import puppeteer, { Browser } from "puppeteer";

class PuppeteerService {
  private static instance: PuppeteerService | null = null;
  private browser: Browser | null = null;

  private constructor() {}

  public static async getInstance(): Promise<PuppeteerService> {
    if (!this.instance) {
      this.instance = new PuppeteerService();
      await this.instance.initialize();
    }
    return this.instance;
  }

  private async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: true });
    }
  }

  public async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      await this.initialize();
      if (!this.browser) {
        throw new Error("Browser instance is not initialized.");
      }
    }
    return this.browser;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default PuppeteerService;
