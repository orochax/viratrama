import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`página da missão sem overflow em ${viewport.name}`, async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto("/historia");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /A Chave Atlas/ }).first()).toBeVisible();
    await expect(page.getByAltText(/Mansão Vesper iluminada/i)).toBeVisible();
    await expect(page.getByAltText(/Planta arquitetônica/i)).toBeVisible();
    await expect(page.getByAltText(/Dispositivo digital Chave Atlas/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Adicionar ao carrinho/i })).toBeVisible();
    await expect(page.getByText("Função da equipe", { exact: true })).toHaveCount(0);

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      squareArchiveCount: document.querySelectorAll(".archive-image").length,
      firstArchiveTitleColor: getComputedStyle(
        document.querySelector<HTMLElement>(".archive-copy h3")!,
      ).color,
      firstCharacterTitleColor: getComputedStyle(
        document.querySelector<HTMLElement>(".story-character-copy h3")!,
      ).color,
      roleAvatarCount: document.querySelectorAll(".role-avatar img").length,
      roleCardBorderTop: getComputedStyle(
        document.querySelector<HTMLElement>(".role-card")!,
      ).borderTopWidth,
      roleCardBorderBottom: getComputedStyle(
        document.querySelector<HTMLElement>(".role-card")!,
      ).borderBottomWidth,
    }));

    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
    expect(dimensions.squareArchiveCount).toBe(3);
    expect(dimensions.firstArchiveTitleColor).toBe("rgb(24, 23, 24)");
    expect(dimensions.firstCharacterTitleColor).toBe("rgb(24, 23, 24)");
    expect(dimensions.roleAvatarCount).toBe(6);
    expect(dimensions.roleCardBorderTop).toBe("0px");
    expect(dimensions.roleCardBorderBottom).toBe("1px");
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`story-${viewport.name}.png`),
      fullPage: true,
    });
  });
}
