import type { Condition, Flags } from "./rules";
export type Effect = { type: "set_flag"|"increment_alert"|"unlock_envelope"|"add_item"|"consume_item"|"start_timer"|"stop_timer"|"award_score"|"send_message"|"branch_to"|"finish_session"; key?: string; value?: string|number|boolean };
export type StoryStep = { id: string; title: string; type: "briefing"|"puzzle"|"decision"|"media"|"instruction"|"ending"; content: string; conditions?: Condition[]; effects?: Effect[]; next?: string };
export type GameState = { flags: Flags; alertLevel: number; score: number; inventory: string[]; unlockedEnvelopes: string[]; currentStep: string; narrativeMinutes: number; policeDeadline?: number };
