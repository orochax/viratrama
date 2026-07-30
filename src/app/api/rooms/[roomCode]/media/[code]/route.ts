import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRoomMedia, recordTransmissionReplay, roomCookieName, GameRuleError } from "@/lib/game/session-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ roomCode: string; code: string }> },
) {
  const { roomCode, code } = await context.params;
  try {
    const jar = await cookies();
    const media = await getRoomMedia(roomCode, jar.get(roomCookieName(roomCode))?.value, code);
    return NextResponse.json(media, { headers: { "Cache-Control": "private, max-age=30" } });
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mídia indisponível." }, { status });
  }
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ roomCode: string; code: string }> },
) {
  const { roomCode, code } = await context.params;
  try {
    const jar = await cookies();
    await recordTransmissionReplay(roomCode, jar.get(roomCookieName(roomCode))?.value, code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Replay indisponível." }, { status });
  }
}
