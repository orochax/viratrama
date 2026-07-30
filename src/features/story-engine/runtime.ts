import {
  canonicalRoles,
  getStep,
  nextStepId,
  puzzleDefinitions,
  routeStarts,
  type FinalVote,
  type RoleSlug,
  type RouteSlug,
} from "../../content/operation-midnight/canonical";
import { isAdjacent, selectEnding, tallyVotes } from "./engine";
import { initialGameState, type GameState } from "./types";

export type SessionStatus = "draft" | "lobby" | "role_assignment" | "role_reveal" |
  "prologue" | "active" | "paused" | "final_decision" | "completed" | "abandoned";

export type RuntimePlayer = {
  id: string;
  nickname: string;
  isHost: boolean;
  confirmed: boolean;
  ready: boolean;
  roleRevealed: boolean;
  roleSlug?: RoleSlug;
  delegatedRoles?: RoleSlug[];
  isActive: boolean;
  deviceMode: "own" | "shared" | "none";
};

export type RuntimeSession = {
  status: SessionStatus;
  state: GameState;
  players: RuntimePlayer[];
  startedAt: string | null;
  pausedAt: string | null;
  alarmDeadlineAt: string | null;
  entryDeadlineAt: string | null;
  extractionDeadlineAt: string | null;
};

export type GameCommand =
  | { type: "confirm_player" }
  | { type: "assign_roles"; mode: "automatic"; assignments?: never }
  | { type: "assign_roles"; mode: "manual"; assignments: Record<string, RoleSlug> }
  | { type: "reveal_role"; avatarGender: "masculino" | "feminino"; personalCode?: string }
  | { type: "ready" }
  | { type: "start_game" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "complete_step" }
  | { type: "select_loadout"; itemIds: string[] }
  | { type: "route_vote"; route: RouteSlug }
  | { type: "choose"; optionId: string }
  | { type: "puzzle"; answer: string }
  | { type: "hint" }
  | { type: "consume_item"; itemId: string }
  | { type: "delegate_role"; fromPlayerId: string; toPlayerId: string }
  | { type: "remove_player"; playerId: string }
  | { type: "move"; markerCode: string; to: string }
  | { type: "final_vote"; option: FinalVote }
  | { type: "break_tie"; option: FinalVote }
  | { type: "extract"; exit: "portao-principal" | "garagem" | "jardins"; selectedTrueKey: boolean };

export type RuntimeResult = {
  session: RuntimeSession;
  playerUpdates?: Record<string, Partial<RuntimePlayer>>;
  event: { type: string; payload?: Record<string, unknown> };
};

export class GameRuleError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function activePlayers(session: RuntimeSession) {
  return session.players.filter((player) => player.isActive);
}

function requireHost(player: RuntimePlayer) {
  if (!player.isHost) throw new GameRuleError("Somente o anfitrião pode executar esta ação.", 403);
}

function requireRole(player: RuntimePlayer, role?: RoleSlug) {
  if (role && player.roleSlug !== role && !player.delegatedRoles?.includes(role) && !player.isHost) {
    const roleName = canonicalRoles.find((item) => item.slug === role)?.name ?? role;
    throw new GameRuleError(`Aguardando ${roleName}.`, 403);
  }
}

function advance(session: RuntimeSession) {
  const current = getStep(session.state.currentStep);
  const nextId = nextStepId(current.id);
  if (!nextId) return;
  const next = getStep(nextId);
  session.state.currentStep = next.id;
  session.state.responsibleRole = next.responsibleRole;
  if (next.envelope && !session.state.unlockedEnvelopes.includes(next.envelope)) {
    session.state.unlockedEnvelopes.push(next.envelope);
  }
  if (next.kind === "final_vote") session.status = "final_decision";
  else if (session.status === "prologue") session.status = "active";
}

function assignAutomatic(players: RuntimePlayer[]) {
  const required: RoleSlug[] = players.length === 3
    ? ["infiltrador", "tecnica", "observador"]
    : players.length === 4
      ? ["infiltrador", "tecnica", "observador", "negociadora"]
      : players.length === 5
        ? ["infiltrador", "tecnica", "observador", "negociadora", "motorista"]
        : canonicalRoles.map((role) => role.slug);
  return Object.fromEntries(players.map((player, index) => [player.id, required[index]]));
}

