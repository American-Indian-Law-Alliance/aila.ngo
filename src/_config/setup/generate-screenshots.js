import fetch from '@11ty/eleventy-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dataPath = './src/_data/builtwith.json';
const screenshotDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '../../assets/images/screenshots'
);

async function fetchScreenshot(url, filePath) {
  const waitCondition = 'wait:2';
  const timeout = 'timeout:5';
  const apiUrl = `https://v1.screenshot.11ty.dev/${encodeURIComponent(url)}/large/_${waitCondition}_${timeout}/`;

  const buffer = await fetch(apiUrl, {
    duration: '1d',
    type: 'buffer'
  });

  await sharp(buffer).webp().toFile(filePath);
  console.log(`Screenshot saved to ${filePath}`);
}

async function generateScreenshots() {
  const jsonData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

  try {
    await fs.access(screenshotDir);
  } catch {
    await fs.mkdir(screenshotDir, {recursive: true});
  }

  for (const item of jsonData) {
    const {name, link, filename} = item;
    const filePath = path.join(screenshotDir, `${filename}.webp`);
    try {
      await fetchScreenshot(link, filePath);
    } catch (error) {
      console.error(`Error processing ${name}: ${error.message}`);
    }
  }
}

generateScreenshots();
