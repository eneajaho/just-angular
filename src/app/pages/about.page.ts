import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumbs } from '../components/breadcrumb.component';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-about',
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs [breadcrumbs]="[{ url: '/about', label: 'About' }]"/>
    </div>

    <div class="py-20 sm:py-32">
      <div class="mx-auto max-w-4xl px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <div class="mb-8">
            <span class="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
              About the Author
            </span>
          </div>
          
          <div class="relative mx-auto w-48 h-48 mb-8">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20"></div>
            <img 
              ngSrc="enea.png" 
              height="400" 
              width="400" 
              priority 
              alt="Enea Jahollari"
              class="relative rounded-full border-4 border-white/10 shadow-2xl"
            >
          </div>

          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl mb-6">
            Enea Jahollari
          </h1>
          
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Software Engineer focused on performance, scalability, and architecture of web applications.
          </p>
        </div>

        <!-- Content Section -->
        <div class="glass p-8 rounded-2xl">
          <div class="prose dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
            
            <div class="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                I'm a passionate Software Engineer with a deep focus on performance, scalability, and architecture of web applications. 
                My journey in the tech world has been driven by a constant desire to push the boundaries of what's possible in web development.
              </p>
              
              <p>
                As a <strong class="text-blue-400">Google Developer Expert for Angular</strong>, I've had the privilege of sharing my knowledge 
                through talks and workshops at major conferences including ngIndia, AngularAustria, and NgPoland. 
                I've also conducted internal workshops at various companies, helping teams level up their Angular skills.
              </p>
              
              <p>
                I'm proud to be a maintainer of the <strong class="text-purple-400">RxAngular library</strong>, which brings performance utilities 
                to your fingertips, ready to be used in production applications. This library has become an essential tool 
                for many Angular developers looking to optimize their applications.
              </p>
              
              <p>
                Together with Chau Tran & the community, I'm a co-creator of the <strong class="text-green-400">ngxtension library</strong>, 
                which makes it easier to use Signal primitives in Angular applications. This project represents our commitment 
                to making Angular development more accessible and efficient.
              </p>
              
              <p>
                I've written numerous blog posts about Angular performance, internals, Signals, and architecture that receive 
                significant daily traction from the developer community. These posts aim to bridge the gap between complex 
                concepts and practical implementation.
              </p>
              
              <p>
                You can find me actively sharing the latest Angular news and updates on 
                <a href="https://x.com/Enea_Jahollari" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  X (formerly Twitter)
                </a>, where I engage with the community and share insights about the ever-evolving Angular ecosystem.
              </p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-12 text-center">
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://x.com/Enea_Jahollari"
              target="_blank"
              class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 transition-all duration-200 hover:scale-105"
            >
              <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Follow on Twitter
            </a>
            <a 
              href="https://github.com/eneajaho"
              target="_blank"
              class="inline-flex items-center rounded-lg border border-gray-300 dark:border-white/20 px-6 py-3 text-lg font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
            >
              <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs, NgOptimizedImage],
})
export default class AboutPage { }
