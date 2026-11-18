import assert from 'node:assert/strict';
import {globSync, readFileSync} from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';

test('frontmatter tags contain lowercase alphanumeric words with no duplicates', () => {
  let checked = 0;
  for (const file of globSync('src/**/*.{md,njk,webc}')) {
    const source = readFileSync(file, 'utf8');
    const header = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!header) continue;
    const data = yaml.load(header[1]);
    if (!data?.tags) continue;
    checked++;
    assert(Array.isArray(data.tags), file);
    assert.equal(new Set(data.tags).size, data.tags.length, file);
    for (const tag of data.tags) assert.match(tag, /^[a-z0-9]+(?: [a-z0-9]+)*$/, file);
  }
  assert(checked > 0);
});
