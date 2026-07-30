import { createHmac, timingSafeEqual } from "node:crypto";

const ABACATEPAY_PUBLIC_HMAC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

export function verifyAbacateWebhookSecret(received: string | null) {
  const expected = process.env.ABACATEPAY_WEBHOOK_SECRET;
  if (!received || !expected) return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function verifyAbacateWebhookSignature(
  rawBody: string,
  received: string | null,
) {
  if (!received) return false;
  const expected = createHmac("sha256", ABACATEPAY_PUBLIC_HMAC_KEY)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64");
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export type AbacateCheckoutEvent = {
  id: string;
  event:
    | "checkout.completed"
    | "checkout.refunded"
    | "checkout.disputed"
    | "checkout.lost";
  checkout: {
    id: string;
    externalId: string;
    amount: number;
    paidAmount: number;
    receiptUrl: string | null;
  };
  payload: Record<string, unknown>;
};

export function readAbacateCheckoutEvent(
  payload: unknown,
): AbacateCheckoutEvent | null {
  if (!payload || typeof payload !== "object") return null;
  const eventPayload = payload as Record<string, unknown>;
  const event = eventPayload.event;
  const id = eventPayload.id;
  const data = eventPayload.data;
  if (
    typeof id !== "string" ||
    ![
      "checkout.completed",
      "checkout.refunded",
      "checkout.disputed",
      "checkout.lost",
    ].includes(String(event)) ||
    !data ||
    typeof data !== "object"
  ) {
    return null;
  }
  const checkout = (data as Record<string, unknown>).checkout;
  if (!checkout || typeof checkout !== "object") return null;
  const value = checkout as Record<string, unknown>;
  if (
    typeof value.id !== "string" ||
    typeof value.externalId !== "string" ||
    typeof value.amount !== "number"
  ) {
    return null;
  }
  const paidAmount =
    typeof value.paidAmount === "number" ? value.paidAmount : value.amount;
  return {
    id,
    event: event as AbacateCheckoutEvent["event"],
    checkout: {
      id: value.id,
      externalId: value.externalId,
      amount: value.amount,
      paidAmount,
      receiptUrl:
        typeof value.receiptUrl === "string" ? value.receiptUrl : null,
    },
    payload: eventPayload,
  };
}
