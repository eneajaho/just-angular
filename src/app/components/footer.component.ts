import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-footer',
    template: `
        <div class="bg-gray-800 text-gray-300 flex space-x-4 items-center justify-center flex-col py-5">
         <div>
            Brought to you by <a href="https://twitter.com/Enea_Jahollari" target="_blank" class=" hover:bg-gray-700 hover:text-white px-1 py-1 rounded-md font-medium"  style="font-family: 'DM Mono', monospace;">
                Enea Jahollari
            </a>
         </div>

         <div class="mt-10">
            <a
                routerLink="/privacy-policy"
                routerLinkActive="bg-gray-900 text-white"
                ariaCurrentWhenActive="page"
                style="font-family: 'DM Mono', monospace;"
                class=" hover:bg-gray-700 hover:text-white px-3 py-2 rounded-sm font-medium"
            >
                Privacy Policy
            </a>
         </div>
        </div>
    `,
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer { }