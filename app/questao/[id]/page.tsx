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
      <div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">
        {questao ? "Carregando..." : "Questão não encontrada."}
      </div>
    );
  }

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="shell mt-8 space-y-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3 text-lg text-emerald-100/85">
          <Link href="/questoes" className="hover:text-white">
            Voltar
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <span>
              {questao.disciplina}, {questao.dificuldade}
            </span>
            {modoSimulado && (
              <span
                className={
                  restante <= 10
                    ? "font-bold tabular-nums text-red-200"
                    : "tabular-nums text-orange-200"
                }
              >
                {restante}s
              </span>
            )}
          </div>
        </div>

        <section className="card">
          <p className="text-base text-emerald-200/75">
            {questao.banca}, {questao.ano}
          </p>
          <h1 className="mt-4 max-w-[68ch] text-2xl font-medium leading-relaxed text-white sm:text-3xl">
            {questao.enunciado}
          </h1>
        </section>

        <ul className="space-y-3">
          {questao.alternativas.map((alt, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSelecionada(i)}
                className={`choice ${
                  selecionada === i
                    ? "border-emerald-300 bg-emerald-600/35 text-white"
                    : "border-emerald-800/60 bg-emerald-950/55 text-emerald-50 hover:border-emerald-500"
                }`}
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-base font-bold text-emerald-200">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{alt}</span>
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
