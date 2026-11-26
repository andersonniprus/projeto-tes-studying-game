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
      <div className="flex min-h-[60vh] items-center justify-center text-emerald-200/70">
        Carregando...
      </div>
    );
  }

  const mult = getStreakMultiplier(progress.streakDias);
  const disciplinas = Object.entries(progress.acertosPorDisciplina);

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="mt-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Meu perfil</h1>
          <Link href="/" className="text-sm text-emerald-300/80 hover:text-white">
            ← Home
          </Link>
        </div>

        <section className="card space-y-2">
          <p className="text-2xl font-bold text-white">{progress.nome}</p>
          <p className="text-sm text-emerald-300/70">{progress.email}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-emerald-950/50 py-3">
              <p className="text-emerald-400/60">Pontos</p>
              <p className="font-bold text-lime-300">
                {progress.pontosTotais.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/50 py-3">
              <p className="text-emerald-400/60">Streak</p>
              <p className="font-bold text-orange-300">
                {progress.streakDias}d
              </p>
            </div>
            <div className="rounded-xl bg-emerald-950/50 py-3">
              <p className="text-emerald-400/60">Mult.</p>
              <p className="font-bold text-emerald-200">{mult}x</p>
            </div>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold text-emerald-100">
            Acertos por disciplina
          </h2>
          {disciplinas.length === 0 ? (
            <p className="text-sm text-emerald-300/60">Sem dados ainda.</p>
          ) : (
            disciplinas.map(([nome, stats]) => {
              const pct = percentualAcertos(stats.acertos, stats.total);
              const dificil = podeDesbloquearDificil(stats.acertos, stats.total);
              return (
                <div key={nome} className="space-y-1">
                  <ProgressBar label={nome} percent={pct} />
                  <p className="text-xs text-emerald-400/60">
                    {stats.acertos}/{stats.total} acertos
                    {dificil
                      ? " · Nível Difícil desbloqueado ✓"
                      : " · Difícil: precisa 70% em ≥20 questões"}
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
