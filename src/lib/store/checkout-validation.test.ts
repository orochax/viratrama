import { describe, expect, it } from "vitest";
import { checkoutRequestSchema, isValidTaxId } from "./checkout-validation";

const customer = {
  name: "Maria da Silva",
  email: "maria@example.com",
  phone: "11999999999",
  taxId: "52998224725",
};

describe("validação do checkout", () => {
  it("aceita CPF e CNPJ válidos e recusa sequências", () => {
    expect(isValidTaxId("529.982.247-25")).toBe(true);
    expect(isValidTaxId("11.222.333/0001-81")).toBe(true);
    expect(isValidTaxId("111.111.111-11")).toBe(false);
  });

  it("permite produto digital sem endereço", () => {
    const result = checkoutRequestSchema.safeParse({
      items: [
        {
          slug: "operacao-da-meia-noite",
          formatId: "digital",
          quantity: 1,
        },
      ],
      customer,
    });
    expect(result.success).toBe(true);
  });

  it("exige endereço para o produto físico", () => {
    const result = checkoutRequestSchema.safeParse({
      items: [
        {
          slug: "operacao-da-meia-noite",
          formatId: "physical",
          quantity: 1,
        },
      ],
      customer,
    });
    expect(result.success).toBe(false);
  });
});
