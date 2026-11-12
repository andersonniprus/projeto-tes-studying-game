"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultProgress, saveProgress } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("cadastro");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha para continuar.");
      return;
    }
    if (modo === "cadastro" && !nome.trim()) {
      setErro("Informe seu nome no cadastro.");
      return;
    }
    if (senha.length < 4) {
      setErro("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    const p = defaultProgress(nome.trim() || "Estudante", email.trim());
    saveProgress(p);
    router.push("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="card w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-emerald-100 sm:text-5xl">
            Studying game
          </h1>
          <p className="mx-auto mt-3 max-w-[36ch] text-lg text-emerald-100/75">
            Vestibular gamificado, com menos cansaço e mais progresso.
          </p>
        </div>

        <div className="mb-6 flex rounded-2xl bg-emerald-900/50 p-1.5 text-lg">
          <button
            type="button"
            className={`min-h-12 flex-1 rounded-xl py-2 ${
              modo === "cadastro"
                ? "bg-emerald-500 font-semibold text-emerald-950"
                : "text-emerald-100/75"
            }`}
            onClick={() => setModo("cadastro")}
          >
            Criar conta
          </button>
          <button
            type="button"
            className={`min-h-12 flex-1 rounded-xl py-2 ${
              modo === "login"
                ? "bg-emerald-500 font-semibold text-emerald-950"
                : "text-emerald-100/75"
            }`}
            onClick={() => setModo("login")}
          >
            Entrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {modo === "cadastro" && (
            <div>
              <label className="mb-2 block text-base text-emerald-100/85">
                Nome
              </label>
              <input
                className="input-field"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-base text-emerald-100/85">
              E-mail
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-base text-emerald-100/85">
              Senha
            </label>
            <input
              type="password"
              className="input-field"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="rounded-2xl bg-red-500/15 px-4 py-3 text-base text-red-200">
              {erro}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            {modo === "cadastro" ? "Criar conta e começar" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-emerald-200/60">
          Demo local. Os dados ficam neste navegador.
        </p>
      </div>
    </main>
  );
}
