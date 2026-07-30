import { NextResponse } from "next/server";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOrderEmail } from "@/lib/email/transactional";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  status: z.enum(["not_required", "waiting_payment", "pending", "processing", "shipped", "delivered", "cancelled"]),
  carrier: z.string().trim().max(80).optional().default(""),
  trackingCode: z.string().trim().max(120).optional().default(""),
  note: z.string().trim().max(500).optional().default(""),
});

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Dados de entrega inválidos." }, { status: 400 });
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const admin = createAdminClient() as unknown as SupabaseClient;
  const { data: profile } = await admin.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  const values = { status: body.data.status, carrier: body.data.carrier || null, tracking_code: body.data.trackingCode || null, ...(body.data.status === "shipped" ? { shipped_at: new Date().toISOString() } : {}) };
  const { error } = await admin.from("order_fulfillments").update({ ...values, updated_at: new Date().toISOString() }).eq("order_id", orderId);
  if (error) return NextResponse.json({ error: "Não foi possível atualizar a entrega." }, { status: 500 });
  await admin.from("fulfillment_events").insert({ order_id: orderId, status: body.data.status, carrier: values.carrier, tracking_code: values.tracking_code, note: body.data.note || null });
  if (["shipped", "delivered"].includes(body.data.status)) {
    await sendOrderEmail({ orderId, kind: "fulfillment_update", deliveryKey: "fulfillment:" + orderId + ":" + body.data.status + ":" + (values.tracking_code ?? "") + ":" + Date.now() });
  }
  return NextResponse.json({ updated: true });
}
