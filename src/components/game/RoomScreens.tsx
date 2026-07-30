"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  AlertTriangle, ArrowRight, Check, CheckCircle2, ChevronRight, CircleUserRound,
  Copy, FileText, Headphones, KeyRound, Lightbulb, LockKeyhole, MapPin, Package,
  Radio, RotateCcw, ShieldCheck, UserCheck, Vote,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { inventoryCatalog, routeLabels } from "@/content/operation-midnight/public-catalog";
import { createClient } from "@/lib/supabase/client";
import type { PublicTransmission } from "@/lib/game/session-service";
import QRCode from "qrcode";
import { GameShell } from "./GameShell";
import { RoomLoading } from "./RoomGate";
import { useRoom } from "./RoomProvider";

type Screen = "lobby" | "participantes" | "funcoes" | "revelar" | "briefing" |
  "jogo" | "mapa" | "inventario" | "arquivos" | "mensagens" | "pistas" |
  "resultado" | "reorganizacao";

export function RoomScreen({ screen }: { screen: Screen }) {
  const params = useParams<{ roomCode: string }>();
  const roomCode = params.roomCode.toUpperCase();
  const { snapshot, loading, unauthorized, error } = useRoom();
  const router = useRouter();
  useEffect(() => {
    if (!snapshot) return;
    const setup = ["lobby", "participantes", "funcoes", "revelar", "briefing"].includes(screen);
    if (snapshot.status === "role_reveal" && ["lobby", "participantes", "funcoes"].includes(screen)) {
      router.replace(`/sala/${roomCode}/revelar`);
    } else if (["prologue", "active", "paused", "final_decision"].includes(snapshot.status) && setup) {
      router.replace(`/sala/${roomCode}/jogo`);
    } else if (snapshot.status === "completed" && !["resultado", "reorganizacao"].includes(screen)) {
      router.replace(`/sala/${roomCode}/resultado`);
    }
  }, [roomCode, router, screen, snapshot]);
  if (loading) return <RoomLoading />;
  if (unauthorized) return <AccessDenied roomCode={roomCode} />;
  if (!snapshot) return <ErrorScreen message={error || "A sala não está disponível."} />;
  return (
    <GameShell roomCode={roomCode}>
      {screen === "lobby" && <Lobby />}
      {screen === "participantes" && <Participants />}
      {screen === "funcoes" && <Roles />}
      {screen === "revelar" && <Reveal />}
      {screen === "briefing" && <Briefing />}
      {screen === "jogo" && <Game />}
      {screen === "mapa" && <MapView />}
      {screen === "inventario" && <Inventory />}
      {screen === "arquivos" && <Files />}
      {screen === "mensagens" && <Messages />}
      {screen === "pistas" && <Hints />}
      {screen === "resultado" && <Result />}
      {screen === "reorganizacao" && <Restoration />}
    </GameShell>
  );
}

function AccessDenied({ roomCode }: { roomCode: string }) {
  return <main className="grid min-h-screen place-items-center px-5"><div className="panel max-w-md p-6"><LockKeyhole className="text-[#c7a96b]" /><h1 className="serif mt-4 text-4xl">Acesso da sala necessário.</h1><p className="mt-3 text-[#99a1ae]">Entre pelo código para vincular este aparelho.</p><Link href={`/sala/${roomCode}`} className="button-primary mt-6 inline-flex items-center gap-2">Entrar na sala <ArrowRight size={16} /></Link></div></main>;
}

function ErrorScreen({ message }: { message: string }) {
  return <main className="grid min-h-screen place-items-center px-5"><div className="panel max-w-md p-6"><AlertTriangle className="text-[#b71929]" /><h1 className="serif mt-4 text-4xl">Não foi possível abrir.</h1><p className="mt-3 text-[#99a1ae]">{message}</p></div></main>;
}

function Lobby() {
  const { snapshot, command, submitting } = useRoom();
  const self = snapshot!.players.find((player) => player.isSelf)!;
  const canStart = snapshot!.players.length >= 3 && snapshot!.players.every((player) => player.confirmed);
  return (
    <section>
      <p className="eyebrow">Lobby / aguardando equipe</p>
      <div className="room-heading">
        <div><h1 className="serif text-5xl">A noite começa quando todos chegam.</h1><p>Compartilhe o código. O anfitrião joga sem receber spoilers.</p></div>
        <div className="room-code"><Radio size={17} /><span>{snapshot!.roomCode}</span></div>
      </div>
      <PlayerList />
      <RoomInvite roomCode={snapshot!.roomCode} />
      <div className="room-actions">
        {!self.confirmed && <button className="button-primary" disabled={submitting} onClick={() => void command({ type: "confirm_player" })}><UserCheck size={16} /> Confirmar presença</button>}
        {snapshot!.isHost && <button className="button-primary" disabled={!canStart || submitting} onClick={() => void command({ type: "assign_roles", mode: "automatic" })}>Distribuir funções <ArrowRight size={16} /></button>}
        {!snapshot!.isHost && self.confirmed && <p className="waiting-copy"><Radio size={15} /> Aguardando o anfitrião distribuir as funções.</p>}
      </div>
    </section>
  );
}

function RoomInvite({ roomCode }: { roomCode: string }) {
  const [qr, setQr] = useState("");
  useEffect(() => {
    const invite = `${window.location.origin}/sala/${roomCode}`;
    void QRCode.toDataURL(invite, { width: 240, margin: 1, color: { dark: "#111720", light: "#f4f1e8" } }).then(setQr);
  }, [roomCode]);
  return <div className="room-invite"><div>{qr && <Image src={qr} alt={`QR Code para entrar na sala ${roomCode}`} width={132} height={132} unoptimized />}</div><div><p className="eyebrow">Entrada da equipe</p><strong>{roomCode}</strong><p>Leia o QR ou abra o link no aparelho de cada jogador.</p><button className="button-ghost mt-3 flex items-center gap-2" onClick={() => void navigator.clipboard.writeText(`${window.location.origin}/sala/${roomCode}`)}><Copy size={14} /> Copiar convite</button></div></div>;
}

function Participants() {
  return <section><p className="eyebrow">Equipe conectada</p><h1 className="serif mt-4 text-5xl">Participantes.</h1><p className="mt-4 text-[#99a1ae]">Conexão e confirmações são restauradas quando o aparelho retorna.</p><PlayerList /><PlayerManagement /></section>;
}

function PlayerManagement() {
  const { snapshot, command, submitting } = useRoom();
  const candidates = snapshot!.players.filter((player) => !player.isHost);
  const [source, setSource] = useState(candidates[0]?.id ?? "");
  const [target, setTarget] = useState(snapshot!.players.find((player) => player.id !== source)?.id ?? "");
  if (!snapshot!.isHost || !candidates.length) return null;
  return <div className="panel mt-6 p-5"><p className="eyebrow">Gestão do anfitrião</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-[#99a1ae]">Jogador<select className="activation-input mt-2" value={source} onChange={(event) => setSource(event.target.value)}>{candidates.map((player) => <option value={player.id} key={player.id}>{player.nickname}</option>)}</select></label><label className="text-xs text-[#99a1ae]">Delegar função para<select className="activation-input mt-2" value={target} onChange={(event) => setTarget(event.target.value)}>{snapshot!.players.filter((player) => player.id !== source).map((player) => <option value={player.id} key={player.id}>{player.nickname}</option>)}</select></label></div><div className="mt-4 flex flex-wrap gap-3"><button className="button-ghost" disabled={!source || !target || submitting} onClick={() => void command({ type: "delegate_role", fromPlayerId: source, toPlayerId: target })}>Delegar função</button><button className="button-ghost text-[#f08b8b]" disabled={!source || submitting} onClick={() => void command({ type: "remove_player", playerId: source })}>Remover da sala</button></div></div>;
}

function PlayerList() {
  const { snapshot } = useRoom();
  return (
    <div className="room-player-list">
      {snapshot!.players.map((player) => (
        <article className="room-player" key={player.id}>
          <span className="room-player__avatar">{player.nickname.slice(0, 1).toUpperCase()}</span>
          <div><strong>{player.nickname}</strong><p>{player.isHost ? "Anfitrião" : player.deviceMode === "shared" ? "Aparelho compartilhado" : "Aparelho próprio"}</p></div>
          <span className={`room-player__status ${player.connected ? "is-online" : ""}`}>{player.connected ? "conectado" : "ausente"}</span>
          {player.confirmed && <CheckCircle2 size={17} className="text-[#3e7b62]" aria-label="Presença confirmada" />}
        </article>
      ))}
    </div>
  );
}

function Roles() {
  const { snapshot, command, submitting } = useRoom();
  return (
    <section>
      <p className="eyebrow">Distribuição operacional</p>
      <h1 className="serif mt-4 text-5xl">Uma responsabilidade para cada voz.</h1>
      <p className="mt-4 max-w-2xl text-[#99a1ae]">A combinação se adapta ao tamanho da equipe. Responsabilidades sem titular ficam delegadas ao anfitrião.</p>
      <PlayerList />
      {snapshot!.isHost && snapshot!.status === "lobby" && <button className="button-primary mt-6" disabled={submitting} onClick={() => void command({ type: "assign_roles", mode: "automatic" })}>Sortear funções</button>}
      {snapshot!.status === "role_reveal" && <Link className="button-primary mt-6 inline-flex items-center gap-2" href={`/sala/${snapshot!.roomCode}/revelar`}>Revelar em segurança <ArrowRight size={16} /></Link>}
    </section>
  );
}

function Reveal() {
  const { snapshot, command, submitting } = useRoom();
  const [gender, setGender] = useState<"masculino" | "feminino">("masculino");
  const self = snapshot!.players.find((player) => player.isSelf)!;
  const [personalCode, setPersonalCode] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(`vt_personal_${snapshot!.roomCode}`) ?? "");
  if (self.deviceMode === "shared" && self.ready && !snapshot!.selfRole) {
    return <section className="private-reveal"><ShieldCheck className="text-[#3e7b62]" size={34} /><p className="eyebrow mt-5">Conteúdo protegido</p><h1 className="serif mt-4 text-5xl">Função ocultada.</h1><p className="mt-4 text-[#99a1ae]">O aparelho já pode ser passado. Sua missão privada não permanece nesta tela.</p><Link className="button-primary mt-6 inline-flex items-center gap-2" href={`/sala/${snapshot!.roomCode}/briefing`}>Voltar à equipe <ArrowRight size={16} /></Link></section>;
  }
  if (!snapshot!.selfRole) {
    return (
      <section className="private-reveal">
        <p className="eyebrow">Conteúdo privado</p>
        <h1 className="serif mt-4 text-5xl">Passe o aparelho somente ao jogador correto.</h1>
        <div className="gender-switch mt-7" role="group" aria-label="Avatar">
          <button className={gender === "masculino" ? "is-active" : ""} onClick={() => setGender("masculino")}>Masculino</button>
          <button className={gender === "feminino" ? "is-active" : ""} onClick={() => setGender("feminino")}>Feminino</button>
        </div>
        {self.deviceMode === "shared" && <label className="eyebrow mt-5 block" htmlFor="personal-code">Código pessoal<input id="personal-code" className="activation-input mt-2" inputMode="numeric" maxLength={4} value={personalCode} onChange={(event) => setPersonalCode(event.target.value.replace(/\D/g, ""))} /></label>}
        <button className="button-primary mt-6" disabled={submitting || (self.deviceMode === "shared" && personalCode.length !== 4)} onClick={() => void command({ type: "reveal_role", avatarGender: gender, personalCode: self.deviceMode === "shared" ? personalCode : undefined })}><KeyRound size={16} /> Revelar minha função</button>
      </section>
    );
  }
  const role = snapshot!.selfRole;
  return (
    <section className="private-reveal">
      <p className="eyebrow">Somente para {self.nickname}</p>
      <h1 className="serif mt-4 text-6xl">{role.name}</h1>
      <div className="role-secret-grid">
        <article><ShieldCheck /><span>Responsabilidade</span><p>{role.responsibility}</p></article>
        <article><KeyRound /><span>Habilidade</span><p>{role.ability}</p></article>
        <article className="role-secret"><LockKeyhole /><span>Missão secreta</span><p>{role.secret}</p></article>
      </div>
      {!self.ready ? <button className="button-primary mt-6" disabled={submitting} onClick={() => void command({ type: "ready" })}><Check size={16} /> Entendi e estou pronto</button> : <Link className="button-primary mt-6 inline-flex items-center gap-2" href={`/sala/${snapshot!.roomCode}/briefing`}>Aguardar equipe <ArrowRight size={16} /></Link>}
    </section>
  );
}

