---
title: Signal Inputs are here to change the game 🎯
slug: signal-inputs-are-here
description: What you have been waiting for! 🚀
coverImage: '/cd.webp'
tags: ['Signals', 'Inputs', 'Angular']
publishedAt: Jan 10 2024
---
# Signal Inputs are here to change the game 🎯

Angular has gone through a lot of changes in the past few years. Since the release of 2.0 Angular embraced dectorators and used them to annotate parts of code that should be processed by Angular. We have `Component`, `Directive`, `Pipe`, `Injectable` decorators for classes etc. We also have `@Input` and `@Output` decorators that are used to define inputs and outputs of a component (public API of a component).

In this article, we will see how Angular is going to reduce the decorator usage for Inputs by using signal inputs and how it will make the code more readable, easier to understand.

## Decorator Inputs
Let's start with a simple example of a component that has an input property.

```ts
@Component({
  selector: 'user',
  template: `
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
  `,
})
export class UserComponent {
  @Input() user: User;
}
```

The `@Input` decorator is used to define an input property. The `user` property is an input property and it is used to pass a `User` object to the component. The `User` object is then used to render the name and email of the user.

The code above looks ok, but it has a few issues 🤔. 

Just by looking at the type, we can see that the `user` will always be set (it's not optional). But, we're still allowed to use the component as: 

```html
<user />
```

But, this will result in an error at runtime because the `user` property is not set. 

```bash
Error: Cannot read property 'name' of undefined
```

We can fix this by making the `user` property optional:

```ts
@Input() user?: User;
```

Now, we need to check if the `user` is set before using it:

```html
@if (user) {
  <h1>{{ user.name }}</h1>
  <p>{{ user.email }}</p>
}
```

or by using the `?` operator:

```html
<h1>{{ user?.name }}</h1>
<p>{{ user?.email }}</p>
```

This is a lot of code for something that should be simple. We can fix this by using a default value:

```ts
@Input() user: User = { name: '', email: '' };
```

Now, we can use the `user` property without checking if it is set. But, what if the `user` object has a lot more fields? We would need to set all of them to a default value. This is not a good solution 🙃.

What we can do is to make the user input required if it's a core part of the component. We can do this by using the `{ required: true }` option:

```ts
@Input({ required: true }) user: User;
```

This will make the `user` input required and we will get an error if we don't set it.

```html
<user />
```

This will result in an error:

```bash
Error: Required input 'user' from component UserComponent must be specified.ngtsc(-998008)
```

### How can we make these errors appear earlier? 
What we can do is to make enable `strictPropertyInitialization` in the `tsconfig.json` file. This will make the compiler check if all properties are initialized. The code below will result in an error:

```ts
@Input() user: User; // error: Property 'user' has no initializer and is not definitely assigned in the constructor.
```

In order to fix this TS error, we either need to set a default value or just set it to `undefined` or `null`:

```ts
@Input() user: User | undefined;
// or
@Input() user: User | null;
// or
@Input() user?: User;
```

And then, just like before we need to check if the `user` is set before using it.

If we try to make the `user` input required, we will get the same error:

```ts
@Input({ required: true }) user: User; // error: Property 'user' has no initializer and is not definitely assigned in the constructor.
```

We can fix this by using the `!` operator:

```ts
@Input({ required: true }) user!: User;
```

This is fine, because we're telling the compiler that the `user` property will be set before we use it.

## Signal Inputs
In Angular v17.1, a new feature was introduced - Signal Inputs. This is how they will look like: 
    
```ts
export class UserComponent {
  user = input<User>();
}
```

The code above is equivalent to the code below:

```ts
export class UserComponent {
  @Input() user: User | undefined;
}
```

The difference is that by default if we don't make the input required, the `user` property will be set to `undefined`. This is the first thing that signal inputs protect us from.

### Required Inputs
If we want to make the `user` input required, we can do it by using the `required` option:

```ts
export class UserComponent {
  user = input.required<User>();
}
```

This is equivalent to:

```ts
export class UserComponent {
  @Input({ required: true }) user!: User;
}
```

What we can also do is to set a default value:

```ts
export class UserComponent {
  user = input<User>({ name: '', email: '' });
}
```

As we can see, we don't have to fight with TS anymore, or have to understand all the inner workings of Angular. We can just use the `input` function and we're good to go 🚀.

### Why doesn't Angular make all decorator inputs required by default?
The reason is that Angular is used in a lot of different projects. Making all inputs required by default will break a lot of projects. That's why we need to opt-in for this feature.




- inputs as class fields vs inputs as signals
- deriving state from inputs
- ngOnChanges vs effect ?
- inputs + api calls
- typechecking (add link here)
- input options
- initial value dilemma + typechecking
- small trick for easy migration
    
    
    
    
    
    
    