import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LicenseGenerator } from "@/components/admin/LicenseGenerator";
import { requireAdmin } from "@/lib/admin/require-admin";

export const dynamic = "force-dynamic";
export default async function Page() {
  const { admin } = await requireAdmin();
  const { data: licenses } = await admin.from("licenses").select("id,code_last4,status,activated_at,created_at").order("created_at", { ascending: false }).limit(100);
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#99a1ae]"><ArrowLeft size={15}/> voltar</Link><p className="eyebrow mt-14">Licenciamento auditado</p><h1 className="serif mt-4 text-6xl">Chaves da operação.</h1><LicenseGenerator/><div className="mt-8"><p className="eyebrow">Últimas licenças</p><div className="resource-grid">{licenses?.map((license)=><article key={license.id}><span className="text-[#c7a96b]">••••</span><div><strong>•••• {license.code_last4}</strong><p>Criada em {new Date(license.created_at).toLocaleDateString("pt-BR")}</p></div><span>{license.status}</span></article>)}</div></div></main>;
}
