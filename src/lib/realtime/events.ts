export const realtimeChannels = { state: "session-state", presence: "session-presence", alerts: "session-alerts" } as const;
export type CriticalEvent = "step_advanced"|"vote_submitted"|"puzzle_attempted"|"envelope_opened"|"alarm_triggered"|"timer_expired"|"session_paused"|"session_resumed"|"session_finished";
