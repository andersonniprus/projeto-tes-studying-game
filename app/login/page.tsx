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
    <main className="flex min-h-screen flex-col items-center justify-center py-10">
      <div className="card w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl">📚</p>
          <h1 className="mt-2 text-2xl font-bold text-emerald-200">
            Studying game
          </h1>
          <p className="mt-1 text-sm text-emerald-300/70">
            Vestibular gamificado — menos cansaço, mais progresso
          </p>
        </div>

        <div className="mb-4 flex rounded-xl bg-emerald-950/50 p-1 text-sm">
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 ${
              modo === "cadastro"
                ? "bg-emerald-600 text-white"
                : "text-emerald-300/70"
            }`}
            onClick={() => setModo("cadastro")}
          >
            Criar conta
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 ${
              modo === "login"
                ? "bg-emerald-600 text-white"
                : "text-emerald-300/70"
            }`}
            onClick={() => setModo("login")}
          >
            Entrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "cadastro" && (
            <div>
              <label className="mb-1 block text-sm text-emerald-200/80">
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
            <label className="mb-1 block text-sm text-emerald-200/80">
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
            <label className="mb-1 block text-sm text-emerald-200/80">
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
            <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
              {erro}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            {modo === "cadastro" ? "Criar conta e começar" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-emerald-400/50">
          Demo local — dados salvos no navegador (localStorage)
        </p>
      </div>
    </main>
  );
}
