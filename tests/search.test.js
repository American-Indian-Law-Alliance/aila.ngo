import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

test('search waits for island hydration before initializing and restoring the query', async () => {
  const template = readFileSync('src/_includes/partials/search-box.njk', 'utf8');
  const [, script] = template.match(/<script type="module">([\s\S]*?)<\/script>/);
  let hydrated = false;
  let searched;
  const search = {
    pagefind: async () => { assert(hydrated); },
    pagefindUI: {triggerSearch: term => { searched = term; }}
  };
  const island = {wait: async () => { hydrated = true; }};
  const fallback = {closest: () => island};
  await vm.runInNewContext(`(async () => {${script}})()`, {
    customElements: {whenDefined: async () => {}},
    document: {querySelector: () => hydrated ? search : fallback},
    window: {location: {search: '?q=Haudenosaunee'}},
    history: {replaceState: () => {}},
    URLSearchParams
  });
  assert.equal(searched, 'Haudenosaunee');
});
