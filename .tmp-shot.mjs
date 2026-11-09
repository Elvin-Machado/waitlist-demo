import { chromium } from "@playwright/test";

const out = "C:/Users/elvin/AppData/Local/Temp/opencode";
const browser = await chromium.launch();

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await desktop.goto("http://127.0.0.1:3011", { waitUntil: "networkidle" });
await desktop.waitForTimeout(1400);
await desktop.screenshot({ path: `${out}/kaws-desktop-full.png`, fullPage: true });
await desktop.locator("#home").screenshot({ path: `${out}/kaws-desktop-hero.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
await mobile.goto("http://127.0.0.1:3011", { waitUntil: "networkidle" });
await mobile.waitForTimeout(1400);
await mobile.screenshot({ path: `${out}/kaws-mobile-hero.png` });

await browser.close();
console.log("done");
