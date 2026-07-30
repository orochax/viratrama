"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Radio } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function EntrarSala() {
  const router = useRouter();
  const [code, setCode] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = code.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (normalized.length === 6) router.push(`/sala/${normalized}`);
  }
  return (
    <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-5">
      <form className="panel w-full p-6" onSubmit={submit}>
        <Radio className="text-[#c7a96b]" />
        <p className="eyebrow mt-5">Entrada de agentes</p>
        <h1 className="serif mt-4 text-5xl">Código da sala.</h1>
        <input className="activation-input mt-6 text-center tracking-[.22em]" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={6} placeholder="ATLAS7" required />
        <button className="button-primary mt-5 flex w-full items-center justify-center gap-2">Continuar <ArrowRight size={16} /></button>
      </form>
    </main>
  );
}
