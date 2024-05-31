---
title: Read this if you are building design system components in Angular 🎨
slug: read-this-if-you-are-building-design-system-components-in-angular
description: Learn how to make your components extensible and easy to use in Angular by other developers.
coverImage: "/read-this-if-you-are-building-design-system-components-in-angular.png"
coverImageAlt: "Read this if you are building design system components in Angular 🎨"
tags: ["Angular", "DesignSystem", "Signals", "Inputs", "Models"]
publishedAt: "2024-05-31T00:00:00.000Z"
---

# Read this if you are building design system components in Angular 🎨

If you are building a design system components library in Angular, you are probably using the new signal inputs in update it with the latest Angular features. But, there are some things that you should consider when building these components.

## Extending components using directives
I won't go into much details here, but I will link a great blog post about this topic.

[Use Angular directives to extend components that you don't own](https://timdeschryver.dev/blog/use-angular-directives-to-extend-components-that-you-dont-own) by [Tim Deschryver](https://x.com/tim_deschryver)

### TL;DR
We can use directives to extend or configure components using dependency injection. Because the directive and the component will live in the same [element injector](https://angular.dev/guide/di/hierarchical-dependency-injection#example-elementinjector-use-cases) they can inject each other.
In our case we want to inject the component into the directive so that we can configure the component.

Example with a tabs component: 

Let's say we have a tabs component with some inputs that we want to configure. 

```ts
@Component({
  selector: 'my-tabs',
})
export class TabsComponent {
    @Input() fullWidth = false;
    @Input() showIcon = false;
}
```

We can use it like: 
```html
<my-tabs [fullWidth]="true" [showIcon]="true">
    <my-tab>Hello</my-tab>
    <my-tab>World</my-tab>
</my-tabs>
```

What if we want to have this configuration in multiple places? We can create a directive that will configure the tabs component for us and provide the defaults for the inputs.

```ts
@Directive({
  selector: 'my-tabs[defaultConfig]'
})
export class DefaultTabsDirective {
    constructor(private tabs: TabsComponent) {
        tabs.fullWidth = true;
        tabs.showIcon = true;
    }
}
```

And use it like: 
```html
<my-tabs defaultConfig>
    <my-tab>Hello</my-tab>
    <my-tab>World</my-tab>
</my-tabs>
```

## Migrating to signal inputs for the tabs component
Our example was using normal decorator inputs, but what if we want to use signal inputs for the tabs component? Let's try to migrate it.

```ts
@Component({
  selector: 'my-tabs',
})
export class TabsComponent {
    fullWidth = input<boolean>(false);
    showIcon = input<boolean>(false);
}
```

We can use it the same way as before, but what about the directive? Let's see how we can migrate it.

```ts
@Directive({
  selector: 'my-tabs[defaultConfig]'
})
export class DefaultTabsDirective {
    constructor(private tabs: TabsComponent) {
        tabs.fullWidth = true; // ??? we can't do this
        tabs.showIcon = true; // ??? we can't do this
    }
}
```

We can't do this because the `fullWidth` and `showIcon` are signals and not normal properties. But the `input()` function returns a signal that we can use to read the value but not set it. So, the quick solution would be to use `model()` instead of `input()`. Because `model()` returns a signal that we can read and write.

```ts
@Component({
  selector: 'my-tabs',
})
export class TabsComponent {
    fullWidth = model<boolean>(false);
    showIcon = model<boolean>(false);
}
```

And now we can use it in the directive.

```ts
@Directive({
  selector: 'my-tabs[defaultConfig]'
})
export class DefaultTabsDirective {
    constructor(private tabs: TabsComponent) {
        tabs.fullWidth.set(true); // we can set the value
        tabs.showIcon.set(true); // we can set the value
    }
}
```

And now we can use it like before.

```html
<my-tabs defaultConfig>
    <my-tab>Hello</my-tab>
    <my-tab>World</my-tab>
</my-tabs>
```

### Listening to input changes?
Now that we are using `model` instead of `input` we can listen to the changes of the inputs. 

```html
<my-tabs defaultConfig (showIconChange)="showIconChanged($event)">
    <my-tab>Hello</my-tab>
    <my-tab>World</my-tab>
</my-tabs>
```

```ts
showIconChanged(showIcon: boolean) {
    console.log('showIcon changed', showIcon);
}
```

There's a catch. If you want the input changes to emit and to listen to them, you need to set the model value in the directive in the `ngOnInit` lifecycle hook instead of the `constructor`.

```ts
@Directive({
  selector: 'my-tabs[defaultConfig]'
})
export class DefaultTabsDirective {
    tabs = inject(TabsComponent);

    ngOnInit() {
        this.tabs.fullWidth.set(true);
        this.tabs.showIcon.set(true);
    }
}
```

## Summary
If you are building a design system components library in Angular, instead of using `input` you may want to use `model` in order to give your users the ability to extend and configure your components using directives. This way you can provide a better developer experience and make your components more extensible and easy to use.


---

# Thanks for reading!
If this article was interesting and useful to you, and you want to learn more about Angular, support me by [buying me a coffee ☕️](https://ko-fi.com/eneajahollari) or follow me on X (formerly Twitter) [@Enea_Jahollari](https://twitter.com/Enea_Jahollari) where I tweet and blog a lot about `Angular` latest news, signals, videos, podcasts, updates, RFCs, pull requests and so much more. 💎


