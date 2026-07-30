"use client";

import { CheckCircle2, ImagePlus, Mic2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { transmissions } from "@/content/operation-midnight/transmissions";
import { createClient } from "@/lib/supabase/client";

export function MediaVault() {
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const visible = transmissions.filter((item) => filter === "all" || item.characterSlug === filter);

  async function upload(code: string, file: File, kind: "audio" | "portrait") {
    setBusy(`${code}:${kind}`);
    setMessage("");
    try {
      const item = transmissions.find((entry) => entry.code === code);
      if (!item) throw new Error("Mídia não encontrada.");
      const extension = file.name.split(".").pop()?.toLowerCase() || (kind === "audio" ? "mp3" : "webp");
      const path = `operation-midnight/characters/${item.characterSlug}/${kind === "audio" ? "audio" : "portraits"}/${code.toLowerCase()}.${extension}`;
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          storySlug: "operacao-da-meia-noite",
          code,
          kind,
          characterSlug: item.characterSlug,
          path,
          transcript: item.transcript,
          theme: item.theme,
        }),
      });
      const result = await response.json() as { error?: string; upload?: { path: string; token: string } };
      if (!response.ok || !result.upload) throw new Error(result.error ?? "Upload não preparado.");
      const supabase = createClient();
      const uploaded = await supabase.storage.from("game-media").uploadToSignedUrl(result.upload.path, result.upload.token, file);
      if (uploaded.error) throw uploaded.error;
      const finalized = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, state: "uploaded" }),
      });
      if (!finalized.ok) throw new Error("Arquivo enviado, mas o catálogo não foi atualizado.");
      setMessage(`${kind === "audio" ? "Áudio" : "Retrato"} enviado para ${code}. Teste e aprove antes de publicar.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setBusy(null);
    }
  }

  async function approve(code: string) {
    setBusy(`${code}:approve`);
    const response = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, state: "approved" }),
    });
    const payload = await response.json();
    setMessage(response.ok ? `${code} aprovado para partidas.` : payload.error ?? "Falha na aprovação.");
    setBusy(null);
  }

  return (
    <div className="mt-10">
      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <label className="eyebrow" htmlFor="character-filter">Filtrar personagem</label>
        <select id="character-filter" className="border border-white/10 bg-[#151b24] px-3 py-2 text-sm" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Todos</option>
          {[...new Set(transmissions.map((item) => item.characterSlug))].map((slug) => <option key={slug} value={slug}>{slug}</option>)}
        </select>
        <span className="ml-auto text-xs text-[#99a1ae]">{visible.length} transmissões catalogadas</span>
      </div>
      {message && <p className="mt-4 border border-[#c7a96b]/30 bg-[#c7a96b]/10 p-4 text-sm text-[#e0c98e]" role="status">{message}</p>}
      <div className="mt-5 space-y-3">
        {visible.map((item) => (
          <article className="panel grid gap-4 p-5 md:grid-cols-[1fr_auto]" key={item.code}>
            <div>
              <div className="flex flex-wrap items-center gap-3"><span className="eyebrow">{item.code}</span><span className="border border-white/10 px-2 py-1 text-[10px] uppercase text-[#99a1ae]">{item.status === "not_recorded" ? "não gravado" : item.status}</span></div>
              <h2 className="serif mt-2 text-2xl">{item.title}</h2>
              <p className="mt-1 text-sm text-[#99a1ae]">{item.characterName} · {item.role} · {item.kind}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#c5cad2]">{item.transcript}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:max-w-[250px] md:justify-end">
              <label className="button-ghost inline-flex cursor-pointer items-center gap-2 text-xs"><Mic2 size={14} />{busy === `${item.code}:audio` ? "Enviando" : "Enviar áudio"}<input className="sr-only" type="file" accept="audio/mpeg" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(item.code, file, "audio"); }} /></label>
              <label className="button-ghost inline-flex cursor-pointer items-center gap-2 text-xs"><ImagePlus size={14} />Retrato<input className="sr-only" type="file" accept="image/webp,image/avif,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(item.code, file, "portrait"); }} /></label>
              <button className="button-ghost inline-flex items-center gap-2 text-xs" disabled={busy === `${item.code}:approve`} onClick={() => void approve(item.code)}><CheckCircle2 size={15} /> Aprovar</button>
            </div>
          </article>
        ))}
      </div>
      <div className="panel mt-6 flex gap-3 p-5 text-sm text-[#99a1ae]"><UploadCloud className="shrink-0 text-[#c7a96b]" size={18} /><p>Uploads usam o bucket privado `game-media`. A partida só recebe URLs assinadas curtas e continua pela transcrição quando o MP3 não existe.</p></div>
    </div>
  );
}
