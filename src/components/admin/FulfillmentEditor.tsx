"use client";

import { Save } from "lucide-react";
import { useState } from "react";

export function FulfillmentEditor({ orderId, status: initialStatus, carrier: initialCarrier, trackingCode: initialTracking }: { orderId: string; status: string; carrier: string; trackingCode: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [carrier, setCarrier] = useState(initialCarrier);
  const [trackingCode, setTrackingCode] = useState(initialTracking);
  const [message, setMessage] = useState("");
  async function save() {
    const response = await fetch("/api/admin/orders/" + orderId + "/fulfillment", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, carrier, trackingCode }) });
    setMessage(response.ok ? "Atualizado." : "Não foi possível atualizar.");
  }
  return <div className="mt-4 grid gap-2 sm:grid-cols-4"><select className="activation-input" value={status} onChange={(event) => setStatus(event.target.value)}><option value="waiting_payment">Aguardando pagamento</option><option value="pending">Pendente</option><option value="processing">Preparando</option><option value="shipped">Postado</option><option value="delivered">Entregue</option><option value="cancelled">Cancelado</option></select><input className="activation-input" placeholder="Transportadora" value={carrier} onChange={(event) => setCarrier(event.target.value)} /><input className="activation-input" placeholder="Código de rastreio" value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} /><button type="button" className="button-primary inline-flex items-center justify-center gap-2" onClick={() => void save()}><Save size={15} /> Salvar</button>{message && <span className="text-xs text-[#c7a96b]">{message}</span>}</div>;
}