function Briefing() {
  const { snapshot, command, submitting } = useRoom();
  const allReady = snapshot!.players.every((player) => player.ready);
  return (
    <section>
      <p className="eyebrow">Envelope 00 / preparação</p>
      <h1 className="serif mt-4 text-5xl">Ninguém abre nada ainda.</h1>
      <p className="mt-4 max-w-2xl text-[#99a1ae]">{snapshot!.playMode === "digital" ? "Todos os arquivos, pistas e decisões serão liberados pelo aplicativo. Deixem cada jogador com o próprio aparelho." : "Coloquem o mapa no centro, mantenham os envelopes lacrados e deixem o volume ativo apenas no aparelho principal."}</p>
      <PlayerList />
      {snapshot!.isHost ? <button className="button-primary mt-6" disabled={!allReady || submitting} onClick={() => void command({ type: "start_game" })}>Iniciar transmissão de Orion <ArrowRight size={16} /></button> : <p className="waiting-copy mt-6">Aguardando o anfitrião iniciar a operação.</p>}
    </section>
  );
}

function Game() {
  const { snapshot } = useRoom();
  const router = useRouter();
  useEffect(() => {
    if (snapshot?.status === "completed") router.replace(`/sala/${snapshot.roomCode}/resultado`);
  }, [router, snapshot]);
  if (!snapshot!.step) return <Result />;
  return (
    <section>
      <div className="active-step-heading">
        <div><p className="eyebrow">Ato {snapshot!.step.act} / passo ativo</p><h1 className="serif mt-3 text-5xl">{snapshot!.step.title}</h1></div>
        {snapshot!.step.envelope && <span className="envelope-permit"><LockKeyhole size={15} /> Envelope {snapshot!.step.envelope}</span>}
      </div>
      <div className="objective-panel"><span>Objetivo atual</span><strong>{snapshot!.step.objective}</strong><p>{snapshot!.step.context}</p></div>
      <ActionPanel />
    </section>
  );
}

function ActionPanel() {
  const { snapshot } = useRoom();
  const kind = snapshot!.step!.kind;
  if (kind === "transmission") return <TransmissionAction />;
  if (kind === "loadout") return <LoadoutAction />;
  if (kind === "route_vote") return <RouteVoteAction />;
  if (kind === "decision") return <DecisionAction />;
  if (kind === "puzzle") return <PuzzleAction />;
  if (kind === "movement") return <MovementAction />;
  if (kind === "final_vote") return <FinalVoteAction />;
  if (kind === "extraction") return <ExtractionAction />;
  return <SimpleAction />;
}

