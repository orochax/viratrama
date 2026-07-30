import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FulfillmentEditor } from "@/components/admin/FulfillmentEditor";
import { requireAdmin } from "@/lib/admin/require-admin";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { admin } = await requireAdmin();
  const { data: orders } = await admin.from("orders").select("id,public_number,customer_name,customer_email,status,total_cents,created_at,order_fulfillments(status,carrier,tracking_code)").order("created_at", { ascending: false }).limit(100);
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-10"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#99a1ae]"><ArrowLeft size={15} /> voltar</Link><p className="eyebrow mt-14">Commerce operacional</p><h1 className="serif mt-4 text-6xl">Pedidos e entregas.</h1><div className="mt-8 grid gap-4">{orders?.map((order) => { const fulfillment = Array.isArray(order.order_fulfillments) ? order.order_fulfillments[0] : order.order_fulfillments; return <article className="panel p-5" key={order.id}><div className="flex flex-wrap justify-between gap-3"><div><strong>{order.public_number}</strong><p className="mt-1 text-sm text-[#99a1ae]">{order.customer_name} · {order.customer_email}</p></div><span className="text-[#c7a96b]">{order.status}</span></div><FulfillmentEditor orderId={order.id} status={fulfillment?.status ?? "pending"} carrier={fulfillment?.carrier ?? ""} trackingCode={fulfillment?.tracking_code ?? ""} /></article>; })}</div></main>;
}
