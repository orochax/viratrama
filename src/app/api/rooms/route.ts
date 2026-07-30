import { NextResponse } from "next/server";
import { z } from "zod";
import { createRoom, GameRuleError } from "@/lib/game/session-service";

const schema = z.object({
  licenseId: z.string().uuid(),
  nickname: z.string().trim().min(2).max(40),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Dados da sala inválidos." }, { status: 400 });
    return NextResponse.json(await createRoom(parsed.data.licenseId, parsed.data.nickname), { status: 201 });
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível criar a sala." }, { status });
  }
}
