---
title: Create configurable Angular interceptors ⚙️
slug: create-configurable-angular-interceptors
description: When working with Angular interceptors, there are times we want to configure them based on the context of the application. So, if we want to export the interceptor as a library, we want to be able to…
coverImage: '/configurable-angular-interceptors.webp'
coverImageAlt: 'Photo by Matthew Henry on Unsplash'
tags: [ 'Angular', 'Interceptors', 'LibraryDesign', 'HttpRequest', 'DependencyInjection' ]
publishedAt: '2023-05-13T00:00:00.000Z'
---

When working with Angular interceptors, there are times we want to configure them based on the context of the application. So, if we want to export the interceptor as a library, we want to be able to configure it in the application that uses it.

In order to better understand it, let’s create a `RetryInterceptor` that retries failed requests.

We want to be able to configure the number of retries and the delay between retries. For this we will use the [retry](https://rxjs.dev/api/operators/retry) operator from RxJS 😎.

## Create the interceptor
We will start by creating the interceptor itself. We will create a new file called `retry.interceptor.ts` and add the following code to it:

```ts
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { retry, RetryConfig } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private retryConfig: RetryConfig = { count: 3, delay: 1000 };
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(retry(this.retryConfig));
  }
}
```

We can see that the interceptor is very simple. It has a `retryConfig` property that is used by the `retry` operator. The `retry` operator will retry the request `count` times, with a delay of `delay` milliseconds between each retry.

## Register the interceptor
Now that we have the interceptor, we need to register it. Before we do that, let’s create a provider object for it:

```ts
import { Provider } from '@angular/core';

export const RetryInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: RetryInterceptor,
  multi: true,
};
```

We can now register it in the `providers` array of the `AppModule`:

```ts
@NgModule({
 // … other properties
 imports: [
   // … other modules
   HttpClientModule,
 ],
 providers: [
   RetryInterceptorProvider
 ],
})
export class AppModule {}
```

## Configure the interceptor
Now, if we want our interceptor to be **reusable**, we need to move the configuration out of the interceptor itself in order to be able to configure it in the application that uses it. We will do that by creating a new `injection token` for the `retryConfig` property:

```ts
import { InjectionToken } from '@angular/core';

export const RETRY_INTERCEPTOR_CONFIG = new InjectionToken<RetryConfig>(
  'retryConfig',
  {
    providedIn: 'root',
    factory: () => {
      return { count: 3, delay: 1000 } as RetryConfig;
    },
  }
);
```

As we can see it is provided in the root injector, and it has a default value of `{ count: 3, delay: 1000 }`.

Now we can use this injection token in the interceptor itself:

```diff
export class RetryInterceptor implements HttpInterceptor {
-  private retryConfig: RetryConfig = { count: 3, delay: 1000 };
+  private retryConfig = inject(RETRY_INTERCEPTOR_CONFIG);
  
  // ... rest of the code
}
```

We have replaced the `retryConfig` property with the value of the `RETRY_INTERCEPTOR_CONFIG` injection token.
Now, we can configure the interceptor in the `AppModule`:

```diff
@NgModule({
  providers: [
    RetryInterceptorProvider,
+   {
+     provide: RETRY_INTERCEPTOR_CONFIG,
+     useValue: { count: 5, delay: 2000 },
+   },
  ],
})
export class AppModule {}
```

We have provided a new value for the `RETRY_INTERCEPTOR_CONFIG` injection token. This value will be used by the interceptor instead of the default value.

**_And that’s it 🎉! We have created a configurable interceptor that can be configured in the application that uses it._**

You can play with it here: [Stackblitz project 🕹️](https://stackblitz.com/edit/angular-ygxgiy?file=src%2Fretry.interceptor.ts)

As we can see, just to make an interceptor configurable we had to do a lot of work. We had to create a new injection token, register it in the AppModule, and then use it in the interceptor itself. This is a lot of work for such a simple task.

## How to make this process easier?

Convert the class based interceptor to a function based interceptor.

Read more about it here 👇:

[Migrate Angular Interceptors to function based interceptors 🏃‍♂️](./blog/migrate-angular-interceptors-to-function-based-interceptors)

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎

