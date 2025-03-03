// @ts-nocheck
import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikReact } from '@builder.io/qwik-react/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), qwikCity(), qwikVite(), tsconfigPaths(), qwikReact()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
