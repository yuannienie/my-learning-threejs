// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chapter1: resolve(__dirname, 'chapter-1/index.html'),
      },
    },
  },
});
