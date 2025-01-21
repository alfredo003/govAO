import fs from "fs";
import PuppeteerService from "./../services/PuppeteerService";

class GetMinistersUseCase {
  async execute(url: string) {
    try {
      const puppeteerService = await PuppeteerService.getInstance();
      const browser = await puppeteerService.getBrowser();
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (
          ["image", "stylesheet", "font", "script"].includes(
            request.resourceType()
          )
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page.goto(url);

      const list = await page.evaluate(() => {
        const lists = Array.from(document.querySelectorAll(".col-md-3"));

        const data = lists
          .map((list) => {
            return {
              img: list.querySelector("img")?.getAttribute("src"),
              name: list
                .querySelector("#namestyle")
                ?.textContent?.trim()
                .toLowerCase()
                ?.replace(/\b\w/g, (char) => char.toUpperCase()),
              position: list.querySelector("small")?.textContent?.trim(),
              data_nomination: list
                .querySelector("br + b")
                ?.textContent?.trim(),
            };
          })
          .filter(
            (item) =>
              item.img || item.name || item.position || item.data_nomination
          );

        return data;
      });

      // await page.close();
      await puppeteerService.closeBrowser();
      fs.writeFileSync("cache/ministres.json", JSON.stringify(list, null, 2));

      return list;
    } catch (error) {
      console.error("Error in GetMinistersUseCase:", error);
      throw new Error("Failed to fetch ministros data.");
    }
  }
}

export default GetMinistersUseCase;
