// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  resolve: {
    alias: {
      '@assets': resolve(__dirname, './assets'),
    }
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chapter1: resolve(__dirname, 'chapter-1/index.html'),
        chapter2: resolve(__dirname, 'chapter-2/index.html'),
        chapter3: resolve(__dirname, 'chapter-3/index.html')
      },
    },
  },
});
