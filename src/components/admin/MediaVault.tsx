"use client";

import { CheckCircle2, ImagePlus, Mic2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { transmissions } from "@/content/operation-midnight/transmissions";

export function MediaVault() {
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const visible = transmissions.filter((item) => filter === "all" || item.characterSlug === filter);

  async function upload(code: string, file: File, kind: "audio" | "portrait") {
    setBusy(`${code}:${kind}`); setMessage("");
    try {
      const item = transmissions.find((entry) => entry.code === code);
      if (!item) throw new Error("Mídia não encontrada");
      const path = `operation-midnight/characters/${item.characterSlug}/${kind === "audio" ? "audio" : "portraits"}/${file.name}`;
      const response = await fetch("/api/admin/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ storySlug: "operacao-da-meia-noite", code, kind, characterSlug: item.characterSlug, path, transcript: item.transcript, theme: item.theme }) });
      const result = await response.json() as { error?: string; upload?: { path: string; token: string } };
      if (!response.ok || !result.upload) throw new Error(result.error ?? "Upload não preparado");
      const supabase = createClient();
      const uploaded = await supabase.storage.from("game-media").uploadToSignedUrl(result.upload.path, result.upload.token, file);
      if (uploaded.error) throw uploaded.error;
      setMessage(`${kind === "audio" ? "Áudio" : "Retrato"} enviado para ${code}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Falha no upload"); }
    finally { setBusy(null); }
  }

  return <div className="mt-10">
    <div className="panel flex flex-wrap items-center gap-3 p-4"><label className="eyebrow" htmlFor="character-filter">Filtrar personagem</label><select id="character-filter" className="border border-white/10 bg-[#151b24] px-3 py-2 text-sm" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Todos</option>{[...new Set(transmissions.map((item) => item.characterSlug))].map((slug) => <option key={slug} value={slug}>{slug}</option>)}</select><span className="ml-auto text-xs text-[#99a1ae]">{visible.length} transmissões catalogadas</span></div>
    {message && <p className="mt-4 border border-[#c7a96b]/30 bg-[#c7a96b]/10 p-4 text-sm text-[#e0c98e]" role="status">{message}</p>}
    <div className="mt-5 space-y-3">{visible.map((item) => <article className="panel grid gap-4 p-5 md:grid-cols-[1fr_auto]" key={item.code}><div><div className="flex flex-wrap items-center gap-3"><span className="eyebrow">{item.code}</span><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase text-[#99a1ae]">{item.status === "not_recorded" ? "não gravado" : item.status}</span></div><h2 className="serif mt-2 text-2xl">{item.title}</h2><p className="mt-1 text-sm text-[#99a1ae]">{item.characterName} · {item.role} · {item.kind}</p><p className="mt-3 text-sm leading-relaxed text-[#c5cad2]">{item.transcript}</p></div><div className="flex flex-wrap items-center gap-2 md:max-w-[220px] md:justify-end"><label className="button-ghost inline-flex cursor-pointer items-center gap-2 text-xs"><Mic2 size={14}/>{busy === `${item.code}:audio` ? "Enviando" : "Enviar áudio"}<input className="sr-only" type="file" accept="audio/mpeg,audio/mp4,audio/wav" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(item.code, file, "audio"); }} /></label><label className="button-ghost inline-flex cursor-pointer items-center gap-2 text-xs"><ImagePlus size={14}/>Retrato<input className="sr-only" type="file" accept="image/webp,image/avif,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(item.code, file, "portrait"); }} /></label><CheckCircle2 size={16} className="text-[#3e7b62]" aria-label="Catálogo pronto" /></div></article>)}</div>
    <div className="panel mt-6 flex gap-3 p-5 text-sm text-[#99a1ae]"><UploadCloud className="shrink-0 text-[#c7a96b]" size={18}/><p>Os uploads são privados e passam pelo servidor administrativo. Arquivos reais ainda não existem no bucket; esta tela ficará pronta para recebê-los quando forem produzidos.</p></div>
  </div>;
}
