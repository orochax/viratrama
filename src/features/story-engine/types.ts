import type { FinalVote, RoleSlug, RouteSlug } from "../../content/operation-midnight/canonical";
import type { Condition, Flags } from "./rules";

export type Effect = {
  type: "set_flag" | "increment_alert" | "unlock_envelope" | "add_item" |
    "consume_item" | "start_timer" | "stop_timer" | "award_score" |
    "send_message" | "branch_to" | "finish_session";
  key?: string;
  value?: string | number | boolean;
};
export type StoryStep = {
  id: string;
  title: string;
  type: "briefing" | "puzzle" | "decision" | "media" | "instruction" | "ending";
  content: string;
  conditions?: Condition[];
  effects?: Effect[];
  next?: string;
};
export type GameState = {
  flags: Flags;
  alertLevel: number;
  maxAlertLevel: number;
  score: number;
  inventory: string[];
  consumedItems: string[];
  unlockedEnvelopes: string[];
  openedEnvelopes: string[];
  unlockedFiles: string[];
  currentStep: string;
  narrativeMinutes: number;
  route?: RouteSlug;
  routeVotes: Record<string, RouteSlug>;
  finalVotes: Record<string, FinalVote>;
  runoffOptions?: FinalVote[];
  locations: Record<string, string>;
  puzzleAttempts: Record<string, number>;
  revealedHints: Record<string, number>;
  hintRequestedAt: Record<string, string>;
  completedTransmissions: string[];
  responsibleRole?: RoleSlug;
  policeEtaKnown: boolean;
  extracted: boolean;
  extractionExit?: string;
  ending?: string;
};

export function initialGameState(): GameState {
  return {
    flags: {},
    alertLevel: 0,
    maxAlertLevel: 0,
    score: 100,
    inventory: [],
    consumedItems: [],
    unlockedEnvelopes: ["00"],
    openedEnvelopes: [],
    unlockedFiles: [],
    currentStep: "orion-abertura",
    narrativeMinutes: 0,
    routeVotes: {},
    finalVotes: {},
    locations: {},
    puzzleAttempts: {},
    revealedHints: {},
    hintRequestedAt: {},
    completedTransmissions: [],
    policeEtaKnown: false,
    extracted: false,
  };
}
