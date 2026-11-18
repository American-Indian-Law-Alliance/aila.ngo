import assert from 'node:assert/strict';
import test from 'node:test';
import {tagList, tagPages} from '../src/_config/collections.js';
import {slugifyString} from '../src/_config/filters/slugify.js';

test('tag archives merge URL-equivalent tags without losing or repeating posts', () => {
  const posts = Array.from({length: 17}, (_, index) => ({
    date: new Date(2026, 0, index + 1),
    data: {tags: ['posts', index % 2 ? 'Haudenosaunee' : 'haudenosaunee']}
  }));
  posts[0].data.tags.push('Haudenosaunee');
  const items = [...posts, {data: {tags: ['all']}}, {data: {}}];
  const collection = {
    getAll: () => items,
    getFilteredByTag: tag => items.filter(item => item.data.tags?.includes(tag))
  };

  assert.deepEqual(tagList(collection).map(slugifyString), ['haudenosaunee']);
  const pages = tagPages(collection);
  assert.deepEqual(pages.map(page => [page.slug, page.pageNumber, page.totalPages]), [
    ['haudenosaunee', 0, 1],
    ['haudenosaunee', 1, 1]
  ]);
  assert.deepEqual(pages.map(page => page.pageData.length), [15, 2]);
  assert.deepEqual(pages.flatMap(page => page.pageData), [...posts].reverse());
});

test('tag archives preserve distinct tags and merge punctuation-equivalent tags', () => {
  const posts = ['News!', 'News', 'Events'].map(tag => ({
    date: new Date(2026, 0, 1),
    data: {tags: [tag]}
  }));
  const collection = {
    getAll: () => posts,
    getFilteredByTag: tag => posts.filter(item => item.data.tags.includes(tag))
  };

  assert.deepEqual(tagList(collection).map(slugifyString), ['events', 'news']);
  const pages = tagPages(collection);
  assert.deepEqual(pages.map(page => page.slug), ['events', 'news']);
  assert.deepEqual(pages[0].pageData, [posts[2]]);
  assert.deepEqual(pages[1].pageData, posts.slice(0, 2));
});
