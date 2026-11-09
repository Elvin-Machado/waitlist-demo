import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3011", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      height: Math.round(r.height),
    };
  };
  return {
    hero: rect(".kaws-hero"),
    visual: rect(".kaws-visual"),
    dashboard: rect(".kaws-dashboard"),
    chipTop: rect(".kaws-chip-top"),
    chipBottom: rect(".kaws-chip-bottom"),
    brandmark: rect(".kaws-brandmark"),
    foot: rect(".kaws-journey-foot"),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
