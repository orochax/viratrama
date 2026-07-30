import { endingCatalog, routeGraph, type FinalVote } from "../../content/operation-midnight/canonical";
import type { Effect, GameState, StoryStep } from "./types";
import { meetsCondition } from "./rules";

export function canEnter(state: GameState, step: StoryStep) {
  return (step.conditions ?? []).every((condition) => meetsCondition(state.flags, condition));
}

export function applyEffects(state: GameState, effects: Effect[]): GameState {
  const next = structuredClone(state);
  for (const effect of effects) {
    if (effect.type === "set_flag" && effect.key) next.flags[effect.key] = effect.value ?? true;
    if (effect.type === "increment_alert") {
      next.alertLevel = Math.min(5, next.alertLevel + Number(effect.value ?? 1));
      next.maxAlertLevel = Math.max(next.maxAlertLevel, next.alertLevel);
    }
    if (effect.type === "add_item" && effect.key && !next.inventory.includes(effect.key)) {
      next.inventory.push(effect.key);
    }
    if (effect.type === "consume_item" && effect.key && !next.consumedItems.includes(effect.key)) {
      next.inventory = next.inventory.filter((item) => item !== effect.key);
      next.consumedItems.push(effect.key);
    }
    if (effect.type === "unlock_envelope" && effect.key && !next.unlockedEnvelopes.includes(effect.key)) {
      next.unlockedEnvelopes.push(effect.key);
    }
    if (effect.type === "award_score") next.score += Number(effect.value ?? 0);
    if (effect.type === "branch_to" && typeof effect.value === "string") next.currentStep = effect.value;
  }
  return next;
}

export function isAdjacent(from: string, to: string) {
  return routeGraph[from]?.includes(to) ?? false;
}

export function tallyVotes<T extends string>(votes: Record<string, T>, allowed?: readonly T[]) {
  const counts = Object.values(votes).reduce<Record<string, number>>((result, vote) => {
    if (!allowed || allowed.includes(vote)) result[vote] = (result[vote] ?? 0) + 1;
    return result;
  }, {});
  const highest = Math.max(0, ...Object.values(counts));
  const leaders = Object.entries(counts)
    .filter(([, count]) => count === highest)
    .map(([option]) => option as T);
  return { counts, leaders, winner: leaders.length === 1 ? leaders[0] : null };
}

export function selectEnding(input: {
  vote: FinalVote;
  trueKeyIdentified: boolean;
  selectedTrueKey: boolean;
  extracted: boolean;
  policeExpired: boolean;
}) {
  if (!input.extracted || input.policeExpired) {
    return endingCatalog.find((ending) => ending.slug === "doze-minutos")!;
  }
  if (!input.trueKeyIdentified || !input.selectedTrueKey) {
    return endingCatalog.find((ending) => ending.slug === "chave-errada")!;
  }
  const slugByVote: Record<FinalVote, string> = {
    manter: "novo-atlas",
    divulgar: "transparencia-brutal",
    destruir: "cinzas",
    voss: "acordo-voss",
    orion: "donos-segredo",
  };
  return endingCatalog.find((ending) => ending.slug === slugByVote[input.vote])!;
}
