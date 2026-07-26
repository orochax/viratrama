import { test, expect } from "@playwright/test";
test("landing apresenta a operação e ativação", async ({ page }) => { await page.goto("/"); await expect(page.getByText("o segredo", { exact: false })).toBeVisible(); await page.getByRole("link", { name: /Inserir código/i }).click(); await expect(page).toHaveURL(/ativar/); });
test("sala demo expõe navegação de jogo", async ({ page }) => { await page.goto("/sala/ATLAS1/jogo"); await expect(page.getByText("A transmissão começa.")).toBeVisible(); await expect(page.getByText("Mapa")).toBeVisible(); });
