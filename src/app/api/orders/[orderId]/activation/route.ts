import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicOrder } from "@/lib/store/order-service";

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!z.string().uuid().safeParse(orderId).success || token.length < 32) {
    return NextResponse.json({ error: "Acesso inválido." }, { status: 404 });
  }
  const order = await getPublicOrder(orderId, token);
  if (!order || order.status !== "paid" || !order.licenses.length) {
    return NextResponse.json({ error: "A licença ainda não está disponível." }, { status: 404 });
  }
  return NextResponse.json({ code: order.licenses[0].code });
}
