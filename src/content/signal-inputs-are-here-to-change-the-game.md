---
title: Angular Signal Inputs are here to change the game 🎲
slug: signal-inputs-are-here-to-change-the-game
description: Angular has gone through a lot of changes in the past few years. Since the release of 2.0 Angular embraced decorators and used them to annotate parts of code that should be processed by Angular. We…
coverImage: '/signal-inputs1.png'
coverImageAlt: 'Photo by Erik Mclean on Unsplash'
tags: ['Signals', 'Inputs', 'Angular']
publishedAt: '2024-01-10T00:00:00.000Z'
---

# Angular Signal Inputs are here to change the game 🎲

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

```
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
Error: Required input 'user' from component UserComponent must be specified.
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
@Input() user: User | null = null;
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

> _Because the user will always be instantiated, we won't need to use the ! (non null assertion) anymore_ 🚀 

As we can see, we don't have to fight with TS anymore, or have to understand all the inner workings of Angular. We can just use the `input` function and we're good to go 🚀.

### Why doesn't Angular make all decorator inputs required by default?
The reason is that Angular is used in a lot of different projects. Making all inputs required by default will break a lot of projects. That's why we need to opt-in for this feature.

## Deriving state from inputs 

### Input setter with method call
With class fields, what we did to derive state was to use input setters and call a method that will derive the state from the inputs.

```ts
// deriving state from inputs with input setter and calling a method
export class UserComponent {
  _user: User | undefined;
  _images: string[] = [];

  favoriteImages: string[] = [];

  @Input() set user(user: User) {
    this._user = user;
    this.updateFavoriteImages();
  }

  @Input() set images(images: string[]) {
    this._images = images;
    this.updateFavoriteImages();
  }

  private updateFavoriteImages() {
    if (this._user && this._images) {
      this.favoriteImages = this._images.filter(x => this._user.favoriteImages.includes(x.name));
    }
  }
}
```


### Input setter with BehaviorSubject

Input setter have the issue of not having access to all input changes, that's why we used it mostly with BehaviorSubjects, and handled the racing conditions with rxjs operators. 

```ts
// deriving state from inputs with input setter and BehaviorSubject

export class UserComponent {
  user$ = new BehaviorSubject<User | undefined>(undefined);
  images$ = new BehaviorSubject<string[]>([]);

  favoriteImages$ = combineLatest([this.user$, this.images$]).pipe(
    map(([user, images]) => {
      if (user && images) {
        return images.filter(x => user.favoriteImages.includes(x.name));
      }
      return [];
    })
  );

  @Input() set user(user: User) {
    this.user$.next(user);
  }

  @Input() set images(images: string[]) {
    this.images$.next(images);
  }
}
```

### ngOnChanges

ngOnChanges on the other hand, is called for every input change and it has access to all the inputs. 

```ts
// deriving state from inputs with ngOnChanges

export class UserComponent implements OnChanges {
  @Input() user: User | undefined;
  @Input() images: string[] = [];

  favoriteImages: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user || changes.images) {
      this.updateFavoriteImages();
    }
  }

  private updateFavoriteImages() {
    if (this.user && this.images) {
      this.favoriteImages = this.images.filter(x => this.user.favoriteImages.includes(x.name));
    }
  }
}
```

These are some of the patterns that we used to derive state from inputs.


### Signals 🚦

Then signals were introduced and we started to use them to derive state from inputs. 

```ts
// deriving state from inputs with signals

export class UserComponent {
  user = signal<User | undefined>(undefined);
  images = signal<string[]>([]);

  favoriteImages = computed(() => {
    const user = this.user();
    if (user && this.images().length) {
      return this.images().filter(x => user.favoriteImages.includes(x.name));
    }
    return [];
  });

  @Input({ alias: 'user' }) set _user(user: User) {
    this.user.set(user);
  }

  @Input({ alias: 'images' }) set _images(images: string[]) {
    this.images.set(images);
  }
}
```

Basically, we just refactored the code to use signals instead of BehaviorSubjects. And computed instead of combineLatest.


### Signal Inputs

Now, with signal inputs, we can just use the `input` function and we're good to go 🚀.

```ts
// deriving state from inputs with signal inputs

export class UserComponent {
  user = input.required<User>(); // Let's make the user input required for this example
  images = input<string[]>([]);

  favoriteImages = computed(() => {
    const user = this.user();
    if (user && this.images().length) {
      return this.images().filter(x => user.favoriteImages.includes(x.name));
    }
    return [];
  });
}
```


## Inputs + API calls

This was easy to do with BehaviorSubjects, because we can just pipe the observables and handle the racing conditions with rxjs operators. 

```ts
// inputs + api calls with BehaviorSubjects
export class UserComponent {
  private imagesService = inject(ImagesService);
  user$ = new BehaviorSubject<User | undefined>(undefined);

  favoriteImages$ = this.user$.pipe(
    switchMap(user => {
      if (user) {
        return this.imagesService.getImages(user.favoriteImages);
      }
      return of([]);
    })
  );

  @Input() set user(user: User) {
    this.user$.next(user);
  }
}
```

With `ngOnChanges` we can do the same thing, but we need to handle the racing conditions ourselves.

```ts
// inputs + api calls with ngOnChanges
export class UserComponent implements OnChanges {
  private imagesService = inject(ImagesService);
  @Input() user: User | undefined;

  favoriteImages: string[] = [];

  private currentSub?: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.updateFavoriteImages();
    }
  }

  private updateFavoriteImages() {
    if (this.user) {
      this.currentSub?.unsubscribe();

      this.currentSub = this.imagesService
        .getImages(this.user.favoriteImages)
        .subscribe(images => (this.favoriteImages = images));
    }
  }

  ngOnDestroy() {
    // unsubscribe from the observable when the component is destroyed
    this.currentSub?.unsubscribe(); 
  }
}
```

That's too much code for something that should be simple. And also, if the api call depends on more than one input, we need to handle the racing conditions ourselves.


### Signal Inputs + API calls

In order to listen to input changes, we use the `effect` function. 

In v17, `effect` is scheduled to run after all the inputs are initialized. So, it means even if we have effect in the constructor, we can be sure that all the inputs are initialized (inside of it).

```ts
export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  constructor() {
    console.log('constructor - user', this.user()); // user is undefined here
    effect(() => {
      console.log('effect - user', this.user());
    });
  }

  ngOnInit() {
    console.log('init - user', this.user()); // user is defined here
  }
}

```

```html
<app-user [user]="user" />
```

This code will result in the following output:

```bash
constructor  - user undefined
init         - user { name: 'John' };
effect       - user { name: 'John' };
```

Because of this, we can use the `effect` function to make API calls.

```ts
// inputs + api calls with signal inputs

export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = signal<string[]>([]);

  constructor() {
    effect((onCleanup) => {
      const sub = this.imagesService.getImages(this.user().favoriteImages).subscribe(images => {
        this.favoriteImages.set(images);
      });
      onCleanup(() => sub.unsubscribe())
    });
  }
}
```

This is great, until we have to manage multiple input changes, and derive state from them, while also maintaining the subscriptions. 

## [computedFrom](https://ngxtension.netlify.app/utilities/signals/computed-from/) (ngxtension) to the rescue

`computedFrom` was born out of the need to derive state from multiple sources (observables, signals, signals from inputs) and also to manage the subscriptions in a clean way (without having to unsubscribe manually).

> Read the whole story here: <br> [A sweet spot between signals and observables 🍬](https://itnext.io/a-sweet-spot-between-signals-and-observables-a3c9620768f1)

This is how we can use it to derive state from inputs and api calls:

```ts
// inputs + api calls with signal inputs + computedFrom

export class UserComponent {
  private imagesService = inject(ImagesService);
  user = input.required<User>();

  favoriteImages = computedFrom(
    [this.user], // sources
    switchMap(([user]) => this.imagesService.getImages(user.favoriteImages)), // side effect + computation
    { initialValue: [] } // options
  );
}
```

If you have more sources, you can just add them to the array:

```ts
favoriteImages = computedFrom(
  [this.user, this.imageOptions],
  switchMap(([user, options]) => 
    this.imagesService.getImages(user.favoriteImages, options)
  ),
  { initialValue: [] } 
);
```

## Migrating to Signal Inputs
You can go over all your inputs and start refactoring every input and its references one by one, or you can use some migration schematics that handle most of the basic usage patterns for you.

The [ngxtension](https://ngxtension.netlify.app) library publishes some schematics you can use in an Angular or Nx workspace.

To use it you just have to run these two commands:

```bash
npm install ngxtension
ng g ngxtension:convert-signal-inputs
```

Find more about it in the docs: [Ngxtension Signal Inputs Migration](https://ngxtension.netlify.app/utilities/migrations/signal-inputs-migration/) by [Chau Tran](https://twitter.com/Nartc1410) 🪄

## To sum up

With signal inputs, we can just use the `input` function and we're good to go 🚀. We don't have to fight with `Typescript` anymore or have to understand all the inner workings of `Angular`. We can just use the `input` function to derive state directly from inputs, to manage API calls more easily, and if we don't want to maintain any glue code at all, `computedFrom` (ngxtension) is there to help us.


### The article was reviewed by: 
- [Matthieu Riegler 🧑🏻‍💻](https://twitter.com/Jean__Meche) (Make sure to follow him on Twitter for everything Angular)

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎
