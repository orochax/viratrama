"use client";

import { Clock3, DoorOpen, LockKeyhole, Siren, Timer, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { SessionSnapshot } from "@/lib/game/session-service";

function duration(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function countdown(value: string | undefined, now: number) {
  return value ? duration(new Date(value).getTime() - now) : null;
}

export function LiveDashboard({ snapshot }: { snapshot: SessionSnapshot }) {
  const [now, setNow] = useState(() => snapshot.dashboard.startedAt
    ? new Date(snapshot.dashboard.startedAt).getTime()
    : 0);
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const items = [
    { label: "Sala", value: snapshot.dashboard.startedAt ? duration(now - new Date(snapshot.dashboard.startedAt).getTime()) : "00:00:00", icon: Timer },
    { label: "Entrada", value: countdown(snapshot.dashboard.entryDeadlineAt, now) ?? "BLOQUEADO", icon: DoorOpen, locked: !snapshot.dashboard.entryDeadlineAt },
    { label: "Extração", value: countdown(snapshot.dashboard.extractionDeadlineAt, now) ?? "BLOQUEADO", icon: Clock3, locked: !snapshot.dashboard.extractionDeadlineAt },
    { label: "Polícia", value: countdown(snapshot.dashboard.alarmDeadlineAt, now) ?? "DADO NÃO OBTIDO", icon: Siren, locked: !snapshot.dashboard.alarmDeadlineAt },
    { label: "Equipe", value: `${snapshot.dashboard.connected} / ${snapshot.maxPlayers}`, icon: Users },
  ];
  return (
    <section className="live-dashboard" aria-label="Estado operacional">
      {items.map(({ label, value, icon: Icon, locked }) => (
        <div className="live-dashboard__item" key={label}>
          <span>{locked ? <LockKeyhole size={13} /> : <Icon size={13} />}{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
