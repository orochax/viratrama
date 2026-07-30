"use client";

import Link from "next/link";
import { Archive, Home, Map, MessageSquare, Package, Pause, Play, ShieldAlert, WifiOff } from "lucide-react";
import { useRoom } from "./RoomProvider";
import { LiveDashboard } from "./LiveDashboard";

export function GameShell({ roomCode, children }: { roomCode: string; children: React.ReactNode }) {
  const { snapshot, offline, error, submitting, command } = useRoom();
  const paused = snapshot?.status === "paused";
  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-white/10 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href={`/sala/${roomCode}`} className="flex min-h-11 items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-[#c7a96b]/50 text-[#c7a96b]"><ShieldAlert size={16} /></span>
            <span className="text-xs tracking-[.12em]">OMN / {roomCode}</span>
          </Link>
          {snapshot?.isHost && ["prologue", "active", "paused", "final_decision"].includes(snapshot.status) && (
            <button
              type="button"
              onClick={() => void command({ type: paused ? "resume" : "pause" })}
              disabled={submitting}
              className="button-ghost flex min-h-11 items-center gap-2 px-3"
            >
              {paused ? <Play size={15} /> : <Pause size={15} />} {paused ? "Retomar" : "Pausar"}
            </button>
          )}
        </div>
      </header>
      {offline && <div className="room-status room-status--warning"><WifiOff size={15} /> Reconectando. Ações críticas estão bloqueadas.</div>}
      {paused && <div className="room-status">Sessão pausada pelo anfitrião. O prazo policial continua correndo.</div>}
      {error && <div className="room-status room-status--error" role="alert">{error}</div>}
      <main className="mx-auto max-w-6xl px-4 py-5">
        {snapshot?.dashboard.startedAt && <LiveDashboard snapshot={snapshot} />}
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0e1219]/95 px-2 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-xl justify-around text-[10px] text-[#99a1ae]">
          <Nav href={`/sala/${roomCode}/jogo`} icon={<Home />} label="Jogo" />
          <Nav href={`/sala/${roomCode}/mapa`} icon={<Map />} label="Mapa" />
          <Nav href={`/sala/${roomCode}/inventario`} icon={<Package />} label="Itens" />
          <Nav href={`/sala/${roomCode}/arquivos`} icon={<Archive />} label="Arquivos" />
          <Nav href={`/sala/${roomCode}/mensagens`} icon={<MessageSquare />} label="Mensagens" />
        </div>
      </nav>
    </div>
  );
}

function Nav({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 hover:text-[#f4f1e8]">{icon}<span>{label}</span></Link>;
}
