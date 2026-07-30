"use client";

import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  taxId: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

const emptyForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  taxId: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export function CartPageClient() {
  const { items, isHydrated, removeItem, clearCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasPhysical = items.some((item) => item.formatId === "physical");
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.unitPriceInCents * item.quantity,
        0,
      ),
    [items],
  );

  const update = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const startCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ slug, formatId, quantity }) => ({
            slug,
            formatId,
            quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            taxId: form.taxId,
          },
          shippingAddress: hasPhysical
            ? {
                recipientName: form.name,
                zipCode: form.zipCode,
                street: form.street,
                number: form.number,
                complement: form.complement,
                neighborhood: form.neighborhood,
                city: form.city,
                state: form.state,
              }
            : undefined,
        }),
      });
      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || "Não foi possível abrir o pagamento.");
      }
      window.location.assign(payload.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Não foi possível abrir o pagamento.",
      );
      setBusy(false);
    }
  };

  if (!isHydrated) {
    return (
      <section className="cart-page">
        <div className="landing-container cart-loading">
          <LoaderCircle className="checkout-spinner" size={24} />
          Carregando seu carrinho
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="landing-container">
        <p className="eyebrow">Arquivo de compra</p>
        <h1>
          Seu carrinho
          <br />
          <em>de missões.</em>
        </h1>
        {items.length === 0 ? (
          <>
            <p className="cart-empty">
              Nenhuma missão foi separada ainda. A próxima história pode começar
              pela sua mesa.
            </p>
            <Link
              href="/historia"
              className="button button-wine cart-empty-action"
            >
              Conhecer A Chave Atlas <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <form className="checkout-layout" onSubmit={startCheckout}>
            <div className="checkout-form">
              <section aria-labelledby="checkout-contact-title">
                <p className="eyebrow">Identificação</p>
                <h2 id="checkout-contact-title">Quem receberá a missão</h2>
                <div className="checkout-fields">
                  <label className="checkout-field checkout-field-wide">
                    <span>Nome completo</span>
                    <input
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                    />
                  </label>
                  <label className="checkout-field checkout-field-wide">
                    <span>E-mail</span>
                    <input
                      autoComplete="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </label>
                  <label className="checkout-field">
                    <span>Celular</span>
                    <input
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(00) 00000-0000"
                      required
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                    />
                  </label>
                  <label className="checkout-field">
                    <span>CPF ou CNPJ</span>
                    <input
                      autoComplete="off"
                      inputMode="numeric"
                      required
                      value={form.taxId}
                      onChange={(event) => update("taxId", event.target.value)}
                    />
                  </label>
                </div>
              </section>

              {hasPhysical && (
                <section
                  className="checkout-address"
                  aria-labelledby="checkout-address-title"
                >
                  <p className="eyebrow">Entrega da caixa</p>
                  <h2 id="checkout-address-title">Endereço de destino</h2>
                  <div className="checkout-fields">
                    <label className="checkout-field">
                      <span>CEP</span>
                      <input
                        autoComplete="postal-code"
                        inputMode="numeric"
                        required
                        value={form.zipCode}
                        onChange={(event) =>
                          update("zipCode", event.target.value)
                        }
                      />
                    </label>
                    <label className="checkout-field checkout-field-grow">
                      <span>Rua</span>
                      <input
                        autoComplete="address-line1"
                        required
                        value={form.street}
                        onChange={(event) =>
                          update("street", event.target.value)
                        }
                      />
                    </label>
                    <label className="checkout-field">
                      <span>Número</span>
                      <input
                        required
                        value={form.number}
                        onChange={(event) =>
                          update("number", event.target.value)
                        }
                      />
                    </label>
                    <label className="checkout-field checkout-field-grow">
                      <span>Complemento</span>
                      <input
                        autoComplete="address-line2"
                        value={form.complement}
                        onChange={(event) =>
                          update("complement", event.target.value)
                        }
                      />
                    </label>
                    <label className="checkout-field">
                      <span>Bairro</span>
                      <input
                        required
                        value={form.neighborhood}
                        onChange={(event) =>
                          update("neighborhood", event.target.value)
                        }
                      />
                    </label>
                    <label className="checkout-field checkout-field-grow">
                      <span>Cidade</span>
                      <input
                        autoComplete="address-level2"
                        required
                        value={form.city}
                        onChange={(event) => update("city", event.target.value)}
                      />
                    </label>
                    <label className="checkout-field checkout-field-state">
                      <span>UF</span>
                      <input
                        autoComplete="address-level1"
                        maxLength={2}
                        required
                        value={form.state}
                        onChange={(event) =>
                          update("state", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </section>
              )}
            </div>

            <aside className="checkout-summary" aria-label="Resumo do pedido">
              <div className="checkout-summary-title">
                <ShoppingCart size={18} />
                <strong>Resumo da operação</strong>
              </div>
              <div className="cart-items">
                {items.map((item) => (
                  <article className="cart-item" key={item.lineId}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.formatLabel} ·{" "}
                        {currencyFormatter.format(item.unitPriceInCents / 100)}{" "}
                        · Quantidade: {item.quantity}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      aria-label={`Remover ${item.formatLabel}`}
                      onClick={() => removeItem(item.lineId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
              <div className="checkout-total">
                <span>Total</span>
                <strong>{currencyFormatter.format(total / 100)}</strong>
              </div>
              {hasPhysical && (
                <p className="checkout-shipping-note">
                  Nesta integração inicial, o checkout cobra o valor cadastrado
                  do produto. O frete não está sendo acrescentado.
                </p>
              )}
              {error && (
                <p className="checkout-error" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="button button-wine checkout-submit"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <LoaderCircle className="checkout-spinner" size={17} />
                    Abrindo pagamento
                  </>
                ) : (
                  <>
                    Ir para o pagamento <ArrowRight size={17} />
                  </>
                )}
              </button>
              <p className="checkout-security">
                <LockKeyhole size={14} />
                Pagamento processado pela AbacatePay. Dados de cartão não passam
                pela ViraTrama.
              </p>
              <button type="button" className="cart-remove" onClick={clearCart}>
                Limpar carrinho
              </button>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
