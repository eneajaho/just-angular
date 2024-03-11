---
title: Migrating from Custom Lazy Loading components to defer block
slug: migrating-from-custom-lazy-loading-to-defer-block
description: Migrating from Custom Lazy Loading components to defer block
coverImage: "/migrating-from-custom-lazy-loading-to-defer-block.png"
coverImageAlt: "Migrating from Custom Lazy Loading components to defer block"
tags: ["Lazy Loading", "defer", "ngComponentOutlet", "Angular"]
publishedAt: "2024-03-11T00:00:00.000Z"
---

# Migrating from Custom Lazy Loading components to defer block

Lazy loading components in Angular has not been an easy task for a long time. We had to go over `ngComponentOutlet` and dynamic imports and also handle different kind of events to load the desired component.

### Example in the Movies app

In the movies app we have an example in the `app-shell.component.ts` where we lazy load an account menu component when the user clicks on the account button.

```html
<div class="account-menu-dropdown">
  <button 
    type="button" 
    class="profile-button" 
    (mouseenter)="ui.loadAccountMenu()">
      <div class="focus-overlay"></div>
      <fast-svg name="account" />
  </button>
  <div class="profile-menu-content">
    <ng-container 
        *rxLet="accountMenuComponent$; suspense: loading" 
        [lazy]="accountMenuComponent$" />
    <ng-template #loading> Loading...</ng-template>
  </div>
</div>
```

```ts
type Actions = {
  ...
  loadAccountMenu: void;
};

export class AppShellComponent {
  readonly ui = rxActions<{ loadAccountMenu: void }>();

  accountMenuComponent$ = this.ui.loadAccountMenu$.pipe(
    switchMap(() =>
      import('./account-menu/account-menu.component').then((x) => x.default)
    ),
    shareReplay(1)
  );
}
```

So, we create an `ui` actions object and we have a `loadAccountMenu` action that we call when the user clicks on the account button. 
We have a `accountMenuComponent$` observable that we use to lazy load the `AccountMenuComponent` when the user clicks on the account button.

The observable is then used in the `*rxLet` directive to render the `AccountMenuComponent` when it's loaded.

### Migrating to defer block
Defer block is a new feature in Angular that allows us to defer the rendering of a component until it's loaded.

We can use the `defer` block to achieve the same result as the previous example.

```html
<div class="account-menu-dropdown">
  <button #accountButton type="button" class="profile-button">
    <div class="focus-overlay"></div>
    <fast-svg name="account" />
  </button>
  <div class="profile-menu-content">
    @defer (on hover(accountButton)) {
        <app-account-menu />
    } @placeholder {
        Loading...
    }
  </div>
</div>
```

That's it. We don't need to use any observables or actions, or register any listeners to load the `AccountMenuComponent`. We can safely remove the observable, the *rxLet directive and the actions object. 

The `on hover()` will register an event listener on the `accountButton` and when the user hovers over the button, the `AccountMenuComponent` will be loaded and rendered.

More info in the [defer block docs](https://angular.dev/guide/defer#on-hover);

# Thanks for reading!

If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
