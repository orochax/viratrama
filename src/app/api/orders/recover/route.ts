import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderRecovery } from "@/lib/email/transactional";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

const attempts = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < 60 * 60 * 1000);
  if (recent.length >= 5) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Se o pedido existir, enviaremos um novo acesso para este e-mail." });
  }
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`${forwardedFor}:${parsed.data.email}`)) {
    return NextResponse.json({ message: "Se o pedido existir, enviaremos um novo acesso para este e-mail." });
  }
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select("id")
    .eq("customer_email", parsed.data.email)
    .in("status", ["pending_payment", "paid"])
    .order("created_at", { ascending: false })
    .limit(5);
  await Promise.all((orders ?? []).map((order) => sendOrderRecovery(order.id)));
  return NextResponse.json({ message: "Se o pedido existir, enviaremos um novo acesso para este e-mail." });
}
