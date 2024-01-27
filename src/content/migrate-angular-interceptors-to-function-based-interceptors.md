---
title: Migrate Angular Interceptors to function based interceptors
slug: migrate-angular-interceptors-to-function-based-interceptors
description: In this article we will learn how to migrate class based interceptors to function based interceptors. In Angular v15, the Angular team introduced a new way to create interceptors. Instead of creating…
coverImage: '/migrate-angular-interceptors-to-function-based-interceptors.webp'
coverImageAlt: 'Photo by Patrick Hendry on Unsplash'
tags: [ 'Angular', 'Interceptors', 'Migration', 'Rxjs', 'Functional']
publishedAt: '2023-05-13T00:20:00.000Z'
---

# Migrate Angular Interceptors to function based interceptors

In this article we will learn how to migrate class based interceptors to function based interceptors. In [Angular v15](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8), the Angular team introduced a new way to create interceptors. Instead of creating a class that implements the `HttpInterceptor` interface, we can now create a function that implements the `HttpInterceptorFn` interface.

## Why should we migrate to function based interceptors?
Class based interceptors are great, but they may be phased out in a later release. This is taken from here: [withInterceptorsFromDi()](https://github.com/angular/angular/blob/85b4941be137a2fcdc664dc870e408dd72ad7de7/packages/common/http/src/provider.ts#L125) 😬

Other than that, function based interceptors are better than class based interceptors for many reasons:

- Easier to create
- Easier to configure
- Easier to use
- Migrate RetryInterceptor to function based interceptor

In my previous article 👇

[Create configurable Angular interceptors ⚙️](./blog/create-configurable-angular-interceptors)

We created a configurable retry interceptor. Let’s incrementally migrate that one to functional based interceptors and see what we gain from it.

Our interceptor looks like this:

```ts
export const RETRY_INTERCEPTOR_CONFIG = new InjectionToken<RetryConfig>(
  'retryConfig',
  {
    providedIn: 'root',
    factory: () => {
      return { count: 3, delay: 1000 } as RetryConfig;
    },
  }
);

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private retryConfig = inject(RETRY_INTERCEPTOR_CONFIG);

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(retry(this.retryConfig));
  }
}

export const RetryInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: RetryInterceptor,
  multi: true,
};
```

## How to migrate to function based interceptors?
To migrate to function based interceptors, first we need to do something else first. We need to use `provideHttpClient` instead of `HttpClientModule`.

```diff
- import { HttpClientModule } from '@angular/common/http';
+ import { provideHttpClient } from '@angular/common/http';

@NgModule({
  imports: [
-   HttpClientModule,
  ],
  providers: [
+   provideHttpClient(),
    RetryInterceptorProvider,
    {
      provide: RETRY_INTERCEPTOR_CONFIG,
      useValue: { count: 5, delay: 2000 },
    },
  ],
})
export class AppModule {}
```

We’re not done yet. When using `provideHttpClient`, and if we still are using class based interceptors, we need to use the `withInterceptorsFromDi` function to register the class based interceptors.

```diff
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  providers: [
   provideHttpClient(
+     withInterceptorsFromDi()
   ),
    RetryInterceptorProvider,
  ],
})
export class AppModule {}
```

Now, we’re in the same state as we were before. We have a class based interceptor, and we’re using the `withInterceptorsFromDi` function to register it.

## How to create a function based interceptor and how to use it?
To better understand the migration process, let’s create a simple functional interceptor first.

```ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const simpleInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  return next(req);
};
```

And we can use it like this:

```ts
@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([simpleInterceptor])
    ),
  ],
})
export class AppModule {}
```

or in a standalone application:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([simpleInterceptor])
    ),
  ]
});
```

_That’s it! We have a simple functional interceptor that we can use in our application._

## How to migrate the `RetryInterceptor` to a function based interceptor?
Now that we know how to create and use a function based interceptor, let’s migrate the `RetryInterceptor` to a function based interceptor.

Because our interceptor is configurable, we need to pass the configuration to the interceptor.

**How can we do that?**

_We can create a function that creates the interceptor and pass the configuration to it._

```ts
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { retry, RetryConfig } from 'rxjs';

export const retryInterceptor = (config: RetryConfig) => {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(retry(config));
  };
};
```

Or, in order to also have better type-checking, let’s change it a bit!

```ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { retry, RetryConfig } from 'rxjs';

export const retryInterceptor = (config: RetryConfig) => {
  const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(retry(config));
  };

  return interceptor;
};
```

Now, we can use it like this:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([ retryInterceptor({ count: 5 }) ])
    ),
  ]
});
```

That’s it!

![Before vs After 🍓](migrate-interceptor-before-after.webp)
Before vs After 🍓

As you can see for yourself, the difference is huge 🚀!

Here’s the playground for the function based interceptor: [Stackblitz link](https://stackblitz.com/edit/angular-gd6vru?file=src%2Fretry.interceptor.ts)


> If your interceptor depends on other services, you can inject them in the function that creates the interceptor.

For example, if we want to log the requests, we can create an interceptor that injects the logger service.

```ts
export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const loggerService = inject(LoggerService); // inject the logger service

  return next(req).pipe(
    tap({
      next: () => loggerService.log('Request sent'),
      error: () => loggerService.error('Request failed'),
      complete: () => loggerService.log('Request completed'),
    })
  );
};
```

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎

