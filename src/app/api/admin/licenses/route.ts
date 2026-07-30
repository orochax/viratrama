import { NextResponse } from "next/server";
import { z } from "zod";
import { createCommercialLicense } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  storySlug: z.string().min(2),
  quantity: z.number().int().min(1).max(100),
});

export async function POST(request: Request) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: "Acesso administrativo necessário." }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Lote inválido." }, { status: 400 });
  const { data: story } = await admin.from("stories").select("id").eq("slug", parsed.data.storySlug).maybeSingle();
  if (!story) return NextResponse.json({ error: "História não encontrada." }, { status: 404 });
  const licenses = Array.from(
    { length: parsed.data.quantity },
    createCommercialLicense,
  );
  const { error } = await admin.from("licenses").insert(licenses.map((license) => ({
    story_id: story.id,
    code_hash: license.hash,
    code_last4: license.last4,
    status: "unactivated" as const,
    metadata: { generated_by: user.id, generated_at: new Date().toISOString() },
  })));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ codes: licenses.map((license) => license.raw) });
}
