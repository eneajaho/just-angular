import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-footer',
    template: `
        <footer class="glass border-t border-gray-200 dark:border-white/10 mt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="flex flex-col items-center space-y-6">
                    <!-- Main content -->
                    <div class="text-center">
                        <p class="text-gray-900 dark:text-white text-lg">
                            Brought to you by 
                            <a 
                                href="https://twitter.com/Enea_Jahollari" 
                                target="_blank" 
                                class="gradient-text font-semibold hover:scale-105 transition-transform duration-200 inline-block ml-1"
                            >
                                Enea Jahollari
                            </a>
                        </p>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mt-2">
                            Sharing Angular knowledge and best practices
                        </p>
                    </div>

                    <!-- Social links -->
                    <div class="flex space-x-6">
                        <a 
                            href="https://twitter.com/Enea_Jahollari" 
                            target="_blank"
                            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            aria-label="Twitter"
                        >
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a 
                            href="https://github.com/eneajahollari" 
                            target="_blank"
                            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                            aria-label="GitHub"
                        >
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>

                    <!-- Links -->
                    <div class="flex space-x-6">
                        <a
                            routerLink="/privacy-policy"
                            routerLinkActive="text-blue-600 dark:text-blue-400"
                            ariaCurrentWhenActive="page"
                            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                        >
                            Privacy Policy
                        </a>
                    </div>

                    <!-- Copyright -->
                    <div class="text-center pt-6 border-t border-gray-200 dark:border-white/10 w-full">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">
                            © {{ year }} JustAngular. All rights reserved.
                        </p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">
                            Powered by 
                            <a href="https://analogjs.org" target="_blank" class="font-semibold text-orange-500 hover:text-orange-400">Analog.js</a> 
                            & 
                            <a href="https://angular.dev" target="_blank" class="font-semibold text-red-500 hover:text-red-400">Angular</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    `,
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
    year = new Date().getFullYear();
}