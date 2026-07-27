import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`landing não apresenta overflow em ${viewport.name}`, async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByAltText(/Caixa aberta da Operação da Meia-Noite/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Escolha sua missão." })).toBeVisible();
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      bannerLoaded: (() => {
        const banner = document.querySelector<HTMLImageElement>(".landing-hero img");
        return Boolean(banner?.complete && banner.naturalWidth > 0);
      })(),
    }));

    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
    expect(dimensions.bannerLoaded).toBe(true);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`landing-${viewport.name}.png`),
      fullPage: true,
    });
  });
}
