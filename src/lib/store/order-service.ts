import { randomBytes, randomUUID } from "node:crypto";
import type { Json } from "@/types/database";
import {
  createCommercialLicense,
  decryptLicenseCode,
  encryptLicenseCode,
  hashSecret,
} from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createAbacateCheckout,
  createAbacateCustomer,
  getAbacateCheckout,
} from "@/lib/payments/abacatepay";
import { getCheckoutCatalogItem } from "./checkout-catalog";
import type { CheckoutRequest } from "./checkout-validation";

type ResolvedItem = NonNullable<ReturnType<typeof getCheckoutCatalogItem>> & {
  id: string;
  storyId: string;
  quantity: number;
};

type PaymentEventInput = {
  eventId: string;
  eventType:
    | "checkout.completed"
    | "checkout.refunded"
    | "checkout.disputed"
    | "checkout.lost";
  orderId: string;
  checkoutId: string;
  paidAmount: number;
  receiptUrl: string | null;
  payload: Record<string, unknown>;
};

export class StoreCheckoutError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "StoreCheckoutError";
  }
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

function publicOrderNumber() {
  const date = Date.now().toString(36).toUpperCase();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `VT-${date}-${suffix}`;
}

function applicationOrigin(fallbackOrigin: string) {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  try {
    return new URL(configured || fallbackOrigin).origin;
  } catch {
    return new URL(fallbackOrigin).origin;
  }
}

async function resolveItems(input: CheckoutRequest["items"]) {
  const admin = createAdminClient();
  const storySlugs = [
    ...new Set(
      input.map((item) => {
        const catalogItem = getCheckoutCatalogItem(item.slug, item.formatId);
        if (!catalogItem) {
          throw new StoreCheckoutError(
            "Um item do carrinho não está disponível.",
            400,
          );
        }
        return catalogItem.storySlug;
      }),
    ),
  ];
  const { data: stories, error } = await admin
    .from("stories")
    .select("id,slug")
    .in("slug", storySlugs);
  if (error) throw error;

  return input.map<ResolvedItem>((item) => {
    const catalogItem = getCheckoutCatalogItem(item.slug, item.formatId);
    const story = stories?.find(
      (entry) => entry.slug === catalogItem?.storySlug,
    );
    if (!catalogItem || !story) {
      throw new StoreCheckoutError(
        "A missão ainda não está disponível para compra.",
        409,
      );
    }
    return {
      ...catalogItem,
      id: randomUUID(),
      storyId: story.id,
      quantity: item.quantity,
    };
  });
}

