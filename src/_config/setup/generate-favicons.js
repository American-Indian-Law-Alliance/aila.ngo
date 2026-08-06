import fs from 'node:fs';
import sharp from 'sharp';
import {sharpsToIco} from 'sharp-ico';
import {pathToSvgLogo} from '../../_data/meta.js';

async function createFavicons() {
  const outputDir = 'src/assets/images/favicon';
  fs.mkdirSync(outputDir, {recursive: true});

  const logoBuffer = fs.readFileSync(pathToSvgLogo);
  const icon192 = await sharp(logoBuffer).resize(192, 192).png().toBuffer();

  // SVG icon
  fs.writeFileSync(
    `${outputDir}/favicon.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${icon192.toString('base64')}"/></svg>\n`
  );

  // PNG icons
  fs.writeFileSync(`${outputDir}/icon-192x192.png`, icon192);
  await sharp(logoBuffer).resize(512, 512).toFile(`${outputDir}/icon-512x512.png`);
  await sharp(logoBuffer).resize(180, 180).toFile(`${outputDir}/apple-touch-icon.png`);

  // maskable icon
  await sharp(logoBuffer)
    .resize(512, 512)
    .extend({
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
      background: {r: 0, g: 0, b: 0, alpha: 0} // Transparent padding
    })
    .toFile(`${outputDir}/maskable-icon.png`);

  // ICO icon
  const iconSharp = sharp(logoBuffer);
  await sharpsToIco([iconSharp], `${outputDir}/favicon.ico`, {sizes: [32]});

  console.log('All favicons generated.');
}

createFavicons();
