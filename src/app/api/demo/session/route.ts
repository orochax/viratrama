import { NextResponse } from "next/server";
import { roomCodeSchema } from "@/lib/validation/codes";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  const code = new URL(request.url).searchParams.get("room") ?? "";
  const parsed = roomCodeSchema.safeParse(code);
  if (!parsed.success) return NextResponse.json({ error: "Código de sala inválido" }, { status: 400 });
  return NextResponse.json({ roomCode: parsed.data, status: "lobby", story: "operacao-da-meia-noite", players: 1, maxPlayers: 6, alertLevel: 0 });
}
