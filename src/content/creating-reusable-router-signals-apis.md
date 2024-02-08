---
title: Creating reusable Router Signals APIs in Angular 🗺️
slug: creating-reusable-router-signals-apis
description: How to convert Angular Router events into Signals and use them in a declarative way
coverImage: '/creating-reusable-router-signals-apis.png'
coverImageAlt: 'Photo by Andrea Leopardi on Unsplash'
tags: [ 'Angular', 'Router', 'Signals', 'RxJS', 'Observables', 'Declarative']
publishedAt: '2024-02-07T00:00:00.000Z'
---

# Creating reusable Router Signals APIs in Angular 🗺️

Building single page applications with Angular often involves working with the Angular Router. 

When working with the router there are a few common patterns that we often find ourselves repeating.

For example, we often need to grab the current route params or query params and use them in our components.

```typescript
@Component({
  template: `
    <h1>Product Details</h1>
    <p>{{ productName }}</p>
  `
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  productName: string = '';

  ngOnInit() {
    const prodcutId = this.route.snapshot.params['id'];

    this.productsService.getProduct(prodcutId)
    .pipe(take(1))
    .subscribe(product => {
      this.productName = product.name;
    });
  }
}
```

In the above example, we are using the `ActivatedRoute` to grab the current route params and then using the `ProductsService` to fetch the product details. 

The issue with the above code is that when the route params change, the component will not update the `productName` value. Let's fix that.

Let's make this more declarative and reactive using observables.

## Using Observables to react to route changes
Just like we used the snapshot to grab the route params, we can use the `params` observable to listen to route params changes.

```typescript 
@Component({
  template: `
    <h1>Product Details</h1>
    <p>{{ productName$ | async }}</p>
  `
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  // Store the productId observable
  productId$ = this.route.params.pipe(map(params => params['id']));

  productName$ = this.productId$.pipe(
    // Fetch the product details when the productId changes
    // and cancel the previous request
    switchMap(id => this.productsService.getProduct(id)),
    map(product => product.name)
  );
}
```

Here we have a declarative and reactive way to fetch the product details when the route params change using observables, that will also cancel the previous request when the route params change (this is useful when the user is navigating quickly between routes).

We are using the `async` pipe to subscribe to the `productName$` observable and display the product name in the template.

## Refactoring to Signals
We can take this a step further and refactor the observables into signals. Let's use the `toSignal` function to convert the observables into signals.

```typescript
@Component({
  template: `
    <h1>Product Details</h1>
    <p>{{ productName() }}</p> <!-- No need for async pipe -->
  `
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  productId$ = this.route.params.pipe(map(params => params['id']));

  productName$ = this.productId$.pipe(
    switchMap(id => this.productsService.getProduct(id)),
    map(product => product.name)
  );

  // This will convert the productName$ observable into a signal 
  // and will be updated when the productName$ observable emits a new value
  productName = toSignal(this.productName$, { initialValue: '' });
}
```

Now we have a `productName` signal that will be updated when the `productName$` observable emits a new value. This is great! We can now use the `productName` signal in our template without the need for the `async` pipe.

Can we do better? To, write less code maybe?

## Creating a reusable router signals API
We can create a reusable router signals API that will allow us to easily grab the current route params and query params and use them in a declarative way using signals.

We want to be able to inject params that should return us all the route params as a signal, and if we pass a key, it should return us the value of that key as a signal.

Something like this: 

```typescript
export class ProductDetails {
  params = injectParams(); // Signal<Params>
  productId = injectParams('id'); // Signal<string | null>

  private productsService = inject(ProductsService);

  // usage with computedAsync function
  productName = computedAsync(() => 
    this.productsService.getProduct(this.productId()).pipe(map(p => p.name))
  ); // uses switchMap under the hood to cancel previous request
}
```

