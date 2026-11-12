import type { Dificuldade, ScoreInput } from "./types";

const MULTIPLICADOR: Record<Dificuldade, number> = {
  Fácil: 1.0,
  Médio: 1.5,
  Difícil: 2.0,
};

/** RN-002: multiplicador de streak */
export function getStreakMultiplier(streakDias: number): number {
  if (streakDias >= 7) return 1.5;
  if (streakDias >= 3) return 1.25;
  return 1.0;
}

/**
 * RN-001 – Cálculo de pontuação da questão
 * Pontuação = (PontosBase × MultiplicadorDificuldade) × bônusTempo × streak
 * Mínimo = 1 ponto
 */
export function calcularPontuacao(input: ScoreInput): number {
  const { pontosBase, dificuldade, tempoGastoSeg, tempoLimiteSeg, streakDias } =
    input;

  let pontos = pontosBase * MULTIPLICADOR[dificuldade];

  // Bônus se respondeu em menos de 30% do tempo limite
  if (tempoLimiteSeg > 0 && tempoGastoSeg <= tempoLimiteSeg * 0.3) {
    pontos *= 1.2;
  }

  pontos *= getStreakMultiplier(streakDias);

  return Math.max(1, Math.round(pontos));
}

/** RN-003 – pode desbloquear nível Difícil? */
export function podeDesbloquearDificil(
  acertos: number,
  total: number
): boolean {
  if (total < 20) return false;
  return acertos / total >= 0.7;
}

/** Percentual de acertos */
export function percentualAcertos(acertos: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((acertos / total) * 100);
}
