import { expect, test } from "@playwright/test";

test("primeiro e segundo acesso do código de demonstração usam formulários distintos", async ({ page }) => {
  await page.goto("/ativar");
  await page.getByLabel("Código da licença").fill("OMN-DEMO-0001");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Crie seu acesso." })).toBeVisible();
  await expect(page.getByLabel("Nome completo")).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();

  await page.getByLabel("Nome completo").fill("Carlo ViraTrama");
  await page.getByLabel("E-mail").fill("carlo@example.test");
  await page.getByLabel("Senha").fill("teste-seguro");
  await page.getByRole("button", { name: /Criar conta e vincular/ }).click();
  await expect(page.getByRole("heading", { name: "Chave vinculada." }).last()).toBeVisible();

  await page.goto("/ativar");
  await page.getByLabel("Código da licença").fill("OMN-DEMO-0001");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Entre na operação." })).toBeVisible();
  await expect(page.getByLabel("Nome completo")).toHaveCount(0);
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();

  await page.getByLabel("E-mail").fill("carlo@example.test");
  await page.getByLabel("Senha").fill("teste-seguro");
  await page.getByRole("button", { name: /Entrar e vincular/ }).click();
  await expect(page.getByRole("heading", { name: "Chave vinculada." }).last()).toBeVisible();
});
