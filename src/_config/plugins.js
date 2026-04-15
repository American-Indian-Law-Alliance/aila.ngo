// Eleventy
import {EleventyRenderPlugin} from '@11ty/eleventy';
import rss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import webc from '@11ty/eleventy-plugin-webc';
import {eleventyImageTransformPlugin} from '@11ty/eleventy-img';
import fontAwesomePlugin from "@11ty/font-awesome";

// custom
import {markdownLib} from './plugins/markdown.js';
import {drafts} from './plugins/drafts.js';

// Custom transforms
import {htmlConfig} from './plugins/html-config.js';
import { eleventyImgOptions } from './shortcodes/image.js';

export default {
  EleventyRenderPlugin,
  fontAwesomePlugin,
  rss,
  syntaxHighlight,
  webc,
  eleventyImageTransformPlugin,
  eleventyImgOptions,
  markdownLib,
  drafts,
  htmlConfig
};
