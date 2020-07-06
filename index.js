const puppeteer = require('puppeteer');
require('dotenv').config();

const getChallengesInfo = async () => {
  const excersicesUrl = process.env.URL;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(excersicesUrl, {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0']
  });
  const btnSelector = 'button.ui.fluid.button';

  /* while((await page.$(btnSelector)) != null){
    page.click(btnSelector);
    await page.waitFor(2000);
  } */

  const getAllChallenges = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a.content')).map(
      element => element.href
    );
    const allLevels = Array.from(
      document.querySelectorAll('a.content > div > span')
    ).map(span => span.innerText);
    return { allLevels, allLinks };
  });

  //const randomNumOfExercise = Math.floor(Math.random() * 10000);
  const randomNumOfExercise = Math.floor(Math.random() * 20);

  const { allLinks, allLevels } = getAllChallenges;
  await page.goto(allLinks[randomNumOfExercise], {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0']
  });
  await page.waitForSelector('h2.content');

  const getExcerciseInfo = await page.evaluate(() => {
    const title = document.querySelector('h2.content').textContent;
    const description = document
      .querySelectorAll(
        'div[class="grey-segment code-area instructions"] > div'
      )[1]
      .innerText.split('\n')
      .join(' ');
    return { title, description };
  });

  //To click in Code tab
  await page.$$eval('div.rc-tabs-tab > span:nth-child(1)', anchors => {
    anchors.map(anchor => {
      if (anchor.textContent == 'Código' || anchor.textContent == 'Tests') {
        anchor.click();
        return;
      }
    });
  });

  const getChallengeCode = await page.evaluate(() => {
    const codesArea = Array.from(
      document.querySelectorAll('pre.CodeMirror-line')
    ).map(el => el.innerText);
    const mainFunctionCode = codesArea.filter((element, index) => index < 3);
    const testsCode = codesArea.filter((element, index) => index >= 3);
    return { mainFunctionCode, testsCode };
  });
  const { title, description } = getExcerciseInfo;
  const { mainFunctionCode, testsCode } = getChallengeCode;

  console.log('%c⧭', 'color: #e50000', 'finished');
  await browser.close();

  return {
    link: allLinks[randomNumOfExercise],
    level: allLevels[randomNumOfExercise],
    title,
    description,
    mainFunctionCode,
    testsCode
  };

};

const sevenJsChallenges = Array(2).fill({}).reduce((carry) => {
  getChallengesInfo()
    .then(response => {
      console.log('%c⧭', 'color: #733d00', response);
      carry += response
    })
    .catch(error => console.error(error))

  return carry;
}, []) 
