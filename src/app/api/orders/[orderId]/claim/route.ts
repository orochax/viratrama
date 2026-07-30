import { NextResponse } from "next/server";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveOrderAccessToken } from "@/lib/email/transactional";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = z.object({ token: z.string().min(32) }).safeParse(body);
  if (!z.string().uuid().safeParse(orderId).success || !parsed.success) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre ou crie sua conta para salvar o pedido." }, { status: 401 });
  if (!user.email_confirmed_at) return NextResponse.json({ error: "Confirme seu e-mail antes de salvar o pedido." }, { status: 403 });
  const access = await resolveOrderAccessToken(orderId, parsed.data.token);
  if (!access.valid) return NextResponse.json({ error: "Este link expirou. Solicite um novo acesso." }, { status: 404 });
  const admin = createAdminClient() as unknown as SupabaseClient;
  const { data: order, error } = await admin.from("orders").select("id,user_id,customer_email").eq("id", orderId).maybeSingle();
  if (error || !order) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  if (order.customer_email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json({ error: "Use a conta com o mesmo e-mail da compra." }, { status: 403 });
  }
  if (order.user_id && order.user_id !== user.id) {
    return NextResponse.json({ error: "Este pedido já pertence a outra conta." }, { status: 409 });
  }
  const { error: updateError } = await admin.from("orders").update({ user_id: user.id, updated_at: new Date().toISOString() }).eq("id", orderId).is("user_id", null);
  if (updateError) return NextResponse.json({ error: "Não foi possível salvar o pedido." }, { status: 500 });
  if (access.claimTokenId) await admin.from("order_claim_tokens").update({ used_at: new Date().toISOString() }).eq("id", access.claimTokenId);
  return NextResponse.json({ claimed: true });
}
