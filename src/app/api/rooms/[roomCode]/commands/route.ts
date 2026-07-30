import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { executeCommand, roomCookieName, GameRuleError } from "@/lib/game/session-service";

const role = z.enum(["infiltrador", "tecnica", "observador", "negociadora", "motorista", "analista"]);
const commandSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("confirm_player") }),
  z.object({ type: z.literal("assign_roles"), mode: z.literal("automatic") }),
  z.object({ type: z.literal("assign_roles"), mode: z.literal("manual"), assignments: z.record(z.string(), role) }),
  z.object({ type: z.literal("reveal_role"), avatarGender: z.enum(["masculino", "feminino"]), personalCode: z.string().regex(/^\d{4}$/).optional() }),
  z.object({ type: z.literal("ready") }),
  z.object({ type: z.literal("start_game") }),
  z.object({ type: z.literal("pause") }),
  z.object({ type: z.literal("resume") }),
  z.object({ type: z.literal("complete_step") }),
  z.object({ type: z.literal("select_loadout"), itemIds: z.array(z.string()).length(4) }),
  z.object({ type: z.literal("route_vote"), route: z.enum(["social", "servico", "tecnica"]) }),
  z.object({ type: z.literal("choose"), optionId: z.string().min(1) }),
  z.object({ type: z.literal("puzzle"), answer: z.string().min(1).max(80) }),
  z.object({ type: z.literal("hint") }),
  z.object({ type: z.literal("consume_item"), itemId: z.string().min(2).max(50) }),
  z.object({ type: z.literal("delegate_role"), fromPlayerId: z.string().uuid(), toPlayerId: z.string().uuid() }),
  z.object({ type: z.literal("remove_player"), playerId: z.string().uuid() }),
  z.object({ type: z.literal("move"), markerCode: z.string().uuid(), to: z.string().min(2).max(40) }),
  z.object({ type: z.literal("final_vote"), option: z.enum(["orion", "voss", "divulgar", "destruir", "manter"]) }),
  z.object({ type: z.literal("break_tie"), option: z.enum(["orion", "voss", "divulgar", "destruir", "manter"]) }),
  z.object({ type: z.literal("extract"), exit: z.enum(["portao-principal", "garagem", "jardins"]), selectedTrueKey: z.boolean() }),
]);

export async function POST(request: Request, context: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = await context.params;
  try {
    const parsed = commandSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey || idempotencyKey.length < 12 || idempotencyKey.length > 100) {
      return NextResponse.json({ error: "Chave de idempotência ausente." }, { status: 400 });
    }
    const jar = await cookies();
    const result = await executeCommand(roomCode, jar.get(roomCookieName(roomCode))?.value, parsed.data, idempotencyKey);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof GameRuleError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "A ação não foi concluída." }, { status });
  }
}
