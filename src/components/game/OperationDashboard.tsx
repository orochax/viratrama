"use client";

import { DoorOpen, Footprints, LockKeyhole, Siren, Timer, Users, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { OperationCountdown, OperationDashboardData } from "@/content/operation-midnight/operation-dashboard";

type MetricProps = {
  timer: "session" | "entry" | "extraction" | "police" | "team";
  label: string;
  icon: LucideIcon;
  value: string;
  status?: "locked" | "active" | "expired";
  urgency?: "normal" | "warning" | "critical";
  session?: boolean;
};

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function countdownValue(countdown: OperationCountdown, now: number) {
  if (countdown.status === "locked") {
    return { value: "DADO NÃO OBTIDO", status: "locked" as const, urgency: "normal" as const };
  }

  const remaining = new Date(countdown.deadlineAt).getTime() - now;
  if (countdown.status === "expired" || remaining <= 0) {
    return { value: "ENCERRADO", status: "expired" as const, urgency: "critical" as const };
  }

  return {
    value: formatDuration(remaining),
    status: "active" as const,
    urgency: (remaining <= 60_000 ? "critical" : remaining <= 5 * 60_000 ? "warning" : "normal") as "normal" | "warning" | "critical",
  };
}

function Metric({ timer, label, icon: Icon, value, status = "active", urgency = "normal", session }: MetricProps) {
  const isLocked = status === "locked";
  return (
    <div className={`operation-dashboard__metric${session ? " operation-dashboard__metric--session" : ""}`} data-dashboard-timer={timer} data-status={status} data-urgency={urgency}>
      <div className="operation-dashboard__label">
        {isLocked ? <LockKeyhole aria-hidden="true" size={15} /> : <Icon aria-hidden="true" size={15} />}
        <span>{label}</span>
      </div>
      <strong className="operation-dashboard__value">{value}</strong>
    </div>
  );
}

export function OperationDashboard({ data }: { data: OperationDashboardData }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const entry = countdownValue(data.entry, now);
  const extraction = countdownValue(data.extraction, now);
  const police = countdownValue(data.police, now);
  return (
    <section className="operation-dashboard" aria-label="Status da operação">
      <Metric timer="session" label="Tempo de sala" icon={Timer} value={formatDuration(now - new Date(data.sessionStartedAt).getTime())} session />
      <Metric timer="entry" label="Entrada" icon={DoorOpen} {...entry} />
      <Metric timer="extraction" label="Extração" icon={Footprints} {...extraction} />
      <Metric timer="police" label="Polícia" icon={Siren} {...police} />
      <Metric timer="team" label="Equipe" icon={Users} value={`${data.playersConnected} / ${data.maxPlayers}`} />
    </section>
  );
}
