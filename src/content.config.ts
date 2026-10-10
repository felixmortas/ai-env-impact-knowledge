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
      // Sépare le h1 du reste pour insérer le bloc auteur juste en dessous.
      const h1End = rendered.html.indexOf('</h1>');
      if (h1End === -1) throw new Error('Titre h1 introuvable dans le rendu');
      const h1Html = rendered.html.slice(0, h1End + 5);
      const bodyHtml = rendered.html.slice(h1End + 5);
      store.set({
        id: 'fr',
        data: { title, references, h1Html },
        body: markdown,
        rendered: { ...rendered, html: applyTableCaptions(bodyHtml) },
      });
      watcher?.add(fileURLToPath(new URL('./fr', import.meta.url)));
      watcher?.add(fileURLToPath(new URL('./references.bib', import.meta.url)));
    },
  },
});

export const collections = { article };
