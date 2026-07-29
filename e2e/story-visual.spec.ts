import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`página da missão sem overflow em ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto("/historia", { waitUntil: "load" });

    await expect(page.getByRole("link", { name: "Voltar" })).toBeVisible();
    await expect(page.getByText("Favorito da equipe")).toBeVisible();
    await expect(page.getByText("Intermediário")).toBeVisible();
    await expect(page.getByLabel("Imagens do produto")).toBeVisible();
    await expect(page.getByText("1 / 5")).toBeVisible();
    await expect(page.locator(".product-story-preview")).toBeVisible();
    await expect(page.locator(".product-story-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await page.locator(".product-story-toggle").click();
    await expect(page.locator(".product-story-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(
      page.locator(".product-format-option.is-selected"),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".story-fact")).toHaveCount(3);
    await expect(page.getByText("R$ 119,90", { exact: true })).toBeVisible();
    await expect(page.getByText("R$ 59,90", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Experiência completa 100% digital. Jogue agora mesmo."),
    ).toBeVisible();
    await expect(page.getByText("Disponível", { exact: true })).toHaveCount(0);
    await page.locator(".product-format-option").nth(1).click();
    await expect(page.locator(".product-format-option").nth(1)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("button", { name: /Adicionar versão digital/i }),
    ).toBeVisible();
    await page.locator(".product-format-option").first().click();
    await expect(page.locator(".product-included-item")).toHaveCount(6);
    await expect(
      page.getByRole("heading", { name: /A Chave Atlas/ }).first(),
    ).toBeVisible();
    await expect(page.getByAltText(/Mansão Vesper iluminada/i)).toBeVisible();
    await expect(page.getByAltText(/Planta arquitetônica/i)).toBeVisible();
    await expect(
      page.getByAltText(/Dispositivo digital Chave Atlas/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Adicionar ao carrinho/i }),
    ).toBeVisible();
    await expect(
      page.getByText("Função da equipe", { exact: true }),
    ).toHaveCount(0);

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
      productThumbnailCount: document.querySelectorAll(
        ".product-gallery-thumbnails button",
      ).length,
    }));

    expect(dimensions.pageWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth + 1,
    );
    expect(dimensions.squareArchiveCount).toBe(3);
    expect(dimensions.firstArchiveTitleColor).toBe("rgb(24, 23, 24)");
    expect(dimensions.firstCharacterTitleColor).toBe("rgb(24, 23, 24)");
    expect(dimensions.roleAvatarCount).toBe(6);
    expect(dimensions.roleCardBorderTop).toBe("0px");
    expect(dimensions.roleCardBorderBottom).toBe("1px");
    expect(dimensions.productThumbnailCount).toBe(5);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`story-${viewport.name}.png`),
      fullPage: true,
    });
  });
}
