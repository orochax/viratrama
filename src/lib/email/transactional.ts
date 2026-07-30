import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptLicenseCode, hashSecret } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";

type EmailKind = "purchase_confirmation" | "order_recovery" | "fulfillment_update";

type OrderEmailData = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  status: string;
  receiptUrl: string | null;
  items: Array<{ title: string; formatLabel: string; quantity: number }>;
  licenses: string[];
  fulfillment: { status: string; carrier: string | null; trackingCode: string | null } | null;
};

function db() {
  return createAdminClient() as unknown as SupabaseClient;
}

function origin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export async function createOrderAccessToken(orderId: string, purpose: "confirmation" | "recovery" | "activation") {
  const token = randomBytes(32).toString("base64url");
  const { error } = await db().from("order_claim_tokens").insert({
    order_id: orderId,
    token_hash: hashSecret(token),
    purpose,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });
  if (error) throw error;
  return token;
}

export async function resolveOrderAccessToken(orderId: string, token: string) {
  const hashed = hashSecret(token);
  const client = db();
  const { data: direct } = await client
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .eq("access_token_hash", hashed)
    .maybeSingle();
  if (direct) return { valid: true, claimTokenId: null as string | null };
  const { data: claim } = await client
    .from("order_claim_tokens")
    .select("id,order_id,expires_at,used_at")
    .eq("order_id", orderId)
    .eq("token_hash", hashed)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  return claim ? { valid: true, claimTokenId: claim.id as string } : { valid: false, claimTokenId: null };
}

async function getOrderEmailData(orderId: string): Promise<OrderEmailData> {
  const client = db();
  const { data: order, error } = await client
    .from("orders")
    .select("id,public_number,customer_name,customer_email,total_cents,status,receipt_url")
    .eq("id", orderId)
    .single();
  if (error || !order) throw error ?? new Error("ORDER_NOT_FOUND");

  const { data: items, error: itemsError } = await client
    .from("order_items")
    .select("id,product_title,format_label,quantity")
    .eq("order_id", orderId);
  if (itemsError) throw itemsError;
  const itemIds = items?.map((item) => item.id) ?? [];
  const { data: licenses, error: licenseError } = itemIds.length
    ? await client.from("licenses").select("id,order_item_id").in("order_item_id", itemIds)
    : { data: [], error: null };
  if (licenseError) throw licenseError;
  const licenseIds = licenses?.map((license) => license.id) ?? [];
  const { data: deliveries, error: deliveryError } = licenseIds.length
    ? await client.from("license_deliveries").select("license_id,encrypted_code").in("license_id", licenseIds)
    : { data: [], error: null };
  if (deliveryError) throw deliveryError;
  const deliveryByLicense = new Map(deliveries?.map((delivery) => [delivery.license_id, delivery.encrypted_code]));
  const { data: fulfillment } = await client
    .from("order_fulfillments")
    .select("status,carrier,tracking_code")
    .eq("order_id", orderId)
    .maybeSingle();

  return {
    id: order.id,
    number: order.public_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    totalCents: order.total_cents,
    status: order.status,
    receiptUrl: order.receipt_url,
    items: items?.map((item) => ({ title: item.product_title, formatLabel: item.format_label, quantity: item.quantity })) ?? [],
    licenses: licenses?.flatMap((license) => {
      const encrypted = deliveryByLicense.get(license.id);
      return encrypted ? [decryptLicenseCode(encrypted)] : [];
    }) ?? [],
    fulfillment: fulfillment ? { status: fulfillment.status, carrier: fulfillment.carrier, trackingCode: fulfillment.tracking_code } : null,
  };
}

async function sendProviderEmail(input: { to: string; subject: string; html: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    if (process.env.EMAIL_DELIVERY_MODE === "strict") throw new Error("RESEND_API_KEY e EMAIL_FROM não configurados");
    console.info("[email-preview]", JSON.stringify({ to: input.to, subject: input.subject }));
    return { id: "preview", preview: true };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html, text: input.text }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null) as { id?: string; message?: string } | null;
  if (!response.ok || !payload?.id) throw new Error(payload?.message ?? "O provedor de e-mail rejeitou a mensagem");
  return { id: payload.id, preview: false };
}

