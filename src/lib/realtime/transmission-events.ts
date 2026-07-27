export const transmissionEventTypes = [
  "transmission_ready", "transmission_started", "transmission_paused", "transmission_resumed",
  "transmission_progress", "transmission_completed", "transmission_replayed", "transmission_failed",
  "transcript_opened", "transcript_confirmed", "narrative_step_unlocked",
] as const;

export type TransmissionEventType = (typeof transmissionEventTypes)[number];

export type TransmissionEvent = {
  type: TransmissionEventType;
  sessionId?: string;
  mediaCode: string;
  playerId?: string;
  positionSeconds?: number;
  timestamp: number;
  payload?: Record<string, unknown>;
};

export function transmissionIdempotencyKey(sessionId: string, mediaCode: string, type: TransmissionEventType, actor = "host") {
  return `${sessionId}:${mediaCode}:${type}:${actor}`;
}
