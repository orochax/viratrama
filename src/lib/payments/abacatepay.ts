const API_URL = "https://api.abacatepay.com/v2";

type AbacateResponse<T> = {
  data: T | null;
  success: boolean;
  error: string | null;
};

export type AbacateCustomer = {
  id: string;
  email: string;
};

export type AbacateCheckout = {
  id: string;
  externalId: string | null;
  url: string;
  amount: number;
  paidAmount: number | null;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED";
  receiptUrl: string | null;
  updatedAt: string;
};

export class AbacatePayError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AbacatePayError";
  }
}

function apiKey() {
  const value = process.env.ABACATEPAY_API_KEY?.trim();
  if (!value) throw new Error("ABACATEPAY_API_KEY não configurada");
  return value;
}

async function abacateRequest<T>(path: string, init: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response
    .json()
    .catch(() => null)) as AbacateResponse<T> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new AbacatePayError(
      payload?.error || "A AbacatePay não concluiu a solicitação",
      response.status,
    );
  }
  return payload.data;
}

export function createAbacateCustomer(input: {
  name: string;
  email: string;
  phone: string;
  taxId: string;
  zipCode?: string;
}) {
  return abacateRequest<AbacateCustomer>("/customers/create", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      cellphone: input.phone,
      taxId: input.taxId,
      zipCode: input.zipCode,
      metadata: { source: "viratrama-checkout" },
    }),
  });
}

export function createAbacateCheckout(input: {
  items: Array<{ id: string; quantity: number }>;
  customerId: string;
  externalId: string;
  returnUrl: string;
  completionUrl: string;
  maxInstallments: number;
}) {
  return abacateRequest<AbacateCheckout>("/checkouts/create", {
    method: "POST",
    body: JSON.stringify({
      items: input.items,
      customerId: input.customerId,
      externalId: input.externalId,
      returnUrl: input.returnUrl,
      completionUrl: input.completionUrl,
      methods: ["PIX", "CARD"],
      card: { maxInstallments: input.maxInstallments },
      metadata: { source: "viratrama-store" },
    }),
  });
}

export function getAbacateCheckout(id: string) {
  const params = new URLSearchParams({ id });
  return abacateRequest<AbacateCheckout>(`/checkouts/get?${params}`, {
    method: "GET",
  });
}
