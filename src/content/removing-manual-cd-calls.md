---
title: Removing manual change detection calls from my Angular app ⚡️
slug: removing-manual-cd-calls
description: Learn step by step how to remove manual change detection calls from your Angular application and make it more robust.
coverImage: "/removing-manual-cd-calls.png"
coverImageAlt: "Removing manual change detection calls from my Angular app"
tags: ["Angular", "Change Detection", "Signals", "markForCheck"]
publishedAt: "2024-04-30T00:00:00.000Z"
---

# Removing manual change detection calls from my Angular app ⚡️

If you have read my previous articles about Angular change detection, you know what manual change detection calls are and on this article, I will show you how they work and how I'm removing them from my Angular applications.

Let's start with a simple example, where I have a service that fetches the user's name and I want to display it in a component.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  #http = inject(HttpClient);

  getUser() {
    return this.#http.get<string>('/api/user');
  }
}

@Component({
    template: `<div>{{ username }}</div>`,
})
export class UserComponent {
  #userService = inject(UserService);

  username: string = '';

  ngOnInit() {
    this.#userService.getUser().pipe(take(1)).subscribe(user => {
      this.username = user.name;
    });
  }
}
```

If you run this code in an Angular application, it will just work! That's thanks to `zone.js`. Why is that? Zone.js is intercepting XHR requests that are made and is telling Angular to run change detection that some data has changed. This is why you see the username in the view.

> More about it here: [A change detection, zone.js, zoneless, local cd, and signals story 📚](/blog/a-change-detection-zone-js-zoneless-local-change-detection-and-signals-story)

But what if you want to use `ChangeDetectionStrategy.OnPush` for better performance in your component? 

```ts
@Component({
    template: `<div>{{ username }}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent { /*...*/ }
```

Now that we have `OnPush` enabled, our view is not going to be updated when the name changes, because nothing is telling Angular that this component's data has changed. This is where manual change detection calls come into play.

To fix this, we can call `ChangeDetectorRef`'s `markForCheck` method to tell Angular to mark this component as dirty and to refresh the bindings/interpolations in the next change detection.

```typescript
export class UserComponent {
  #cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.#userService.getUser().pipe(take(1)).subscribe(user => {
      this.username = user.name;
      this.#cdr.markForCheck();
    });
  }
}
```

This is great, and it works fine! Then another feature comes in, and you need to update the user's name and add a button to change it, and call the `markForCheck` method again.

```typescript
export class UserComponent {
  username?: string;

  handleNameChange(newName: string) {
    this.#userService.changeName(newName).pipe(take(1)).subscribe(name => {
      this.username = name;
      this.#cdr.markForCheck(); 
    });
  }
}
```

As you can see, this can get out of hand quickly, and you can forget to call `markForCheck` in some places, which can lead to bugs in your application.

In order to solve this we would use rxjs and observables, and use the `async` pipe in the template to let Angular know that this component's data has changed as it calls `markForCheck` under the hood.

> Read more about it here: [Async pipe is not pure 🤯](/blog/async-pipe-is-not-pure)

Our component would look like this:

```typescript
@Component({
    template: `<div>{{ username$ | async }}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe]
})
export class UserComponent {
  #userService = inject(UserService);
  #cdr = inject(ChangeDetectorRef);

  username$ = new BehaviorSubject<string>('');

  ngOnInit() {
    this.#userService.getUser().pipe(take(1)).subscribe(user => {
      this.username$.next(user.name);
    });
  }

  handleNameChange(newName: string) {
    this.#userService.changeName(newName).pipe(take(1)).subscribe(name => {
      this.username$.next(name);
    });
  }
}
```

This is perfectly valid code, now we won't need to call `markForCheck` anymore, and we can be sure that the view will be updated when the data changes.

Having to create BehaviorSubjects and using the `async` pipe in the template can be a bit cumbersome, and this is where Angular signals come into play.

Signals are a new way to handle state in Angular, and they are very powerful and greatly simplify the way we write Angular applications and in the same time improve the performance of our applications, because **_Angular thinks in signals now_**.

## Step by step guide to remove manual change detection

- [Optional] Use ESLint to find all manual CD calls

If you're using ESLint there is a package which you can install that will show you all the manual CD calls in your application.

[RxAngular](https://www.rx-angular.io/) publishes an ESLint plugin with a set of ESLint rules for building reactive, performant and Zone-less Angular applications.

You can find it here: [RxAngular ESLint Plugin](https://www.rx-angular.io/docs/eslint-plugin)

```bash
npm install --save-dev @rx-angular/eslint-plugin
```

Enable the rule: 

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@rx-angular"],
  "rules": {
    "@rx-angular/no-explicit-change-detection-apis": "error",
  }
}
```

- Check why the manual CD call was needed
In our case, we are using `OnPush` and we need to tell Angular when the data has changed. 

```typescript
username: string = '';

ngOnInit() {
    this.#userService.getUser().pipe(take(1)).subscribe(user => {
        this.username = user.name;
        this.#cdr.markForCheck();
    });
}
```

Let's replace the `username` field with a signal.

```diff
- username: string = '';
+ username = signal(''); // Will be typed as WritableSignal<string>
```

Now we will see that it will throw an error when we try to set a new value to the field inside the subscription.

```typescript
ngOnInit() {
    this.#userService.getUser().pipe(take(1)).subscribe(user => {
        // ❌ Type 'string' is not assignable to type 'WritableSignal<string>'.
        this.username = user.name;
        this.#cdr.markForCheck();
    });
}
```

But, if your application is not using Typescript strict mode, you won't see this error. In this case, you should also use the `readonly` keyword to make sure that the value is never set directly.

```diff
- username = signal('');
+ readonly username = signal('');
```

Now Typescript will throw an error if you try to set the value directly.

```typescript
this.#userService.getUser().pipe(take(1)).subscribe(user => {
    // ❌ Cannot assign to 'username' because it is a read-only property.
    // this.username = user.name;
    // ✅ To set the value you should use the set method 
    this.username.set(user.name); 
});
```

Now, don't forget to call this signal in the template in order to show the value.

```diff
- <div>{{ username }}</div>
+ <div>{{ username() }}</div>
```

And that's it! You have removed the manual change detection call from your Angular application.

Why does this work? Well, signals will mark the template as dirty and as needed to be checked by Angular when they change, but also, in a zoneless world, they also trigger a Change Detection cycle which will update the view with the new value.

> Read more about it here: [A new era for Angular - Zoneless Change Detection](/blog/a-new-era-for-angular-zoneless-change-detection)

_I'm also looking to create an eslint rule that does all of this automatically for you, so you don't have to do it manually. If you're interested in this, let me know in the comments below._

---

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎


