import { NextResponse } from "next/server";
import { hashSecret } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";
import { licenseCodeSchema } from "@/lib/validation/codes";

type LicenseRecord = {
  id: string;
  status: "unactivated" | "active" | "revoked";
  owner_user_id: string | null;
  code_last4: string;
};

type LicenseQueryResult = Promise<{
  data: LicenseRecord | null;
  error: { message: string } | null;
}>;

type ActivationAdminDb = {
  from: (table: "licenses") => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => LicenseQueryResult;
      };
    };
  };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = licenseCodeSchema.safeParse(body.code);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Código inválido" },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient() as unknown as ActivationAdminDb;
    const { data, error } = await admin
      .from("licenses")
      .select("id,status,owner_user_id,code_last4")
      .eq("code_hash", hashSecret(parsed.data))
      .maybeSingle();

    if (error) throw error;

    const license = data;
    if (!license) {
      return NextResponse.json({ error: "Código não encontrado." }, { status: 404 });
    }

    if (license.status === "revoked") {
      return NextResponse.json(
        { error: "Esta licença não está disponível para ativação." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      flow: license.owner_user_id ? "signin" : "signup",
      last4: license.code_last4,
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível validar a licença agora. Tente novamente." },
      { status: 500 },
    );
  }
}
