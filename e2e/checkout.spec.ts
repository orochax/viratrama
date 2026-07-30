import { expect, test } from "@playwright/test";

test("checkout físico solicita comprador, entrega e usa o preço do catálogo", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.setItem(
      "viratrama-cart",
      JSON.stringify([
        {
          slug: "operacao-da-meia-noite",
          title: "Operação da Meia-Noite: A Chave Atlas",
          formatId: "physical",
          formatLabel: "Físico + digital",
          unitPriceInCents: 1,
          quantity: 1,
        },
      ]),
    );
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/carrinho");

  await expect(
    page.getByRole("heading", { name: "Quem receberá a missão" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Endereço de destino" }),
  ).toBeVisible();
  await expect(page.getByText("R$ 119,90", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Ir para o pagamento/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("checkout digital não solicita endereço", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.setItem(
      "viratrama-cart",
      JSON.stringify([
        {
          slug: "operacao-da-meia-noite",
          title: "Operação da Meia-Noite: A Chave Atlas",
          formatId: "digital",
          formatLabel: "Digital",
          unitPriceInCents: 999999,
          quantity: 1,
        },
      ]),
    );
  });
  await page.goto("/carrinho");

  await expect(page.getByText("R$ 59,90", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Endereço de destino" }),
  ).toHaveCount(0);
});
