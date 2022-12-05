let chrome: any = {};
let puppeteer: any;

chrome = require("chrome-aws-lambda");
puppeteer = require("puppeteer-core");

const ListResultsServices = async ({ data, type }: any) => {
  const options = {
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  };

  let browser = await puppeteer.launch(options);

  let error = false;
  let typeMedia = type;
  let result = [];

  const page = await browser.newPage();
  page.setCacheEnabled(false);
  await page.goto(data as string);

  if (type === "image") {
    await page
      .waitForSelector("._aagv")
      .then(() => {
        return (error = false);
      })
      .catch(() => {
        return (error = true);
      });
    result = await page.$$eval("._aagv > img", (images: any) =>
      images.map((i: any) => i.src)
    );
  } else {
    await page
      .waitForSelector("._ab1c")
      .then(() => {
        return (error = false);
      })
      .catch(() => {
        return (error = true);
      });
    result = await page.$$eval("._ab1c > video", (images: any) =>
      images.map((i: any) => i.src)
    );
  }

  await browser.close();

  return { result, error, typeMedia };
};

export { ListResultsServices };
