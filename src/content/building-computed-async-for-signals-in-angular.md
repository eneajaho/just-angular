---
title: Building ComputedAsync for Signals in Angular
slug: building-computed-async-for-signals-in-angular
description: Handling async operations using Signals and Rxjs in Angular
coverImage: '/computed-async-angular.jpeg'
coverImageAlt: 'Building ComputedAsync for Signals in Angular'
tags: ['Signals', 'RxJs', 'computed', 'async', 'Angular']
publishedAt: '2024-01-22T00:00:00.000Z'
---

# Building ComputedAsync for Signals in Angular

## Little bit of history
Handling async operations in Angular has always been the job of Observables. Observables are a great way to handle async operations. But with the introduction of Signals in Angular, everyone is trying to use Signals for everything, but Signals are not meant to handle async operations. Signals are meant to handle value and not events. So, how do we handle async operations using Signals? Let's find out.

## Motivation
I will use a simple example for an API call. Let's say we have a component that calls an API and displays the data. We will use the `HttpClient` to make the API call. The `HttpClient` returns an `Observable` which we can subscribe to and get the data. Let's see how we can do this using Signals.

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);

  user = input.required<User>();

  favoriteImages = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.imagesService.getImages(this.user().favoriteImages).subscribe(images => {
        this.favoriteImages.set(images);
      });
    });
  }
}
```

As you can see, I'm also using signal inputs in order to use the built in reactivity. 

But, we don't handle the unsubscribe part. So, we need to do that manually. Effect function includes a callback function that is called everytime the effect runs. We can use that to unsubscribe from the subscription.

This is how we can do it.

```ts
export class UserComponent {
  constructor() {
    // onCleanup is a callback function that is called everytime the effect runs
    effect((onCleanup) => { 
      const sub = this.imagesService.getImages(this.user().favoriteImages).subscribe(images => {
        this.favoriteImages.set(images);
      });
      onCleanup(() => sub.unsubscribe()) // unsubscribe from the subscription
    });
  }
}
```

To sum up, here's what's happening in the above code:

- We register an effect that will run whenever the `user` input changes.
- Effect runs at least once by default, so it will make that initial API call.
- Effect will run again whenever the `user` input changes.
- Everytime the effect re-runs, the onCleanup function will call the callback function passed to it.
- Our callback function will unsubscribe from the previous subscription. (So, it will behave like the `switchMap` operator in RxJS)
- When the API call returns, we set the value of the `favoriteImages` signal.


## Problem
What we are trying to do in the above example is to have some derived state based on the user `favoriteImages` ids. So, using an effect may not be the straightforwad way to do this, or we may forget to unsubscribe from our subscription. 

One other solution is to use `toObservable` helper function. 

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);

  user = input.required<User>();

  favoriteImages = toSignal(toObservable(this.user).pipe(
    switchMap(user => this.imagesService.getImages(user.favoriteImages))
  ), { initialValue: [] });
}
```

This is a better solution, but it's not perfect. What happens if we include some other input and we need to include it in our API call? We will have to use `combineLatest` operator. 

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);

  user = input.required<User>();
  otherInput = input.required<string>();

  favoriteImages = toSignal(combineLatest([
    toObservable(this.user),
    toObservable(this.otherInput)
  ]).pipe(
    switchMap(([user, otherInput]) => this.imagesService.getImages(user.favoriteImages, otherInput))
  ), { initialValue: [] });
}
```

This gets messy very quickly! Because we start to include more and more rxjs operators, and we have to use `toObservable` and `toSignal` everywhere.

We can do better!

## Building ComputedAsync
We want our `computedAsync` function to behave like the `computed` function, but it should handle async operations. Basically, it should return a signal that will have the value of the async operation.

```ts
favoriteImages = computedAsync(() => 
  this.imagesService.getImages(this.user().favoriteImages)
);
```

We want to return an observable (or promise), and we want the `computedAsync` function to handle the subscription and unsubscribe from it. 

### Handling the callback function

We want the developer to be able to pass either an observable or a promise, or just normal value. So, we need to handle all of these cases. 

Here are the possible cases:
```ts
type ComputationResult<T> = Promise<T> | Observable<T> | T | undefined;
```

We want to accept a callback fn and return a Signal. So, we need to accept a callback function that will return a `ComputationResult<T>`. 

```ts
export function computedAsync<T>(
    computation: () => ComputationResult<T>
): Signal<T> {
  // ...
}
```

### Handling the current value and the result

We need to handle the current value and to return the result of the computation. We can use a `WritableSignal` to handle the current value and a computed signal to return the result of the computation.

```ts
export function computedAsync<T>(
    computation: () => ComputationResult<T>
): Signal<T> {
  const sourceValue = signal<T | undefined>(undefined);
  return computed(() => sourceValue()!);
}
```

### Handling the computation
Because the computation will include signals, and the only way to listen to signal changes is by using `effect`, we need to use `effect` to handle the computation. 

```ts
import { isObservable } from 'rxjs';

