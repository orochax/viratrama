import "server-only";

import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  canonicalRoles,
  endingCatalog,
  endingMediaCodes,
  getStep,
  inventoryCatalog,
  puzzleDefinitions,
  routeGraph,
  STORY_SLUG,
  STORY_VERSION,
  type RoleSlug,
} from "@/content/operation-midnight/canonical";
import { getTransmission } from "@/content/operation-midnight/transmissions";
import { runCommand, GameRuleError, type GameCommand, type RuntimePlayer, type RuntimeSession, type SessionStatus } from "@/features/story-engine/runtime";
import { initialGameState, type GameState } from "@/features/story-engine/types";
import { hashSecret } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  license_id: string;
  host_user_id: string;
  room_code: string;
  status: SessionStatus;
  current_act: number;
  story_version: number;
  elapsed_seconds: number;
  started_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
  alarm_deadline_at: string | null;
  entry_deadline_at: string | null;
  extraction_deadline_at: string | null;
  alert_level: number;
  max_alert_level: number;
  collective_score: number;
  route_slug: string | null;
  police_eta_known: boolean;
  kit_restored: boolean;
  state: GameState | null;
  version: number;
  max_players: number;
  created_at: string;
  updated_at: string;
};

type PlayerRow = {
  id: string;
  session_id: string;
  auth_user_id: string | null;
  nickname: string;
  personal_code_hash: string | null;
  guest_token_hash: string | null;
  device_mode: "own" | "shared" | "none";
  is_host: boolean;
  is_active: boolean;
  confirmed: boolean;
  ready: boolean;
  role_revealed: boolean;
  avatar_gender: "default" | "masculino" | "feminino";
  last_seen_at: string | null;
  current_location_node: string | null;
  metadata: Record<string, unknown> | null;
};

type Identity = {
  player: PlayerRow;
  isHost: boolean;
};

export type PublicPlayer = {
  id: string;
  nickname: string;
  isHost: boolean;
  isSelf: boolean;
  confirmed: boolean;
  ready: boolean;
  roleRevealed: boolean;
  roleName?: string;
  roleSlug?: RoleSlug;
  connected: boolean;
  deviceMode: "own" | "shared" | "none";
  avatarGender?: string;
  delegatedRoleNames?: string[];
};

export type SessionSnapshot = {
  sessionId: string;
  roomCode: string;
  status: SessionStatus;
  version: number;
  isHost: boolean;
  selfPlayerId: string;
  maxPlayers: number;
  players: PublicPlayer[];
  dashboard: {
    startedAt: string | null;
    entryDeadlineAt?: string;
    extractionDeadlineAt?: string;
    alarmDeadlineAt?: string;
    connected: number;
    alertLevel: number;
    maxAlertLevel: number;
    score: number;
  };
  step?: {
    id: string;
    act: number;
    kind: string;
    title: string;
    objective: string;
    context: string;
    responsibleRole?: string;
    responsibleRoleName?: string;
    canAct: boolean;
    envelope?: string;
    options?: readonly { id: string; label: string; publicRequirement?: string }[];
    transmission?: ReturnType<typeof publicTransmission>;
    voteCount?: number;
    playerCount?: number;
    runoffOptions?: string[];
  };
  selfRole?: {
    slug: RoleSlug;
    name: string;
    responsibility: string;
    ability: string;
    secret: string;
  };
  state: {
    route?: string;
    routeVotes: Record<string, string>;
    inventory: typeof inventoryCatalog[number][];
    consumedItems: string[];
    unlockedEnvelopes: string[];
    openedEnvelopes: string[];
    unlockedFiles: string[];
    completedTransmissions: string[];
    locations: Record<string, string>;
    knownGraph: Record<string, readonly string[]>;
    puzzleAttempts?: number;
    hints: string[];
    finalVoteCast: boolean;
    ending?: typeof endingCatalog[number];
    messages: PublicTransmission[];
    epilogue?: PublicTransmission;
    extractionExit?: string;
    flags: Record<string, boolean | string | number>;
  };
};

function db() {
  return createAdminClient() as unknown as SupabaseClient;
}

function roleSlug(player: PlayerRow): RoleSlug | undefined {
  const value = player.metadata?.role_slug;
  return canonicalRoles.some((role) => role.slug === value) ? value as RoleSlug : undefined;
}

function toRuntimePlayer(player: PlayerRow): RuntimePlayer {
  return {
    id: player.id,
    nickname: player.nickname,
    isHost: player.is_host,
    confirmed: player.confirmed,
    ready: player.ready,
    roleRevealed: player.role_revealed,
    roleSlug: roleSlug(player),
    delegatedRoles: Array.isArray(player.metadata?.delegated_roles)
      ? player.metadata.delegated_roles.filter((value): value is RoleSlug =>
        canonicalRoles.some((role) => role.slug === value))
      : [],
    isActive: player.is_active,
    deviceMode: player.device_mode,
  };
}

function toRuntimeSession(session: SessionRow, players: PlayerRow[]): RuntimeSession {
  return {
    status: session.status,
    state: { ...initialGameState(), ...(session.state ?? {}) },
    players: players.map(toRuntimePlayer),
    startedAt: session.started_at,
    pausedAt: session.paused_at,
    alarmDeadlineAt: session.alarm_deadline_at,
    entryDeadlineAt: session.entry_deadline_at,
    extractionDeadlineAt: session.extraction_deadline_at,
  };
}

function publicTransmission(code?: string) {
  if (!code) return undefined;
  const item = getTransmission(code);
  if (!item) return undefined;
  return {
    code: item.code,
    characterSlug: item.characterSlug,
    characterName: item.characterName,
    role: item.role,
    title: item.title,
    transcript: item.transcript,
    portraitPath: item.portraitPath,
    status: item.status,
    requiresCompletion: item.requiresCompletion,
  };
}

export type PublicTransmission = NonNullable<ReturnType<typeof publicTransmission>>;

async function getRows(roomCode: string) {
  const client = db();
  const { data: sessionData, error: sessionError } = await client
    .from("game_sessions")
    .select("*")
    .eq("room_code", roomCode.toUpperCase())
    .maybeSingle();
  if (sessionError) throw new Error(sessionError.message);
  if (!sessionData) throw new GameRuleError("Sala não encontrada.", 404);
  const session = sessionData as SessionRow;
  const { data: playerData, error: playerError } = await client
    .from("players")
    .select("*")
    .eq("session_id", session.id)
    .order("joined_at");
  if (playerError) throw new Error(playerError.message);
  return { session, players: (playerData ?? []) as PlayerRow[] };
}

async function resolveIdentity(session: SessionRow, players: PlayerRow[], guestToken?: string): Promise<Identity> {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  const host = user ? players.find((player) => player.auth_user_id === user.id && player.is_host) : undefined;
  if (host && session.host_user_id === user!.id) return { player: host, isHost: true };
  if (guestToken) {
    const tokenHash = hashSecret(guestToken);
    const guest = players.find((player) => player.guest_token_hash === tokenHash && player.is_active);
    if (guest) return { player: guest, isHost: false };
  }
  throw new GameRuleError("Este aparelho não está vinculado à sala.", 401);
}

export function roomCookieName(roomCode: string) {
  return `vt_room_${roomCode.toUpperCase()}`;
}

export async function createRoom(licenseId: string, nickname: string) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) throw new GameRuleError("Entre na sua conta para criar uma sala.", 401);
  const client = db();
  const { data: license, error: licenseError } = await client
    .from("licenses")
    .select("id,owner_user_id,status,story_id")
    .eq("id", licenseId)
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (licenseError) throw new Error(licenseError.message);
  if (!license || license.status !== "active") throw new GameRuleError("Licença ativa não encontrada.", 403);

  const { data: existing } = await client
    .from("game_sessions")
    .select("room_code,status,kit_restored")
    .eq("license_id", licenseId)
    .in("status", ["lobby", "role_assignment", "role_reveal", "prologue", "active", "paused", "final_decision"])
    .maybeSingle();
  if (existing) return { roomCode: existing.room_code as string, resumed: true };

  const { data: completed } = await client
    .from("game_sessions")
    .select("kit_restored")
    .eq("license_id", licenseId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (completed && !completed.kit_restored) {
    throw new GameRuleError("Conclua a reorganização do kit antes de abrir outra sala.", 409);
  }

  let roomCode = "";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    roomCode = randomBytes(5).toString("base64url").replace(/[-_]/g, "").slice(0, 6).toUpperCase();
    const { data } = await client.from("game_sessions").select("id").eq("room_code", roomCode).maybeSingle();
    if (!data) break;
  }
  if (roomCode.length !== 6) throw new Error("Não foi possível gerar um código de sala.");

  const { data: session, error } = await client.from("game_sessions").insert({
    license_id: licenseId,
    host_user_id: user.id,
    room_code: roomCode,
    status: "lobby",
    story_version: STORY_VERSION,
    state: initialGameState(),
  }).select("id").single();
  if (error) throw new Error(error.message);
  const { error: playerError } = await client.from("players").insert({
    session_id: session.id,
    auth_user_id: user.id,
    nickname: nickname.trim() || user.user_metadata?.full_name || "Anfitrião",
    is_host: true,
    confirmed: true,
    device_mode: "own",
    last_seen_at: new Date().toISOString(),
  });
  if (playerError) throw new Error(playerError.message);
  return { roomCode, resumed: false };
}

export async function joinRoom(roomCode: string, nickname: string, deviceMode: "own" | "shared") {
  const { session, players } = await getRows(roomCode);
  if (session.status !== "lobby") throw new GameRuleError("Esta sala já iniciou a distribuição de funções.", 409);
  if (players.filter((player) => player.is_active).length >= session.max_players) {
    throw new GameRuleError("A sala está completa.", 409);
  }
  const token = randomBytes(32).toString("base64url");
  const personalCode = deviceMode === "shared" ? String(Math.floor(1000 + Math.random() * 9000)) : null;
  const client = db();
  const { data, error } = await client.from("players").insert({
    session_id: session.id,
    nickname: nickname.trim(),
    guest_token_hash: hashSecret(token),
    personal_code_hash: personalCode ? hashSecret(personalCode) : null,
    personal_code_last4: personalCode,
    device_mode: deviceMode,
    last_seen_at: new Date().toISOString(),
  }).select("id").single();
  if (error) throw new Error(error.message);
  await client.from("game_events").insert({
    session_id: session.id,
    player_id: data.id,
    event_type: "player_joined",
    payload: { deviceMode },
  });
  return { token, playerId: data.id as string, personalCode };
}

export async function getSnapshot(roomCode: string, guestToken?: string): Promise<SessionSnapshot> {
  const { session, players } = await getRows(roomCode);
  const identity = await resolveIdentity(session, players, guestToken);
  const state = { ...initialGameState(), ...(session.state ?? {}) };
  const current = getStep(state.currentStep);
  const selfRoleSlug = roleSlug(identity.player);
  const selfDelegatedRoles = Array.isArray(identity.player.metadata?.delegated_roles)
    ? identity.player.metadata.delegated_roles.filter((value): value is RoleSlug =>
      canonicalRoles.some((role) => role.slug === value))
    : [];
  const selfRole = canonicalRoles.find((role) => role.slug === selfRoleSlug);
  const now = Date.now();
  if (!identity.player.last_seen_at || now - new Date(identity.player.last_seen_at).getTime() > 20_000) {
    identity.player.last_seen_at = new Date(now).toISOString();
    await db().from("players").update({ last_seen_at: identity.player.last_seen_at }).eq("id", identity.player.id);
  }
  const publicPlayers = players.filter((player) => player.is_active).map<PublicPlayer>((player) => {
    const playerRole = roleSlug(player);
    return {
      id: player.id,
      nickname: player.nickname,
      isHost: player.is_host,
      isSelf: player.id === identity.player.id,
      confirmed: player.confirmed,
      ready: player.ready,
      roleRevealed: player.role_revealed,
      roleName: player.role_revealed ? canonicalRoles.find((role) => role.slug === playerRole)?.name : undefined,
      roleSlug: player.id === identity.player.id || session.status !== "role_reveal" ? playerRole : undefined,
      connected: !!player.last_seen_at && now - new Date(player.last_seen_at).getTime() < 45_000,
      deviceMode: player.device_mode,
      avatarGender: player.id === identity.player.id ? player.avatar_gender : undefined,
      delegatedRoleNames: Array.isArray(player.metadata?.delegated_roles)
        ? player.metadata.delegated_roles
          .map((slug) => canonicalRoles.find((role) => role.slug === slug)?.name)
          .filter(Boolean) as string[]
        : [],
    };
  });
  const definition = current.kind === "puzzle"
    ? puzzleDefinitions[current.id as keyof typeof puzzleDefinitions]
    : undefined;
  const hintCount = state.revealedHints[current.id] ?? 0;
  const flags = Object.fromEntries(Object.entries(state.flags).filter(([key]) =>
    !["true_key_identified", "final_vote", "tie_pending"].includes(key) ||
    session.status === "completed" ||
    (key === "tie_pending" && selfRoleSlug === "observador")
  ));
  return {
    sessionId: session.id,
    roomCode: session.room_code,
    status: session.status,
    version: session.version,
    isHost: identity.isHost,
    selfPlayerId: identity.player.id,
    maxPlayers: session.max_players,
    players: publicPlayers,
    dashboard: {
      startedAt: session.started_at,
      entryDeadlineAt: session.entry_deadline_at ?? undefined,
      extractionDeadlineAt: session.extraction_deadline_at ?? undefined,
      alarmDeadlineAt: session.police_eta_known ? session.alarm_deadline_at ?? undefined : undefined,
      connected: publicPlayers.filter((player) => player.connected).length,
      alertLevel: session.alert_level,
      maxAlertLevel: session.max_alert_level,
      score: session.collective_score,
    },
    step: session.status === "completed" ? undefined : {
      id: current.id,
      act: current.act,
      kind: current.kind,
      title: current.title,
      objective: current.objective,
      context: current.context,
      responsibleRole: current.responsibleRole,
      responsibleRoleName: canonicalRoles.find((role) => role.slug === current.responsibleRole)?.name,
      canAct: !current.responsibleRole || current.responsibleRole === selfRoleSlug ||
        selfDelegatedRoles.includes(current.responsibleRole) || identity.isHost,
      envelope: current.envelope,
      options: current.options,
      transmission: publicTransmission(current.transmissionCode),
      voteCount: current.kind === "final_vote" ? Object.keys(state.finalVotes).length : undefined,
      playerCount: publicPlayers.length,
      runoffOptions: state.runoffOptions,
    },
    selfRole: identity.player.role_revealed && selfRole &&
      !(identity.player.device_mode === "shared" && identity.player.ready) ? { ...selfRole } : undefined,
    state: {
      route: state.route,
      routeVotes: state.routeVotes,
      inventory: inventoryCatalog.filter((item) => state.inventory.includes(item.id)),
      consumedItems: state.consumedItems,
      unlockedEnvelopes: state.unlockedEnvelopes,
      openedEnvelopes: state.openedEnvelopes,
      unlockedFiles: state.unlockedFiles,
      completedTransmissions: state.completedTransmissions,
      locations: state.locations,
      knownGraph: routeGraph,
      puzzleAttempts: state.puzzleAttempts[current.id],
      hints: definition ? [...definition.hints].slice(0, hintCount) : [],
      finalVoteCast: !!state.finalVotes[identity.player.id],
      ending: state.ending ? endingCatalog.find((ending) => ending.slug === state.ending) : undefined,
      messages: state.completedTransmissions
        .map((code) => publicTransmission(code))
        .filter((item): item is PublicTransmission => !!item),
      epilogue: state.ending
        ? publicTransmission(endingMediaCodes[state.ending as keyof typeof endingMediaCodes])
        : undefined,
      extractionExit: state.extractionExit,
      flags,
    },
  };
}

