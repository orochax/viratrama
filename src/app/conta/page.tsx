import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getAccountSnapshot } from "@/lib/account/account-service";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function Page() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/entrar?next=/conta");
  const account = await getAccountSnapshot(user.id);
  return <AccountDashboard email={user.email ?? ""} fullName={account.profile.full_name ?? user.user_metadata?.full_name ?? ""} phone={account.profile.phone ?? ""} orders={account.orders} />;
}