export function computedAsync<T>(
    computation: () => ComputationResult<T>
): Signal<T> {
  const sourceValue = signal<T | undefined>(undefined);

  effect(() => {
    const value = computation(); // store the result of the computation

    // handle the result if it's an observable or a promise or a normal value
    if (isObservable(value) || isPromise(value)) {
      // TODO: handle observable and promise
    } else {
      // TODO: handle normal value
    }
  });

  return computed(() => sourceValue()!);
}

// helper function to check if the value is a promise
function isPromise<T>(value: any): value is Promise<T> {
	return value && typeof value.then === 'function';
}
```

But, `effect` depends on the `DestroyRef` token, so it needs to be in an injection context, or we need to pass an injector to it. Let's handle that.

### Handling injection context
I will use the [assertInjector](https://ngxtension.netlify.app/utilities/injectors/assert-injector/) helper function (created by [Chau Tran](https://twitter.com/Nartc1410)) provided in `ngxtension` library.

The `assertInjector` function will check if the injector is provided, and if it's not, it will throw an error. In the third argument, we can pass a callback function that will be called in the injection context. 

Let's create a `ComputedAsyncOptions` interface that will include the injector and the equal function (that the normal `computed` function also includes).

```ts
interface ComputedAsyncOptions<T> extends CreateComputedOptions<T> {
	injector?: Injector;
}
```

Now, we can use the `assertInjector` function.

```ts
export function computedAsync<T>(
    computation: () => ComputationResult<T>,
    options?: ComputedAsyncOptions<T>
): Signal<T> {
  return assertInjector(computedAsync, options?.injector, () => {
    // here we can safely use effect and inject function because we are in an injection context
     effect(() => { /* ...  */ }, { injector: options?.injector });
  });
}
```

### Handling the subscription
Just like we have a `sourceValue` signal to handle the current value, we need a `sourceEvent$` observable to handle the subscription. We will use a `Subject` to handle the subscription. 

We want our value of the `sourceEvent$` to be either a promise or an observable. 

```ts
const sourceEvent$ = new Subject<Promise<T> | Observable<T>>();
```

Let's subscribe to the `sourceEvent$` and set the value of the `sourceValue` signal.

We also have to take care of flattening the observable, because we will pass an observable or promise to our `sourceEvent$`.

That's why we will use `switchMap` operator to flatten the observable.

> As a side effect, `switchMap` will also unsubscribe from the previous subscription 🎉.

```ts
const sourceResult = sourceEvent$
    .pipe(switchMap(s$ => s$))
    .subscribe({
        // set the value of the sourceValue signal when the source$ emits a value
        next: (value) => sourceValue.set(value),
        error: (error) => {
            // NOTE: Error should be handled by the user (using catchError or .catch())
            sourceValue.set(error);
        }
    });
```

Having `switchMap(s$ => s$)` can be replaced with `switchAll()` operator. Thanks to [Petrus Nguyễn Thái Học](https://github.com/hoc081098) and [Lucas Garcia](https://github.com/LcsGa) for pointing that out.

```ts
const sourceResult = sourceEvent$
    .pipe(switchAll())
    .subscribe();
```

### Handling the subscription cleanup
Because we subscribed to the `sourceEvent$` observable, we need to unsubscribe from it. We can use the `DestroyRef` token to handle that. `DestroyRef` has an `onDestroy` method that will call the callback function passed to it when the current injection context is destroyed, in our case, when the component is destroyed.

```ts
export function computedAsync<T>(
    computation: () => ComputationResult<T>,
    options?: ComputedAsyncOptions<T>
): Signal<T> {
  return assertInjector(computedAsync, options?.injector, () => {
    const destroyRef = inject(DestroyRef);

	const sourceEvent$ = new Subject<Promise<T> | Observable<T>>();

    effect(() => { /* ...  */ });

    const sourceResult = source$.subscribe(/* ... */);

    destroyRef.onDestroy(() => {
      sourceResultSubcription.unsubscribe();
    });
  });
}
```

That's it! We subscribe to get the value and we unsubscribe when the component is destroyed.

### Handling the returned observable or promise in the computation
This is currently how `computedAsync` looks like:

```ts
export function computedAsync<T>(
    computation: () => ComputationResult<T>,
    options?: ComputedAsyncOptions<T>
): Signal<T> {
  return assertInjector(computedAsync, options?.injector, () => {
    const destroyRef = inject(DestroyRef);

    const sourceValue = signal<T | undefined>(undefined);

	const sourceEvent$ = new Subject<Promise<T> | Observable<T>>();

    effect(() => {
        const value = computation(); // store the result of the computation

        // handle the result if it's an observable or a promise or a normal value
        if (isObservable(value) || isPromise(value)) {
            // TODO: handle observable and promise
        } else {
            // TODO: handle normal value
        }
    });

    const sourceResult = sourceEvent$
        .pipe(switchAll())
        .subscribe({
            next: (value) => sourceValue.set(value),
            error: (error) => sourceValue.set(error)
        });

    destroyRef.onDestroy(() => {
      sourceResultSubcription.unsubscribe();
    });

    return computed(() => sourceValue()!);
  });
}
```

Let's handle the TODOs in the above code.

First, let's handle the normal value case. We just need to set the value of the `sourceValue` signal.

```ts
 effect(() => {
    const value = computation(); // store the result of the computation

    // handle the result if it's an observable or a promise or a normal value
    if (isObservable(value) || isPromise(value)) {
        // TODO: handle observable and promise
    } else {
        sourceValue.set(value);
    }
});
```

This will throw an error, because we cannot set the value of a signal inside an effect, without first enabling it for the effect.

```ts
effect(() => {
    // ...
}, { allowSignalWrites: true }) // enable signal writes
```

But, there's another way to solve this problem. We can use the `untracked` function to set the value of the signal without enabling it for the effect (this is basically doing the same thing as the above code). Read more about this trick [here](https://github.com/angular/angular/issues/53986)

Let's use it: 

```ts
untracked(() => sourceValue.set(value));
```

Let's handle the observable and promise case. Just like we set the value in the signal, we need to `next` to the `sourceEvent$` observable.

```ts
effect(() => {
    const value = computation(); // store the result of the computation

    // handle the result if it's an observable or a promise or a normal value
    if (isObservable(value) || isPromise(value)) {
        sourceEvent$.next(value);
    } else {
        untracked(() => sourceValue.set(value));
    }
});
```

This may cause some issues, if we just leave it like that. How so? 

Look at this example: 

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  someValue = signal<string>('');

  favoriteImages = computedAsync(() => {
    return this.imagesService.getImages(this.user().favoriteImages).pipe(
        tap(() => this.someValue.set('some value'))
    );
  });
}
```

The `someValue` signal will be set inside our computation, but our computation is inside an effect, basically, we are setting the value of a signal inside an effect. This will throw an error. So, we need to untrack the `sourceEvent$.next()`.

```ts
effect(() => {
    const value = computation(); // store the result of the computation

    // handle the result if it's an observable or a promise or a normal value
    if (isObservable(value) || isPromise(value)) {
        untracked(() => sourceEvent$.next(value));
    } else {
        untracked(() => sourceValue.set(value));
    }
});
```

And now, our `computedAsync` function is complete!

