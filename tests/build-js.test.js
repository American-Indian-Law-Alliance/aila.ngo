import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {buildJs} from '../src/_config/events/build-js.js';

test('component bundles preserve import.meta.url for is-land registration', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'aila-build-js-'));
  try {
    const output = await buildJs(
      'src/assets/scripts/components/is-land.js',
      path.join(directory, 'is-land.js'),
      'esm'
    );
    assert.match(output, /import\.meta\.url/);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});
