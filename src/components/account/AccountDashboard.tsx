"use client";

import Link from "next/link";
import { Check, Copy, KeyRound, LogOut, PackageCheck, Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccountOrder } from "@/lib/account/account-service";
import { createClient } from "@/lib/supabase/client";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function AccountDashboard({ email, fullName, phone, orders }: { email: string; fullName: string; phone: string; orders: AccountOrder[] }) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");

  async function saveProfile() {
    setMessage("");
    const client = createClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user?.email) return;
    if (newPassword) {
      const { error: signInError } = await client.auth.signInWithPassword({ email: user.email, password: currentPassword });
      if (signInError) return setMessage("Confirme sua senha atual antes de trocar a senha.");
    }
    const { error: authError } = await client.auth.updateUser({ data: { full_name: name.trim() } });
    if (authError) return setMessage("Não foi possível salvar o perfil.");
    const response = await fetch("/api/account/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, phone: phoneValue, password: newPassword || undefined }) });
    if (!response.ok) return setMessage("O perfil foi salvo parcialmente. Tente novamente.");
    setCurrentPassword("");
    setNewPassword("");
    setMessage("Dados atualizados.");
    router.refresh();
  }

  async function copy(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(""), 2000);
  }

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Área do cliente</p><h1 className="serif mt-4 text-6xl">Seu arquivo.</h1></div><button type="button" onClick={() => void logout()} className="button-ghost inline-flex items-center gap-2"><LogOut size={15} /> Sair</button></header><div className="account-layout mt-10"><section><div className="panel p-6"><p className="eyebrow">Perfil</p><h2 className="serif mt-3 text-3xl">Seus dados de acesso.</h2><label className="eyebrow mt-6 block">Nome<input className="activation-input mt-2" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="eyebrow mt-5 block">E-mail<input className="activation-input mt-2 opacity-60" value={email} disabled /></label><label className="eyebrow mt-5 block">Celular<input className="activation-input mt-2" value={phoneValue} onChange={(event) => setPhoneValue(event.target.value)} /></label><div className="border-t border-white/10 mt-6 pt-5"><p className="eyebrow">Segurança</p><label className="eyebrow mt-4 block">Senha atual<input className="activation-input mt-2" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></label><label className="eyebrow mt-4 block">Nova senha<input className="activation-input mt-2" type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></label></div><button type="button" className="button-primary mt-6 inline-flex items-center gap-2" onClick={() => void saveProfile()}><Save size={15} /> Salvar alterações</button>{message && <p className="mt-4 text-sm text-[#c7a96b]">{message}</p>}</div><Link href="/recuperar-pedido" className="panel mt-5 block p-6"><KeyRound className="text-[#c7a96b]" /><h2 className="serif mt-3 text-2xl">Recuperar uma compra</h2><p className="mt-2 text-sm text-[#99a1ae]">Encontre pedidos feitos com outro aparelho.</p></Link></section><section><p className="eyebrow">Minhas compras</p><h2 className="serif mt-3 text-4xl">Operações adquiridas.</h2><div className="mt-6 grid gap-5">{orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} copied={copied} onCopy={copy} />) : <div className="panel p-6 text-[#99a1ae]">Nenhuma compra vinculada a esta conta.</div>}</div></section></div></main>;
}

function OrderCard({ order, copied, onCopy }: { order: AccountOrder; copied: string; onCopy: (code: string) => void }) {
  return <article className="panel p-6"><div className="flex flex-wrap justify-between gap-3"><div><p className="eyebrow">{order.number}</p><p className="mt-2 text-sm text-[#99a1ae]">{new Date(order.date).toLocaleDateString("pt-BR")} · {order.status}</p></div><strong className="text-[#c7a96b]">{money.format(order.totalCents / 100)}</strong></div><div className="mt-5 border-t border-white/10 pt-4">{order.items.map((item) => <p key={item.title + item.formatId} className="text-sm">{item.title} · {item.formatLabel} · {item.quantity}x</p>)}</div>{order.receiptUrl && <a className="order-receipt-link mt-4 inline-flex" href={order.receiptUrl} target="_blank" rel="noreferrer"><PackageCheck size={15} /> Abrir comprovante</a>}{order.licenses.length > 0 && <div className="mt-5"><p className="eyebrow">Códigos de ativação</p>{order.licenses.map((license) => <div key={license.code} className="mt-2 flex flex-wrap items-center gap-3"><code className="license-code">{license.code}</code><button type="button" className="button-ghost" onClick={() => onCopy(license.code)}>{copied === license.code ? <Check size={15} /> : <Copy size={15} />}</button><Link href="/ativar" className="text-sm text-[#c7a96b]">Ativar</Link></div>)}</div>}{order.fulfillment && order.fulfillment.status !== "not_required" && <div className="mt-5 border-t border-white/10 pt-4"><p className="eyebrow">Rastreamento</p><p className="mt-2 flex items-center gap-2 text-sm"><PackageCheck size={15} /> {order.fulfillment.status}</p>{order.fulfillment.trackingCode && <p className="mt-1 text-sm text-[#99a1ae]">{order.fulfillment.carrier ?? "Transportadora"} · {order.fulfillment.trackingCode}</p>}{order.fulfillmentEvents.map((event) => <p key={event.status + event.createdAt} className="mt-2 text-xs text-[#99a1ae]">{new Date(event.createdAt).toLocaleDateString("pt-BR")} · {event.status}{event.note ? " · " + event.note : ""}</p>)}</div>}{order.licenses.some((license) => license.allowedPlayModes.includes("hybrid")) && <p className="mt-5 flex items-center gap-2 text-xs text-[#8fc7ad]"><ShieldCheck size={14} /> Esta licença permite jogo digital e físico + digital.</p>}</article>;
}
