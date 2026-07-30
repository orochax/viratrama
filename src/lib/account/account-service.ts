import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptLicenseCode } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";

function db() {
  return createAdminClient() as unknown as SupabaseClient;
}

export type AccountOrder = {
  id: string;
  number: string;
  date: string;
  status: string;
  totalCents: number;
  receiptUrl: string | null;
  items: Array<{ title: string; formatLabel: string; formatId: "physical" | "digital"; quantity: number }>;
  licenses: Array<{ code: string; last4: string; allowedPlayModes: string[] }>;
  fulfillment: { status: string; carrier: string | null; trackingCode: string | null } | null;
  fulfillmentEvents: Array<{ status: string; carrier: string | null; trackingCode: string | null; note: string | null; createdAt: string }>;
};

export async function getAccountSnapshot(userId: string) {
  const client = db();
  const [{ data: profile }, { data: orders, error }] = await Promise.all([
    client.from("profiles").select("full_name,phone").eq("id", userId).maybeSingle(),
    client.from("orders").select("id,public_number,created_at,status,total_cents,receipt_url").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);
  if (error) throw error;
  const result: AccountOrder[] = [];
  for (const order of orders ?? []) {
    const [{ data: items, error: itemsError }, { data: fulfillment }, { data: events }] = await Promise.all([
      client.from("order_items").select("id,product_title,format_label,format_id,quantity").eq("order_id", order.id),
      client.from("order_fulfillments").select("status,carrier,tracking_code").eq("order_id", order.id).maybeSingle(),
      client.from("fulfillment_events").select("status,carrier,tracking_code,note,created_at").eq("order_id", order.id).order("created_at", { ascending: true }),
    ]);
    if (itemsError) throw itemsError;
    const itemIds = items?.map((item) => item.id) ?? [];
    const { data: licenses, error: licenseError } = itemIds.length
      ? await client.from("licenses").select("id,code_last4,order_item_id,allowed_play_modes").in("order_item_id", itemIds)
      : { data: [], error: null };
    if (licenseError) throw licenseError;
    const licenseIds = licenses?.map((license) => license.id) ?? [];
    const { data: deliveries, error: deliveryError } = licenseIds.length
      ? await client.from("license_deliveries").select("license_id,encrypted_code").in("license_id", licenseIds)
      : { data: [], error: null };
    if (deliveryError) throw deliveryError;
    const deliveryMap = new Map(deliveries?.map((delivery) => [delivery.license_id, delivery.encrypted_code]));
    result.push({
      id: order.id,
      number: order.public_number,
      date: order.created_at,
      status: order.status,
      totalCents: order.total_cents,
      receiptUrl: order.receipt_url,
      items: items?.map((item) => ({ title: item.product_title, formatLabel: item.format_label, formatId: item.format_id, quantity: item.quantity })) ?? [],
      licenses: licenses?.flatMap((license) => {
        const encrypted = deliveryMap.get(license.id);
        return encrypted ? [{ code: decryptLicenseCode(encrypted), last4: license.code_last4, allowedPlayModes: license.allowed_play_modes ?? ["digital", "hybrid"] }] : [];
      }) ?? [],
      fulfillment: fulfillment ? { status: fulfillment.status, carrier: fulfillment.carrier, trackingCode: fulfillment.tracking_code } : null,
      fulfillmentEvents: events?.map((event) => ({ status: event.status, carrier: event.carrier, trackingCode: event.tracking_code, note: event.note, createdAt: event.created_at })) ?? [],
    });
  }
  return { profile: profile ?? { full_name: "", phone: "" }, orders: result };
}
