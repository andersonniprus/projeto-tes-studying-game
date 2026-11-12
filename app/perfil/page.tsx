"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import {
  getStreakMultiplier,
  percentualAcertos,
  podeDesbloquearDificil,
} from "@/lib/scoring";
import { clearProgress, loadProgress } from "@/lib/storage";
import type { UserProgress } from "@/lib/types";

export default function PerfilPage() {
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

  function sair() {
    clearProgress();
    router.replace("/login");
  }

  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">
        Carregando...
      </div>
    );
  }

  const mult = getStreakMultiplier(progress.streakDias);
  const disciplinas = Object.entries(progress.acertosPorDisciplina);

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="shell mt-8 space-y-8 pb-16">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Meu perfil</h1>
          <Link href="/" className="shrink-0 text-lg text-emerald-200 hover:text-white">
            Voltar
          </Link>
        </div>

        <section className="card">
          <p className="text-3xl font-bold text-white sm:text-4xl">{progress.nome}</p>
          <p className="mt-2 text-lg text-emerald-100/75">{progress.email}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Pontos</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-lime-300">
                {progress.pontosTotais.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Streak</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-orange-200">
                {progress.streakDias}d
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-900/50 px-5 py-5">
              <p className="text-emerald-200/80">Multiplicador</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-100">
                {mult}x
              </p>
            </div>
          </div>
        </section>

        <section className="card space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-50">
            Acertos por disciplina
          </h2>
          {disciplinas.length === 0 ? (
            <p className="text-lg text-emerald-100/70">Sem dados ainda.</p>
          ) : (
            disciplinas.map(([nome, stats]) => {
              const pct = percentualAcertos(stats.acertos, stats.total);
              const dificil = podeDesbloquearDificil(stats.acertos, stats.total);
              return (
                <div key={nome} className="space-y-2">
                  <ProgressBar label={nome} percent={pct} />
                  <p className="text-base text-emerald-200/70">
                    {stats.acertos}/{stats.total} acertos
                    {dificil
                      ? ". Nível Difícil desbloqueado."
                      : ". Difícil pede 70% em pelo menos 20 questões."}
                  </p>
                </div>
              );
            })
          )}
        </section>

        <button type="button" onClick={sair} className="btn-secondary w-full">
          Sair e limpar dados locais
        </button>
      </main>
    </>
  );
}
