import Link from "next/link";
import { Activity, Archive, BookOpen, Film, KeyRound, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";

export const dynamic = "force-dynamic";
export default async function Admin() {
  const { admin } = await requireAdmin();
  const [sessions, licenses, media, players] = await Promise.all([
    admin.from("game_sessions").select("id", { count: "exact", head: true }).in("status", ["lobby", "role_reveal", "prologue", "active", "paused", "final_decision"]),
    admin.from("licenses").select("id", { count: "exact", head: true }),
    admin.from("media_assets").select("id", { count: "exact", head: true }).neq("production_state", "approved"),
    admin.from("players").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);
  const cards = [
    [Activity, "Sessões ativas", sessions.count ?? 0],
    [KeyRound, "Licenças", licenses.count ?? 0],
    [Film, "Mídias pendentes", media.count ?? 0],
    [Users, "Jogadores ativos", players.count ?? 0],
  ] as const;
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><div className="flex items-center justify-between"><Link href="/" className="text-xs tracking-[.2em]">OMN / ADMIN</Link><span className="eyebrow">Acesso verificado</span></div><h1 className="serif mt-16 text-6xl">Sala de controle.</h1><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([Icon,title,value])=><div className="panel p-5" key={title}><Icon className="text-[#c7a96b]" size={19}/><p className="mt-5 text-sm">{title}</p><p className="mt-2 text-2xl">{value}</p></div>)}</div><div className="mt-8 grid gap-4 md:grid-cols-2"><AdminLink href="/admin/historias" icon={<BookOpen/>} title="História e conteúdo"/><AdminLink href="/admin/midias" icon={<Film/>} title="Mídias e transcrições"/><AdminLink href="/admin/licencas" icon={<KeyRound/>} title="Geração de licenças"/><AdminLink href="/admin/documentacao" icon={<Archive/>} title="Documentação de produção"/></div></main>;
}
function AdminLink({href,icon,title}:{href:string;icon:React.ReactNode;title:string}){return <Link href={href} className="panel flex min-h-16 items-center gap-4 p-5 hover:border-[#c7a96b]/50">{icon}<span>{title}</span></Link>}
