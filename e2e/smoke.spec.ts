import { expect, test } from "@playwright/test";

test("landing apresenta o banner escolhido e o carrossel automático", async ({ page }) => {
  await page.goto("/");
  await page.mouse.move(1, 1);

  await expect(page.locator("h1")).toHaveText("ViraTrama");
  await expect(
    page.getByAltText(/Caixa aberta da Operação da Meia-Noite/i),
  ).toHaveAttribute("src", /operation-midnight-banner/);
  await expect(page.getByRole("heading", { name: "Escolha sua missão." })).toBeVisible();

  const activeDifference = page.locator('.difference-slide[aria-hidden="false"] h2');
  await expect(activeDifference).toHaveText("A história ocupa a mesa");
  await expect(activeDifference).toHaveText("Todos entram na trama", { timeout: 6000 });
  await expect(page.getByRole("button", { name: /Mostrar próximo diferencial/i })).toHaveCount(0);
  await page.getByRole("link", { name: "Ver missão" }).click();
  await expect(page).toHaveURL(/historia/);
  await expect(page.getByRole("heading", { name: /A Chave Atlas/ })).toBeVisible();
  await expect(page.getByAltText(/Dispositivo digital Chave Atlas/i)).toBeVisible();
  await page.getByRole("button", { name: /Adicionar ao carrinho/i }).click();
  await expect(page.getByRole("link", { name: /Adicionado ao carrinho/i })).toBeVisible();
  await page.locator('a[href="/carrinho"]').first().click();
  await expect(page).toHaveURL(/carrinho/);
  await expect(page.getByText(/A Chave Atlas/).first()).toBeVisible();
});

test("sala demo expõe navegação de jogo", async ({ page }) => {
  await page.goto("/sala/ATLAS1/jogo");
  await expect(page.getByText("A transmissão começa.")).toBeVisible();
  await expect(page.getByText("Mapa")).toBeVisible();
});
