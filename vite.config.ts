/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { getProductionBlogPosts } from './vite-blog.utils';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      prerender: {
        discover: true,
        routes: ['/', '/blog', ...getProductionBlogPosts()],
        sitemap: {
          host: 'https://justangular.com/',
        },
        postRenderingHooks: [
          async (route) => {
            const gTag = `
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-9RYZZ33YWW"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9RYZZ33YWW');
            </script>
            `;
            route.contents = route.contents?.concat(gTag);
          },
        ],
      },
      vite: {
        experimental: {
          dangerouslySupportNgFormat: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
