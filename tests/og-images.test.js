import assert from 'node:assert/strict';
import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import {svgToWebp} from '../src/_config/events/svg-to-webp.js';

test('a slash in a post slug produces a nested WebP preview', async t => {
  const output = await mkdtemp(path.join(tmpdir(), 'aila-og-'));
  t.after(() => rm(output, {recursive: true, force: true}));
  const dir = path.join(output, 'assets/og-images/iroquois-nationals-passport');
  await mkdir(dir, {recursive: true});
  await writeFile(path.join(dir, 'visa-dispute-preview.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6"/>');
  await svgToWebp({directories: {output}});
  const image = await sharp(path.join(dir, 'visa-dispute-preview.webp')).metadata();
  assert.deepEqual([image.format, image.width, image.height], ['webp', 12, 6]);
});
