import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sqlclr.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
