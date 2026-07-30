"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, Monitor, RotateCcw, Shapes } from "lucide-react";
import { useState } from "react";

type License = {
  id: string;
  code_last4: string;
  stories: { title?: string; slug?: string } | { title?: string; slug?: string }[] | null;
  latestSession?: {
    room_code?: string;
    status?: string;
    kit_restored?: boolean;
    state?: { ending?: string };
  } | null;
  allowedPlayModes?: string[];
};

export function LibraryOperations({ licenses, defaultNickname }: { licenses: License[]; defaultNickname: string }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(defaultNickname);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [playModes, setPlayModes] = useState<Record<string, "digital" | "hybrid">>({});

  async function create(licenseId: string) {
    setBusy(licenseId);
    setError("");
    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseId, nickname: nickname.trim() || "Anfitrião", playMode: playModes[licenseId] ?? "hybrid" }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Não foi possível criar a sala.");
      setBusy("");
      return;
    }
    router.push(`/sala/${payload.roomCode}`);
  }

  if (!licenses.length) return <div className="panel mt-8 p-6"><p className="text-[#99a1ae]">Nenhuma missão está vinculada a esta conta.</p></div>;
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {licenses.map((license) => {
        const story = Array.isArray(license.stories) ? license.stories[0] : license.stories;
        const session = license.latestSession;
        const live = session && ["lobby", "role_assignment", "role_reveal", "prologue", "active", "paused", "final_decision"].includes(session.status ?? "");
        const needsRestore = session?.status === "completed" && !session.kit_restored;
        const allowedModes = license.allowedPlayModes ?? ["digital", "hybrid"];
        const selectedMode = playModes[license.id] ?? (allowedModes.includes("hybrid") ? "hybrid" : "digital");
        return (
          <article className="panel p-6" key={license.id}>
            <p className="eyebrow">Licença ativa · •••• {license.code_last4}</p>
            <h2 className="serif mt-3 text-3xl">{story?.title ?? "Operação da Meia-Noite"}</h2>
            {live && <p className="mt-3 flex items-center gap-2 text-sm text-[#c7a96b]"><Clock3 size={15} /> Partida em andamento · {session.room_code}</p>}
            {needsRestore && <p className="mt-3 flex items-center gap-2 text-sm text-[#c7a96b]"><RotateCcw size={15} /> Kit aguardando reorganização</p>}
            {session?.status === "completed" && session.kit_restored && <p className="mt-3 flex items-center gap-2 text-sm text-[#3e7b62]"><CheckCircle2 size={15} /> Última operação concluída</p>}
            {live || needsRestore ? (
              <button className="button-primary mt-6 flex items-center gap-2" onClick={() => router.push(`/sala/${session!.room_code}`)}>
                {needsRestore ? "Reorganizar kit" : "Retomar partida"} <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <label className="eyebrow mt-5 block" htmlFor={`host-${license.id}`}>Nome do anfitrião</label>
                <input id={`host-${license.id}`} className="activation-input mt-2" value={nickname} onChange={(event) => setNickname(event.target.value)} />
                <fieldset className="mt-5"><legend className="eyebrow">Como vocês vão jogar?</legend><div className="mt-2 grid grid-cols-2 gap-2">{allowedModes.includes("hybrid") && <button type="button" className={`room-mode ${selectedMode === "hybrid" ? "is-active" : ""}`} onClick={() => setPlayModes((current) => ({ ...current, [license.id]: "hybrid" }))}><Shapes size={16} /><span>Físico + digital</span></button>}<button type="button" className={`room-mode ${selectedMode === "digital" ? "is-active" : ""}`} onClick={() => setPlayModes((current) => ({ ...current, [license.id]: "digital" }))}><Monitor size={16} /><span>100% digital</span></button></div></fieldset>
                <button className="button-primary mt-4 flex items-center gap-2" disabled={busy === license.id} onClick={() => void create(license.id)}>
                  {busy === license.id ? "Criando..." : "Criar sala"} <ArrowRight size={16} />
                </button>
              </>
            )}
          </article>
        );
      })}
      {error && <p className="text-sm text-[#f08b8b]" role="alert">{error}</p>}
    </div>
  );
}
