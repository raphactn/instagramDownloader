import puppeteer from "puppeteer";

const ListResultsServices = async ({ data, type }: any) => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
    ignoreHTTPSErrors: true,
  });

  let error = false;
  let typeMedia = type;
  let result = [""];

  const page = await browser.newPage();
  page.setCacheEnabled(false);

  await page.goto("https://cors-anywhere.herokuapp.com");

  const selector = await page.$(
    "body > form > p:nth-child(2) > input[type=submit]:nth-child(1)"
  );

  if (selector !== null) {
    await page.click(
      "body > form > p:nth-child(2) > input[type=submit]:nth-child(1)",
      { delay: 10, clickCount: 2 }
    );
  }

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
