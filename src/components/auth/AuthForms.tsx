"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, LogIn, Mail, RefreshCw, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: authError } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError("E-mail ou senha inválidos.");
      setBusy(false);
      return;
    }
    router.replace(search.get("next") || "/biblioteca");
    router.refresh();
  }
  return <AuthFrame icon={<LogIn />} kicker="Acesso do anfitrião" title="Retomar uma operação."><form onSubmit={submit}><Field label="E-mail"><input className="activation-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></Field><Field label="Senha"><input className="activation-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></Field><button className="button-primary mt-6 flex w-full items-center justify-center gap-2" disabled={busy}>{busy ? "Entrando..." : "Entrar"} <ArrowRight size={16} /></button>{error && <ErrorText>{error}</ErrorText>}<div className="mt-5 flex justify-between text-sm"><Link href="/cadastro" className="text-[#c7a96b]">Criar conta</Link><Link href="/recuperar-senha" className="text-[#99a1ae]">Esqueci a senha</Link></div></form></AuthFrame>;
}

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const { data, error: authError } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/biblioteca`,
      },
    });
    if (authError) return setError(authError.message);
    setMessage(data.session ? "Conta criada. Abra sua biblioteca." : "Confira seu e-mail para confirmar a conta.");
  }
  async function resend() {
    setError("");
    const { error: resendError } = await createClient().auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/biblioteca` },
    });
    if (resendError) setError("Não foi possível reenviar agora.");
    else setMessage("Novo link enviado. Confira também o spam.");
  }
  return <AuthFrame icon={<UserPlus />} kicker="Conta permanente" title="O anfitrião começa aqui.">{message ? <><SuccessText>{message}</SuccessText><button type="button" onClick={() => void resend()} className="button-ghost mt-6 inline-flex items-center gap-2"><RefreshCw size={15} /> Reenviar confirmação</button></> : <form onSubmit={submit}><Field label="Nome completo"><input className="activation-input" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} required /></Field><Field label="E-mail"><input className="activation-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></Field><Field label="Senha · mínimo 8 caracteres"><input className="activation-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></Field><button className="button-primary mt-6 flex w-full items-center justify-center gap-2">Criar conta <ArrowRight size={16} /></button>{error && <ErrorText>{error}</ErrorText>}</form>}</AuthFrame>;
}

export function RecoveryForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const redirectTo = `${window.location.origin}/auth/callback?next=/redefinir-senha`;
    const { error: authError } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (authError) return setError(authError.message);
    setSent(true);
  }
  return <AuthFrame icon={<Mail />} kicker="Recuperação segura" title="Restaure seu acesso.">{sent ? <SuccessText>Enviamos o link de recuperação. Confira também a pasta de spam.</SuccessText> : <form onSubmit={submit}><Field label="E-mail da conta"><input className="activation-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field><button className="button-primary mt-6 flex w-full items-center justify-center gap-2">Enviar link <ArrowRight size={16} /></button>{error && <ErrorText>{error}</ErrorText>}</form>}</AuthFrame>;
}

export function AccountForm({ email, fullName }: { email: string; fullName: string }) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function update(event: FormEvent) {
    event.preventDefault();
    const values: { data: { full_name: string }; password?: string } = { data: { full_name: name.trim() } };
    if (password) values.password = password;
    const { error } = await createClient().auth.updateUser(values);
    setMessage(error ? error.message : "Conta atualizada.");
  }
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }
  return <form className="panel mt-8 p-6" onSubmit={update}><Field label="Nome"><input className="activation-input" value={name} onChange={(event) => setName(event.target.value)} /></Field><Field label="E-mail"><input className="activation-input opacity-60" value={email} disabled /></Field><Field label="Nova senha · deixe vazio para manter"><input className="activation-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} /></Field><div className="mt-6 flex flex-wrap gap-3"><button className="button-primary">Salvar alterações</button><button type="button" className="button-ghost" onClick={() => void signOut()}>Sair da conta</button></div>{message && <p className="mt-4 text-sm text-[#c7a96b]">{message}</p>}</form>;
}

export function NewPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8 || password !== confirmation) {
      setError("Use pelo menos 8 caracteres e repita a mesma senha.");
      return;
    }
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) setError("O link expirou. Solicite uma nova recuperação.");
    else setMessage("Senha atualizada. Você já pode entrar na sua conta.");
  }
  return <AuthFrame icon={<CheckCircle2 />} kicker="Recuperação segura" title="Escolha uma nova senha.">{message ? <><SuccessText>{message}</SuccessText><button type="button" onClick={() => router.push("/entrar")} className="button-primary mt-6 inline-flex items-center gap-2">Entrar <ArrowRight size={16} /></button></> : <form onSubmit={submit}><Field label="Nova senha"><input className="activation-input" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></Field><Field label="Repetir senha"><input className="activation-input" type="password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required /></Field><button className="button-primary mt-6 flex w-full items-center justify-center gap-2">Salvar senha <ArrowRight size={16} /></button>{error && <ErrorText>{error}</ErrorText>}</form>}</AuthFrame>;
}

function AuthFrame({ icon, kicker, title, children }: { icon: React.ReactNode; kicker: string; title: string; children: React.ReactNode }) {
  return <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 py-10"><section className="w-full"><div className="text-[#c7a96b]">{icon}</div><p className="eyebrow mt-5">{kicker}</p><h1 className="serif mt-4 text-5xl">{title}</h1><div className="panel mt-7 p-6">{children}</div></section></main>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="eyebrow mt-5 block first:mt-0">{label}<span className="mt-2 block">{children}</span></label>; }
function ErrorText({ children }: { children: React.ReactNode }) { return <p className="mt-4 text-sm text-[#f08b8b]" role="alert">{children}</p>; }
function SuccessText({ children }: { children: React.ReactNode }) { return <div className="flex gap-3 text-[#8fc7ad]"><CheckCircle2 /><p>{children}</p></div>; }