## Initial value
By default, the initial value of the `sourceValue` signal is `undefined`. But, we can pass an initial value to the `computedAsync` function.

```ts
interface ComputedAsyncOptions<T> extends CreateComputedOptions<T> {
	initialValue?: T;
	injector?: Injector;
}

export function computedAsync<T>(
    computation: () => ComputationResult<T>,
    options?: ComputedAsyncOptions<T>
): Signal<T> {
  return assertInjector(computedAsync, options?.injector, () => {
    // ...
    const sourceValue = signal<T | undefined>(options?.initialValue ?? undefined);
    // ...
  });
}
```

Now, we can pass an initial value to the `computedAsync` function.

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedAsync(() => {
    return this.imagesService.getImages(this.user().favoriteImages);
  }, { initialValue: [] });
}
```

## Handling race conditions (behavior)
Currently, we use only `switchAll` operator to handle the subscription and it will cancel the previous calls. But the devs may want to have a different behavior, and for this we can add a `behavior` option to the `computedAsync` function.

```ts
type ComputedAsyncBehavior = 'switch' | 'merge' | 'concat' | 'exhaust';

interface ComputedAsyncOptions<T> extends CreateComputedOptions<T> {
	initialValue?: T;
	injector?: Injector;
	behavior?: ComputedAsyncBehavior;
}
```

We can use the `behavior` option to handle the subscription.
Let's create a `createFlattenObservable` function that will handle operator based on the `behavior` option.

```ts
function createFlattenObservable<T>(
	source: Subject<Promise<T> | Observable<T>>,
	behavior: ComputedAsyncBehavior,
): Observable<T> {
	const KEY_OPERATOR_MAP = {
		merge: mergeAll,
		concat: concatAll,
		exhaust: exhaustAll,
		switch: switchAll,
	};

	return source.pipe(KEY_OPERATOR_MAP[behavior]());
}
```

Now, we can use the `createFlattenObservable` function to handle the subscription.

```ts
const source$: Observable<T> = createFlattenObservable(
    sourceEvent$,
    options?.behavior ?? 'switch',
);
```

By default, we use `switch` behavior, but we can pass a different behavior.

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedAsync(() => 
    this.imagesService.getImages(this.user().favoriteImages), 
    { initialValue: [], behavior: 'merge' }
  );
}
```

Because rxjs operators also support Promises, we can pass a promise to the `sourceEvent$` and it will handle it, just like it handles observables.

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedAsync(() => 
    fetch(`https://localhost/api/images/${this.user().favoriteImages}`).then(res => res.json()), 
    { initialValue: [], behavior: 'merge' }
  );

}
```

### How to use the previous value in the computation?
Inside the effect, we can get the current value from the `sourceValue` signal. But, reading a signal inside an effect, register it as a dependency. So, we need to untrack it first, then we can pass it to the `computation` function.

```ts
effect(() => {
    const currentSourceValue = untracked(() => sourceValue());
    const value = computation(currentSourceValue); // store the result of the computation
    // ...  
}); 
```

This enables us to use the previous value in the computation.

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedAsync((previousFavoriteImages) => 
    {
        if (previousFavoriteImages) { /* do something */ }
        
        return  this.imagesService.getImages(this.user().favoriteImages);
    }, 
    { initialValue: [], behavior: 'merge' }
  );
}
```

## Use computedAsync from ngxtension
The `computedAsync` function is available in the `ngxtension` library. You can install it using `npm` or `yarn`.

```bash
npm install ngxtension
# or
yarn add ngxtension
```

Then, you can import it from `ngxtension` library.

```ts
import { computedAsync } from 'ngxtension/computed-async';
```

And use it like this:

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedAsync(() => 
    this.imagesService.getImages(this.user().favoriteImages), 
    { initialValue: [], behavior: 'merge' }
  );
}
```

📚 Documentation for `computedAsync` is available [here](https://ngxtension.netlify.app/utilities/signals/computed-async/). 

 🔨 Read more about the development of `computedAsync` [here](https://github.com/nartc/ngxtension-platform/pull/229).

## Reviewed by: 
- [Chau Tran 🧑🏻‍💻](https://twitter.com/Nartc1410)

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
