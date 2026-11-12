"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import questoesData from "@/data/questoes.json";
import { loadProgress } from "@/lib/storage";
import type { Questao } from "@/lib/types";

const todas = questoesData as Questao[];

function ResultadoContent() {
  const search = useSearchParams();
  const id = search.get("id") || "";
  const acertou = search.get("acertou") === "true";
  const pontos = Number(search.get("pontos") || 0);
  const escolhida = Number(search.get("escolhida") ?? -1);
  const modoSimulado = search.get("modo") === "simulado";

  const questao = useMemo(() => todas.find((q) => q.id === id), [id]);
  const progress = typeof window !== "undefined" ? loadProgress() : null;

  if (!questao) {
    return (
      <div className="mt-16 text-center text-lg text-emerald-100/80">
        Resultado indisponível.{" "}
        <Link href="/questoes" className="underline">
          Voltar às questões
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header
        nome={progress?.nome}
        streak={progress?.streakDias}
      />
      <main className="shell mt-8 space-y-8 pb-16">
        <section
          className={`card text-center ${
            acertou
              ? "border-lime-400/50 bg-lime-950/40"
              : "border-red-400/40 bg-red-950/40"
          }`}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {acertou ? "Você acertou" : "Resposta incorreta"}
          </h1>
          {acertou && (
            <p className="mt-3 text-3xl font-semibold tabular-nums text-lime-300">
              +{pontos} pontos
            </p>
          )}
        </section>

        <section className="card space-y-5 text-lg">
          <p>
            <span className="text-emerald-200/75">Sua resposta: </span>
            <span className={acertou ? "text-lime-200" : "text-red-200"}>
              {escolhida >= 0
                ? `${String.fromCharCode(65 + escolhida)}. ${questao.alternativas[escolhida]}`
                : "—"}
            </span>
          </p>
          {!acertou && (
            <p>
              <span className="text-emerald-200/75">Correta: </span>
              <span className="text-lime-200">
                {String.fromCharCode(65 + questao.correta)}.{" "}
                {questao.alternativas[questao.correta]}
              </span>
            </p>
          )}
          <div className="rounded-2xl bg-emerald-900/45 p-5">
            <p className="mb-2 text-lg font-semibold text-emerald-100">
              Explicação
            </p>
            <p className="max-w-[68ch] leading-relaxed text-emerald-50">
              {questao.explicacao}
            </p>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href={modoSimulado ? "/questoes?modo=simulado" : "/questoes"}
            className="btn-primary w-full"
          >
            Próxima questão
          </Link>
          <Link href="/" className="btn-secondary w-full">
            Ir para Home
          </Link>
        </div>
      </main>
    </>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">
          Carregando resultado...
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
