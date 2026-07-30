import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const destination = next?.startsWith("/") ? next : "/biblioteca";
  if (code) {
    const client = await createClient();
    await client.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(destination, url.origin));
}
