import { RouteMeta } from '@analogjs/router';

// export const routeMeta: RouteMeta = {
//   redirectTo: '/blog',
//   pathMatch: 'full',
// };

import { Component } from '@angular/core';
import { FromBlogComponent } from '../components/from-the-blog.component';

@Component({
  standalone: true,
  template: `
    <div class="px-6 py-10 lg:px-8">
      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-200">
        <p class="text-base font-semibold leading-7 text-indigo-500">
          Introducing
        </p>
        <h1
          style="font-family: DM Mono, monospace;"
          class="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl"
        >
          justangular.com
        </h1>
        <p class="mt-6 text-xl leading-8">
          The blog you would like to read if you are a beginner or an expert in
          Angular. It is a comprehensive resource designed to cater to all
          levels of proficiency, ensuring a seamless learning experience for
          newcomers and seasoned developers alike.
        </p>
        <div class="mt-10 max-w-2xl text-xl leading-8">
          <p>
            Whether you're new to Angular or want to get better at it, this blog
            is the perfect place for you. It shares the newest and most
            important updates about Angular, along with useful tips and tricks.
            Whether you're just starting out or want to improve your skills,
            this blog has the information you need to sail smoothly through
            Angular development.
          </p>
          <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-400">
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                ><strong class="font-semibold text-gray-100">Signals</strong>
                Everything you need to know about signals, how they work and how
                to use them.
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                ><strong class="font-semibold text-gray-100"
                  >Change detection</strong
                >
                Angular needs to know when to update the view. It needs some
                change detection.
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                ><strong class="font-semibold text-gray-100"
                  >Control flow</strong
                >
                To show or not to show? That is the question. What &#64;if ?
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>
                <strong class="font-semibold text-gray-100">
                  Http call management
                </strong>
                When to call the server? How to handle errors? I changed my
                mind, how do I cancel it?
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>
                <strong class="font-semibold text-gray-100">Forms</strong>
                You want to build a form? Validation? Typeahead? Two ways? We
                got you covered.
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>
                <strong class="font-semibold text-gray-100"
                  >Guards, Resolvers, Interceptors</strong
                >
                Best practices at your fingertips.
              </span>
            </li>
            <li class="flex gap-x-3">
              <svg
                class="mt-1 h-5 w-5 flex-none text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>
                <strong class="font-semibold text-gray-100"
                  >Server side rendering?</strong
                >
                You want that SEO juice? And that fast inital load speed? Go to
                the <a class="cursor-pointer" routerLink="/blog">blog</a>.
              </span>
            </li>
          </ul>
          <!-- <p class="mt-8">
            Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis
            odio id et. Id blandit molestie auctor fermentum dignissim. Lacus
            diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices
            hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem
            vel integer orci.
          </p>
          <h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-100">
            From beginner to expert in 3 hours
          </h2>
          <p class="mt-6">
            Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat
            in. Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum
            mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
            tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi.
            Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis
            diam.
          </p>
          <figure class="mt-10 border-l border-indigo-600 pl-9">
            <blockquote class="font-semibold text-gray-100">
              <p>
                “Vel ultricies morbi odio facilisi ultrices accumsan donec lacus
                purus. Lectus nibh ullamcorper ac dictum justo in euismod. Risus
                aenean ut elit massa. In amet aliquet eget cras. Sem volutpat
                enim tristique.”
              </p>
            </blockquote>
            <figcaption class="mt-6 flex gap-x-4">
              <img
                class="h-6 w-6 flex-none rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <div class="text-sm leading-6">
                <strong class="font-semibold text-gray-100">Maria Hill</strong>
                – Marketing Manager
              </div>
            </figcaption>
          </figure>
          <p class="mt-10">
            Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
            enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
            praesent donec est. Odio penatibus risus viverra tellus varius sit
            neque erat velit.
          </p>
        </div>
        <figure class="mt-16">
          <img
            class="aspect-video rounded-xl bg-gray-50 object-cover"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3"
            alt=""
          />
          <figcaption class="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
            <svg
              class="mt-0.5 h-5 w-5 flex-none text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clip-rule="evenodd"
              />
            </svg>
            Faucibus commodo massa rhoncus, volutpat.
          </figcaption>
        </figure>-->
          <div class="mt-16 max-w-2xl">
            <h2 class="text-2xl font-bold tracking-tight text-gray-100">
              All the Angular you need
            </h2>
            <p class="mt-6">
              Feel free to browse the blog and learn more about Angular. If you
              have any questions, feel free to reach out to me on X (formerly
              Twitter) at
              <a class="cursor-pointer" href="https://x.com/Enea_Jahollari">
                Enea_Jahollari </a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>

    <app-from-blog />
  `,
  imports: [FromBlogComponent],
})
export default class HomePageComponent {}
