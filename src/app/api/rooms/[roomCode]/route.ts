import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSnapshot, roomCookieName, GameRuleError } from "@/lib/game/session-service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = await context.params;
  try {
    const jar = await cookies();
    const snapshot = await getSnapshot(roomCode, jar.get(roomCookieName(roomCode))?.value);
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível carregar a sala." }, { status });
  }
}
