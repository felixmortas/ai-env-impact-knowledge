import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Publie le dossier partagé `images/` vers `dist/images/` (copie déterministe, sans le dupliquer dans src/).
const publishImages = {
  name: 'publish-images',
  hooks: {
    'astro:build:done': ({ dir }) => {
      cpSync(new URL('./images/', import.meta.url), fileURLToPath(new URL('./images/', dir)), { recursive: true, filter: (src) => !src.endsWith('.DS_Store') });
    },
  },
};

// Site 100 % statique, déployé sur GitHub Pages.
export default defineConfig({
  site: 'https://felixmortas.com',
  base: '/ai-env-impact-knowledge',
  output: 'static',
  trailingSlash: 'always',
  // Le Markdown est la source de vérité : aucune conversion typographique.
  markdown: { smartypants: false },
  integrations: [react(), publishImages],
});
