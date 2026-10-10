import { defineCollection } from 'astro:content';
import { fileURLToPath } from 'node:url';
import { assembleArticle } from './lib/assemble-article';
import { applyTableCaptions } from './lib/tables';
import { formatEntry, loadBibliography } from './lib/bibliography';
import { createCitations } from './lib/citations';
import { discoverLanguages } from './lib/languages';

const srcDir = fileURLToPath(new URL('./', import.meta.url));

const article = defineCollection({
  loader: {
    name: 'article',
    load: async ({ store, renderMarkdown, watcher }) => {
      // Une entrée par langue ; échoue (en nommant la langue) si dossiers, chaînes ou clés sont incohérents.
      const languages = discoverLanguages(srcDir);
      const bibliography = loadBibliography(fileURLToPath(new URL('./references.bib', import.meta.url)));
      store.clear();
      for (const lang of languages) {
        const mainPath = fileURLToPath(new URL(`./${lang}/main.md`, import.meta.url));
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
        const rendered = await renderMarkdown(markdown);
        // Sépare le h1 du reste pour insérer le bloc auteur juste en dessous.
        const h1End = rendered.html.indexOf('</h1>');
        if (h1End === -1) throw new Error(`Titre h1 introuvable dans le rendu (langue "${lang}")`);
        const h1Html = rendered.html.slice(0, h1End + 5);
        const bodyHtml = rendered.html.slice(h1End + 5);
        store.set({
          id: lang,
          data: { title, references, h1Html },
          body: markdown,
          rendered: { ...rendered, html: applyTableCaptions(bodyHtml) },
        });
        watcher?.add(fileURLToPath(new URL(`./${lang}`, import.meta.url)));
      }
      watcher?.add(fileURLToPath(new URL('./references.bib', import.meta.url)));
      watcher?.add(fileURLToPath(new URL('./locales', import.meta.url)));
    },
  },
});

export const collections = { article };
