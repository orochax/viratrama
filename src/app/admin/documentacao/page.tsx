import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";

const documents = [
  ["Mapa de páginas","docs/VIRATRAMA/APLICATIVO/00_MAPA_DE_PAGINAS.md"],
  ["Fluxo do usuário","docs/VIRATRAMA/APLICATIVO/01_FLUXO_DO_USUARIO.md"],
  ["Estados da partida","docs/VIRATRAMA/APLICATIVO/03_ESTADOS_DA_PARTIDA.md"],
  ["Regras de celulares","docs/VIRATRAMA/APLICATIVO/04_REGRAS_DE_CELULARES.md"],
  ["Banco de dados","docs/VIRATRAMA/TECNICO/01_BANCO_DE_DADOS.md"],
  ["Storage e mídias","docs/VIRATRAMA/TECNICO/04_STORAGE_E_MIDIAS.md"],
] as const;
export default async function Page() {
  await requireAdmin();
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-10"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#99a1ae]"><ArrowLeft size={15}/> voltar</Link><p className="eyebrow mt-14">Livro interno</p><h1 className="serif mt-4 text-6xl">Documentação operacional.</h1><div className="resource-grid mt-8">{documents.map(([title,path])=><article key={path}><ExternalLink/><div><strong>{title}</strong><p>{path}</p></div><span>repositório</span></article>)}</div></main>;
}
