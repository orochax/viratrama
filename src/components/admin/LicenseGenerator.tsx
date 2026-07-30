"use client";

import { Download, KeyRound } from "lucide-react";
import { useState } from "react";

export function LicenseGenerator() {
  const [quantity, setQuantity] = useState(10);
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function generate() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/licenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storySlug: "operacao-da-meia-noite", quantity }),
    });
    const payload = await response.json();
    if (!response.ok) setError(payload.error ?? "Não foi possível gerar o lote.");
    else setCodes(payload.codes);
    setBusy(false);
  }
  function download() {
    const csv = `codigo\n${codes.join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `licencas-omn-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <section className="panel mt-8 p-6"><div className="flex items-center gap-3 text-[#c7a96b]"><KeyRound /><span className="eyebrow">Novo lote</span></div><label className="eyebrow mt-6 block" htmlFor="license-count">Quantidade · 1 a 100</label><input id="license-count" className="activation-input mt-2 max-w-40" type="number" min={1} max={100} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><button className="button-primary mt-4" disabled={busy} onClick={() => void generate()}>{busy ? "Gerando..." : "Gerar códigos"}</button>{error && <p className="mt-4 text-sm text-[#f08b8b]">{error}</p>}{codes.length > 0 && <div className="mt-6"><p className="text-sm text-[#99a1ae]">Esta é a única exibição dos códigos completos. O banco recebeu somente os hashes.</p><pre className="mt-3 max-h-72 overflow-auto border border-white/10 bg-black/30 p-4 text-sm">{codes.join("\n")}</pre><button className="button-ghost mt-4 flex items-center gap-2" onClick={download}><Download size={15} /> Baixar CSV</button></div>}</section>;
}
