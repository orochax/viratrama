import { expect, test } from "@playwright/test";

test("landing apresenta o banner escolhido e o carrossel automático", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.move(1, 1);

  await expect(page.locator("h1")).toHaveText("ViraTrama");
  await expect(
    page.getByRole("link", { name: "Conhecer Operação da Meia-Noite" }),
  ).toHaveAttribute("href", "/historia");
  await expect(
    page
      .getByRole("link", {
        name: /Operação da Meia-Noite: A Chave Atlas/,
      })
      .first(),
  ).toHaveAttribute("href", "/historia");
  await expect(
    page.getByRole("link", {
      name: /Ver página de Operação da Meia-Noite/,
    }),
  ).toHaveAttribute("href", "/historia");
  await expect(
    page.getByAltText(/Banner da Operação da Meia-Noite/i),
  ).toHaveAttribute("src", /homepage-operation-midnight-campaign/);
  await expect(
    page.getByRole("heading", { name: "Escolha sua missão." }),
  ).toBeVisible();
  await expect(
    page.getByAltText(/Entrada iluminada da Mansão Vesper/i),
  ).toHaveAttribute("src", /operation-midnight-entrance/);
  await expect(
    page.getByAltText(/Vega em uma transmissão segura/i),
  ).toBeVisible();
  await expect(page.getByText("Quantas pessoas podem jogar?")).toHaveCount(0);
  await expect(page.getByText("Quanto tempo dura uma partida?")).toHaveCount(0);
  await expect(page.locator(".final-cta")).toHaveCount(0);

  await expect(page.locator(".difference-carousel")).toHaveAttribute(
    "data-autoplay-ms",
    "3000",
  );
  await expect
    .poll(() =>
      page
        .locator(".difference-track")
        .evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).transitionDuration),
        ),
    )
    .toBeGreaterThan(0);
  await page.locator(".difference-carousel").hover();
  const activeDifference = page.locator(
    '.difference-slide[aria-hidden="false"] h2',
  );
  await expect(activeDifference).toHaveText("A história ocupa a mesa");
  await expect(activeDifference).toHaveText("Todos entram na trama", {
    timeout: 6000,
  });
  await expect(
    page.getByRole("button", { name: /Mostrar próximo diferencial/i }),
  ).toHaveCount(0);
  await expect(
    page.locator(".compact-product-card .case-description"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Adicionar ao carrinho/i }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ver mais detalhes" }).click();
  await expect(page).toHaveURL(/historia/);
  await expect(
    page.getByRole("heading", { name: /A Chave Atlas/ }),
  ).toBeVisible();
  await expect(
    page.getByAltText(/Dispositivo digital Chave Atlas/i),
  ).toBeVisible();
  await page.getByRole("button", { name: /Adicionar ao carrinho/i }).click();
  await expect(
    page.getByRole("link", { name: /Adicionado ao carrinho/i }),
  ).toBeVisible();
  await page.locator('a[href="/carrinho"]').first().click();
  await expect(page).toHaveURL(/carrinho/);
  await expect(page.getByText(/A Chave Atlas/).first()).toBeVisible();
});

test("sala demo expõe navegação de jogo", async ({ page }) => {
  await page.goto("/sala/ATLAS1/jogo");
  await expect(page.getByText("A transmissão começa.")).toBeVisible();
  await expect(page.getByText("Orion", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Retrato de Orion")).toBeVisible();
  await page.getByRole("button", { name: "Abrir transcrição" }).click();
  await page.getByRole("button", { name: "Confirmar leitura e continuar" }).click();
  await expect(page.getByText("Vega", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Retrato de Vega")).toBeVisible();
  await expect(page.getByText("Mapa")).toBeVisible();
});