function TransmissionAction() {
  const { snapshot, command, submitting } = useRoom();
  const transmission = snapshot!.step!.transmission;
  const [transcript, setTranscript] = useState(transmission?.status === "not_recorded");
  const [confirmed, setConfirmed] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sync, setSync] = useState({ state: "ready", current: 0, duration: 0 });
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastProgress = useRef(-1);
  const roomCode = snapshot!.roomCode;
  const sessionId = snapshot!.sessionId;
  const transmissionCode = transmission?.code;

  useEffect(() => {
    if (!transmissionCode) return;
    let cancelled = false;
    void fetch(`/api/rooms/${roomCode}/media/${transmissionCode}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && payload.audioUrl) {
          setAudioUrl(payload.audioUrl);
          setTranscript(false);
        }
    });
    return () => { cancelled = true; };
  }, [roomCode, transmissionCode]);

  useEffect(() => {
    if (!transmissionCode) return;
    const client = createClient();
    const channel = client.channel(`transmission:${sessionId}`);
    channelRef.current = channel;
    channel.on("broadcast", { event: transmissionCode }, ({ payload }) => {
      setSync({
        state: typeof payload.state === "string" ? payload.state : "ready",
        current: Number(payload.current ?? 0),
        duration: Number(payload.duration ?? 0),
      });
    }).subscribe();
    return () => {
      channelRef.current = null;
      void client.removeChannel(channel);
    };
  }, [sessionId, transmissionCode]);

  function emit(state: string, current = 0, duration = 0) {
    void channelRef.current?.send({
      type: "broadcast",
      event: transmission!.code,
      payload: { state, current, duration },
    });
  }
  if (!transmission) return <SimpleAction />;
  return (
    <article className="transmission-card">
      <div className="transmission-person">
        <div className="transmission-portrait">{transmission.portraitPath && <Image src={`/${transmission.portraitPath}`} alt="" fill sizes="120px" />}</div>
        <div><span className="eyebrow"><Radio size={13} /> Transmissão segura</span><h2 className="serif">{transmission.characterName}</h2><p>{transmission.role}</p></div>
      </div>
      {!audioUrl && <p className="audio-pending"><Headphones size={15} /> Áudio em produção. A transcrição mantém a partida completa.</p>}
      {audioUrl && snapshot!.isHost && (
        <audio
          className="room-audio"
          src={audioUrl}
          controls
          preload="metadata"
          onPlay={(event) => emit("playing", event.currentTarget.currentTime, event.currentTarget.duration)}
          onPause={(event) => emit("paused", event.currentTarget.currentTime, event.currentTarget.duration)}
          onTimeUpdate={(event) => {
            const second = Math.floor(event.currentTarget.currentTime);
            if (second !== lastProgress.current && second % 3 === 0) {
              lastProgress.current = second;
              emit("playing", event.currentTarget.currentTime, event.currentTarget.duration);
            }
          }}
          onEnded={(event) => {
            setConfirmed(true);
            emit("complete", event.currentTarget.duration, event.currentTarget.duration);
          }}
        />
      )}
      {audioUrl && !snapshot!.isHost && (
        <div className="remote-audio" aria-live="polite">
          <Radio size={16} />
          <div><strong>{sync.state === "playing" ? "Transmitindo no aparelho principal" : sync.state === "complete" ? "Transmissão concluída" : "Aguardando o anfitrião"}</strong>
          <span><i style={{ width: `${sync.duration ? Math.min(100, sync.current / sync.duration * 100) : 0}%` }} /></span></div>
        </div>
      )}
      <button className="button-ghost mt-5" onClick={() => setTranscript((value) => !value)}><FileText size={15} /> {transcript ? "Fechar transcrição" : "Abrir transcrição"}</button>
      {transcript && <div className="transcript"><p>{transmission.transcript}</p><label><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> Li a transmissão integralmente para a equipe.</label></div>}
      {snapshot!.isHost ? <button className="button-primary mt-5" disabled={submitting || !confirmed} onClick={() => void command({ type: "complete_step" })}>Concluir transmissão <ArrowRight size={16} /></button> : <p className="waiting-copy mt-5">Aguardando confirmação no aparelho principal.</p>}
    </article>
  );
}

function SimpleAction() {
  const { snapshot, command, submitting } = useRoom();
  return <div className="action-panel"><p>Confiram o material físico antes de continuar.</p>{snapshot!.isHost ? <button className="button-primary" disabled={submitting} onClick={() => void command({ type: "complete_step" })}>Confirmar etapa <ArrowRight size={16} /></button> : <WaitingRole />}</div>;
}

function LoadoutAction() {
  const { snapshot, command, submitting } = useRoom();
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(id: string) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 4 ? [...items, id] : items);
  }
  return (
    <div className="action-panel">
      <div className="selection-count">{selected.length} / 4 itens</div>
      <div className="choice-grid">{inventoryCatalog.map((item) => <button type="button" key={item.id} className={selected.includes(item.id) ? "is-selected" : ""} onClick={() => toggle(item.id)}><Package size={18} /><strong>{item.name}</strong><span>{item.description}</span></button>)}</div>
      {snapshot!.step!.canAct ? <button className="button-primary" disabled={selected.length !== 4 || submitting} onClick={() => void command({ type: "select_loadout", itemIds: selected })}>Confirmar equipamento <ArrowRight size={16} /></button> : <WaitingRole />}
    </div>
  );
}

function RouteVoteAction() {
  const { snapshot, command, submitting } = useRoom();
  const voted = !!snapshot!.state.routeVotes[snapshot!.selfPlayerId];
  return <div className="action-panel"><p>Cada pessoa recomenda uma entrada. Os votos são públicos após a escolha.</p><div className="choice-grid choice-grid--three">{Object.entries(routeLabels).map(([id, label]) => <button key={id} disabled={voted || submitting} onClick={() => void command({ type: "route_vote", route: id })}><MapPin size={18} /><strong>{label}</strong></button>)}</div>{voted && <p className="waiting-copy"><Check size={15} /> Recomendação registrada. Aguardando {snapshot!.players.length - Object.keys(snapshot!.state.routeVotes).length}.</p>}</div>;
}

function DecisionAction() {
  const { snapshot, command, submitting } = useRoom();
  return <div className="action-panel"><p>Discutam usando apenas as evidências já reveladas. A consequência permanece oculta.</p><div className="choice-grid">{snapshot!.step!.options?.map((option) => <button key={option.id} disabled={!snapshot!.step!.canAct || submitting} onClick={() => void command({ type: "choose", optionId: option.id })}><ChevronRight size={18} /><strong>{option.label}</strong>{option.publicRequirement && <span>{option.publicRequirement}</span>}</button>)}</div>{!snapshot!.step!.canAct && <WaitingRole />}</div>;
}

function PuzzleAction() {
  const { snapshot, command, submitting } = useRoom();
  const [answer, setAnswer] = useState("");
  return (
    <div className="action-panel">
      <p>Manipulem os materiais sobre a mesa. A resposta é validada no servidor e não está presente nesta página.</p>
      <form onSubmit={(event) => { event.preventDefault(); void command({ type: "puzzle", answer }).then((ok) => { if (ok) setAnswer(""); }); }}>
        <label className="eyebrow" htmlFor="puzzle-answer">Código encontrado</label>
        <input id="puzzle-answer" className="activation-input mt-3" value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={!snapshot!.step!.canAct} autoComplete="off" required />
        {snapshot!.step!.canAct ? <button className="button-primary mt-4" disabled={submitting}>Validar código <ArrowRight size={16} /></button> : <WaitingRole />}
      </form>
      <Link href={`/sala/${snapshot!.roomCode}/pistas`} className="button-ghost mt-5 inline-flex items-center gap-2"><Lightbulb size={15} /> Consultar pistas</Link>
    </div>
  );
}

function MovementAction() {
  const { snapshot, command, submitting } = useRoom();
  const [marker, setMarker] = useState(snapshot!.players[0]?.id ?? "");
  const from = snapshot!.state.locations[marker];
  const destinations = from ? snapshot!.state.knownGraph[from] ?? [] : [];
  return (
    <div className="action-panel">
      <p>Movam primeiro a peça no mapa físico. Depois, o Infiltrador confirma a nova posição.</p>
      <div className="movement-current"><MapPin size={18} /><div><span>Marcador</span><select value={marker} onChange={(event) => setMarker(event.target.value)}>{snapshot!.players.map((player) => <option value={player.id} key={player.id}>{player.nickname}</option>)}</select></div><strong>{from?.replaceAll("-", " ") ?? "aguardando rota"}</strong></div>
      <div className="choice-grid">{destinations.map((to) => <button key={to} disabled={!snapshot!.step!.canAct || submitting} onClick={() => void command({ type: "move", markerCode: marker, to })}><ArrowRight size={18} /><strong>{to.replaceAll("-", " ")}</strong></button>)}</div>
      {!snapshot!.step!.canAct && <WaitingRole />}
    </div>
  );
}

function FinalVoteAction() {
  const { snapshot, command, submitting } = useRoom();
  const cast = snapshot!.state.finalVoteCast;
  const options = snapshot!.step!.options?.filter((option) => !snapshot!.step!.runoffOptions || snapshot!.step!.runoffOptions.includes(option.id));
  const tiePending = snapshot!.state.flags.tie_pending === true;
  return (
    <div className="action-panel">
      <div className="vote-seal"><Vote /><div><strong>{snapshot!.step!.runoffOptions ? "Segundo turno" : "Voto secreto"}</strong><p>{snapshot!.step!.voteCount} de {snapshot!.step!.playerCount} votos selados. Nenhum placar parcial será exibido.</p></div></div>
      <div className="choice-grid">{options?.map((option) => <button key={option.id} disabled={submitting || (cast && !tiePending) || (tiePending && snapshot!.selfRole?.slug !== "observador")} onClick={() => void command({ type: tiePending ? "break_tie" : "final_vote", option: option.id })}><LockKeyhole size={18} /><strong>{option.label}</strong></button>)}</div>
      {cast && <p className="waiting-copy"><Check size={15} /> Seu voto foi selado.</p>}
      {tiePending && snapshot!.selfRole?.slug !== "observador" && <p className="waiting-copy">O segundo turno empatou. Aguardando o Observador.</p>}
    </div>
  );
}

function ExtractionAction() {
  const { snapshot, command, submitting } = useRoom();
  const [trueKey, setTrueKey] = useState(true);
  return (
    <div className="action-panel">
      <label className="key-confirm"><input type="checkbox" checked={trueKey} onChange={(event) => setTrueKey(event.target.checked)} /><span>A equipe está levando a chave identificada como verdadeira.</span></label>
      <div className="choice-grid choice-grid--three">{snapshot!.step!.options?.map((option) => <button key={option.id} disabled={!snapshot!.step!.canAct || submitting} onClick={() => void command({ type: "extract", exit: option.id, selectedTrueKey: trueKey })}><MapPin size={18} /><strong>{option.label}</strong></button>)}</div>
      {!snapshot!.step!.canAct && <WaitingRole />}
    </div>
  );
}

function WaitingRole() {
  const { snapshot } = useRoom();
  return <p className="waiting-copy"><Radio size={15} /> Aguardando {snapshot!.step!.responsibleRoleName ?? "o anfitrião"}.</p>;
}

function MapView() {
  const { snapshot } = useRoom();
  const knownNodes = useMemo(() => new Set([...Object.keys(snapshot!.state.knownGraph), ...Object.values(snapshot!.state.knownGraph).flat()]), [snapshot]);
  return <section><p className="eyebrow">{snapshot!.playMode === "digital" ? "Mapa digital / posições confirmadas" : "Mapa físico / posições confirmadas"}</p><h1 className="serif mt-4 text-5xl">Mansão Vesper.</h1><p className="mt-4 text-[#99a1ae]">{snapshot!.playMode === "digital" ? "A equipe movimenta os marcadores diretamente no mapa digital." : "O aplicativo registra os pontos. A movimentação continua sobre o mapa físico."}</p><div className="map-node-grid">{[...knownNodes].map((node) => { const occupants = snapshot!.players.filter((player) => snapshot!.state.locations[player.id] === node); return <article key={node}><MapPin size={16} /><strong>{node.replaceAll("-", " ")}</strong>{occupants.map((player) => <span key={player.id}>{player.nickname}</span>)}</article>; })}</div></section>;
}

function Inventory() {
  const { snapshot, command, submitting } = useRoom();
  const selected = snapshot!.state.inventory;
  const canConsume = snapshot!.isHost || snapshot!.selfRole?.slug === "motorista";
  return <section><p className="eyebrow">Inventário persistido</p><h1 className="serif mt-4 text-5xl">O que a equipe carrega.</h1><div className="resource-grid">{selected.length ? selected.map((item) => { const consumed = snapshot!.state.consumedItems.includes(item.id); return <article key={item.id}><Package /><div><strong>{item.name}</strong><p>{item.description}</p>{canConsume && !consumed && <button className="button-ghost mt-3" disabled={submitting} onClick={() => void command({ type: "consume_item", itemId: item.id })}>Confirmar uso</button>}</div><span>{consumed ? "usado" : "disponível"}</span></article>; }) : <EmptyState label="O equipamento será escolhido durante o primeiro ato." />}</div></section>;
}

function Files() {
  const { snapshot } = useRoom();
  const files = snapshot!.state.openedEnvelopes.map((code) => ({ code, title: code === "00" ? "Dossiê da operação" : `Materiais do Envelope ${code}` }));
  return <section><p className="eyebrow">Arquivos desbloqueados</p><h1 className="serif mt-4 text-5xl">Dossiê da equipe.</h1><div className="resource-grid">{files.length ? files.map((file) => <article key={file.code}><FileText /><div><strong>{file.title}</strong><p>Disponível porque a equipe abriu este material.</p></div><span>aberto</span></article>) : <EmptyState label="Nenhum arquivo foi aberto." />}</div></section>;
}

function Messages() {
  const { snapshot } = useRoom();
  const items = snapshot!.state.messages;
  return <section><p className="eyebrow">Agora / não ouvidas / histórico</p><h1 className="serif mt-4 text-5xl">Transmissões.</h1><div className="resource-grid">{items.length ? items.map((item) => <HistoryTransmission key={item.code} roomCode={snapshot!.roomCode} item={item} />) : <EmptyState label="O histórico aparece depois da primeira transmissão." />}</div></section>;
}

function HistoryTransmission({ roomCode, item }: { roomCode: string; item: PublicTransmission }) {
  const [audioUrl, setAudioUrl] = useState("");
  const [open, setOpen] = useState(false);
  async function replay() {
    await fetch(`/api/rooms/${roomCode}/media/${item.code}`, { method: "POST" });
    const response = await fetch(`/api/rooms/${roomCode}/media/${item.code}`);
    const media = await response.json();
    setAudioUrl(media.audioUrl ?? "");
    setOpen(true);
  }
  return (
    <article>
      <Radio />
      <div>
        <strong>{item.characterName} · {item.title}</strong>
        {open && <p>{item.transcript}</p>}
        {audioUrl && <audio className="room-audio" src={audioUrl} controls />}
        <button className="button-ghost mt-3" onClick={() => void replay()}><Headphones size={14} /> {open ? "Reabrir transmissão" : "Reproduzir ou ler novamente"}</button>
      </div>
      <span>histórico</span>
    </article>
  );
}

function Hints() {
  const { snapshot, command, submitting } = useRoom();
  const isPuzzle = snapshot!.step?.kind === "puzzle";
  return <section><p className="eyebrow">Assistência progressiva</p><h1 className="serif mt-4 text-5xl">Pistas.</h1><p className="mt-4 text-[#99a1ae]">Cada novo nível reduz a pontuação. A resposta nunca é entregue diretamente.</p><div className="hint-list">{snapshot!.state.hints.map((hint, index) => <article key={hint}><span>{index + 1}</span><p>{hint}</p></article>)}</div>{isPuzzle ? <button className="button-primary mt-6" disabled={submitting || snapshot!.state.hints.length >= 3} onClick={() => void command({ type: "hint" })}><Lightbulb size={16} /> Revelar próxima pista</button> : <p className="waiting-copy mt-6">As pistas ficam disponíveis quando um puzzle está ativo.</p>}</section>;
}

function Result() {
  const { snapshot } = useRoom();
  const ending = snapshot!.state.ending;
  if (!ending) return <section><p className="eyebrow">Operação em andamento</p><h1 className="serif mt-4 text-5xl">O resultado ainda não foi selado.</h1><Link href={`/sala/${snapshot!.roomCode}/jogo`} className="button-primary mt-6 inline-flex">Voltar ao jogo</Link></section>;
  const epilogue = snapshot!.state.epilogue;
  return <section className="result-screen"><p className="eyebrow">Resultado da operação</p><h1 className="serif mt-4 text-7xl">{ending.title}</h1><p className="result-summary">{ending.summary}</p><div className="result-metrics"><span><strong>{snapshot!.dashboard.score}</strong>Pontuação</span><span><strong>{snapshot!.dashboard.maxAlertLevel}/5</strong>Alerta máximo</span><span><strong>{snapshot!.state.route ?? "—"}</strong>Rota</span><span><strong>{snapshot!.state.extractionExit ?? "—"}</strong>Saída</span></div>{epilogue && <div className="resource-grid mt-7"><HistoryTransmission roomCode={snapshot!.roomCode} item={epilogue} /></div>}<Link href={`/sala/${snapshot!.roomCode}/reorganizacao`} className="button-primary mt-8 inline-flex items-center gap-2">Reorganizar o kit <RotateCcw size={16} /></Link></section>;
}

function Restoration() {
  const { snapshot } = useRoom();
  const router = useRouter();
  const [checked, setChecked] = useState<string[]>([]);
  const [strong, setStrong] = useState(false);
  const materials = snapshot!.state.openedEnvelopes.map((code) => `Envelope ${code}`);
  async function restore(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/rooms/${snapshot!.roomCode}/restore`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmed: strong && checked.length === materials.length }) });
    if (response.ok) router.push("/biblioteca");
  }
  return <section><p className="eyebrow">Checklist dinâmico</p><h1 className="serif mt-4 text-5xl">Devolvam a noite à caixa.</h1><form className="restoration-list mt-8" onSubmit={restore}>{materials.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => setChecked((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} /><Package /><span>{item} e todos os materiais conferidos</span></label>)}<label className="strong-confirm"><input type="checkbox" checked={strong} onChange={(event) => setStrong(event.target.checked)} /><ShieldCheck /><span>Confirmo que todo material aberto retornou ao envelope correto.</span></label>{snapshot!.isHost ? <button className="button-primary mt-6" disabled={!strong || checked.length !== materials.length}>Liberar nova partida</button> : <p className="waiting-copy">Somente o anfitrião conclui a reorganização.</p>}</form></section>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="empty-state"><CircleUserRound /><p>{label}</p></div>;
}
