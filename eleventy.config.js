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

  eleventyConfig.addPlugin(plugins.EleventyRenderPlugin);
  eleventyConfig.addPlugin(plugins.rss);
  eleventyConfig.addPlugin(plugins.syntaxHighlight);

  eleventyConfig.addPlugin(plugins.webc, {
    components: ['./src/_includes/webc/**/*.webc'],
    useTransform: true
  });
  
  eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, plugins.eleventyImgOptions);

  // ---------------------  bundle
  eleventyConfig.addBundle('css', { hoist: true });

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('toIsoString', filters.toISOString);
  eleventyConfig.addFilter('formatDate', filters.formatDate);
  eleventyConfig.addFilter('markdownFormat', filters.markdownFormat);
  eleventyConfig.addFilter('splitlines', filters.splitlines);
  eleventyConfig.addFilter('striptags', filters.striptags);
  eleventyConfig.addFilter('shuffle', filters.shuffleArray);
  eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);
  eleventyConfig.addFilter('slugify', filters.slugifyString);
  eleventyConfig.addFilter('baseDomain', filters.getBaseDomain)

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
  eleventyConfig.addShortcode('imageKeys', shortcodes.imageKeysShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // --------------------- Events: after build
  // !important OG images off by default
  // Configure via OPENGRAPHGEN env variable in package.json `build` script
  if ((process.env.OPENGRAPHGEN === true) && (process.env.ELEVENTY_RUN_MODE === 'build' || process.env.ELEVENTY_RUN_MODE === 'serve')) {
    eleventyConfig.on('eleventy.after', events.svgToJpeg);
  }

    // Load Images from Cache
    eleventyConfig.on("eleventy.after", () => {
      fs.cpSync(".cache/@11ty/img/", path.join(eleventyConfig.directories.output, "/assets/images/content/"), {
        recursive: true
      });
    });

  // --------------------- Passthrough File Copy

  // -- same path
  ['src/assets/fonts/', 'src/assets/images/template', 'src/assets/images/org', 'src/assets/documents', 'src/assets/og-images'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicon/*': '/',

    // -- node_modules
    'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/components/`
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
