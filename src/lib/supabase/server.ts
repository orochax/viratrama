import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
export async function createClient() { const jar = await cookies(); return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", { cookies: { getAll: () => jar.getAll(), setAll: values => { try { values.forEach(({name,value,options})=>jar.set(name,value,options)); } catch {} } } }); }
