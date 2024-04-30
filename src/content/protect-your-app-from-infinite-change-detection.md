---
title: Protect your Angular app from infinite change detection loops
slug: protect-your-app-from-infinite-change-detection
description: How to not get caught in an infinite change detection loop in Angular.
coverImage: '/protect-your-app-from-infinite-change-detection.jpeg'
coverImageAlt: 
tags: [ 'Angular', 'Change Detection', 'afterRender', 'Signals' ]
publishedAt: '2024-03-24T00:00:00.000Z'
---

# Protect your Angular app from infinite change detection loops ♾️

Lately, Angular introduced signals, which are wonderfully powerful and greatly simplify the way we write Angular applications. 

When working with signals in Angular, we know that Angular will make sure to always update the view when a signal is changed.

```typescript
@Component({
  template: `
    <div>{{ count() }}</div>
    <button (click)="increment()">Increment</button>
  `
})
export class AppComponent {
  count = signal(0);

  increment() {
    this.count.update(x => x + 1);
  }
}
```

One other thing Angular has introduced is the `afterRender` lifecycle hook. This hook is called after Angular has rendered the view, which is a great place to do some work that should be done after the view has been updated.

```typescript
@Component()
export class AppComponent {
  count = signal(0);
  
  constructor() {
    afterRender(() => {
      console.log('View has been updated');
    });
  }
}
```

If for some reason you need to update the view in the `afterRender` hook, and to do that you're updating a signal (which may have been called in the component's template), please make sure to not update the signal in an non-definitive way. 

```typescript
@Component({
  template: `
    <div>{{ count() }}</div>
  `
})
export class AppComponent {
  count = signal(0);
  
  constructor() {
    afterRender(() => {
      // This will cause an infinite change detection loop
      this.count.update(x => x + 1); // changes infinitely
    });
  }
}
```

![Infinite Change Detection Loop](infinite-cd-error.png)

If you update a signal in the `afterRender` hook, make sure to update it in a definitive way. This means that the signal should be updated in a way that it will not change the value of the signal when the view is updated.

```typescript
@Component({
  template: `
    <div>{{ count() }}</div>
  `
})
export class AppComponent {
  count = signal(0);
  
  constructor() {
    afterRender(() => {
      // This will not cause an infinite change detection loop
      this.count.set(1); // changes only once 
    });
  }
}
```

By following this simple rule, you can protect your Angular app from infinite change detection loops. 

---

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
