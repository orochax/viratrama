"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Radio, Smartphone, Users } from "lucide-react";
import { useRoom } from "./RoomProvider";

const destination: Record<string, string> = {
  draft: "lobby",
  lobby: "lobby",
  role_assignment: "funcoes",
  role_reveal: "revelar",
  prologue: "jogo",
  active: "jogo",
  paused: "jogo",
  final_decision: "jogo",
  completed: "resultado",
  abandoned: "resultado",
};

export function RoomGate({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const { snapshot, loading, unauthorized, refresh } = useRoom();
  const [nickname, setNickname] = useState("");
  const [deviceMode, setDeviceMode] = useState<"own" | "shared">("own");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (snapshot) router.replace(`/sala/${roomCode}/${destination[snapshot.status] ?? "lobby"}`);
  }, [roomCode, router, snapshot]);

  async function join(event: FormEvent) {
    event.preventDefault();
    setJoining(true);
    setError("");
    const response = await fetch("/api/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode, nickname, deviceMode }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Não foi possível entrar na sala.");
      setJoining(false);
      return;
    }
    if (payload.personalCode) window.sessionStorage.setItem(`vt_personal_${roomCode}`, payload.personalCode);
    await refresh();
    router.replace(`/sala/${roomCode}/lobby`);
  }

  if (loading && !unauthorized) return <RoomLoading />;
  if (snapshot) return <RoomLoading label="Abrindo a etapa atual..." />;
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <div className="my-auto">
        <p className="eyebrow flex items-center gap-2"><Radio size={15} /> Sala {roomCode}</p>
        <h1 className="serif mt-5 text-6xl">Entre na operação.</h1>
        <p className="mt-4 leading-relaxed text-[#99a1ae]">Use seu nome de jogo. Uma conta não é necessária para participar.</p>
        <form className="panel mt-8 p-5" onSubmit={join}>
          <label className="eyebrow block" htmlFor="nickname">Nome ou apelido</label>
          <input id="nickname" className="activation-input mt-3" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={40} required />
          <fieldset className="mt-6">
            <legend className="eyebrow">Como vai acompanhar?</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Mode active={deviceMode === "own"} onClick={() => setDeviceMode("own")} icon={<Smartphone />} title="Meu celular" />
              <Mode active={deviceMode === "shared"} onClick={() => setDeviceMode("shared")} icon={<Users />} title="Compartilhado" />
            </div>
          </fieldset>
          <button className="button-primary mt-6 flex min-h-12 w-full items-center justify-center gap-2" disabled={joining}>
            {joining ? "Entrando..." : "Entrar na sala"} <ArrowRight size={16} />
          </button>
          {error && <p className="mt-4 text-sm text-[#f08b8b]" role="alert">{error}</p>}
        </form>
      </div>
    </main>
  );
}

function Mode({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string }) {
  return <button type="button" onClick={onClick} className={`room-mode ${active ? "is-active" : ""}`}>{icon}<span>{title}</span></button>;
}

export function RoomLoading({ label = "Sincronizando sala..." }: { label?: string }) {
  return <main className="grid min-h-screen place-items-center px-5"><div className="text-center"><span className="room-spinner" /><p className="mt-4 text-sm text-[#99a1ae]">{label}</p></div></main>;
}
