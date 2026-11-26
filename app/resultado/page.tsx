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
      <div className="mt-10 text-center text-emerald-200/70">
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
      <main className="mt-6 space-y-5">
        <section
          className={`card text-center ${
            acertou
              ? "border-lime-500/40 bg-lime-900/20"
              : "border-red-500/30 bg-red-950/20"
          }`}
        >
          <p className="text-4xl">{acertou ? "✓" : "✗"}</p>
          <h1 className="mt-2 text-xl font-bold text-white">
            {acertou ? "Você acertou!" : "Resposta incorreta"}
          </h1>
          {acertou && (
            <p className="mt-1 text-lime-300">+{pontos} pontos</p>
          )}
        </section>

        <section className="card space-y-3 text-sm">
          <p>
            <span className="text-emerald-400/70">Sua resposta: </span>
            <span className={acertou ? "text-lime-300" : "text-red-300"}>
              {escolhida >= 0
                ? `${String.fromCharCode(65 + escolhida)}. ${questao.alternativas[escolhida]}`
                : "—"}
            </span>
          </p>
          {!acertou && (
            <p>
              <span className="text-emerald-400/70">Correta: </span>
              <span className="text-lime-300">
                {String.fromCharCode(65 + questao.correta)}.{" "}
                {questao.alternativas[questao.correta]}
              </span>
            </p>
          )}
          <div className="rounded-xl bg-emerald-950/50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400/60">
              Explicação
            </p>
            <p className="text-emerald-50">{questao.explicacao}</p>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={modoSimulado ? "/questoes?modo=simulado" : "/questoes"}
            className="btn-primary flex-1 text-center"
          >
            Próxima questão
          </Link>
          <Link href="/" className="btn-secondary flex-1 text-center">
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
        <div className="flex min-h-[60vh] items-center justify-center text-emerald-200/70">
          Carregando resultado...
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
