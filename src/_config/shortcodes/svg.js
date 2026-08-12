/**
 * Generates an optimized SVG shortcode with optional attributes.
 *
 * @param {string} svgName - The name of the SVG file (without the .svg extension).
 * @param {string} [ariaName=''] - The ARIA label for the SVG.
 * @param {string} [className=''] - The CSS class name for the SVG.
 * @param {string} [styleName=''] - The inline style for the SVG.
 * @returns {Promise<string>} The optimized SVG shortcode.
 */

import {optimize} from 'svgo';
import {readFileSync} from 'node:fs';

/**
 * Read + SVGO output keyed by file name. The optimized markup depends only on
 * the source file, but the shortcode is called ~2,200 times per build (the nav
 * and footer icons appear on every page), and read+optimize was being redone
 * every time. Only the attribute injection below is per-call.
 *
 * There are ~24 SVGs in the project, so this is bounded by the file count.
 */
const optimizedSvgCache = new Map();

const getOptimizedSvg = async svgName => {
  if (optimizedSvgCache.has(svgName)) return optimizedSvgCache.get(svgName);

  const svgData = readFileSync(`./src/assets/svg/${svgName}.svg`, 'utf8');
  const {data} = await optimize(svgData);

  optimizedSvgCache.set(svgName, data);
  return data;
};

export const svgShortcode = async (svgName, ariaName = '', className = '', styleName = '') => {
  const data = await getOptimizedSvg(svgName);

  return data.replace(
    /<svg(.*?)>/,
    `<svg$1 ${ariaName ? `aria-label="${ariaName}"` : 'aria-hidden="true"'} ${className ? `class="${className}"` : ''} ${styleName ? `style="${styleName}"` : ''} >`
  );
};
