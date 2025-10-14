import express from "express";
import dotenv from "dotenv";
import PQueue from "p-queue";
import { randomDelay } from "./utils/delay.js";
import { scraperNaverAPI } from "./scraper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// maskimal 2 task per detik yang jalan barengan
const queue = new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 });

app.get("/naver", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  queue.add(async () => {
    try {
      await randomDelay(3000, 7000);
      const data = await scraperNaverAPI(url);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/naver?url=<naver_api_url>`);
});
