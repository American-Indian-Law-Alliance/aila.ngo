import Image from '@11ty/eleventy-img';
import path from 'node:path';

export const eleventyImgOptions = {
    formats: ['webp', 'jpeg'],
    widths: [320, 640, 1400],
    urlPath: "/assets/images/content/",
    outputDir: ".cache/@11ty/img/",
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async'
      },
      pictureAttributes: {}
    }
  }


const stringifyAttributes = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

const errorSrcRequired = shortcodeName => {
  throw new Error(`src parameter is required for {% ${shortcodeName} %} shortcode`);
};

// Handles image processing
const processImage = async options => {
  let {
    src,
    alt = '',
    caption = '',
    loading = 'lazy',
    containerClass,
    imageClass,
    widths = eleventyImgOptions.widths,
    sizes,
    formats = eleventyImgOptions.formats
  } = options;

  // Set sizes based on loading (if not provided)
  if (sizes == null) {
    sizes = loading === 'lazy' ? 'auto' : '100vw';
  }

  // Prepend "./src" if not present
  if (!src.startsWith('./src')) {
    src = `./src${src}`;
  }

  const metadata = await Image(src, {
    widths: [...widths],
    formats: [...formats],
    urlPath: eleventyImgOptions.urlPath,
    outputDir: eleventyImgOptions.outputDir,
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  });

  const lowsrc = metadata.jpeg[metadata.jpeg.length - 1];

  const imageSources = Object.values(metadata)
    .map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map(entry => entry.srcset)
        .join(', ')}" sizes="${sizes}">`;
    })
    .join('\n');

  const imageAttributes = stringifyAttributes({
    'src': lowsrc.url,
    'width': lowsrc.width,
    'height': lowsrc.height,
    alt,
    loading,
    'decoding': loading === 'eager' ? 'sync' : 'async',
    ...(imageClass && {class: imageClass}),
    'eleventy:ignore': ''
  });

  const pictureElement = `<picture> ${imageSources}<img ${imageAttributes}></picture>`;

  return caption
    ? `<figure slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${pictureElement}<figcaption>${caption}</figcaption></figure>`
    : `<picture slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${imageSources}<img ${imageAttributes}></picture>`;
};

// Positional parameters (legacy)
export const imageShortcode = async (
  src,
  alt,
  caption,
  loading,
  containerClass,
  imageClass,
  widths,
  sizes,
  formats
) => {
  if (!src) {
    errorSrcRequired('image');
  }
  return processImage({
    src,
    alt,
    caption,
    loading,
    containerClass,
    imageClass,
    widths,
    sizes,
    formats
  });
};

// Named parameters
export const imageKeysShortcode = async (options = {}) => {
  if (!options.src) {
    errorSrcRequired('imageKeys');
  }
  return processImage(options);
};