export async function executeCommand(
  roomCode: string,
  guestToken: string | undefined,
  command: GameCommand,
  idempotencyKey: string,
) {
  const { session, players } = await getRows(roomCode);
  const identity = await resolveIdentity(session, players, guestToken);
  if (command.type === "reveal_role" && identity.player.device_mode === "shared") {
    if (!command.personalCode || hashSecret(command.personalCode) !== identity.player.personal_code_hash) {
      throw new GameRuleError("Código pessoal incorreto.", 403);
    }
  }
  const client = db();
  const { data: receipt } = await client.from("session_action_receipts")
    .select("response")
    .eq("session_id", session.id)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (receipt) return receipt.response as { ok: boolean };

  const result = runCommand(toRuntimeSession(session, players), identity.player.id, command);
  const { data: claimed, error: claimError } = await client.rpc("claim_session_version", {
    target_session: session.id,
    expected_version: session.version,
    next_status: result.session.status,
    next_state: result.session.state,
    next_act: getStep(result.session.state.currentStep).act,
    next_alert: result.session.state.alertLevel,
    next_score: result.session.state.score,
    next_route: result.session.state.route ?? null,
  });
  if (claimError) throw new Error(claimError.message);
  if (!claimed) throw new GameRuleError("A sala mudou em outro aparelho. Atualize e tente novamente.", 409);

  const sessionPatch: Record<string, unknown> = {
    started_at: result.session.startedAt,
    paused_at: result.session.pausedAt,
    alarm_deadline_at: result.session.alarmDeadlineAt,
    entry_deadline_at: result.session.entryDeadlineAt,
    extraction_deadline_at: result.session.extractionDeadlineAt,
    police_eta_known: result.session.state.policeEtaKnown,
  };
  await client.from("game_sessions").update(sessionPatch).eq("id", session.id);

  for (const [playerId, update] of Object.entries(result.playerUpdates ?? {})) {
    const source = players.find((player) => player.id === playerId);
    const metadata = { ...(source?.metadata ?? {}) };
    if (update.roleSlug) metadata.role_slug = update.roleSlug;
    if (update.delegatedRoles) metadata.delegated_roles = update.delegatedRoles;
    await client.from("players").update({
      confirmed: update.confirmed,
      ready: update.ready,
      role_revealed: update.roleRevealed,
      is_active: update.isActive,
      metadata,
      last_seen_at: new Date().toISOString(),
    }).eq("id", playerId).eq("session_id", session.id);
  }
  if (command.type === "reveal_role") {
    await client.from("players").update({ avatar_gender: command.avatarGender }).eq("id", identity.player.id);
  }
  await client.from("players").update({ last_seen_at: new Date().toISOString() }).eq("id", identity.player.id);
  await client.from("game_events").insert({
    session_id: session.id,
    player_id: identity.player.id,
    event_type: result.event.type,
    payload: result.event.payload ?? {},
    idempotency_key: idempotencyKey,
  });
  const response = { ok: true };
  await client.from("session_action_receipts").insert({
    session_id: session.id,
    player_id: identity.player.id,
    idempotency_key: idempotencyKey,
    command: command.type,
    response,
  });
  const channel = client.channel(`session:${session.id}`);
  await channel.send({
    type: "broadcast",
    event: "state_changed",
    payload: { version: session.version + 1 },
  });
  await client.removeChannel(channel);
  return response;
}

