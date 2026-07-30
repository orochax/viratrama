import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicOrder } from "@/lib/store/order-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!z.string().uuid().safeParse(orderId).success || token.length < 32) {
    return NextResponse.json(
      { error: "Pedido não encontrado." },
      { status: 404 },
    );
  }
  try {
    const order = await getPublicOrder(orderId, token);
    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 },
      );
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível consultar o pedido." },
      { status: 500 },
    );
  }
}
