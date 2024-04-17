---
title: A new era for Angular - Zoneless Change Detection
slug: a-new-era-for-angular-zoneless-change-detection
description: Learn how Angular is going to work without Zone.js in the future, and how you can enable it in your application.
coverImage: "/a-new-era-for-angular-zoneless-change-detection.png"
coverImageAlt: " A new era for Angular - Zoneless Change Detection"
tags: ["Angular", "Change Detection", "Signals", "RefreshView"]
publishedAt: "2024-04-17T00:00:00.000Z"
---

# A new era for Angular - Zoneless Change Detection

## Change Detection in Angular with Zone.js

Angular has always relied on Zone.js to know when something changed, and we can say that it has been the only framework that worked like this. In my previous blog post, I talked about how Angular's change detection works and how it is becoming better.

> [A change detection, zone.js, zoneless, local change detection, and signals story 📚](/blog/a-change-detection-zone-js-zoneless-local-change-detection-and-signals-story)

And one thing we can take from that post is this picture:

![OnPush Bindings Refresh](/cd-article/onpush-refresh.webp)

What we learn from that one, is that every interaction we have with the application, will first notify zone.js and than zone.js will notify Angular that something has changed. As we can see, Angular always used this intermediate layer to know when something changed.

## Bye Bye Zone.js

In Angular v18, we will get a new way of doing change detection, and that is without Zone.js. This is a big step for Angular.

**Say welcome to Zoneless Change Detection** 🎉

### How to enable it?

Currently it's going to be an experimental API as this is one of the biggest improvements in Angular, and there's a lot of things that can go wrong, that's why we need to be careful when using it.

To enable it, we just need to add `provideExperimentalZonelessChangeDetection()` in our providers array:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    // 👇 Add this line to enable Zoneless Change Detection
    provideExperimentalZonelessChangeDetection(),
  ],
});
```

And that's it, you can now remove `zone.js` from your `angular.json` polyfills array.

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "polyfills": [
              "zone.js" // 👈 Remove this line
            ],
          }
        }
      }
    }
  }
```

> Removing this line from the `polyfills` array, just made your app **13kb lighter** 🎉

The moment we don't have zone.js in the polyfills anymore, Angular will support native async/await and won't downlevel the code to use generators or promises, which is a big win 🎉!

More here in the PR: [feat(@angular-devkit/build-angular): support native async/await when app is zoneless](https://github.com/angular/angular-cli/pull/27486)

### How does it work?

The new zoneless change detection is build on the idea that your components will let Angular know when something has changed immediately. So, there won't be any intermediate layer like `zone.js` to notify Angular that something has changed.

Currently, to tell Angular that something changed we have API-s like:

- `ChangeDetectorRef.markForCheck()`
- `ComponentRef.setInput`
- Updating a signals value that is used in the template
- When template event listerens are triggered
- Attaching/Detaching a view using `ViewContainerRef`
- registering a render hook (templates are only refreshed if render hooks do one of the above)

And this is how it's going to look like (GIF):

![zonelesscd](/zonelesscd.gif)

When something from the list above happens, Angular will schedule an `AppRef.tick()` using `setTimeout + requestAnimationFrame`. Read more about this scheduling [here](https://github.com/angular/angular/blob/ff686f3ca5dc47cc1e961957268fa4886db145da/packages/core/src/util/callback_scheduler.ts#L37)

The `scheduleCallback` will call the callback function (our `AppRef.tick()`) using `setTimeout` and `requestAnimationFrame` like this, so, which ever comes first will be used:

```typescript
export function scheduleCallback(callback: Function, useNativeTimers = true): () => void {
  // code omitted for brevity
  let executeCallback = true;
  nativeSetTimeout(() => {
    if (!executeCallback) return;
    executeCallback = false;
    callback();
  });
  nativeRequestAnimationFrame?.(() => {
    if (!executeCallback) return;
    executeCallback = false;
    callback();
  });

  return () => { executeCallback = false; };
}
```

`AppRef.tick()` will then check all the components that have changed and will refresh them. Read more on the previous article 👇

> [A change detection, zone.js, zoneless, local change detection, and signals story 📚](/blog/a-change-detection-zone-js-zoneless-local-change-detection-and-signals-story)

## Is it safe to use?
If you're app is using `ChangeDetectionStrategy.OnPush`, or is using `Observables` with `async` pipe or `Signals` to render data in the templates, you will be safe to try it and use it (keep in mind it's still experimental ⚠️). 

**Angular Material** was also refactored to not depend on `Zone.js` API-s to work, so their components are also safe to use with zoneless change detection.

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
