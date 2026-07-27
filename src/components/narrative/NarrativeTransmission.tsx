"use client";

import { AlertTriangle, FileText, Headphones, Pause, Play, Radio, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { AudioTransmission } from "@/content/operation-midnight/transmissions";

type Props = {
  transmission: AudioTransmission;
  onComplete?: (mode: "audio" | "transcript") => void;
  onEvent?: (type: string, payload?: Record<string, unknown>) => void;
  compact?: boolean;
  syncChannel?: string;
  isHost?: boolean;
};

const themeClasses = {
  orion: "border-[#c7a96b]/50 shadow-[0_0_80px_rgba(199,169,107,.12)]",
  vega: "border-[#78b7d0]/50 shadow-[0_0_80px_rgba(120,183,208,.12)]",
  voss: "border-[#9b2638]/60 shadow-[0_0_80px_rgba(155,38,56,.14)]",
  sofia: "border-[#d8e7ee]/50 shadow-[0_0_80px_rgba(216,231,238,.12)]",
  neutral: "border-white/20",
} as const;

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  return `${Math.floor(value / 60).toString().padStart(2, "0")}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
}

export function NarrativeTransmission({ transmission, onComplete, onEvent, compact = false, syncChannel, isHost = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "paused" | "complete" | "error">("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [transcriptConfirmed, setTranscriptConfirmed] = useState(false);
  const [audioUrl, setAudioUrl] = useState(transmission.audioPath);
  const [portraitUrl, setPortraitUrl] = useState(`/${transmission.portraitPath}`);
  const lastProgressBroadcast = useRef(0);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  const progress = useMemo(() => duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0, [currentTime, duration]);

  useEffect(() => {
    let active = true;
    void fetch(`/api/media/${encodeURIComponent(transmission.code)}`).then((response) => response.ok ? response.json() as Promise<{ audioUrl?: string; portraitUrl?: string }> : null).then((result) => {
      if (!active || !result) return;
      if (result.audioUrl) setAudioUrl(result.audioUrl);
      if (result.portraitUrl) setPortraitUrl(result.portraitUrl);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [transmission.code, transmission.audioPath, transmission.portraitPath]);

  useEffect(() => {
    if (!syncChannel || typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(syncChannel);
    broadcastRef.current = channel;
    channel.onmessage = (event: MessageEvent<{ type?: string; positionSeconds?: number; duration?: number }>) => {
      if (isHost || !event.data?.type) return;
      if (event.data.type === "transmission_started" || event.data.type === "transmission_resumed") setStatus("playing");
      if (event.data.type === "transmission_paused") setStatus("paused");
      if (event.data.type === "transmission_completed") setStatus("complete");
      if (event.data.type === "transmission_progress" && typeof event.data.positionSeconds === "number") setCurrentTime(event.data.positionSeconds);
      if (event.data.duration) setDuration(event.data.duration);
    };
    return () => { channel.close(); broadcastRef.current = null; };
  }, [isHost, syncChannel]);

  const emit = (type: string, payload?: Record<string, unknown>) => {
    onEvent?.(type, payload);
    if (syncChannel && isHost) broadcastRef.current?.postMessage({ type, ...payload });
  };

  const start = async () => {
    if (!isHost && syncChannel) return;
    const element = audioRef.current;
    if (!element) return;
    setStatus("loading");
    emit("transmission_started", { code: transmission.code });
    try {
      await element.play();
      setStatus("playing");
    } catch {
      setStatus("error");
      emit("transmission_failed", { code: transmission.code, reason: "autoplay_or_load" });
    }
  };

  const togglePlayback = async () => {
    const element = audioRef.current;
    if (!element) return;
    if (element.paused) return start();
    element.pause();
    setStatus("paused");
    emit("transmission_paused", { code: transmission.code, positionSeconds: element.currentTime });
  };

  const confirmTranscript = () => {
    setTranscriptConfirmed(true);
    setStatus("complete");
    emit("transcript_confirmed", { code: transmission.code });
    onComplete?.("transcript");
  };

  return (
    <section className={`transmission panel overflow-hidden ${themeClasses[transmission.theme]} ${compact ? "p-4" : "p-6 md:p-8"}`} aria-label={`Transmissão de ${transmission.characterName}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        muted={muted}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => { const time = event.currentTarget.currentTime; setCurrentTime(time); if (isHost && syncChannel && time - lastProgressBroadcast.current >= 1) { lastProgressBroadcast.current = time; emit("transmission_progress", { code: transmission.code, positionSeconds: time, duration: event.currentTarget.duration }); } }}
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus((current) => current === "complete" ? current : "paused")}
        onError={() => { setStatus("error"); emit("transmission_failed", { code: transmission.code, reason: "asset_missing_or_invalid" }); }}
        onEnded={() => { setStatus("complete"); emit("transmission_completed", { code: transmission.code }); onComplete?.("audio"); }}
      />

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow flex items-center gap-2"><Radio size={14} aria-hidden="true" /> {transmission.kind === "incoming_call" ? "Chamada criptografada" : "Transmissão segura"}</span>
        <span className="text-[10px] uppercase tracking-[.18em] text-[#99a1ae]">{transmission.code}</span>
      </div>

      <div className={`mt-5 grid gap-6 ${compact ? "md:grid-cols-[150px_1fr]" : "md:grid-cols-[220px_1fr]"}`}>
        <div className="transmission-portrait relative aspect-[4/5] overflow-hidden border border-white/10 bg-gradient-to-br from-[#1b2530] to-[#080a0d]">
          <Image src={portraitUrl} alt={`Retrato de ${transmission.characterName}`} fill sizes="(max-width: 768px) 100vw, 220px" unoptimized className="h-full w-full object-cover opacity-80 grayscale-[.2]" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0,rgba(7,9,13,.85)_90%)]" aria-hidden="true" />
          <div className="absolute bottom-3 left-3 right-3"><p className="text-lg font-semibold tracking-[.08em]">{transmission.characterName}</p><p className="text-[10px] uppercase tracking-[.18em] text-[#c7a96b]">{transmission.role}</p></div>
        </div>

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <p className="eyebrow">{status === "error" ? "Sinal interrompido" : status === "complete" ? "Transmissão encerrada" : status === "playing" ? "Recebendo agora" : "Mensagem recebida"}</p>
            <h2 className="serif mt-3 text-3xl md:text-4xl">{transmission.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#99a1ae]">A imagem é uma identificação visual. A informação da operação também está disponível pela transcrição.</p>
          </div>

          <div className="mt-6">
            <div className={`audio-wave ${status === "playing" ? "is-playing" : ""}`} aria-hidden="true">{Array.from({ length: compact ? 20 : 32 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 65)}%` }} />)}</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#c7a96b] transition-[width] duration-200" style={{ width: `${progress}%` }} /></div>
            <div className="mt-2 flex justify-between text-[11px] text-[#99a1ae]"><span>{formatTime(currentTime)}</span><span>{duration ? formatTime(duration) : "duração pendente"}</span></div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {status === "error" ? <button className="button-primary flex items-center gap-2" onClick={start} disabled={!isHost && !!syncChannel}><RotateCcw size={15} /> Tentar novamente</button> : <button className="button-primary flex items-center gap-2" onClick={togglePlayback} disabled={status === "loading" || (!isHost && !!syncChannel)}>{!isHost && syncChannel ? <Radio size={15} /> : status === "playing" ? <Pause size={15} /> : <Play size={15} />} {!isHost && syncChannel ? "Aguardando anfitrião" : status === "playing" ? "Pausar" : status === "loading" ? "Conectando" : "Iniciar transmissão"}</button>}
            <button className="button-ghost flex items-center gap-2" onClick={() => { setMuted((value) => !value); emit("volume_changed", { muted: !muted }); }} aria-label={muted ? "Ativar som" : "Silenciar áudio"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}<span className="hidden sm:inline">{muted ? "Ativar som" : "Silenciar"}</span></button>
            <button className="button-ghost flex items-center gap-2" onClick={() => { setTranscriptOpen((value) => !value); emit("transcript_opened", { code: transmission.code }); }}><FileText size={15} /> {transcriptOpen ? "Fechar transcrição" : "Abrir transcrição"}</button>
          </div>
        </div>
      </div>

      {transcriptOpen && <div className="mt-6 border-t border-white/10 pt-5" aria-live="polite"><p className="eyebrow flex items-center gap-2"><Headphones size={14} /> Transcrição integral</p><p className="mt-4 whitespace-pre-line text-base leading-8 text-[#f4f1e8]">{transmission.transcript}</p>{transmission.requiresCompletion && <button className="button-ghost mt-5" onClick={confirmTranscript} disabled={transcriptConfirmed}>{transcriptConfirmed ? "Leitura confirmada" : "Confirmar leitura e continuar"}</button>}</div>}
      {status === "error" && <p className="mt-5 flex items-center gap-2 text-sm text-[#e09a9a]"><AlertTriangle size={15} /> O arquivo ainda não foi enviado ou não pôde ser carregado. Use a transcrição para continuar.</p>}
      {status === "complete" && !transcriptOpen && <p className="mt-5 text-sm text-[#3e7b62]" role="status">Transmissão concluída. A próxima etapa pode ser liberada pelo anfitrião.</p>}
    </section>
  );
}
