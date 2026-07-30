"use client";

import {
  ArrowRight,
  Check,
  Copy,
  LoaderCircle,
  PackageCheck,
  ReceiptText,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { PublicOrder } from "@/lib/store/order-service";
import { useCart } from "./CartProvider";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusCopy: Record<
  string,
  { eyebrow: string; title: string; text: string }
> = {
  pending_payment: {
    eyebrow: "Pagamento pendente",
    title: "Aguardando a confirmação.",
    text: "Se você já concluiu o pagamento, esta página será atualizada automaticamente.",
  },
  paid: {
    eyebrow: "Pagamento confirmado",
    title: "A missão agora é de vocês.",
    text: "A Chave Atlas foi liberada. Guarde o código abaixo para ativar a operação.",
  },
  refunded: {
    eyebrow: "Pedido reembolsado",
    title: "O pagamento foi devolvido.",
    text: "As licenças deste pedido não podem mais ser ativadas.",
  },
  disputed: {
    eyebrow: "Pagamento em análise",
    title: "A operação foi temporariamente bloqueada.",
    text: "A liberação será revista quando a contestação do pagamento for concluída.",
  },
  checkout_failed: {
    eyebrow: "Checkout interrompido",
    title: "O pagamento não foi iniciado.",
    text: "Volte ao carrinho e tente novamente.",
  },
};

export function OrderPageClient({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const missingToken = !token;
  const { clearCart } = useCart();
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const cartCleared = useRef(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    let timer: number | undefined;
    const load = async () => {
      try {
        const params = new URLSearchParams({ token });
        const response = await fetch(`/api/orders/${orderId}?${params}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          order?: PublicOrder;
          error?: string;
        };
        if (!response.ok || !payload.order) {
          throw new Error(payload.error || "Pedido não encontrado.");
        }
        if (!active) return;
        setOrder(payload.order);
        setError("");
        if (payload.order.status === "paid" && !cartCleared.current) {
          cartCleared.current = true;
          clearCart();
        } else if (payload.order.status === "pending_payment") {
          timer = window.setTimeout(load, 3_000);
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível consultar o pedido.",
        );
      }
    };
    void load();
    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [clearCart, orderId, token]);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(""), 2_000);
  };

  const claimOrder = async () => {
    const response = await fetch(`/api/orders/${orderId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const payload = await response.json();
    setClaimMessage(payload.error ?? "Pedido salvo na sua conta.");
  };

  if (error || missingToken) {
    return (
      <section className="order-page">
        <div className="landing-container order-error">
          <ShieldAlert size={28} />
          <p className="eyebrow">Pedido protegido</p>
          <h1>Não foi possível abrir este arquivo.</h1>
          <p>{error || "O link deste pedido está incompleto."}</p>
          <Link href="/carrinho" className="button button-wine">
            Voltar ao carrinho
          </Link>
          <Link href="/recuperar-pedido" className="order-receipt-link">
            Recuperar pedido por e-mail
          </Link>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-page">
        <div className="landing-container order-loading">
          <LoaderCircle className="checkout-spinner" size={26} />
          Confirmando o pagamento
        </div>
      </section>
    );
  }

  const copy = statusCopy[order.status] ?? statusCopy.pending_payment;
  const hasPhysical = order.items.some((item) => item.formatId === "physical");

  return (
    <section className="order-page">
      <div className="landing-container">
        <div className={`order-status order-status-${order.status}`}>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <span>{order.number}</span>
        </div>

        <div className="order-grid">
          <section
            className="order-details"
            aria-labelledby="order-items-title"
          >
            <p className="eyebrow">Arquivo do pedido</p>
            <h2 id="order-items-title">Itens da operação</h2>
            <div className="order-items">
              {order.items.map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {item.formatLabel} · Quantidade {item.quantity}
                    </span>
                  </div>
                  <strong>
                    {currencyFormatter.format(
                      (item.unitPriceInCents * item.quantity) / 100,
                    )}
                  </strong>
                </article>
              ))}
            </div>
            <div className="order-total">
              <span>Total confirmado</span>
              <strong>
                {currencyFormatter.format(order.totalInCents / 100)}
              </strong>
            </div>
            {hasPhysical && order.fulfillment && (
              <div className="order-fulfillment">
                <PackageCheck size={20} />
                <div>
                  <strong>
                    {order.fulfillment.status === "pending"
                      ? "Preparação aguardando a equipe ViraTrama"
                      : `Entrega: ${order.fulfillment.status}`}
                  </strong>
                  <span>
                    {order.fulfillment.trackingCode
                      ? `${order.fulfillment.carrier ?? "Transportadora"} · ${order.fulfillment.trackingCode}`
                      : "O rastreio aparecerá aqui depois da postagem."}
                  </span>
                </div>
              </div>
            )}
          </section>

          <aside className="order-actions">
            {order.licenses.length > 0 ? (
              <>
                <p className="eyebrow">Chave de ativação</p>
                <h2>Vincule a missão à sua conta.</h2>
                <div className="order-license-list">
                  {order.licenses.map((license) => (
                    <button
                      type="button"
                      key={license.code}
                      onClick={() => void copyCode(license.code)}
                    >
                      <span>{license.code}</span>
                      {copied === license.code ? (
                        <Check size={17} />
                      ) : (
                        <Copy size={17} />
                      )}
                    </button>
                  ))}
                </div>
                <Link href="/ativar" className="button button-wine">
                  Ativar a missão <ArrowRight size={17} />
                </Link>
                <button type="button" className="button-ghost mt-3" onClick={() => void claimOrder()}>
                  Salvar pedido na minha conta
                </button>
                {claimMessage && <p className="mt-3 text-sm text-[#c7a96b]">{claimMessage}</p>}
              </>
            ) : order.status === "pending_payment" ? (
              <>
                <p className="eyebrow">Canal de pagamento</p>
                <h2>A confirmação ainda não chegou.</h2>
                {order.checkoutUrl && (
                  <a
                    href={order.checkoutUrl}
                    className="button button-wine"
                    rel="noreferrer"
                  >
                    Voltar ao pagamento <ArrowRight size={17} />
                  </a>
                )}
              </>
            ) : (
              <>
                <p className="eyebrow">Situação do pedido</p>
                <h2>A licença não está disponível.</h2>
                <Link href="/carrinho" className="button button-wine">
                  Voltar ao carrinho
                </Link>
              </>
            )}
            {order.receiptUrl && (
              <a
                href={order.receiptUrl}
                className="order-receipt-link"
                target="_blank"
                rel="noreferrer"
              >
                <ReceiptText size={16} /> Abrir comprovante
              </a>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
