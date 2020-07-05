const puppeteer = require('puppeteer');
require('dotenv').config();


const getEasyChallenges = async () => {
  const excersicesUrl = process.env.URL;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(excersicesUrl, { waitUntil: 'networkidle2' });
  const btnSelector = 'button.ui.fluid.button';

  /* while((await page.$(btnSelector)) != null){
    page.click(btnSelector);
    await page.waitFor(2000);
  } */

  const getExampleInfo = await page.evaluate(() => {
    const getRandomNumb = Math.floor(Math.random() * 10000);
    const allLinks = Array.from(document.querySelectorAll('a.content')).map(element => element.href);
    const allLevels = Array.from(document.querySelectorAll('a.content > div > span')).map(span => span.innerText);
    return { getRandomNumb, allLevels, allLinks };
  });

  console.log('%c⧭', 'color: #0088cc', getExampleInfo);
  console.log('%c⧭', 'color: #e50000', 'finished');
  await browser.close();
};

getEasyChallenges();
