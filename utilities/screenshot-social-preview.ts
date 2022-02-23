import puppeteer from 'puppeteer';

// The non-retina dimensions of the social preview image to generate
const screenshotWidth = 1200;
const screenshotHeight = 630;
// The path to the social preview image to generate
const screenshotPath = './public/images/social-preview.png';

async function main(): Promise<void> {

  console.log('launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('setting viewport...');
  await page.setViewport({
    width: screenshotWidth,
    height: screenshotHeight,
    deviceScaleFactor: 2
  });

  console.log('navigating to app...');
  await page.goto('http://localhost:3000');

  console.log('configuring dashboard...');
  await page.evaluate(async (_) => {
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
    type: 'png',
    captureBeyondViewport: false
  });

  console.log('closing browser...');
  await browser.close();

}
main();
