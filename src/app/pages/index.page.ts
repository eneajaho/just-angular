import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'JustAngular - justangular.com',
  meta: [
    {
      name: 'description',
      content: `The blog you would like to read if you are a beginner or an expert in Angular. It is a comprehensive resource designed to cater to all levels of proficiency, ensuring a seamless learning experience for newcomers and seasoned developers alike.`,
    },
    {
      name: 'author',
      content: 'Enea Jahollari',
    },
    {
      property: 'og:title',
      content: 'justangular.com',
    },
    {
      property: 'og:description',
      content: `The blog you would like to read if you are a beginner or an expert in Angular. It is a comprehensive resource designed to cater to all levels of proficiency, ensuring a seamless learning experience for newcomers and seasoned developers alike.`,
    },
    { property: 'og:image', content: '/justangular.png' },
    { property: 'twitter:creator', content: '@Enea_Jahollari' },
    { property: 'twitter:image', content: '/justangular.png' },
  ],
};

@Component({
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            <span class="gradient-text">justangular.com</span>
          </h1>
          
          <p class="mt-8 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The blog you would like to read if you are a beginner or an expert in Angular. 
            A comprehensive resource designed to cater to all levels of proficiency, ensuring 
            a seamless learning experience for newcomers and seasoned developers alike.
          </p>
          
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              routerLink="/blog"
              class="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 hover:scale-105"
            >
              Explore Blog
            </a>
            <a
              href="https://twitter.com/Enea_Jahollari"
              target="_blank"
              class="text-lg font-semibold leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Follow on Twitter <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to master Angular
            </h2>
            <p class="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Whether you're new to Angular or want to get better at it, this blog is the perfect place for you.
            </p>
          </div>
          
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Signals</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Everything you need to know about signals, how they work and how to use them effectively in your Angular applications.
              </p>
            </div>

            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Change Detection</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Angular needs to know when to update the view. Learn about change detection strategies and optimization techniques.
              </p>
            </div>

            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Control Flow</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                To show or not to show? That is the question. Master Angular's new control flow syntax with &#64;if, &#64;for, and more.
              </p>
            </div>

            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">HTTP Management</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                When to call the server? How to handle errors? Learn about HTTP call management, error handling, and request cancellation.
              </p>
            </div>

            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                  <svg class="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Forms</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                You want to build a form? Validation? Typeahead? Two-way binding? We've got you covered with comprehensive form guides.
              </p>
            </div>

            <div class="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div class="flex items-center gap-x-3 mb-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Guards & Interceptors</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Best practices at your fingertips. Learn about route guards, HTTP interceptors, and resolvers for robust applications.
              </p>
            </div>
          </div>

          <div class="mt-16 text-center">
            <div class="glass p-8 rounded-2xl">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Server Side Rendering?
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                You want that SEO juice? And that fast initial load speed? 
                Discover the power of Angular Universal and SSR techniques.
              </p>
              <a 
                routerLink="/blog"
                class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 transition-all duration-200 hover:scale-105"
              >
                Explore the Blog
                <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [RouterLink]
})
export default class HomePageComponent { }
