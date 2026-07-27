import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type MediaDb = { from: (table: string) => { select: (columns: string) => { eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: { storage_path?: string; portrait_path?: string; caption_path?: string; transcript?: string; duration_seconds?: number } | null; error: { message: string } | null }> } } }; storage: { from: (bucket: string) => { createSignedUrl: (path: string, expiresIn: number) => Promise<{ data: { signedUrl: string } | null }> } } };

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const db = createAdminClient() as unknown as MediaDb;
  const asset = await db.from("media_assets").select("storage_path,portrait_path,caption_path,transcript,duration_seconds").eq("code", code).maybeSingle();
  if (asset.error || !asset.data) return NextResponse.json({ error: "Mídia não encontrada" }, { status: 404 });
  const [audio, portrait, captions] = await Promise.all([
    asset.data.storage_path ? db.storage.from("game-media").createSignedUrl(asset.data.storage_path, 900) : Promise.resolve({ data: null }),
    asset.data.portrait_path ? db.storage.from("game-media").createSignedUrl(asset.data.portrait_path, 900) : Promise.resolve({ data: null }),
    asset.data.caption_path ? db.storage.from("game-media").createSignedUrl(asset.data.caption_path, 900) : Promise.resolve({ data: null }),
  ]);
  return NextResponse.json({ audioUrl: audio.data?.signedUrl ?? null, portraitUrl: portrait.data?.signedUrl ?? null, captionsUrl: captions.data?.signedUrl ?? null, transcript: asset.data.transcript ?? "", durationSeconds: asset.data.duration_seconds ?? null }, { headers: { "cache-control": "private, max-age=60" } });
}
