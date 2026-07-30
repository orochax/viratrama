import { NextResponse } from "next/server";
import { z } from "zod";
import { joinRoom, roomCookieName, GameRuleError } from "@/lib/game/session-service";

const schema = z.object({
  roomCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6}$/),
  nickname: z.string().trim().min(2).max(40),
  deviceMode: z.enum(["own", "shared"]),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Confira o código e o apelido." }, { status: 400 });
    const joined = await joinRoom(parsed.data.roomCode, parsed.data.nickname, parsed.data.deviceMode);
    const response = NextResponse.json({
      roomCode: parsed.data.roomCode,
      playerId: joined.playerId,
      personalCode: joined.personalCode,
    }, { status: 201 });
    response.cookies.set(roomCookieName(parsed.data.roomCode), joined.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/`,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível entrar." }, { status });
  }
}
