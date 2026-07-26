import type { GameState } from "@/features/story-engine/types";
export const sessionStates = ["draft","lobby","role_assignment","role_reveal","prologue","active","paused","final_decision","completed","abandoned"] as const;
export type SessionState = typeof sessionStates[number];
const allowed: Record<SessionState, SessionState[]> = { draft:["lobby","abandoned"], lobby:["role_assignment","abandoned"], role_assignment:["role_reveal","abandoned"], role_reveal:["prologue","abandoned"], prologue:["active","paused","abandoned"], active:["paused","final_decision","abandoned"], paused:["active","abandoned"], final_decision:["completed","abandoned"], completed:[], abandoned:[] };
export function canTransition(from: SessionState, to: SessionState) { return allowed[from].includes(to); }
export function transitionSession(state: GameState & { sessionStatus: SessionState }, to: SessionState) { if (!canTransition(state.sessionStatus,to)) throw new Error(`Transição inválida: ${state.sessionStatus} → ${to}`); return {...state,sessionStatus:to}; }
