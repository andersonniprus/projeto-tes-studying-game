"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import questoesData from "@/data/questoes.json";
import { calcularPontuacao } from "@/lib/scoring";
import { atualizarStreak } from "@/lib/streak";
import { loadProgress, saveProgress } from "@/lib/storage";
import type { Questao, UserProgress } from "@/lib/types";

const todas = questoesData as Questao[];

export default function QuestaoPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const modoSimulado = search.get("modo") === "simulado";

  const questao = useMemo(() => todas.find((q) => q.id === id), [id]);

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [inicio] = useState(() => Date.now());
  const [restante, setRestante] = useState(0);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    if (!p.email) {
      router.replace("/login");
      return;
    }
    setProgress(p);
  }, [router]);

  useEffect(() => {
    if (!questao || !modoSimulado) return;
    setRestante(questao.tempoLimiteSeg);
    const t = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          clearInterval(t);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [questao, modoSimulado]);

  function confirmar() {
    if (!questao || !progress || selecionada === null || enviando) return;
    setEnviando(true);

    const tempoGasto = Math.max(1, Math.round((Date.now() - inicio) / 1000));
    const acertou = selecionada === questao.correta;

    const { streak, ultimoDia } = atualizarStreak(
      progress.streakDias,
      progress.ultimoDiaEstudo
    );

    const pontos = acertou
      ? calcularPontuacao({
          pontosBase: questao.pontosBase,
          dificuldade: questao.dificuldade,
          tempoGastoSeg: tempoGasto,
          tempoLimiteSeg: questao.tempoLimiteSeg,
          streakDias: streak,
        })
      : 0;

    const stats = progress.acertosPorDisciplina[questao.disciplina] || {
      acertos: 0,
      total: 0,
    };

    const novo: UserProgress = {
      ...progress,
      pontosTotais: progress.pontosTotais + pontos,
      streakDias: streak,
      ultimoDiaEstudo: ultimoDia,
      acertosPorDisciplina: {
        ...progress.acertosPorDisciplina,
        [questao.disciplina]: {
          acertos: stats.acertos + (acertou ? 1 : 0),
          total: stats.total + 1,
        },
      },
      historico: [
        ...progress.historico,
        {
          questaoId: questao.id,
          acertou,
          pontos,
          data: new Date().toISOString(),
        },
      ],
    };

    saveProgress(novo);

    const qs = new URLSearchParams({
      id: questao.id,
      acertou: String(acertou),
      pontos: String(pontos),
      escolhida: String(selecionada),
    });
    if (modoSimulado) qs.set("modo", "simulado");
    router.push(`/resultado?${qs.toString()}`);
  }

  if (!questao || !progress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-emerald-200/70">
        {questao ? "Carregando..." : "Questão não encontrada."}
      </div>
    );
  }

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="mt-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-emerald-300/80">
          <Link href="/questoes" className="hover:text-white">
            ← Voltar
          </Link>
          <div className="flex gap-3">
            <span>
              {questao.disciplina} · {questao.dificuldade}
            </span>
            {modoSimulado && (
              <span
                className={
                  restante <= 10 ? "font-bold text-red-300" : "text-orange-300"
                }
              >
                ⏱ {restante}s
              </span>
            )}
          </div>
        </div>

        <section className="card">
          <p className="text-xs text-emerald-400/60">
            {questao.banca} · {questao.ano}
          </p>
          <h1 className="mt-2 text-lg font-medium leading-relaxed text-white">
            {questao.enunciado}
          </h1>
        </section>

        <ul className="space-y-2">
          {questao.alternativas.map((alt, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSelecionada(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selecionada === i
                    ? "border-emerald-400 bg-emerald-600/30 text-white"
                    : "border-emerald-800/50 bg-emerald-950/40 text-emerald-100 hover:border-emerald-600"
                }`}
              >
                <span className="mr-2 font-semibold text-emerald-400">
                  {String.fromCharCode(65 + i)}.
                </span>
                {alt}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
          disabled={selecionada === null || enviando}
          onClick={confirmar}
        >
          Confirmar resposta
        </button>
      </main>
    </>
  );
}
