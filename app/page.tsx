"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { loadProgress } from "@/lib/storage";
import { percentualAcertos, getStreakMultiplier } from "@/lib/scoring";
import type { UserProgress } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const p = loadProgress();
    if (!p.email) {
      router.replace("/login");
      return;
    }
    setProgress(p);
  }, [router]);

  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">
        Carregando...
      </div>
    );
  }

  const disciplinas = Object.entries(progress.acertosPorDisciplina);
  const mult = getStreakMultiplier(progress.streakDias);

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="shell mt-8 space-y-8 pb-16">
        <section className="card">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Olá, {progress.nome}
          </h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Pontos</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-lime-300">
                {progress.pontosTotais.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Streak</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-orange-200">
                {progress.streakDias}
                <span className="ml-2 text-xl font-medium">
                  dia{progress.streakDias === 1 ? "" : "s"}
                </span>
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Multiplicador</p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-emerald-100">
                {mult}x
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link href="/questoes" className="btn-primary">
            Continuar estudando
          </Link>
          <Link href="/questoes?modo=simulado" className="btn-secondary">
            Iniciar simulado
          </Link>
        </section>

        <section className="card space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-50">
            Progresso por disciplina
          </h2>
          {disciplinas.length === 0 ? (
            <p className="text-lg text-emerald-200/75">
              Ainda não há respostas. Comece a praticar.
            </p>
          ) : (
            disciplinas.map(([nome, stats]) => (
              <ProgressBar
                key={nome}
                label={nome}
                percent={percentualAcertos(stats.acertos, stats.total)}
              />
            ))
          )}
        </section>

        {progress.historico.length > 0 && (
          <section className="card">
            <h2 className="mb-5 text-2xl font-semibold text-emerald-50">
              Últimas respostas
            </h2>
            <ul className="space-y-3 text-lg">
              {progress.historico
                .slice(-5)
                .reverse()
                .map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-emerald-900/40 px-5 py-4"
                  >
                    <span>
                      {h.acertou ? "Acertou" : "Errou"} a questão {h.questaoId}
                    </span>
                    <span className="font-semibold tabular-nums text-lime-300">
                      +{h.pontos} pts
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
