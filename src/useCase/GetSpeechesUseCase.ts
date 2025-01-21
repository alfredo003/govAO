import fs from "fs";
import PuppeteerService from "./../services/PuppeteerService";

class GetSpeechesUseCase {
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

     let allSpeeches: any[] = [];

      while (true) {
        const list = await page.evaluate(() => {
          const lists = Array.from(document.querySelectorAll(".box_cat_home"));
          const data = lists.map((list) => {
            return {
              file: list.getAttribute("href"),
              title: list
                .querySelector("h3")
                ?.textContent?.trim()
                .toLowerCase()
                ?.replace(/\b\w/g, (char) => char.toUpperCase()),
              data: list.querySelector("span")?.textContent?.trim(),
            };
          });

          return data;
        });

        allSpeeches = allSpeeches.concat(list);

        // Verificar se há um link para a próxima página
        const nextPageButton = await page.$("a[aria-label='pagination.next']"); // Seletor para o botão "›" (próxima página)

        if (!nextPageButton) {
          break; // Se não houver próximo, interrompe o loop
        }

        // Se houver próximo, clique no botão de próxima página
        const nextPageUrl = await page.evaluate(() => {
          const nextPageLink = document.querySelector(
            "a[aria-label='pagination.next']"
          ) as HTMLAnchorElement;
          return nextPageLink ? nextPageLink.href : null;
        });

        if (!nextPageUrl) {
          break; // Se não houver URL para a próxima página, interrompe o loop
        }

        // Navegar para a próxima página
        await page.goto(nextPageUrl, { waitUntil: "domcontentloaded" });
      };
 fs.writeFileSync("cache/speeches.json", JSON.stringify(allSpeeches, null, 2));
   return allSpeeches;

    } catch (error) {
      console.error("Error in GetMinistersUseCase:", error);
      throw new Error("Failed to fetch ministros data.");
    }
  }
}

export default GetSpeechesUseCase;
