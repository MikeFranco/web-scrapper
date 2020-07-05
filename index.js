const puppeteer = require('puppeteer');
require('dotenv').config();


const getEasyChallenges = async () => {
  const excersicesUrl = process.env.URL;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(excersicesUrl, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
  const btnSelector = 'button.ui.fluid.button';

  /* while((await page.$(btnSelector)) != null){
    page.click(btnSelector);
    await page.waitFor(2000);
  } */

  const getExampleInfo = await page.evaluate(() => {
    const randomNumOfExercise = Math.floor(Math.random() * 20);
    const allLinks = Array.from(document.querySelectorAll('a.content')).map(element => element.href);
    const allLevels = Array.from(document.querySelectorAll('a.content > div > span')).map(span => span.innerText);
    return { randomNumOfExercise, allLevels, allLinks };
  });

  const { randomNumOfExercise, allLinks, allLevels } = getExampleInfo;
  await page.goto(allLinks[randomNumOfExercise], { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
  await page.waitForSelector('h2.content');

  const getExcerciseInfo = await page.evaluate(() => {
      const title = document.querySelector('h2.content').textContent;
      const description = document.querySelectorAll('div[class="grey-segment code-area instructions"] > div')[1].innerText.split('\n').join(' ');
      return { title, description}
  })

  console.log('%c⧭', 'color: #0088cc', getExcerciseInfo, allLinks[randomNumOfExercise]);
  console.log('%c⧭', 'color: #e50000', 'finished');
  await browser.close();
};

getEasyChallenges();
