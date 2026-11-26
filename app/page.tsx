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
      <div className="flex min-h-[60vh] items-center justify-center text-emerald-200/70">
        Carregando...
      </div>
    );
  }

  const disciplinas = Object.entries(progress.acertosPorDisciplina);
  const mult = getStreakMultiplier(progress.streakDias);

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="mt-6 space-y-6">
        <section className="card">
          <p className="text-sm text-emerald-300/70">Bem-vindo de volta</p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Olá, {progress.nome}!
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="rounded-xl bg-emerald-950/60 px-4 py-3">
              <p className="text-emerald-400/70">Pontos</p>
              <p className="text-xl font-bold text-lime-300">
                {progress.pontosTotais.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/60 px-4 py-3">
              <p className="text-emerald-400/70">Streak</p>
              <p className="text-xl font-bold text-orange-300">
                🔥 {progress.streakDias} dia{progress.streakDias === 1 ? "" : "s"}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/60 px-4 py-3">
              <p className="text-emerald-400/70">Multiplicador</p>
              <p className="text-xl font-bold text-emerald-200">{mult}x</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row">
          <Link href="/questoes" className="btn-primary flex-1 text-center">
            Continuar estudando
          </Link>
          <Link
            href="/questoes?modo=simulado"
            className="btn-secondary flex-1 text-center"
          >
            Iniciar simulado
          </Link>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold text-emerald-100">
            Progresso por disciplina
          </h2>
          {disciplinas.length === 0 ? (
            <p className="text-sm text-emerald-300/60">
              Ainda não há respostas. Comece a praticar!
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
            <h2 className="mb-3 font-semibold text-emerald-100">
              Últimas respostas
            </h2>
            <ul className="space-y-2 text-sm">
              {progress.historico
                .slice(-5)
                .reverse()
                .map((h, i) => (
                  <li
                    key={i}
                    className="flex justify-between rounded-lg bg-emerald-950/40 px-3 py-2"
                  >
                    <span>
                      {h.acertou ? "✓" : "✗"} Questão {h.questaoId}
                    </span>
                    <span className="text-lime-300">+{h.pontos} pts</span>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
