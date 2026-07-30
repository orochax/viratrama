"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function OrderRecoveryForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/orders/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json();
    setMessage(payload.message ?? "Confira seu e-mail.");
    setBusy(false);
  }
  return <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 py-10"><section className="w-full"><Mail className="text-[#c7a96b]" /><p className="eyebrow mt-5">Recuperação de pedido</p><h1 className="serif mt-4 text-5xl">Encontrar uma compra.</h1><div className="panel mt-7 p-6">{message ? <p className="text-[#8fc7ad]">{message}</p> : <form onSubmit={submit}><label className="eyebrow">E-mail usado na compra<input className="activation-input mt-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><button className="button-primary mt-6 flex w-full items-center justify-center gap-2" disabled={busy}>{busy ? "Enviando..." : "Enviar acesso"} <ArrowRight size={16} /></button></form>}<a href="/carrinho" className="mt-6 inline-flex text-sm text-[#c7a96b]">Voltar à loja</a></div></section></main>;
}
