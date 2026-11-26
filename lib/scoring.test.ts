import { describe, it, expect } from 'vitest';
import { calcularPontuacao, getStreakMultiplier, podeDesbloquearDificil } from './scoring';

describe('RN-001 - Cálculo de Pontuação', () => {
  it('deve calcular corretamente com multiplicador Médio', () => {
    const pontos = calcularPontuacao({
      pontosBase: 100,
      dificuldade: 'Médio',
      tempoGastoSeg: 40,
      tempoLimiteSeg: 60,
      streakDias: 1,
    });
    expect(pontos).toBe(150);
  });

  it('deve aplicar bônus de +20% quando tempo ≤ 30% do limite', () => {
    const pontos = calcularPontuacao({
      pontosBase: 100,
      dificuldade: 'Fácil',
      tempoGastoSeg: 10,
      tempoLimiteSeg: 60,
      streakDias: 1,
    });
    expect(pontos).toBe(120);
  });
});

describe('RN-003 - Desbloqueio de Nível Difícil', () => {
  it('desbloqueia com 70%+ e 20+ questões', () => {
    expect(podeDesbloquearDificil(14, 20)).toBe(true);
  });

  it('não desbloqueia com menos de 70%', () => {
    expect(podeDesbloquearDificil(12, 20)).toBe(false);
  });
});
