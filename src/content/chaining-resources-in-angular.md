---
title: Give me chained resources Angular 🚀
slug: chaining-resources-in-angular
description: Angular v22 lets a resource's request depend on another resource's value. The new chain function in the params context propagates loading, error, and idle states down the chain — no more undefined juggling. Here's how it works, how it's built under the hood, and what you can compose on top of it.
coverImage: "/chaining-resources-in-angular.png"
coverImageAlt: "Chaining resources in Angular with the chain function in the params context"
tags: ["Angular", "Signals", "Resource", "httpResource", "Angular v22"]
publishedAt: "2026-08-13T00:00:00.000Z"
---

# Give me chained resources Angular 🚀

You have a `movieResource`. You want to show recommendations next to it. But the recommendations endpoint needs the movie's **genre**, which only exists once the movie has loaded.

So you write this, it works, and it's also subtly wrong:

```ts
const recommendations = resource({
  params: () => {
    const movie = movieResource.value(); // undefined while loading 🤔
    return movie ? {genre: movie.genre} : undefined;
  },
  loader: ({params}) => fetchRecommendations(params.genre),
});
```

The bug isn't the data. The bug is the **status**. While `movieResource` is loading, `recommendations` reports `idle` — because `params` returned `undefined`, and `undefined` params means "no request at all". Your template asks `recommendations.isLoading()` and gets `false`, while the page is very obviously loading. And if `movieResource` **errors**? `recommendations` sits in `idle` forever, perfectly calm, telling you nothing is wrong. 😅

Angular v22 has an answer, and it's hiding somewhere you probably never looked: the **argument** to `params`.

## How it works ✨

`params` receives a context object. Right now it holds exactly one thing — `chain`:

```ts
const movieResource = resource({
  params: () => ({id: movieId()}),
  loader: ({params}) => fetchMovie(params),
});

const recommendations = resource({
  // 👇 the params context
  params: ({chain}) => chain(movieResource)?.genre,
  loader: ({params: genre}) => fetchRecommendations(genre),
});
```

That's it. `chain(movieResource)` gives you the value **and** wires up status propagation:

| `movieResource` is   | `recommendations` becomes                       |
| -------------------- | ----------------------------------------------- |
| `idle`               | `idle` — loader doesn't run                     |
| `loading`            | `loading` ✅                                     |
| `reloading`          | `loading` (⚠️ you do **not** get the old value) |
| `error`              | `error`, wrapping the upstream error ✅          |
| `resolved` / `local` | `chain` returns the value, loader runs 🎉       |

Loading cascades. Errors cascade. `idle` cascades. No more `undefined` juggling.

> The nice part: `chain` is available anywhere `params` is. That means `resource`, `rxResource`, **and** the url/request function of `httpResource`.

```ts
// httpResource gets it too 💎
const cast = httpResource<Actor[]>(
  ({chain}) => `/api/movies/${chain(movieResource)?.id}/cast`,
);
```

## But how does it *actually* work 🎲

This is the fun part, and it's about 12 lines. Straight from `packages/core/src/resource/resource.ts`:

```ts
export function chain<T>(resource: Resource<T>): T {
  switch (resource.status()) {
    case 'idle':
      throw ResourceParamsStatus.IDLE;
    case 'error':
      throw new ResourceDependencyError(resource);
    case 'loading':
    case 'reloading':
      throw ResourceParamsStatus.LOADING;
  }
  return resource.value();
}
```

`chain` **throws**. That's the whole mechanism.

`ResourceParamsStatus` is a tiny `Error` subclass with two singleton instances, `IDLE` and `LOADING`, used as sentinels. On the other side, the resource wraps your `params` call in a `try/catch` inside a `linkedSignal`:

```ts
this.extRequest = linkedSignal<WrappedRequest>(() => {
  try {
    setInParamsFunction(true);
    return {request: request(paramsContext), reload: 0};
  } catch (error) {
    rethrowFatalErrors(error);
    if (error === ResourceParamsStatus.IDLE) {
      return {status: 'idle', reload: 0};      // 👈 sentinel → status
    } else if (error === ResourceParamsStatus.LOADING) {
      return {status: 'loading', reload: 0};
    }
    return {error: error as Error, reload: 0}; // 👈 anything else → error state
  } finally {
    setInParamsFunction(false);
  }
});
```

Three things worth staring at 👀

**1. Reactivity survives the throw.** `chain` calls `resource.status()` *before* it throws, and that read is tracked by the `linkedSignal` computation. So when the upstream status flips to `resolved`, `params` re-runs. The throw is pure control flow — it aborts the current computation, it doesn't unsubscribe you from anything.

**2. Any thrown non-sentinel becomes an error state.** Look at that last `return`. Throw a random `Error` from `params` and the resource lands in `error` with your error attached. `chain`'s error case uses exactly this — it throws `ResourceDependencyError`, which carries `.dependency` (the upstream resource) and `.cause` (the actual upstream error). So you can tell "my request failed" from "my dependency's request failed":

```ts
const err = recommendations.error();
if (err instanceof ResourceDependencyError) {
  // this one is not my fault 😌
  console.log('upstream failed:', err.dependency, err.cause);
}
```

**3. There's a guard rail.** `setInParamsFunction(true)` — try to create a resource *inside* another resource's `params` and Angular throws `invalidResourceCreationInParams` at you. Which is what you want, because that would spawn a fresh resource on every params run.

Same "throw a special value to signal control flow" trick as [`RedirectCommand` in the Router](https://github.com/angular/angular/pull/70141), by the way. The Angular team is clearly enjoying this pattern lately. ⚡️

## Caveats 🤔

**Don't wrap the chained value in an object.**

```ts
// ❌ params is `{genre: undefined}` — a DEFINED value!
// the loader runs with an undefined genre
params: ({chain}) => ({genre: chain(movieResource)?.genre}),

// ✅ undefined params → resource goes idle
params: ({chain}) => chain(movieResource)?.genre,
```

**`reloading` throws `LOADING`, not the previous value.** When the parent reloads, the child drops to `loading` and loses its value. If you refresh the movie every time the tab regains focus, that's a recommendations flash on every focus. 👀

**Don't reach for `chain` if you just need a derived value.** No async work downstream? That's a `computed`. `chain` is for "this resource's *request* depends on that resource's *value*".

## What we can build on top of this 💎

Here's where it gets fun. `ResourceParamsStatus` and `ResourceDependencyError` are **public API**. The throw protocol isn't a private Angular thing — it's a protocol *we* can speak.

### 1. Gate a resource on any signal, not just a resource

```ts
// throws the same sentinels Angular's own `chain` throws
function required<T>(value: T | null | undefined): T {
  if (value == null) throw ResourceParamsStatus.IDLE;
  return value;
}

function until(condition: boolean): void {
  if (!condition) throw ResourceParamsStatus.LOADING;
}

const watchProviders = resource({
  params: ({chain}) => {
    until(regionReady());                     // 👈 hold in `loading` until we know the region
    const region = required(selectedRegion()); // 👈 idle until the user picks one
    return {movieId: chain(movieResource).id, region};
  },
  loader: ({params}) => fetchWatchProviders(params),
});
```

Three different "not ready" reasons, one flat function body, zero nested ternaries. Same ergonomic win the Router got from throwable `RedirectCommand` — **you stop threading "not ready" through return types**.

### 2. `chainAll` — wait for several resources at once

Because the first `chain` that isn't ready throws, sequential calls already behave like an "all of these must be ready" combinator:

```ts
function chainAll<T extends readonly Resource<any>[]>(
  chain: <V>(r: Resource<V>) => V,
  resources: T,
) {
  // first not-ready resource short-circuits the whole params fn 🎯
  return resources.map((r) => chain(r)) as {
    [K in keyof T]: T[K] extends Resource<infer V> ? V : never;
  };
}

const personalized = resource({
  params: ({chain}) => {
    const [movie, profile] = chainAll(chain, [movieResource, profileResource]);
    return {genre: movie.genre, favoriteActors: profile.favoriteActors};
  },
  loader: ({params}) => fetchPersonalizedPicks(params),
});
```

Error priority falls out for free: whichever dependency errors first wins, and you get its `ResourceDependencyError`.

### 3. `chainOr` — optional dependencies

Sometimes an upstream failure shouldn't take you down with it:

```ts
function chainOr<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch (e) {
    // let idle/loading through, swallow only real errors
    if (e instanceof ResourceParamsStatus) throw e;
    return fallback;
  }
}

const moviePage = resource({
  params: ({chain}) => ({
    movieId: chain(movieResource).id,
    // the third-party ratings API is down every other Tuesday, we don't care 🤷
    ratings: chainOr(() => chain(criticRatings), null),
  }),
  loader: ({params}) => fetchMoviePage(params),
});
```

Note it still rethrows the `IDLE`/`LOADING` sentinels — we want to *wait*, we just don't want to *fail*.

### 4. Kill the `reloading` flash with `resourceFromSnapshots`

Remember caveat #2? `chain` drops the value during `reloading`. But v22 also shipped `snapshot` + `resourceFromSnapshots`, and those compose with everything:

```ts
function keepPrevious<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        return {status: 'resolved' as const, value: previous.value.value};
      }
      return snap;
    },
  });
  return resourceFromSnapshots(derived);
}

// 👇 the chain never sees `loading` on a refresh, so recommendations don't re-fetch
const stableMovie = keepPrevious(movieResource);
const recommendations = resource({
  params: ({chain}) => chain(stableMovie)?.genre,
  loader: ({params}) => fetchRecommendations(params),
});
```

Chain semantics become **configurable**, because `chain` reads the public `Resource<T>` interface and nothing else. Wrap the resource, change the chaining behaviour. That's a genuinely good API boundary. ✨

### 5. Debounced chains

`debounced()` also returns a `Resource<T>`, so it slots straight in:

```ts
const query = signal('');
const debouncedQuery = debounced(query, 300);

const actorSearch = resource({
  params: ({chain}) => ({
    genre: chain(movieResource).genre,
    q: chain(debouncedQuery), // waits for the debounce ⏱️
  }),
  loader: ({params}) => searchActors(params),
});
```

### 6. The Router is already doing this

There's an [open PR (#69490)](https://github.com/angular/angular/pull/69490) adding a `routerResource(source: Resource<T>)` that wraps **any** `Resource<T>` and freezes its state during navigation. Same trick: operate on the base interface, return a `Resource<T>`, compose. Wrap a chain head in `routerResource` and the whole downstream chain inherits navigation-aware behaviour. 🚀

## Does anyone else do this? 🌍

Yes, and the closest cousin is a nice surprise.

**SWR** — literally the same idea. You pass a *function* as the key, and per the docs, if that function throws or returns falsy, SWR won't start the request. So the canonical SWR dependent fetch is `useSWR(() => '/api/recommendations?genre=' + movie.genre)` — you rely on the property access throwing a `TypeError` when `movie` is undefined. Angular took that trick and made it **intentional and typed**: explicit sentinels, explicit error wrapping, and a real distinction between "idle" and "loading" that SWR doesn't have.

**TanStack Query** — solves it with `enabled: !!genre`. Works, but a disabled query sits in `pending` with no fetch in flight, so `pending` means both "waiting on a dependency" and "actually fetching", and you end up writing `isPending && !isFetching`. There's also no built-in error propagation: if the parent query fails, the child just stays disabled and silent — exactly the failure mode `chain` fixes.

**SolidJS** — `createResource(source, fetcher)` skips the fetcher when the source signal is `false`/`null`/`undefined`. Same "falsy means don't run" as SWR's key, same missing distinction between waiting and erroring.

**React** — `use(promise)` and Suspense are the spiritual ancestors here. Throwing to suspend is the original throw-as-control-flow move. Difference: React's version is coupled to rendering and needs Suspense boundaries plus error boundaries. Angular's happens in the reactive graph, so nothing about your template has to change.

**Remix / React Router / Next.js** — loaders just `await` sequentially on the server. Chaining is trivial there because you're inside one async function. The whole problem `chain` solves is a *client-side reactive graph* problem.

So: not a first, but arguably the cleanest version of it. SWR's throwing key function was a happy accident everyone learned to abuse. Angular made it an API, gave it four distinct states, and made the sentinels public so we can extend the protocol ourselves. 🎯

Which is the part I keep coming back to. `chain` is ~12 lines. The interesting thing isn't `chain` — it's that a resource's `params` function is now a place where **throwing means something**, and Angular handed us the vocabulary. 💎

---

# Thanks for reading!

If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
