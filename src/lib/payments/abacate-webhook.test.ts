import { describe, expect, it } from "vitest";
import { readAbacateCheckoutEvent } from "./abacate-webhook";

describe("eventos da AbacatePay", () => {
  it("lê somente os campos essenciais e tolera campos adicionais", () => {
    const event = readAbacateCheckoutEvent({
      id: "log_123",
      event: "checkout.completed",
      apiVersion: 2,
      futureField: true,
      data: {
        checkout: {
          id: "bill_123",
          externalId: "4f657383-bef7-4ecf-aac8-c762fb7f9a12",
          amount: 11990,
          paidAmount: 11990,
          receiptUrl: "https://example.com/receipt",
          futureCheckoutField: "kept",
        },
      },
    });
    expect(event?.checkout.paidAmount).toBe(11990);
    expect(event?.event).toBe("checkout.completed");
  });

  it("ignora eventos que não pertencem ao checkout", () => {
    expect(
      readAbacateCheckoutEvent({
        id: "log_123",
        event: "subscription.renewed",
        data: {},
      }),
    ).toBeNull();
  });
});
