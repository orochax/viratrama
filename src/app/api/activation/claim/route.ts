import { NextResponse } from "next/server";
import { hashSecret } from "@/lib/security/license";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
    update: (values: {
      owner_user_id: string;
      status: "active";
      activated_at: string;
    }) => {
      eq: (column: string, value: string) => {
        is: (column: string, value: null) => {
          select: (columns: string) => {
            maybeSingle: () => LicenseQueryResult;
          };
        };
      };
    };
  };
};

function success(license: LicenseRecord) {
  return NextResponse.json({ active: true, last4: license.code_last4 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = licenseCodeSchema.safeParse(body.code);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Código inválido" },
      { status: 400 },
    );
  }

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Entre na sua conta para vincular a licença." },
      { status: 401 },
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

    if (license.owner_user_id === user.id) return success(license);

    if (license.owner_user_id) {
      return NextResponse.json(
        { error: "Esta licença já está vinculada a outra conta." },
        { status: 409 },
      );
    }

    const { data: claimed, error: claimError } = await admin
      .from("licenses")
      .update({
        owner_user_id: user.id,
        status: "active",
        activated_at: new Date().toISOString(),
      })
      .eq("id", license.id)
      .is("owner_user_id", null)
      .select("id,status,owner_user_id,code_last4")
      .maybeSingle();

    if (claimError) throw claimError;
    if (claimed) return success(claimed);

    const { data: current, error: currentError } = await admin
      .from("licenses")
      .select("id,status,owner_user_id,code_last4")
      .eq("id", license.id)
      .maybeSingle();

    if (currentError) throw currentError;

    const currentLicense = current;
    if (currentLicense?.owner_user_id === user.id) return success(currentLicense);

    return NextResponse.json(
      { error: "Esta licença foi vinculada por outra conta. Tente entrar novamente." },
      { status: 409 },
    );
  } catch {
    return NextResponse.json(
      { error: "Não foi possível vincular a licença agora. Tente novamente." },
      { status: 500 },
    );
  }
}
