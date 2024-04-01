import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumbs } from '../components/breadcrumb.component';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-about',
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs [breadcrumbs]="[{ url: '/about', label: 'About' }]"/>
    </div>

    <div class="max-w-3xl">
      <div class="grid place-items-center  mt-10 text-2xl">
        <img ngSrc="enea.png" height="400" width="400" priority alt="Enea Jahollari">

        <h1 class="text-4xl font-bold mt-5">Enea Jahollari</h1>

        <p class="text-gray-400 mt-5">Software Engineer focused on performance, scalability, and architecture of web
          applications.</p>


        <p class="text-gray-400 mb-[100px]">
          Software Engineer focused on performance, scalability, and architecture of web applications.
          I'm also a Google Developer Expert for Angular. I've given talks and workshops about Angular ngIndia,
          AngularAustria, and
          NgPoland, and also internal workshops at various companies.
          I'm a maintainer of the RxAngular library known for bringing performance utils to your fingertips ready to be
          used.
          I'm a co-creator of the ngxtension library which tries to make it easier to use Signal primitives in Angular
          apps.
          I've written multiple blog posts regarding Angular performance, internals, Signals, and architecture which get
          a lot of daily
          traction.
          I tweet a lot about Angular's latest news and updates in X (formerly Twitter).
        </p>

        Brought to you by
        <a href="https://x.com/Enea_Jahollari">Enea Jahollari</a>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs, NgOptimizedImage],
})
export default class AboutCmp {}
