import {glob} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const svgToWebp = async ({directories}) => {
  const previews = path.join(directories.output, 'assets/og-images/**/*-preview.svg');
  for await (const svg of glob(previews)) {
    await sharp(svg).webp({lossless: true}).toFile(svg.replace(/\.svg$/, '.webp'));
  }
};
