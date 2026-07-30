import { Suspense } from "react";
import { OrderPageClient } from "@/components/store/OrderPageClient";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <main className="store-page">
      <StoreHeader />
      <Suspense
        fallback={
          <section className="order-page">
            <div className="landing-container order-loading">
              Confirmando o pagamento
            </div>
          </section>
        }
      >
        <OrderPageClient orderId={orderId} />
      </Suspense>
      <StoreFooter />
    </main>
  );
}
