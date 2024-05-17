---
title: Template local variables with @let in Angular
slug: template-local-variables-with-let-in-angular
description: Angular will introduce a new block-scoped variable declaration in the upcoming v18.1. This new feature will allow you to declare variables using the `let` block inside the template. Let's see how it works and how you can use it in your Angular applications.
coverImage: "/template-local-variables-with-let-in-angular.png"
coverImageAlt: "Template local variables with @let in Angular"
tags: ["Angular", "Angular v18", "Angular Template", "Angular Template Compiler"]
publishedAt: "2024-05-17T00:00:00.000Z"
---

# Template local variables with @let in Angular

## Give me `let` Angular

If you have worked with Angular long enough, probably at some point you would have wanted to declare a variable inside the template. This is a common use case when you want to store a value that you will use later in the template.

The most common way to do this is by using a directive like `ngIf` and assign the value to a variable using the `as` keyword. For example:

```html
<div *ngIf="user$ | async as user">
  <h1>{{ user.name }}</h1>
</div>

<!-- or using the new control flow -->
@if (user$ | async; as user) {
  <h1>{{ user.name }}</h1>
}
```

What if you're working with numbers?

```html
<div>
    @if (points$ | async; as points) {
        <h1>You have: {{ points }} points!</h1>
    }
</div>
```

What would you see in the template if `points` is 0? You would see **NOTHING!** because 0 is a falsy value and when used inside the `if` block, it will not render the content.

This is where the new `@let` block comes into play. The `@let` block will allow you to declare a variable inside the template and use it later in the template. Let's see how it works.

```html
<div>
    @let points = (points$ | async) ?? 0;  
    <h1>You have: {{ points }} points!</h1>
</div>
```

This will render the content even if `points` is 0. This is because the `let` block is not checking for falsy values, it's just declaring a variable at that point in the template.

Also, one of the most common use cases for the `@let` block would be to store a variable that allows us to store aliases for complex expressions. For example:

```html
@let someField = someService.someSignal().someProperty.someOtherProperty;
<div>{{ someField }}</div>
```

## How to use `@let` in Angular
You can use the new `@let` in multiple ways: 

- **With async pipes**: 
```html
<div>
    @let user = (user$ | async) ?? { name: 'Guest' };  
    <h1>{{ user.name }}</h1>
</div>
```

- **With control flow directives**: 
```html
<div>
    @let user = user$ | async;  
    @if (user) {
        <h1>{{ user.name }}</h1>
    }
</div>
```


- **Inside @for to refactor code duplications**: 
```html
<mat-selection-list>
    @for (item of items(); track item.id) {
        @let isSelected = item.id === selectedId();
        <mat-list-option [selected]="isSelected" [class.selected]="isSelected">
            {{ item.text }} 
            @if (isSelected) {
                <span>(selected)</span>
            }
        </mat-list-option>
    }
</mat-selection-list>
```

- **With ternary operators**: 
```html
<div>
    @for (game of games; track game.id) {
        @let points = calcPoints(game.points > 0 ? game.points : 0);  
        <h1>You have: {{ points }} points!</h1>
    }
</div>
```

- **With basic math operators**: 
```html
<div>  
    @for (game of games; track game.id) {
        @let total = previousTotal + game.points;  
        <h1>Total points: {{ total }}</h1>
    }
</div>
```

- **With signals**: 
```html
<div>  
    @let username = user()?.name ?? 'Guest';
    <h1>Welcome, {{ username }}</h1>
</div>
```

- **Multiple declarations inline or in multiple lines**: 
```html
<div>  
    @let total = count + previousCount, average = calcAverage(count), (can I use `total` here?)
    
    @let total = count + previousCount, 
         average = calcAverage(count)
    <h1>{{total}}</h1>
</div>
```


## Good to know
Let declaration will work almost the same as let declarations in javascript. 

- Scoping will work the same as let in javascript. 
- Type inference just works! 
- Let declarations will have precedence to a local let declaration over a component property.
- A let declaration cannot be referenced before it is defined, with the exception when it's used inside an event handler.


More info here: [PR - Start implementation of @let syntax](https://github.com/angular/angular/pull/55848)

That's it! This is how you can use the new `@let` block in Angular templates. This feature probably will be available in Angular v18.1, which is expected to be released in the upcoming months.

Let me know of any other use cases you can think of for the `@let` block in Angular templates. 🚀

---

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎


