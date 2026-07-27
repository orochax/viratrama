import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transmissionIdempotencyKey, transmissionEventTypes, type TransmissionEventType } from "@/lib/realtime/transmission-events";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const body = await request.json().catch(() => null) as { mediaAssetId?: string; mediaCode?: string; playerId?: string; type?: TransmissionEventType; positionSeconds?: number; actor?: string; payload?: Record<string, unknown> } | null;
  if (!body?.mediaAssetId || !body.mediaCode || !body.type || !transmissionEventTypes.includes(body.type)) return NextResponse.json({ error: "Evento de transmissão inválido" }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const key = transmissionIdempotencyKey(sessionId, body.mediaCode, body.type, body.actor ?? user.id);
  const events = supabase.from("media_transmission_events") as unknown as { insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }> };
  const { error } = await events.insert({ session_id: sessionId, media_asset_id: body.mediaAssetId, player_id: body.playerId ?? null, event_type: body.type, idempotency_key: key, position_seconds: body.positionSeconds ?? null, payload: body.payload ?? {} });
  if (error && !error.message.toLowerCase().includes("duplicate")) return NextResponse.json({ error: "Não foi possível registrar a transmissão" }, { status: 500 });
  return NextResponse.json({ ok: true, idempotencyKey: key });
}
