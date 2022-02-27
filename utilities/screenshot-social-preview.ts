// To run this utility, run `esr utilities/screenshot-social-preview.ts` from
// the root project directory on the CLI
import puppeteer from 'puppeteer';

// The non-retina dimensions of the social preview image to capture (the
// dimensions of the generated image will be twice these)
const screenshotWidth = 1200;
const screenshotHeight = 630;
const screenshotScaleFactor = 2;
// The path to the social preview image to generate
const screenshotPath = './public/images/social-preview.jpg';
// The file format of the screenshot (should be either 'jpeg' or 'png')
const screenshotFormat = 'jpeg';
// The quality percentage of the screenshot (set to null if not a JPEG)
const screenshotQuality: number = 85;

async function main(): Promise<void> {

  console.log('launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('setting viewport...');
  await page.setViewport({
    width: screenshotWidth,
    height: screenshotHeight,
    deviceScaleFactor: screenshotScaleFactor
  });

  console.log('navigating to app...');
  await page.goto('http://localhost:3000');

  console.log('configuring dashboard...');
  await page.evaluate(async () => {
    const socialPreviewAppState = await (await fetch('./social-preview-app-state.json')).json();
    localStorage.setItem(
      'faith-dashboard-app',
      JSON.stringify(socialPreviewAppState)
    );
  });

  console.log('waiting for dashboard to fully load...');
  await page.reload({ waitUntil: ['load', 'networkidle0'] });

  console.log('generating screenshot...');
  await page.screenshot({
    path: screenshotPath,
    type: screenshotFormat,
    quality: screenshotQuality || undefined,
    captureBeyondViewport: false
  });

  console.log('closing browser...');
  await browser.close();

}
main();
