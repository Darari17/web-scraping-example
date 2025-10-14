import puppeteer from "puppeteer";
import { randomDelay } from "./utils/delay.js";
import { getRandomProxy } from "./utils/proxy.js";

export const scraperNaverAPI = async (url, retries = 10) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    let browser;
    try {
      console.log(`\n[Attempt ${attempt}] Opening headless browser...`);

      const proxy = getRandomProxy();
      const args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ];

      if (proxy) {
        args.push(`--proxy-server=${proxy}`);
        console.log(`Using proxy: ${proxy}`);
      } else {
        console.log("No proxy found, connecting directly...");
      }

      browser = await puppeteer.launch({
        headless: true,
        args,
      });

      const page = await browser.newPage();

      // pake user agent biar keliatan user beneran
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      ];
      const randomUA =
        userAgents[Math.floor(Math.random() * userAgents.length)];
      await page.setUserAgent(randomUA);
      await page.setViewport({ width: 1366, height: 768 });
      await page.setExtraHTTPHeaders({
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
      });

      console.log(`User-Agent: ${randomUA}`);
      console.log(`Navigating to: ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // kalo ada tag <pre> parsing ke JSON
      // kalo gagal return raw teks
      // kalo ga ada, ambil semua body
      const jsonData = await page.evaluate(() => {
        const pre = document.querySelector("pre");
        if (pre) {
          try {
            return JSON.parse(pre.innerText);
          } catch {
            return pre.innerText;
          }
        }
        return document.body.innerText;
      });

      await browser.close();
      return jsonData;
    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (browser) await browser.close();
      if (attempt === retries) throw new Error("Failed after multiple retries");
      await randomDelay(2000, 4000);
    }
  }
};
