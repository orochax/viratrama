import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ fullName: z.string().trim().min(2).max(120), phone: z.string().trim().max(30), password: z.string().min(8).optional() });

export async function PATCH(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const admin = createAdminClient() as unknown as SupabaseClient;
  const { error } = await admin.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) return NextResponse.json({ error: "Não foi possível salvar o perfil." }, { status: 500 });
  if (parsed.data.password) {
    const { error: passwordError } = await auth.auth.updateUser({ password: parsed.data.password });
    if (passwordError) return NextResponse.json({ error: "Perfil salvo, mas não foi possível trocar a senha." }, { status: 400 });
  }
  return NextResponse.json({ saved: true });
}
