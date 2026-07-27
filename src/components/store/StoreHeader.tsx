"use client";

import { KeyRound, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export function StoreHeader({ light = false }: Readonly<{ light?: boolean }>) {
  const { itemCount } = useCart();

  return (
    <>
      <div className="announcement-bar">ABRA O CASO. REÚNA SUA EQUIPE. MUDE A HISTÓRIA.</div>
      <header className={`landing-header store-header${light ? " store-header-light" : ""}`}>
        <div className="header-inner">
          <details className="mobile-menu">
            <summary aria-label="Abrir menu">
              <Menu size={21} className="menu-open-icon" />
              <X size={21} className="menu-close-icon" />
            </summary>
            <nav aria-label="Menu mobile">
              <Link href="/#casos">Missões</Link>
              <Link href="/#como-funciona">Como funciona</Link>
              <Link href="/#diferente">Diferenciais</Link>
              <Link href="/#duvidas">Dúvidas</Link>
              <Link href="/entrar">Entrar</Link>
            </nav>
          </details>

          <Link href="/" className="brand-mark" aria-label="ViraTrama, início">
            <span className="brand-symbol" aria-hidden="true">VT</span>
            <span>ViraTrama</span>
          </Link>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <Link href="/#casos">Missões</Link>
            <Link href="/#como-funciona">Como funciona</Link>
            <Link href="/#diferente">Diferenciais</Link>
            <Link href="/#duvidas">Dúvidas</Link>
            <Link href="/entrar">Entrar</Link>
          </nav>

          <div className="header-actions">
            <Link href="/ativar" className="button button-wine">Ativar um caso <KeyRound size={15} /></Link>
            <Link href="/carrinho" className="cart-link" aria-label={`Carrinho, ${itemCount} item${itemCount === 1 ? "" : "ns"}`} title="Carrinho">
              <ShoppingCart size={19} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
            <Link href="/carrinho" className="mobile-cart-link" aria-label="Abrir carrinho" title="Carrinho">
              <ShoppingCart size={19} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
