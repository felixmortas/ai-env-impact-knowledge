import { test } from 'node:test';
import assert from 'node:assert/strict';
import { share } from './share.ts';

const title = 'Titre';
const url = 'https://exemple.org/fr/';

test('Web Share disponible : reçoit titre et URL canonique', async () => {
  const calls: unknown[] = [];
  const result = await share({ title, url, nav: { share: async (d) => void calls.push(d) } });
  assert.equal(result, 'shared');
  assert.deepEqual(calls, [{ title, url }]);
});

test('annulation (AbortError) : silencieuse, sans copie', async () => {
  let copied = false;
  const result = await share({
    title, url,
    nav: {
      share: async () => { throw Object.assign(new Error('x'), { name: 'AbortError' }); },
      clipboard: { writeText: async () => { copied = true; } },
    },
  });
  assert.equal(result, 'aborted');
  assert.equal(copied, false);
});

test('Web Share absent : copie l\'URL', async () => {
  let text = '';
  const result = await share({ title, url, nav: { clipboard: { writeText: async (s) => { text = s; } } } });
  assert.equal(result, 'copied');
  assert.equal(text, url);
});

test('Web Share en erreur (hors annulation) : repli sur la copie', async () => {
  const result = await share({
    title, url,
    nav: { share: async () => { throw new Error('NotAllowed'); }, clipboard: { writeText: async () => {} } },
  });
  assert.equal(result, 'copied');
});

test('copie refusée : échec explicite', async () => {
  const result = await share({ title, url, nav: { clipboard: { writeText: async () => { throw new Error('denied'); } } } });
  assert.equal(result, 'failed');
});

test('ni partage ni presse-papiers : échec explicite', async () => {
  assert.equal(await share({ title, url, nav: {} }), 'failed');
});
