import type { Questao, UserProgress } from "./types";
import { percentualAcertos } from "./scoring";

/**
 * RN-004 – gera simulado priorizando disciplinas com < 60% de acertos
 */
export function gerarSimulado(
  todas: Questao[],
  progress: UserProgress,
  quantidade = 5
): Questao[] {
  const fracas = new Set<string>();
  for (const [disc, stats] of Object.entries(progress.acertosPorDisciplina)) {
    if (percentualAcertos(stats.acertos, stats.total) < 60) {
      fracas.add(disc);
    }
  }

  const prioritarias = todas.filter((q) => fracas.has(q.disciplina));
  const outras = todas.filter((q) => !fracas.has(q.disciplina));

  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const selecionadas = [
    ...shuffle(prioritarias),
    ...shuffle(outras),
  ].slice(0, quantidade);

  return selecionadas;
}
