import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function copyTinyMCE() {
  return {
    name: 'copy-tinymce',
    buildStart() {
      const src = fileURLToPath(new URL('./node_modules/tinymce', import.meta.url));
      const dest = fileURLToPath(new URL('./public/tinymce', import.meta.url));
      if (!existsSync(dest + '/tinymce.min.js')) {
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    assets: 'assets'
  },
  vite: {
    plugins: [copyTinyMCE()],
  },
});