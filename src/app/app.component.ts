import { Component } from '@angular/core';
import { ComponentIntro } from './lessons/component-intro/component-intro.component';

@Component({
    selector: 'app-root',
    template: `<app-component-intro />`,
    standalone: true,
    imports: [ComponentIntro]
})
export class AppComponent {}