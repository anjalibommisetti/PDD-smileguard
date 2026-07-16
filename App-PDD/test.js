const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log("BROWSER ERROR:", msg.text());
    } else {
      console.log("LOG:", msg.text());
    }
  });

  page.on("pageerror", (error) => {
    console.log("PAGE ERROR:", error.message);
  });

  console.log("Navigating to localhost...");
  await page.goto("http://localhost:8081");

  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "step1_splash.png" });

  console.log("Clicking splash Get Started...");
  await page.evaluate(() => {
    const splashBtn = Array.from(document.querySelectorAll("div, text, span")).find(
      (el) => el.innerText && el.innerText.includes("Get Started"),
    );
    if (splashBtn) splashBtn.click();
  });

  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "step2_landing.png" });

  console.log("Clicking Landing Get Started...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("div, button"));
    const targets = btns.filter((b) => b.innerText && b.innerText.trim() === "Get Started");
    if (targets.length > 0) targets[targets.length - 1].click();
  });

  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "step3_role_selection.png" });
  console.log("Done.");

  await browser.close();
})();