export async function createStoreCheckout(input: {
  request: CheckoutRequest;
  userId: string | null;
  fallbackOrigin: string;
}) {
  const admin = createAdminClient();
  const items = await resolveItems(input.request.items);
  const subtotal = items.reduce(
    (total, item) => total + item.unitPriceInCents * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;
  const orderId = randomUUID();
  const accessToken = randomBytes(32).toString("base64url");
  const orderNumber = publicOrderNumber();
  const address = input.request.shippingAddress;

  const { error: createOrderError } = await admin.rpc("create_store_order", {
    p_order: toJson({
      id: orderId,
      public_number: orderNumber,
      access_token_hash: hashSecret(accessToken),
      user_id: input.userId,
      customer_name: input.request.customer.name,
      customer_email: input.request.customer.email,
      customer_phone: input.request.customer.phone,
      customer_tax_id: input.request.customer.taxId,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      metadata: { channel: "web", payment_mode: "hosted_checkout" },
    }),
    p_items: toJson(
      items.map((item) => ({
        id: item.id,
        story_id: item.storyId,
        product_slug: item.slug,
        product_title: item.title,
        format_id: item.formatId,
        format_label: item.formatLabel,
        provider_product_id: item.providerProductId,
        unit_price_cents: item.unitPriceInCents,
        quantity: item.quantity,
      })),
    ),
    p_address: address
      ? toJson({
          recipient_name: address.recipientName,
          zip_code: address.zipCode,
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        })
      : null,
  });
  if (createOrderError) {
    throw new StoreCheckoutError(
      "O banco de pedidos ainda não está preparado. Aplique a migration de comércio.",
      503,
    );
  }

  try {
    const customer = await createAbacateCustomer({
      name: input.request.customer.name,
      email: input.request.customer.email,
      phone: input.request.customer.phone,
      taxId: input.request.customer.taxId,
      zipCode: address?.zipCode,
    });
    const origin = applicationOrigin(input.fallbackOrigin);
    const completionUrl = new URL(`/pedido/${orderId}`, origin);
    completionUrl.searchParams.set("token", accessToken);

    const checkout = await createAbacateCheckout({
      items: items.map((item) => ({
        id: item.providerProductId,
        quantity: item.quantity,
      })),
      customerId: customer.id,
      externalId: orderId,
      returnUrl: new URL("/carrinho", origin).toString(),
      completionUrl: completionUrl.toString(),
      maxInstallments: Math.max(1, Math.min(3, Math.floor(total / 1000))),
    });

    const { error: updateError } = await admin
      .from("orders")
      .update({
        status: "pending_payment",
        provider_customer_id: customer.id,
        provider_checkout_id: checkout.id,
        checkout_url: checkout.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .in("status", ["draft", "checkout_failed"]);
    if (updateError) throw updateError;

    return {
      orderId,
      orderNumber,
      accessToken,
      checkoutUrl: checkout.url,
    };
  } catch (error) {
    await admin
      .from("orders")
      .update({
        status: "checkout_failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    if (error instanceof StoreCheckoutError) throw error;
    throw new StoreCheckoutError(
      "Não foi possível abrir o pagamento. Confira a chave e as permissões da AbacatePay.",
      502,
    );
  }
}

async function commercialLicenseRows(orderId: string) {
  const admin = createAdminClient();
  const { data: items, error } = await admin
    .from("order_items")
    .select("id,quantity")
    .eq("order_id", orderId);
  if (error) throw error;
  if (!items?.length) throw new Error("Pedido sem itens");

  return items.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => {
      const license = createCommercialLicense();
      return {
        order_item_id: item.id,
        order_item_unit: index + 1,
        code_hash: license.hash,
        code_last4: license.last4,
        encrypted_code: encryptLicenseCode(license.raw),
      };
    }),
  );
}

export async function processStorePaymentEvent(input: PaymentEventInput) {
  const admin = createAdminClient();
  const { data: processedEvent, error: processedEventError } = await admin
    .from("payment_events")
    .select("provider_event_id")
    .eq("provider_event_id", input.eventId)
    .maybeSingle();
  if (processedEventError) throw processedEventError;
  if (processedEvent) return false;

  const licenses =
    input.eventType === "checkout.completed"
      ? await commercialLicenseRows(input.orderId)
      : [];
  const { data, error } = await admin.rpc("process_abacate_checkout_event", {
    p_event_id: input.eventId,
    p_event_type: input.eventType,
    p_order_id: input.orderId,
    p_checkout_id: input.checkoutId,
    p_paid_amount: input.paidAmount,
    p_receipt_url: input.receiptUrl,
    p_payload: toJson(input.payload),
    p_licenses: toJson(licenses),
  });
  if (error) throw error;
  return data;
}

async function reconcilePendingOrder(order: {
  id: string;
  status: string;
  provider_checkout_id: string | null;
}) {
  if (order.status !== "pending_payment" || !order.provider_checkout_id) {
    return;
  }
  try {
    const checkout = await getAbacateCheckout(order.provider_checkout_id);
    const eventType =
      checkout.status === "PAID"
        ? "checkout.completed"
        : checkout.status === "REFUNDED"
          ? "checkout.refunded"
          : null;
    if (!eventType || !checkout.externalId) return;
    await processStorePaymentEvent({
      eventId: `reconcile:${checkout.id}:${checkout.status}:${checkout.updatedAt}`,
      eventType,
      orderId: checkout.externalId,
      checkoutId: checkout.id,
      paidAmount: checkout.paidAmount ?? checkout.amount,
      receiptUrl: checkout.receiptUrl,
      payload: { source: "checkout-status-reconciliation", checkout },
    });
  } catch {
    // The public order endpoint still returns the local status if reconciliation
    // is temporarily unavailable. The signed webhook remains authoritative.
  }
}

export type PublicOrder = {
  id: string;
  number: string;
  status: string;
  customerName: string;
  totalInCents: number;
  checkoutUrl: string | null;
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  fulfillment: {
    status: string;
    trackingCode: string | null;
    carrier: string | null;
  } | null;
  items: Array<{
    id: string;
    title: string;
    formatId: "physical" | "digital";
    formatLabel: string;
    quantity: number;
    unitPriceInCents: number;
  }>;
  licenses: Array<{
    code: string;
    last4: string;
    formatId: "physical" | "digital";
  }>;
};

export async function getPublicOrder(
  orderId: string,
  accessToken: string,
): Promise<PublicOrder | null> {
  if (!accessToken) return null;
  const admin = createAdminClient();
  const { data: initialOrder, error } = await admin
    .from("orders")
    .select(
      "id,public_number,customer_name,status,total_cents,checkout_url,receipt_url,created_at,paid_at,provider_checkout_id",
    )
    .eq("id", orderId)
    .eq("access_token_hash", hashSecret(accessToken))
    .maybeSingle();
  if (error) throw error;
  if (!initialOrder) return null;
  let order = initialOrder;

  await reconcilePendingOrder(order);
  if (order.status === "pending_payment") {
    const refreshed = await admin
      .from("orders")
      .select(
        "id,public_number,customer_name,status,total_cents,checkout_url,receipt_url,created_at,paid_at,provider_checkout_id",
      )
      .eq("id", orderId)
      .maybeSingle();
    if (refreshed.error) throw refreshed.error;
    if (refreshed.data) order = refreshed.data;
  }

  const [{ data: items, error: itemsError }, { data: fulfillment }] =
    await Promise.all([
      admin
        .from("order_items")
        .select(
          "id,product_title,format_id,format_label,quantity,unit_price_cents",
        )
        .eq("order_id", orderId),
      admin
        .from("order_fulfillments")
        .select("status,tracking_code,carrier")
        .eq("order_id", orderId)
        .maybeSingle(),
    ]);
  if (itemsError) throw itemsError;

  const itemIds = items?.map((item) => item.id) ?? [];
  const { data: licenses, error: licensesError } = itemIds.length
    ? await admin
        .from("licenses")
        .select("id,code_last4,order_item_id")
        .in("order_item_id", itemIds)
    : { data: [], error: null };
  if (licensesError) throw licensesError;
  const licenseIds = licenses?.map((license) => license.id) ?? [];
  const { data: deliveries, error: deliveriesError } = licenseIds.length
    ? await admin
        .from("license_deliveries")
        .select("license_id,encrypted_code")
        .in("license_id", licenseIds)
    : { data: [], error: null };
  if (deliveriesError) throw deliveriesError;

  const itemById = new Map(items?.map((item) => [item.id, item]));
  const deliveryByLicense = new Map(
    deliveries?.map((delivery) => [delivery.license_id, delivery]),
  );

  return {
    id: order.id,
    number: order.public_number,
    status: order.status,
    customerName: order.customer_name,
    totalInCents: order.total_cents,
    checkoutUrl: order.checkout_url,
    receiptUrl: order.receipt_url,
    createdAt: order.created_at,
    paidAt: order.paid_at,
    fulfillment: fulfillment
      ? {
          status: fulfillment.status,
          trackingCode: fulfillment.tracking_code,
          carrier: fulfillment.carrier,
        }
      : null,
    items:
      items?.map((item) => ({
        id: item.id,
        title: item.product_title,
        formatId: item.format_id,
        formatLabel: item.format_label,
        quantity: item.quantity,
        unitPriceInCents: item.unit_price_cents,
      })) ?? [],
    licenses:
      order.status === "paid"
        ? (licenses ?? []).flatMap((license) => {
            const item = license.order_item_id
              ? itemById.get(license.order_item_id)
              : null;
            const delivery = deliveryByLicense.get(license.id);
            if (!item || !delivery) return [];
            return [
              {
                code: decryptLicenseCode(delivery.encrypted_code),
                last4: license.code_last4,
                formatId: item.format_id,
              },
            ];
          })
        : [],
  };
}