export async function sendOrderEmail(input: { orderId: string; kind: EmailKind; deliveryKey: string; token?: string }) {
  const data = await getOrderEmailData(input.orderId);
  const client = db();
  const { data: inserted, error: insertError } = await client.from("email_deliveries").insert({
    order_id: data.id,
    recipient_email: data.customerEmail,
    kind: input.kind,
    delivery_key: input.deliveryKey,
  }).select("id").maybeSingle();
  if (insertError?.code === "23505") return { sent: false, duplicate: true };
  if (insertError || !inserted) throw insertError ?? new Error("EMAIL_DELIVERY_NOT_CREATED");

  const accessToken = input.token ?? await createOrderAccessToken(data.id, input.kind === "order_recovery" ? "recovery" : input.kind === "fulfillment_update" ? "confirmation" : "confirmation");
  const orderUrl = `${origin()}/pedido/${data.id}?token=${encodeURIComponent(accessToken)}`;
  const activationUrl = `${origin()}/ativar?orderId=${encodeURIComponent(data.id)}&token=${encodeURIComponent(accessToken)}`;
  const items = data.items.map((item) => `<li>${escapeHtml(item.title)} · ${escapeHtml(item.formatLabel)} · ${item.quantity} unidade(s)</li>`).join("");
  const licenses = data.licenses.length ? `<h3>Código(s) de ativação</h3><ul>${data.licenses.map((code) => `<li><strong>${escapeHtml(code)}</strong></li>`).join("")}</ul>` : "";
  const tracking = data.fulfillment?.trackingCode ? `<p>Rastreamento: ${escapeHtml(data.fulfillment.carrier ?? "Transportadora")} · ${escapeHtml(data.fulfillment.trackingCode)}</p>` : "";
  const subject = input.kind === "order_recovery" ? `Acesso ao pedido ${data.number} · ViraTrama` : input.kind === "fulfillment_update" ? `Atualização da entrega ${data.number} · ViraTrama` : `Pagamento confirmado · ${data.number}`;
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#181818"><p>ViraTrama</p><h1>${escapeHtml(subject)}</h1><p>Olá, ${escapeHtml(data.customerName)}.</p><ul>${items}</ul><p>Total: <strong>${formatMoney(data.totalCents)}</strong></p>${licenses}${tracking}<p><a href="${activationUrl}">Ativar minha missão</a></p><p><a href="${orderUrl}">Acompanhar pedido</a>${data.receiptUrl ? ` · <a href="${escapeHtml(data.receiptUrl)}">Abrir comprovante</a>` : ""}</p></div>`;
  const text = `ViraTrama\n\n${subject}\n\nPedido: ${data.number}\nTotal: ${formatMoney(data.totalCents)}\n\n${data.licenses.length ? `Código(s):\n${data.licenses.join("\n")}\n\n` : ""}Ativar: ${activationUrl}\nAcompanhar: ${orderUrl}${data.receiptUrl ? `\nComprovante: ${data.receiptUrl}` : ""}`;
  try {
    const result = await sendProviderEmail({ to: data.customerEmail, subject, html, text });
    await client.from("email_deliveries").update({ status: result.preview ? "failed" : "sent", provider_id: result.id, error_message: result.preview ? "EMAIL_PREVIEW_ONLY" : null, sent_at: result.preview ? null : new Date().toISOString() }).eq("id", inserted.id);
    return { sent: true, duplicate: false };
  } catch (error) {
    await client.from("email_deliveries").update({ status: "failed", error_message: error instanceof Error ? error.message : "EMAIL_FAILED" }).eq("id", inserted.id);
    console.error("Transactional email failed", { orderId: data.id, kind: input.kind });
    return { sent: false, duplicate: false };
  }
}

export async function sendPurchaseConfirmation(orderId: string, eventId: string) {
  try {
    return await sendOrderEmail({ orderId, kind: "purchase_confirmation", deliveryKey: `purchase:${eventId}` });
  } catch (error) {
    console.error("Purchase email could not be prepared", { orderId, reason: error instanceof Error ? error.message : "unknown" });
    return { sent: false, duplicate: false };
  }
}

export async function sendOrderRecovery(orderId: string) {
  const token = await createOrderAccessToken(orderId, "recovery");
  return sendOrderEmail({ orderId, kind: "order_recovery", deliveryKey: `recovery:${randomBytes(12).toString("hex")}`, token });
}
