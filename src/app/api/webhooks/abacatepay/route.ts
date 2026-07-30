import { NextResponse } from "next/server";
import { z } from "zod";
import {
  readAbacateCheckoutEvent,
  verifyAbacateWebhookSecret,
  verifyAbacateWebhookSignature,
} from "@/lib/payments/abacate-webhook";
import { processStorePaymentEvent } from "@/lib/store/order-service";

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (!verifyAbacateWebhookSecret(url.searchParams.get("webhookSecret"))) {
    return NextResponse.json(
      { error: "Webhook não autorizado." },
      { status: 401 },
    );
  }

  const rawBody = await request.text();
  if (rawBody.length > 1_000_000) {
    return NextResponse.json(
      { error: "Payload muito grande." },
      { status: 413 },
    );
  }
  if (
    !verifyAbacateWebhookSignature(
      rawBody,
      request.headers.get("x-webhook-signature"),
    )
  ) {
    return NextResponse.json(
      { error: "Assinatura inválida." },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const event = readAbacateCheckoutEvent(payload);
  if (!event) {
    return NextResponse.json({ ok: true, ignored: true });
  }
  if (!z.string().uuid().safeParse(event.checkout.externalId).success) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    await processStorePaymentEvent({
      eventId: event.id,
      eventType: event.event,
      orderId: event.checkout.externalId,
      checkoutId: event.checkout.id,
      paidAmount: event.checkout.paidAmount,
      receiptUrl: event.checkout.receiptUrl,
      payload: event.payload,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível processar o evento." },
      { status: 500 },
    );
  }
}
