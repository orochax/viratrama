"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ActivationStep = "code" | "signup" | "signin" | "verify-email" | "ready";

const DEMO_CODE = "OMN-DEMO-0001";
const DEMO_ACCOUNT_KEY = "viratrama-demo-account";

type DemoAccount = {
  email?: string;
  passwordHash?: string;
};

function isDevelopmentDemo(code: string) {
  return process.env.NODE_ENV === "development" && code === DEMO_CODE;
}

function readDemoAccount(): DemoAccount | null {
  try {
    const value = window.localStorage.getItem(DEMO_ACCOUNT_KEY);
    return value ? (JSON.parse(value) as DemoAccount) : null;
  } catch {
    return null;
  }
}

async function hashDemoPassword(value: string) {
  const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function Ativar() {
  const [step, setStep] = useState<ActivationStep>("code");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [last4, setLast4] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function requestClaim() {
    const response = await fetch("/api/activation/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      last4?: string;
    };

    if (!response.ok) throw new Error(payload.error ?? "Não foi possível vincular a licença.");

    setLast4(payload.last4 ?? code.slice(-4));
    setStep("ready");
  }

  async function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    setCode(normalizedCode);
    setError("");
    setIsDemo(false);

    if (isDevelopmentDemo(normalizedCode)) {
      setIsDemo(true);
      setLast4(normalizedCode.slice(-4));
      setStep(readDemoAccount() ? "signin" : "signup");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/activation/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        flow?: "signup" | "signin";
        last4?: string;
      };

      if (!response.ok || !payload.flow) {
        throw new Error(payload.error ?? "Não foi possível validar o código.");
      }

      setLast4(payload.last4 ?? normalizedCode.slice(-4));
      setStep(payload.flow);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível validar o código.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Informe seu nome completo.");
      return;
    }

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (isDemo) {
      window.localStorage.setItem(
        DEMO_ACCOUNT_KEY,
        JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          passwordHash: await hashDemoPassword(password),
        }),
      );
      setStep("ready");
      return;
    }

    setIsSubmitting(true);
    try {
      const client = createClient();
      const { data, error: signupError } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });

      if (signupError) throw signupError;

      if (!data.session) {
        setStep("verify-email");
        return;
      }

      await requestClaim();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível criar sua conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitSignin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    if (isDemo) {
      const account = readDemoAccount();
      const passwordHash = await hashDemoPassword(password);
      if (account?.email !== email.trim().toLowerCase() || account.passwordHash !== passwordHash) {
        setError("E-mail ou senha não conferem com o primeiro acesso de demonstração.");
        return;
      }
      setStep("ready");
      return;
    }

    setIsSubmitting(true);
    try {
      const client = createClient();
      const { error: signinError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signinError) throw signinError;
      await requestClaim();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar na sua conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <Link href="/" className="flex items-center gap-2 text-sm text-[#99a1ae]">
        <ArrowLeft size={15} /> início
      </Link>

      <div className="my-auto py-16">
        <p className="eyebrow">Terminal de ativação</p>
        <h1 className="serif mt-5 text-6xl">{headingFor(step)}</h1>

        {step === "code" && (
          <form className="mt-8" onSubmit={submitCode}>
            <p className="text-[#99a1ae]">
              Digite o código impresso no cartão Comece Aqui para vincular esta operação à sua conta.
            </p>
            <Field label="Código da licença" htmlFor="license-code">
              <input
                id="license-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="OMN-XXXXXXXX-XXXXXXXX"
                autoCapitalize="characters"
                autoComplete="off"
                className="activation-input tracking-[.18em]"
                required
              />
            </Field>
            <SubmitButton isSubmitting={isSubmitting}>Continuar <ArrowRight size={16} /></SubmitButton>
          </form>
        )}

        {step === "signup" && (
          <form className="panel mt-8 p-6" onSubmit={submitSignup}>
            <div className="flex items-center gap-3 text-[#c7a96b]">
              <UserPlus size={20} />
              <span className="eyebrow">Primeiro acesso · •••• {last4}</span>
            </div>
            <h2 className="serif mt-5 text-3xl">Crie sua conta de anfitrião.</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#99a1ae]">
              Esta chave ainda não está vinculada. Seus próximos casos usarão este mesmo acesso.
            </p>
            <Field label="Nome completo" htmlFor="signup-name">
              <input id="signup-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="activation-input" required />
            </Field>
            <Field label="E-mail" htmlFor="signup-email">
              <input id="signup-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="activation-input" required />
            </Field>
            <Field label="Senha" htmlFor="signup-password">
              <input id="signup-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} className="activation-input" required />
            </Field>
            <SubmitButton isSubmitting={isSubmitting}>Criar conta e vincular <ArrowRight size={16} /></SubmitButton>
          </form>
        )}

        {step === "signin" && (
          <form className="panel mt-8 p-6" onSubmit={submitSignin}>
            <div className="flex items-center gap-3 text-[#c7a96b]">
              <LogIn size={20} />
              <span className="eyebrow">Chave reconhecida · •••• {last4}</span>
            </div>
            <h2 className="serif mt-5 text-3xl">Entre para continuar.</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#99a1ae]">
              Esta chave já pertence a uma conta. Informe seu e-mail e senha para acessar a operação.
            </p>
            <Field label="E-mail" htmlFor="signin-email">
              <input id="signin-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="activation-input" required />
            </Field>
            <Field label="Senha" htmlFor="signin-password">
              <input id="signin-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" className="activation-input" required />
            </Field>
            <SubmitButton isSubmitting={isSubmitting}>Entrar e vincular <ArrowRight size={16} /></SubmitButton>
            <Link href="/recuperar-senha" className="mt-4 inline-block text-sm text-[#c7a96b] hover:text-[#f4f1e8]">
              Esqueci minha senha
            </Link>
          </form>
        )}

        {step === "verify-email" && (
          <div className="panel mt-8 p-6">
            <CheckCircle2 className="text-[#3e7b62]" size={30} />
            <h2 className="serif mt-4 text-3xl">Confirme seu e-mail.</h2>
            <p className="mt-2 leading-relaxed text-[#99a1ae]">
              Enviamos um link de confirmação para seu e-mail. Depois de confirmar, volte aqui e entre com seu e-mail e senha para concluir o vínculo da chave.
            </p>
            <button type="button" onClick={() => setStep("signin")} className="button-primary mt-6 inline-flex items-center gap-2">
              Já confirmei <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === "ready" && (
          <div className="panel mt-8 p-6">
            <CheckCircle2 className="text-[#3e7b62]" size={30} />
            <h2 className="serif mt-4 text-3xl">Chave vinculada.</h2>
            <p className="mt-2 text-[#99a1ae]">
              Sua licença está pronta. Crie sua sala para reunir a equipe e iniciar o briefing.
            </p>
            <Link href="/biblioteca" className="button-primary mt-6 inline-flex items-center gap-2">
              Abrir biblioteca <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-[#f08b8b]" role="alert">{error}</p>}
        {isDemo && step !== "code" && <p className="mt-4 text-xs text-[#99a1ae]">Modo de demonstração local.</p>}
      </div>
    </main>
  );
}

function Field({ children, htmlFor, label }: { children: ReactNode; htmlFor: string; label: string }) {
  return (
    <label className="mt-5 block text-xs uppercase tracking-[.18em] text-[#99a1ae]" htmlFor={htmlFor}>
      {label}
      <span className="mt-3 block">{children}</span>
    </label>
  );
}

function SubmitButton({ children, isSubmitting }: { children: ReactNode; isSubmitting: boolean }) {
  return (
    <button type="submit" disabled={isSubmitting} className="button-primary mt-6 flex w-full items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-50">
      {isSubmitting ? "Verificando..." : children}
    </button>
  );
}

function headingFor(step: ActivationStep) {
  if (step === "signup") return "Crie seu acesso.";
  if (step === "signin") return "Entre na operação.";
  if (step === "verify-email") return "Quase lá.";
  if (step === "ready") return "Chave vinculada.";
  return "Vincular a chave.";
}
