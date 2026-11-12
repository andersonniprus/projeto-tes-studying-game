"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import questoesData from "@/data/questoes.json";
import { loadProgress } from "@/lib/storage";
import { gerarSimulado } from "@/lib/simulado";
import type { Questao, UserProgress } from "@/lib/types";

const todas = questoesData as Questao[];

function QuestoesContent() {
  const router = useRouter();
  const search = useSearchParams();
  const modoSimulado = search.get("modo") === "simulado";

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [disciplina, setDisciplina] = useState("");
  const [dificuldade, setDificuldade] = useState("");
  const [banca, setBanca] = useState("");

  useEffect(() => {
    const p = loadProgress();
    if (!p.email) {
      router.replace("/login");
      return;
    }
    setProgress(p);
  }, [router]);

  const disciplinas = useMemo(
    () => [...new Set(todas.map((q) => q.disciplina))].sort(),
    []
  );
  const bancas = useMemo(
    () => [...new Set(todas.map((q) => q.banca))].sort(),
    []
  );

  const lista = useMemo(() => {
    if (modoSimulado && progress) {
      return gerarSimulado(todas, progress, 5);
    }
    return todas.filter((q) => {
      if (disciplina && q.disciplina !== disciplina) return false;
      if (dificuldade && q.dificuldade !== dificuldade) return false;
      if (banca && q.banca !== banca) return false;
      return true;
    });
  }, [disciplina, dificuldade, banca, modoSimulado, progress]);

  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Header nome={progress.nome} streak={progress.streakDias} />
      <main className="shell mt-8 space-y-8 pb-16">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {modoSimulado ? "Simulado personalizado" : "Banco de questões"}
          </h1>
          <Link href="/" className="shrink-0 text-lg text-emerald-200 hover:text-white">
            Voltar
          </Link>
        </div>

        {!modoSimulado && (
          <div className="card grid gap-4 sm:grid-cols-3">
            <select
              className="input-field"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            >
              <option value="">Todas disciplinas</option>
              {disciplinas.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
            >
              <option value="">Todas dificuldades</option>
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
            <select
              className="input-field"
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
            >
              <option value="">Todas bancas</option>
              {bancas.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        {modoSimulado && (
          <p className="text-lg text-emerald-100/80">
            Prioriza disciplinas com menos de 60% de acertos.
          </p>
        )}

        <ul className="space-y-4">
          {lista.map((q) => (
            <li key={q.id}>
              <Link
                href={`/questao/${q.id}${modoSimulado ? "?modo=simulado" : ""}`}
                className="card block hover:border-emerald-400/70 hover:bg-emerald-900/80"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-emerald-100/80">
                  <span className="rounded-full bg-emerald-800/70 px-3 py-1 text-emerald-50">
                    {q.disciplina}
                  </span>
                  <span>{q.ano}</span>
                  <span>{q.banca}</span>
                  <span
                    className={
                      q.dificuldade === "Difícil"
                        ? "text-orange-200"
                        : q.dificuldade === "Médio"
                        ? "text-yellow-200"
                        : "text-lime-200"
                    }
                  >
                    {q.dificuldade}
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 text-xl leading-relaxed text-emerald-50">
                  {q.enunciado}
                </p>
              </Link>
            </li>
          ))}
          {lista.length === 0 && (
            <p className="text-center text-lg text-emerald-100/70">
              Nenhuma questão com esses filtros.
            </p>
          )}
        </ul>
      </main>
    </>
  );
}


export default function QuestoesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-lg text-emerald-100/80">Carregando...</div>}>
      <QuestoesContent />
    </Suspense>
  );
}
