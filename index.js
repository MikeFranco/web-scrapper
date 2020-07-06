const puppeteer = require('puppeteer');
require('dotenv').config();


const getChallengesInfo = async () => {
  const excersicesUrl = process.env.URL;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(excersicesUrl, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
  const btnSelector = 'button.ui.fluid.button';

  /* while((await page.$(btnSelector)) != null){
    page.click(btnSelector);
    await page.waitFor(2000);
  } */
  
  //const sevenTests = Array(7).fill({}).reduce((carry, element) => )
  const getAllChallenges = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a.content')).map(element => element.href);
    const allLevels = Array.from(document.querySelectorAll('a.content > div > span')).map(span => span.innerText);
    return { allLevels, allLinks };
  });

  const randomNumOfExercise = Math.floor(Math.random() * 10000);

  const { allLinks, allLevels } = getAllChallenges;
  await page.goto(allLinks[randomNumOfExercise], { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
  await page.waitForSelector('h2.content');

  const getExcerciseInfo = await page.evaluate(() => {
    const title = document.querySelector('h2.content').textContent;
    const description = document.querySelectorAll('div[class="grey-segment code-area instructions"] > div')[1].innerText.split('\n').join(' ');
    return { title, description }
  })
  
  //To click in Code tab
  await page.$$eval('div.rc-tabs-tab > span:nth-child(1)', anchors => {
    anchors.map(anchor => {
      if (anchor.textContent == 'Código' || anchor.textContent == 'Tests'){
        anchor.click();
        return;
      }
    })
  })
  
  const getChallengeCode = await page.evaluate(() => {
    const codesArea = Array.from(document.querySelectorAll('pre.CodeMirror-line')).map(el => el.innerText);
    const mainFunctionCode = codesArea.filter((element, index) => index < 3);
    const testsCode = codesArea.filter((element, index) => index >= 3);
    return { mainFunctionCode, testsCode }
  })
  
  
  console.log('%c⧭', 'color: #00a3cc', getExcerciseInfo);
  console.log('%c⧭', 'color: #00e600', getChallengeCode, allLinks[randomNumOfExercise]);
  console.log('%c⧭', 'color: #e50000', 'finished');
  await browser.close();
};

getChallengesInfo();
