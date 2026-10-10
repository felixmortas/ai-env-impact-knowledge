import { defineCollection } from 'astro:content';
import { fileURLToPath } from 'node:url';
import { assembleArticle } from './lib/assemble-article';
import { applyTableCaptions } from './lib/tables';
import { formatEntry, loadBibliography } from './lib/bibliography';
import { createCitations } from './lib/citations';

const article = defineCollection({
  loader: {
    name: 'article-fr',
    load: async ({ store, renderMarkdown, watcher }) => {
      const mainPath = fileURLToPath(new URL('./fr/main.md', import.meta.url));
      const bibliography = loadBibliography(fileURLToPath(new URL('./references.bib', import.meta.url)));
      const citations = createCitations(bibliography);
      const { title, markdown } = assembleArticle(
        mainPath,
        {
          root: fileURLToPath(new URL('../', import.meta.url)),
          base: import.meta.env.BASE_URL.replace(/\/+$/, ''),
        },
        citations,
      );
      const references = citations.finish().references.map((ref) => {
        const bibEntry = bibliography.get(ref.key);
        if (!bibEntry) throw new Error(`Entrée absente de references.bib : "${ref.key}"`);
        return { ...ref, ...formatEntry(bibEntry) };
      });
      store.clear();
      const rendered = await renderMarkdown(markdown);
      store.set({
        id: 'fr',
        data: { title, references },
        body: markdown,
        rendered: { ...rendered, html: applyTableCaptions(rendered.html) },
      });
      watcher?.add(fileURLToPath(new URL('./fr', import.meta.url)));
      watcher?.add(fileURLToPath(new URL('./references.bib', import.meta.url)));
    },
  },
});

export const collections = { article };
