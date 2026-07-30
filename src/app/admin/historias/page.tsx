import Link from "next/link";
import { ArrowLeft, BookOpen, Flag, GitBranch, Puzzle } from "lucide-react";
import { canonicalRoles, endingCatalog, gameSteps, puzzleDefinitions, STORY_VERSION } from "@/content/operation-midnight/canonical";
import { requireAdmin } from "@/lib/admin/require-admin";

export const dynamic = "force-dynamic";
export default async function Page() {
  const { admin } = await requireAdmin();
  const { data: version } = await admin.from("stories").select("version,status").eq("slug", "operacao-da-meia-noite").maybeSingle();
  const stats = [[BookOpen,"Passos",gameSteps.length],[GitBranch,"Funções",canonicalRoles.length],[Puzzle,"Puzzles",Object.keys(puzzleDefinitions).length],[Flag,"Finais",endingCatalog.length]] as const;
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#99a1ae]"><ArrowLeft size={15}/> voltar</Link><p className="eyebrow mt-14">Conteúdo canônico versionado</p><h1 className="serif mt-4 text-6xl">Operação da Meia-Noite.</h1><p className="mt-4 text-[#99a1ae]">Aplicação: v{STORY_VERSION}. Banco: v{version?.version ?? "não aplicado"} · {version?.status ?? "ausente"}.</p><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(([Icon,label,value])=><article className="panel p-5" key={label}><Icon className="text-[#c7a96b]"/><strong className="mt-4 block text-2xl">{value}</strong><span className="text-xs text-[#99a1ae]">{label}</span></article>)}</div><div className="mt-8 space-y-2">{gameSteps.map((step)=><article className="panel flex items-center gap-4 p-4" key={step.id}><span className="eyebrow">Ato {step.act}</span><div><strong>{step.title}</strong><p className="text-xs text-[#99a1ae]">{step.kind} · {step.responsibleRole ?? "coletivo"}</p></div></article>)}</div></main>;
}
