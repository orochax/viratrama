import Link from "next/link";
import { redirect } from "next/navigation";
import { Library, Plus } from "lucide-react";
import { LibraryOperations } from "@/components/game/LibraryOperations";
import { listLibrary } from "@/lib/game/session-service";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Biblioteca() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/entrar?next=/biblioteca");
  const licenses = await listLibrary();
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-3"><Library className="text-[#c7a96b]" /><span className="text-xs tracking-[.18em]">BIBLIOTECA</span></Link>
        <Link href="/conta" className="button-ghost px-4 text-sm">Minha conta</Link>
      </header>
      <section className="mt-16">
        <p className="eyebrow">Arquivo do anfitrião</p>
        <h1 className="serif mt-4 text-6xl">Suas operações.</h1>
        <LibraryOperations licenses={licenses} defaultNickname={user.user_metadata?.full_name ?? ""} />
        <Link href="/ativar" className="panel mt-5 flex min-h-40 flex-col justify-center p-6 hover:border-[#c7a96b]/50">
          <Plus className="text-[#c7a96b]" />
          <h2 className="serif mt-4 text-3xl">Ativar outra licença</h2>
          <p className="mt-2 text-[#99a1ae]">Vincule um novo kit à sua conta.</p>
        </Link>
      </section>
    </main>
  );
}