export async function listLibrary() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) throw new GameRuleError("Entre para abrir sua biblioteca.", 401);
  const client = db();
  const { data: licenses, error } = await client
    .from("licenses")
    .select("id,code_last4,status,story_id,stories(slug,title,cover_path)")
    .eq("owner_user_id", user.id)
    .eq("status", "active");
  if (error) throw new Error(error.message);
  const result = [];
  for (const license of licenses ?? []) {
    const { data: session } = await client.from("game_sessions")
      .select("room_code,status,completed_at,state,kit_restored")
      .eq("license_id", license.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    result.push({ ...license, latestSession: session });
  }
  return result;
}

export async function restoreKit(roomCode: string, guestToken: string | undefined, confirmed: boolean) {
  if (!confirmed) throw new GameRuleError("Confirme que todos os materiais voltaram aos envelopes.");
  const { session, players } = await getRows(roomCode);
  const identity = await resolveIdentity(session, players, guestToken);
  if (!identity.isHost || session.status !== "completed") throw new GameRuleError("Somente o anfitrião pode liberar o kit concluído.", 403);
  const client = db();
  const { error } = await client.from("game_sessions").update({ kit_restored: true }).eq("id", session.id);
  if (error) throw new Error(error.message);
  await client.from("game_events").insert({
    session_id: session.id,
    player_id: identity.player.id,
    event_type: "kit_restored",
    payload: {},
  });
}

export async function getRoomMedia(roomCode: string, guestToken: string | undefined, code: string) {
  const { session, players } = await getRows(roomCode);
  await resolveIdentity(session, players, guestToken);
  const state = { ...initialGameState(), ...(session.state ?? {}) };
  const current = getStep(state.currentStep);
  const endingCode = state.ending ? endingMediaCodes[state.ending as keyof typeof endingMediaCodes] : undefined;
  const allowed = current.transmissionCode === code || state.completedTransmissions.includes(code) || endingCode === code;
  if (!allowed) throw new GameRuleError("Esta transmissão ainda não foi liberada.", 403);
  const client = db();
  const { data: asset, error } = await client.from("media_assets")
    .select("storage_path,portrait_path,transcript,duration_seconds,status,production_state")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!asset?.storage_path || !["uploaded", "approved"].includes(asset.production_state ?? "")) {
    return { audioUrl: null, durationSeconds: asset?.duration_seconds ?? null, status: "not_recorded" };
  }
  const { data: signed, error: signedError } = await client.storage
    .from("game-media")
    .createSignedUrl(asset.storage_path, 300);
  if (signedError) throw new Error(signedError.message);
  return {
    audioUrl: signed.signedUrl,
    durationSeconds: asset.duration_seconds ?? null,
    status: asset.production_state,
  };
}

export async function recordTransmissionReplay(roomCode: string, guestToken: string | undefined, code: string) {
  const { session, players } = await getRows(roomCode);
  const identity = await resolveIdentity(session, players, guestToken);
  const state = { ...initialGameState(), ...(session.state ?? {}) };
  const endingCode = state.ending ? endingMediaCodes[state.ending as keyof typeof endingMediaCodes] : undefined;
  if (!state.completedTransmissions.includes(code) && endingCode !== code) {
    throw new GameRuleError("A transmissão ainda não faz parte do histórico.", 403);
  }
  const client = db();
  await client.from("game_events").insert({
    session_id: session.id,
    player_id: identity.player.id,
    event_type: "transmission_replayed",
    payload: { code },
  });
}

export { GameRuleError, STORY_SLUG };
