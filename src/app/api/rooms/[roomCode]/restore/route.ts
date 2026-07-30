import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { restoreKit, roomCookieName, GameRuleError } from "@/lib/game/session-service";

export async function POST(request: Request, context: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = await context.params;
  try {
    const body = await request.json();
    const jar = await cookies();
    await restoreKit(roomCode, jar.get(roomCookieName(roomCode))?.value, body.confirmed === true);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível liberar o kit." }, { status });
  }
}
