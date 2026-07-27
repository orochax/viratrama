import { StoreFooter } from "@/components/store/StoreFooter";
import { CartPageClient } from "@/components/store/CartPageClient";
import { StoreHeader } from "@/components/store/StoreHeader";

export default function CarrinhoPage() {
  return (
    <main className="store-page">
      <StoreHeader />
      <CartPageClient />
      <StoreFooter />
    </main>
  );
}
