import { NextResponse } from "next/server";
import { licenseCodeSchema } from "@/lib/validation/codes";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const parsed = licenseCodeSchema.safeParse(body.code);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Código inválido" }, { status: 400 });
  return NextResponse.json({ valid: true, last4: parsed.data.slice(-4), mode: "demo" });
}
