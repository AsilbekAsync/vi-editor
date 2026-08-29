import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for desktop view
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: '/home/asyncboy/.gemini/antigravity-cli/brain/23fd5fe7-f75a-4db4-9325-c687d3bc0106/screenshot.png' });
    console.log('Screenshot taken successfully at screenshot.png');
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  } finally {
    await browser.close();
  }
})();
