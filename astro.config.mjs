import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sqlclr.com',
  output: 'static',
  server: {
    port: Number(process.env.PORT) || 4321,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