function validateAssignments(players: RuntimePlayer[], assignments: Record<string, RoleSlug>) {
  const values = players.map((player) => assignments[player.id]);
  if (values.some((role) => !role)) throw new GameRuleError("Todos os jogadores precisam receber uma função.");
  if (new Set(values).size !== values.length) throw new GameRuleError("Uma função não pode ser atribuída duas vezes.");
  const valid = new Set(canonicalRoles.map((role) => role.slug));
  if (values.some((role) => !valid.has(role))) throw new GameRuleError("A distribuição contém uma função inválida.");
}

function normalizeAnswer(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}

export function runCommand(
  source: RuntimeSession,
  actorId: string,
  command: GameCommand,
  now = new Date(),
): RuntimeResult {
  const session = structuredClone(source);
  session.state = { ...initialGameState(), ...session.state };
  const player = session.players.find((item) => item.id === actorId && item.isActive);
  if (!player) throw new GameRuleError("Jogador não pertence a esta sala.", 403);
  const step = getStep(session.state.currentStep);

  if (command.type === "confirm_player") {
    player.confirmed = true;
    return { session, playerUpdates: { [player.id]: { confirmed: true } }, event: { type: "player_confirmed" } };
  }
  if (command.type === "remove_player") {
    requireHost(player);
    const target = session.players.find((item) => item.id === command.playerId);
    if (!target || target.isHost) throw new GameRuleError("Esse jogador não pode ser removido.");
    target.isActive = false;
    return { session, playerUpdates: { [target.id]: { isActive: false } }, event: { type: "player_removed", payload: { playerId: target.id } } };
  }
  if (command.type === "delegate_role") {
    requireHost(player);
    const sourcePlayer = session.players.find((item) => item.id === command.fromPlayerId && item.isActive);
    const target = session.players.find((item) => item.id === command.toPlayerId && item.isActive);
    if (!sourcePlayer?.roleSlug || !target || sourcePlayer.id === target.id) throw new GameRuleError("Delegação inválida.");
    target.delegatedRoles = [...new Set([...(target.delegatedRoles ?? []), sourcePlayer.roleSlug])];
    return {
      session,
      playerUpdates: { [target.id]: { delegatedRoles: target.delegatedRoles } },
      event: { type: "role_delegated", payload: { fromPlayerId: sourcePlayer.id, toPlayerId: target.id, role: sourcePlayer.roleSlug } },
    };
  }
  if (command.type === "assign_roles") {
    requireHost(player);
    const players = activePlayers(session);
    if (players.length < 3 || players.length > 6 || players.some((item) => !item.confirmed)) {
      throw new GameRuleError("Confirme de 3 a 6 jogadores antes de distribuir as funções.");
    }
    const assignments = command.mode === "automatic" ? assignAutomatic(players) : command.assignments;
    validateAssignments(players, assignments);
    const updates: Record<string, Partial<RuntimePlayer>> = {};
    players.forEach((item) => {
      item.roleSlug = assignments[item.id];
      item.ready = false;
      item.roleRevealed = false;
      updates[item.id] = { roleSlug: assignments[item.id], ready: false, roleRevealed: false };
    });
    session.status = "role_reveal";
    return { session, playerUpdates: updates, event: { type: "roles_assigned" } };
  }
  if (command.type === "reveal_role") {
    if (session.status !== "role_reveal" || !player.roleSlug) throw new GameRuleError("A função ainda não está disponível.");
    player.roleRevealed = true;
    return {
      session,
      playerUpdates: { [player.id]: { roleRevealed: true } },
      event: { type: "role_revealed", payload: { avatarGender: command.avatarGender } },
    };
  }
  if (command.type === "ready") {
    if (!player.roleRevealed) throw new GameRuleError("Revele sua função antes de confirmar.");
    player.ready = true;
    return { session, playerUpdates: { [player.id]: { ready: true } }, event: { type: "player_ready" } };
  }
  if (command.type === "start_game") {
    requireHost(player);
    if (session.status !== "role_reveal" || activePlayers(session).some((item) => !item.ready)) {
      throw new GameRuleError("Todos precisam revelar a função e confirmar que estão prontos.");
    }
    session.status = "prologue";
    session.startedAt = now.toISOString();
    session.entryDeadlineAt = new Date(now.getTime() + 15 * 60_000).toISOString();
    session.state = initialGameState();
    return { session, event: { type: "session_started" } };
  }
  if (command.type === "pause" || command.type === "resume") {
    requireHost(player);
    if (command.type === "pause") {
      if (!["active", "prologue", "final_decision"].includes(session.status)) throw new GameRuleError("A sessão não pode ser pausada agora.");
      session.status = "paused";
      session.pausedAt = now.toISOString();
    } else {
      if (session.status !== "paused") throw new GameRuleError("A sessão não está pausada.");
      session.status = step.kind === "final_vote" ? "final_decision" : step.act === 1 ? "prologue" : "active";
      session.pausedAt = null;
    }
    return { session, event: { type: command.type === "pause" ? "session_paused" : "session_resumed" } };
  }
  if (session.status === "paused") throw new GameRuleError("Retome a sessão antes de continuar.", 409);

  if (command.type === "complete_step") {
    requireHost(player);
    if (!["transmission", "instruction"].includes(step.kind)) throw new GameRuleError("Esta etapa exige outra ação.");
    if (step.transmissionCode && !session.state.completedTransmissions.includes(step.transmissionCode)) {
      session.state.completedTransmissions.push(step.transmissionCode);
    }
    if (step.id === "abrir-envelope-00" && !session.state.openedEnvelopes.includes("00")) {
      session.state.openedEnvelopes.push("00");
    }
    if (step.id === "alarme") {
      session.state.policeEtaKnown = true;
      session.alarmDeadlineAt = new Date(now.getTime() + 12 * 60_000).toISOString();
      session.extractionDeadlineAt = session.alarmDeadlineAt;
    }
    advance(session);
    return { session, event: { type: "step_completed", payload: { stepId: step.id } } };
  }
  if (command.type === "select_loadout") {
    requireRole(player, "motorista");
    if (step.kind !== "loadout") throw new GameRuleError("O inventário não está em seleção.");
    if (command.itemIds.length !== 4 || new Set(command.itemIds).size !== 4) {
      throw new GameRuleError("Escolha exatamente quatro itens diferentes.");
    }
    session.state.inventory = command.itemIds;
    advance(session);
    return { session, event: { type: "loadout_selected", payload: { itemIds: command.itemIds } } };
  }
  if (command.type === "route_vote") {
    if (step.kind !== "route_vote") throw new GameRuleError("A votação de rota não está aberta.");
    session.state.routeVotes[player.id] = command.route;
    if (Object.keys(session.state.routeVotes).length >= activePlayers(session).length) advance(session);
    return { session, event: { type: "route_vote_cast" } };
  }
  if (command.type === "choose") {
    requireRole(player, step.responsibleRole);
    if (step.kind !== "decision" || !step.options?.some((option) => option.id === command.optionId)) {
      throw new GameRuleError("Esta opção não está disponível.");
    }
    if (step.id === "confirmar-rota") {
      session.state.route = command.optionId as RouteSlug;
      const start = routeStarts[session.state.route];
      activePlayers(session).forEach((item) => { session.state.locations[item.id] = start; });
    }
    if (step.id === "contato-helena") {
      session.state.flags.helena_response = command.optionId;
      if (command.optionId === "pressionar") session.state.alertLevel = Math.min(5, session.state.alertLevel + 1);
      if (command.optionId === "cooperar") session.state.flags.helena_truth = true;
    }
    session.state.maxAlertLevel = Math.max(session.state.maxAlertLevel, session.state.alertLevel);
    advance(session);
    return { session, event: { type: "decision_confirmed", payload: { stepId: step.id, optionId: command.optionId } } };
  }
  if (command.type === "puzzle") {
    requireRole(player, step.responsibleRole);
    if (step.kind !== "puzzle" || !(step.id in puzzleDefinitions)) throw new GameRuleError("Não há puzzle ativo.");
    const definition = puzzleDefinitions[step.id as keyof typeof puzzleDefinitions];
    const attempts = (session.state.puzzleAttempts[step.id] ?? 0) + 1;
    session.state.puzzleAttempts[step.id] = attempts;
    if (normalizeAnswer(command.answer) !== definition.answer) {
      session.state.score = Math.max(0, session.state.score - 2);
      if (attempts >= definition.maxAttempts) session.state.alertLevel = Math.min(5, session.state.alertLevel + 1);
      session.state.maxAlertLevel = Math.max(session.state.maxAlertLevel, session.state.alertLevel);
      return { session, event: { type: "puzzle_attempted", payload: { stepId: step.id, correct: false } } };
    }
    session.state.flags[`${step.id}_solved`] = true;
    if (step.id === "janus") session.state.flags.orion_past_discovered = true;
    if (step.id === "sistema-atlas") session.state.flags.true_key_identified = true;
    session.state.score += 10;
    advance(session);
    return { session, event: { type: "puzzle_solved", payload: { stepId: step.id } } };
  }
  if (command.type === "hint") {
    if (step.kind !== "puzzle" || !(step.id in puzzleDefinitions)) throw new GameRuleError("Não há pistas para a etapa atual.");
    const definition = puzzleDefinitions[step.id as keyof typeof puzzleDefinitions];
    const current = session.state.revealedHints[step.id] ?? 0;
    if (current >= definition.hints.length) throw new GameRuleError("Todas as pistas já foram reveladas.");
    const previous = session.state.hintRequestedAt[step.id];
    const cooldown = [30, 45, 60][current] * 1000;
    if (previous && now.getTime() - new Date(previous).getTime() < cooldown) {
      throw new GameRuleError("A próxima pista ainda está em resfriamento.", 409);
    }
    session.state.revealedHints[step.id] = current + 1;
    session.state.hintRequestedAt[step.id] = now.toISOString();
    session.state.score = Math.max(0, session.state.score - (current + 1) * 3);
    return { session, event: { type: "hint_revealed", payload: { stepId: step.id, level: current + 1 } } };
  }
  if (command.type === "consume_item") {
    requireRole(player, "motorista");
    if (!session.state.inventory.includes(command.itemId)) throw new GameRuleError("O item não está no inventário.");
    if (session.state.consumedItems.includes(command.itemId)) throw new GameRuleError("O item já foi consumido.", 409);
    session.state.consumedItems.push(command.itemId);
    return { session, event: { type: "inventory_item_consumed", payload: { itemId: command.itemId } } };
  }
  if (command.type === "move") {
    requireRole(player, "infiltrador");
    if (step.kind !== "movement") throw new GameRuleError("Nenhum movimento está aguardando confirmação.");
    const from = session.state.locations[command.markerCode];
    if (!from || !isAdjacent(from, command.to)) throw new GameRuleError("Esse movimento não existe no grafo conhecido.");
    session.state.locations[command.markerCode] = command.to;
    const target = step.id === "entrada-mansao"
      ? session.state.route === "social" ? "salao-mascaras" : session.state.route === "servico" ? "adega" : "tunel-tecnico"
      : step.id === "avancar-biblioteca" ? "biblioteca" : "camara-atlas";
    if (activePlayers(session).every((item) => session.state.locations[item.id] === target)) advance(session);
    return { session, event: { type: "marker_moved", payload: { markerCode: command.markerCode, from, to: command.to } } };
  }
  if (command.type === "final_vote") {
    if (step.kind !== "final_vote") throw new GameRuleError("A votação final não está aberta.");
    const allowed = session.state.runoffOptions;
    if (allowed && !allowed.includes(command.option)) throw new GameRuleError("A opção não pertence ao segundo turno.");
    if (session.state.finalVotes[player.id]) throw new GameRuleError("Seu voto já foi selado.", 409);
    session.state.finalVotes[player.id] = command.option;
    if (Object.keys(session.state.finalVotes).length >= activePlayers(session).length) {
      const tally = tallyVotes(session.state.finalVotes, allowed);
      if (tally.winner) {
        session.state.flags.final_vote = tally.winner;
        advance(session);
        session.status = "active";
      } else if (!allowed) {
        session.state.runoffOptions = tally.leaders;
        session.state.finalVotes = {};
      } else {
        session.state.flags.tie_pending = true;
      }
    }
    return { session, event: { type: "final_vote_cast", payload: { sealed: true } } };
  }
  if (command.type === "break_tie") {
    requireRole(player, "observador");
    if (!session.state.flags.tie_pending || !session.state.runoffOptions?.includes(command.option)) {
      throw new GameRuleError("Não há empate aguardando desempate.");
    }
    session.state.flags.final_vote = command.option;
    session.state.flags.tie_pending = false;
    advance(session);
    session.status = "active";
    return { session, event: { type: "tie_broken" } };
  }
  if (command.type === "extract") {
    requireRole(player, "motorista");
    if (step.kind !== "extraction") throw new GameRuleError("A extração ainda não está disponível.");
    const finalVote = session.state.flags.final_vote as FinalVote | undefined;
    if (!finalVote) throw new GameRuleError("A votação final ainda não foi concluída.");
    session.state.extracted = true;
    session.state.extractionExit = command.exit;
    const ending = selectEnding({
      vote: finalVote,
      trueKeyIdentified: session.state.flags.true_key_identified === true,
      selectedTrueKey: command.selectedTrueKey,
      extracted: true,
      policeExpired: !!session.alarmDeadlineAt && new Date(session.alarmDeadlineAt) <= now,
    });
    session.state.ending = ending.slug;
    session.status = "completed";
    return { session, event: { type: "session_completed", payload: { ending: ending.slug } } };
  }
  throw new GameRuleError("Comando não permitido nesta etapa.");
}
