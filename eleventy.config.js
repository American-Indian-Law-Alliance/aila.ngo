/**
 * Most adjustments must be made in `./src/_config/*`
 *
 * Hint VS Code for eleventyConfig autocompletion.
 * © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig -
 * @returns {Object} -
 */

import path from "node:path";
import fs from "node:fs";

// register dotenv for process.env.* variables to pickup
import dotenv from 'dotenv';
dotenv.config();

// add yaml support
import yaml from 'js-yaml';

//  config import
import { getAllPosts, showInSitemap, tagList, categoriesList, categoriesPages, tagPages } from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';

// Utils Import
import { generateExcerpt } from './src/_config/utils/generate-excerpt.js';

export default async function (eleventyConfig) {
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: generateExcerpt,
  });

  // --------------------- Events: before build
  eleventyConfig.on('eleventy.before', async () => {
    await events.buildAllCss();
    await events.buildAllJs();
  });

  // --------------------- dev server
  // Serve passthrough files from where they already are instead of copying
  // them into dist on every rebuild. src/assets/documents alone is ~370 MB.
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');

  // --------------------- custom watch targets
  eleventyConfig.addWatchTarget('./src/assets/**/*.{css,js,svg,png,jpeg}');
  eleventyConfig.addWatchTarget('./src/_includes/**/*.{webc}');

  // --------------------- layout aliases
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('tags', 'tags.njk');
  eleventyConfig.addLayoutAlias('discovery', '/page/discovery.njk');
  eleventyConfig.addLayoutAlias('give', '/page/give.njk');

  //	---------------------  Collections
  eleventyConfig.addCollection('allPosts', getAllPosts);
  eleventyConfig.addCollection('showInSitemap', showInSitemap);
  eleventyConfig.addCollection('tagList', tagList);
  eleventyConfig.addCollection('tagPages', tagPages)
  eleventyConfig.addCollection('categoriesList', categoriesList);
  eleventyConfig.addCollection('categoriesPages', categoriesPages)

  // ---------------------  Plugins
  eleventyConfig.addPlugin(plugins.fontAwesomePlugin);
  eleventyConfig.addPlugin(plugins.htmlConfig);
  eleventyConfig.addPlugin(plugins.drafts);

  eleventyConfig.addPlugin(plugins.rss);
  eleventyConfig.addPlugin(plugins.syntaxHighlight);

  eleventyConfig.addPlugin(plugins.webc, {
    components: ['./src/_includes/webc/**/*.webc'],
    useTransform: true
  });
  
  eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, plugins.eleventyImgOptions);

  // ---------------------  bundle
  // Bundles are written to content-hashed files under /assets/bundle/ and
  // linked (not inlined), so the same CSS is downloaded once and cached across
  // every page instead of being duplicated into all 434 documents. The hashed
  // filename lets those files be served `immutable` — see src/xmit.toml.
  eleventyConfig.addBundle('css', { hoist: true, toFileDirectory: 'assets/bundle' });
  eleventyConfig.addBundle('js', { toFileDirectory: 'assets/bundle' });

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('toIsoString', filters.toISOString);
  eleventyConfig.addFilter('formatDate', filters.formatDate);
  eleventyConfig.addFilter('splitlines', filters.splitlines);
  eleventyConfig.addFilter('striptags', filters.striptags);
  eleventyConfig.addFilter('shuffle', filters.shuffleArray);
  eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);
  eleventyConfig.addFilter('slugify', filters.slugifyString);
  eleventyConfig.addFilter('baseDomain', filters.getBaseDomain)
  eleventyConfig.addFilter('limit', filters.limit);

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
  eleventyConfig.addShortcode('imageKeys', shortcodes.imageKeysShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // --------------------- Events: after build
  // !important OG images off by default
  // Configure via OPENGRAPHGEN env variable in package.json `build` script
  // Compared against the string 'true': env vars are never booleans, so the
  // previous `=== true` could never match and this step was unreachable.
  const openGraphGen = process.env.OPENGRAPHGEN === 'true';

  if (openGraphGen && (process.env.ELEVENTY_RUN_MODE === 'build' || process.env.ELEVENTY_RUN_MODE === 'serve')) {
    eleventyConfig.on('eleventy.after', events.svgToJpeg);
  }

  // The OG source SVGs only exist to be converted to JPEG by the step above.
  // With that off, rendering 160 of them produced 640 KB of output nothing
  // referenced.
  if (!openGraphGen) {
    eleventyConfig.ignores.add('src/common/og-images.njk');
  }

  // Copy eleventy-img output into the site. eleventy-img writes to .cache so
  // the derivatives survive between builds, which is why this runs after the
  // build rather than as a passthrough (the files do not all exist yet when
  // passthrough copy runs).
  //
  // `force: false` leaves already-copied files alone: the derivatives are
  // content-hashed, so a file that exists is already correct. Without it every
  // watch rebuild rewrote all ~840 files (53 MB) of the cache.
  eleventyConfig.on('eleventy.after', () => {
    fs.cpSync('.cache/@11ty/img/', path.join(eleventyConfig.directories.output, '/assets/images/content/'), {
      recursive: true,
      force: false,
      errorOnExist: false
    });
  });

  // --------------------- Passthrough File Copy

  // -- same path
  ['src/xmit.toml', 'src/assets/fonts/', 'src/assets/images/template', 'src/assets/images/org', 'src/assets/documents', 'src/assets/og-images'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicon/*': '/'
  });

  // ----------------------  ignore test files
  if (process.env.ELEVENTY_ENV != 'test') {
    eleventyConfig.ignores.add('src/common/pa11y.njk');
  }

  // --------------------- general config
  return {
    markdownTemplateEngine: 'njk',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
