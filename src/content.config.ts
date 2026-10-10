import { defineCollection } from 'astro:content';
import { fileURLToPath } from 'node:url';
import { assembleArticle } from './lib/assemble-article';
import { applyTableCaptions } from './lib/tables';

const article = defineCollection({
  loader: {
    name: 'article-fr',
    load: async ({ store, renderMarkdown, watcher }) => {
      const mainPath = fileURLToPath(new URL('./fr/main.md', import.meta.url));
      const { title, markdown } = assembleArticle(mainPath, {
        root: fileURLToPath(new URL('../', import.meta.url)),
        base: import.meta.env.BASE_URL.replace(/\/+$/, ''),
      });
      store.clear();
      const rendered = await renderMarkdown(markdown);
      store.set({
        id: 'fr',
        data: { title },
        body: markdown,
        rendered: { ...rendered, html: applyTableCaptions(rendered.html) },
      });
      watcher?.add(fileURLToPath(new URL('./fr', import.meta.url)));
    },
  },
});

export const collections = { article };
