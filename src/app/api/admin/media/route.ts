import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminDb = {
  from: (table: string) => {
    select: (columns: string) => { eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: { id?: string; is_admin?: boolean } | null }> } };
    upsert: (row: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
    update: (row: Record<string, unknown>) => { eq: (column: string, value: string) => Promise<{ error: { message: string } | null }> };
  };
  storage: { from: (bucket: string) => { createSignedUploadUrl: (path: string) => Promise<{ data: { path: string; token: string; signedUrl: string } | null; error: { message: string } | null }> } };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { storyId?: string; storySlug?: string; code?: string; kind?: string; characterSlug?: string; path?: string; durationSeconds?: number; transcript?: string; portraitPath?: string; theme?: string } | null;
  if ((!body?.storyId && !body?.storySlug) || !body.code || !body.kind || !body.path) return NextResponse.json({ error: "Metadados obrigatórios ausentes" }, { status: 400 });
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const admin = createAdminClient() as unknown as AdminDb;
  const profile = await admin.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile.data?.is_admin) return NextResponse.json({ error: "Acesso administrativo necessário" }, { status: 403 });
  const story = body.storyId ? { data: { id: body.storyId } } : await admin.from("stories").select("id").eq("slug", body.storySlug!).maybeSingle();
  if (!story.data?.id) return NextResponse.json({ error: "História não encontrada" }, { status: 404 });
  const upload = await admin.storage.from("game-media").createSignedUploadUrl(body.path);
  if (upload.error || !upload.data) return NextResponse.json({ error: upload.error?.message ?? "Não foi possível preparar o upload" }, { status: 500 });
  const record = await admin.from("media_assets").upsert({ story_id: story.data.id, code: body.code, kind: body.kind, character_slug: body.characterSlug ?? null, storage_path: body.path, portrait_path: body.portraitPath ?? null, duration_seconds: body.durationSeconds ?? null, transcript: body.transcript ?? "", theme: body.theme ?? "neutral", status: "uploaded", production_state: "uploaded", updated_at: new Date().toISOString() }, { onConflict: "story_id,code" });
  if (record.error) return NextResponse.json({ error: record.error.message }, { status: 500 });
  return NextResponse.json({ upload: upload.data });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null) as {
    code?: string;
    state?: "uploaded" | "approved";
    durationSeconds?: number | null;
    transcript?: string;
  } | null;
  if (!body?.code || !body.state) return NextResponse.json({ error: "Código e estado são obrigatórios." }, { status: 400 });
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const admin = createAdminClient() as unknown as AdminDb;
  const profile = await admin.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile.data?.is_admin) return NextResponse.json({ error: "Acesso administrativo necessário" }, { status: 403 });
  const values: Record<string, unknown> = {
    production_state: body.state,
    status: body.state,
    updated_at: new Date().toISOString(),
  };
  if (body.durationSeconds !== undefined) values.duration_seconds = body.durationSeconds;
  if (body.transcript !== undefined) values.transcript = body.transcript;
  if (body.state === "approved") {
    values.approved_at = new Date().toISOString();
    values.approved_by = user.id;
  }
  const result = await admin.from("media_assets").update(values).eq("code", body.code);
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
