"use client";

import { Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { operationMidnightProduct } from "@/content/store/catalog";
import { useCart } from "./CartProvider";

export function ProductCardPurchase() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      slug: operationMidnightProduct.slug,
      title: operationMidnightProduct.title,
    });
    setAdded(true);
  };

  return (
    <div className="compact-product-purchase">
      <div className="compact-format-options" aria-label="Formatos disponíveis">
        <button type="button" className="is-selected" aria-pressed="true">
          <span>Físico + digital</span>
          <strong>Disponível</strong>
        </button>
        <button type="button" disabled>
          <span>Digital</span>
          <strong>Em breve</strong>
        </button>
      </div>

      {added ? (
        <Link href="/carrinho" className="compact-add-button is-added">
          <Check size={15} />
          Adicionado ao carrinho
        </Link>
      ) : (
        <button type="button" className="compact-add-button" onClick={handleAdd}>
          <ShoppingCart size={15} />
          Adicionar ao carrinho
        </button>
      )}

      <Link href="/historia" className="compact-details-link">
        Ver mais detalhes
      </Link>
    </div>
  );
}
