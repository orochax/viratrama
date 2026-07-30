import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/store/checkout-validation";
import {
  createStoreCheckout,
  StoreCheckoutError,
} from "@/lib/store/order-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) {
    return NextResponse.json(
      { error: "Origem não autorizada." },
      { status: 403 },
    );
  }
  const parsed = checkoutRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Confira os dados antes de continuar.",
      },
      { status: 400 },
    );
  }

  try {
    const auth = await createClient();
    const {
      data: { user },
    } = await auth.auth.getUser();
    const checkout = await createStoreCheckout({
      request: parsed.data,
      userId: user?.id ?? null,
      fallbackOrigin: requestUrl.origin,
    });
    return NextResponse.json(checkout);
  } catch (error) {
    const status = error instanceof StoreCheckoutError ? error.status : 500;
    const message =
      error instanceof StoreCheckoutError
        ? error.message
        : "Não foi possível iniciar o pagamento.";
    return NextResponse.json({ error: message }, { status });
  }
}
