const puppeteer = require('puppeteer');
const CREDS = require('./config_continente');
const mongoose = require('mongoose');
const User = require('./model/user');


async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  // await page.goto('https://github.com');
  // await page.screenshot path: 'screenshots/github.png' });

  await page.goto('https://www.continente.pt/pt-pt/public/Pages/homepage.aspx');

  // dom element selectors
const USERNAME_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#btnLogin';

  await page.click(USERNAME_SELECTOR);
  await page.type(CREDS.username);

  await page.click(PASSWORD_SELECTOR);
  await page.type(CREDS.password);

  await page.click(BUTTON_SELECTOR);
  await page.waitForNavigation();

  const searchUrl = 'https://www.continente.pt/pt-pt/private/Pages/orderhistory.aspx';
await page.goto(searchUrl);
await page.waitFor(2*1000);

  const LIST_DATA_SELECTOR = "#onlineOrderHistory > div.tableArea > table > tbody > tr:nth-child(INDEX) > td:nth-child(3)";  
const LIST_TOTAL_SELECTOR = '#onlineOrderHistory > div.tableArea > table > tbody > tr:nth-child(INDEX) > td:nth-child(5)';
const LENGTH_SELECTOR_CLASS = 'clickable-row';
  //const numPages = await getNumPages(page);

  //console.log('Numpages: ', numPages);

  

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS);

    for (let i = 1; i <= listLength; i++) {
    // change the index to the next child
    let dataSelector = LIST_DATA_SELECTOR.replace("INDEX", i);
    let totalSelector = LIST_TOTAL_SELECTOR.replace("INDEX", i);

    let data = await page.evaluate((sel) => {
      let element = document.querySelector(sel);
        return element? element.innerHTML: null;
      }, dataSelector);

    

    let total = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element? element.innerHTML: null;
      }, totalSelector);

    // not all users have emails visible
    if (!total)
      continue;

    console.log(data, ' -> ', total);

    /*upsertUser({
      data: data,
      total: total,
      dateCrawled: new Date()
    });*/
}
  

  browser.close();
}



function upsertUser(userObj) {
  const DB_URL = 'mongodb://localhost/thal';

  if (mongoose.connection.readyState == 0) {
    mongoose.connect(DB_URL);
  }

  
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  User.findOneAndUpdate(null, userObj, options, (err, result) => {
    if (err) {
      throw err;
    }
  });
}

run();