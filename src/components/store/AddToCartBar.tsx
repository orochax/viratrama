"use client";

import { Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { operationMidnightProduct } from "@/content/store/catalog";
import { useCart } from "./CartProvider";

export function AddToCartBar() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ slug: operationMidnightProduct.slug, title: operationMidnightProduct.title });
    setAdded(true);
  };

  return (
    <aside className="add-to-cart-bar" aria-label="Adicionar missão ao carrinho">
      <div className="add-to-cart-bar-inner">
        <div className="add-to-cart-label">
          <strong>A Chave Atlas</strong>
          <span>Operação da Meia-Noite · experiência física + digital</span>
        </div>
        {added ? (
          <Link href="/carrinho" className="button add-to-cart-button is-added">
            <Check size={17} /> Adicionado ao carrinho
          </Link>
        ) : (
          <button type="button" className="button add-to-cart-button" onClick={handleAdd}>
            <ShoppingCart size={17} /> Adicionar ao carrinho
          </button>
        )}
      </div>
    </aside>
  );
}
