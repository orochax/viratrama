import { redirect } from "next/navigation";
import { AccountForm } from "@/components/auth/AuthForms";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function Page() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/entrar?next=/conta");
  return <main className="mx-auto min-h-screen max-w-2xl px-5 py-12"><p className="eyebrow">Conta do anfitrião</p><h1 className="serif mt-4 text-6xl">Identidade operacional.</h1><AccountForm email={user.email ?? ""} fullName={user.user_metadata?.full_name ?? ""} /></main>;
}
