import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Site 100 % statique, déployé sur GitHub Pages.
export default defineConfig({
  site: 'https://felixmortas.com',
  base: '/ai-env-impact-knowledge',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
});
