import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MediaVault } from "@/components/admin/MediaVault";

export default function Midias() {
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#99a1ae]"><ArrowLeft size={15}/> voltar ao admin</Link><p className="eyebrow mt-16">Media vault / áudio primeiro</p><h1 className="serif mt-4 text-6xl">Transmissões da operação.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#99a1ae]">Cada comunicação possui retrato, áudio, transcrição, estado de produção e fallback acessível. Envie os arquivos somente depois de aprová-los.</p><MediaVault /></main>;
}
