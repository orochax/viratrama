"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartPageClient() {
  const { items, removeItem, clearCart } = useCart();

  return (
    <section className="cart-page">
      <div className="landing-container">
        <p className="eyebrow">Arquivo de compra</p>
        <h1>Seu carrinho<br /><em>de missões.</em></h1>
        {items.length === 0 ? (
          <>
            <p className="cart-empty">Nenhuma missão foi separada ainda. A próxima história pode começar pela sua mesa.</p>
            <Link href="/historia" className="button button-wine cart-empty-action">Conhecer A Chave Atlas <ArrowRight size={16} /></Link>
          </>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.slug}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>Quantidade: {item.quantity} · experiência física + digital</span>
                  </div>
                  <button type="button" className="cart-remove" onClick={() => removeItem(item.slug)}>
                    <Trash2 size={16} /> Remover
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-actions">
              <Link href="/ativar" className="button button-wine">Continuar para ativação <ArrowRight size={16} /></Link>
              <button type="button" className="cart-remove" onClick={clearCart}>Limpar carrinho</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