More info about `computedAsync` you can find in the [docs](https://ngxtension.netlify.app/utilities/signals/computed-async/).

I wrote more about it here: [Building ComputedAsync for Signals in Angular](/blog/building-computed-async-for-signals-in-angular)

## Implementing the injectParams function
Because our function will inject the `ActivatedRoute` we need to make sure we are in an injection context. We can use the `assertInInjectionContext` function to do that.

```typescript
export function injectParams(): Signal<Params> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);
}
```

Now that we have access to the `ActivatedRoute` we can grab the route params and convert them into a signal using the `toSignal` function.

```diff
export function injectParams(): Signal<Params> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);
+  return toSignal(route.params);
}
```

Params emit synchronously, so to enforce it, let's use `toSignal` with `requireSync` option.

```diff
export function injectParams(): Signal<Params> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);
+  return toSignal(route.params, { requireSync: true });
}
```

We can also add support for passing a key to the `injectParams` function. If a key is passed, we should return the value of that key as a signal.

```diff
export function injectParams<T>(
+  key?: string // Include the optional key parameter
): Signal<Params | string | null> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);
  // Create a helper function to grab the value of the key
+  const getParam = (params: Params) => key ? params?.[key] ?? null : params;
  // We need to map the params observable to the value of the key
-  return toSignal(route.params, { requireSync: true });
+  return toSignal(route.params.pipe(map(getParam)), { requireSync: true });
}
```

We can extend the `injectParams` function to also support a transform function that will allow us to transform the params into a different value.
It will be used like this:

```typescript
export class ProductDetails {
  // example of using a transform function
  allParamKeys = injectParams(params => Object.keys(params));
}
```

While we add the support for the transform function, we can also make the function generic to support the return type of the transform function.

```typescript
export function injectParams<T>(
	keyOrTransform?: string | ((params: Params) => T),
): Signal<T | Params | string | null> {
  assertInInjectionContext(injectParams);
  const route = inject(ActivatedRoute);
 
  if (typeof keyOrTransform === 'function') {
    return toSignal(route.params.pipe(map(keyOrTransform)), { requireSync: true });
  }

  const getParam = (params: Params) =>
    keyOrTransform ? params?.[keyOrTransform] ?? null : params;

  return toSignal(route.params.pipe(map(getParam)), { requireSync: true });
}
```

As we can see, we have created a reusable router signals API that will allow us to easily grab the current route params and use them in a declarative way using signals.

We can do the same for the query params using the `queryParams` observable from the `ActivatedRoute`.

But, you don't need to do that, because it's already done for you in the `ngxtension` library.

## `injectQueryParams` and `injectParams`

These two functions are already published by the `ngxtension` library 

- [injectParams](https://ngxtension.netlify.app/utilities/injectors/inject-params/)
- [injectQueryParams](https://ngxtension.netlify.app/utilities/injectors/inject-query-params/)

They are fully tested and are already being used in multiple projects. 

## Using `withComponentInputBinding()` with signal inputs 

In v17.1 Angular introduced signal inputs, and before that introduced the `withComponentInputBinding()` function which enables us to have inputs with the same name as our params or query params. 

I wrote about that function here: [Bind Route Info to Component Inputs](/blog/bind-route-info-to-component-inputs-new-router-feature).

What's the difference between these functions and signal inputs? Two things:

### Being explicit about where your data comes from 
If you have an input called productId, do you expect it to come from a parent component or the route params?

```typescript
export class ProductDetails {
  // where does this come from?
  productId = input<string>(); 

  // being explicit we are getting a route param
  productId = injectParams('id'); 

  private productsService = inject(ProductsService);

  // we can use computedAsync with both ways btw.
  productName = computedAsync(() => 
    this.productsService.getProduct(this.productId()).pipe(map(p => p.name))
  ); 
}
```

### What if you need all the params (or query params)
We cannot grab all the params and queryParams using inputs, so we still have to rely on injecting `ActivatedRoute` and listen to observable changes. And that's something `injectParams` solves by default. 

```typescript
export class AllProducts {
  private productsService = inject(ProductsService);
  private productsFilters = injectParams(p => paramsToFilters(p));

  allProducts = computedAsync(() => 
    this.productsService.getProducts(this.productsFilters()))
  );
}

function paramsToFilters(params: Params): ProductsFilters {
  return ...;
}
```

That's all folks! Hope you liked it! 

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
