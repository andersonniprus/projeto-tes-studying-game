/**
 * RN-002 – atualiza streak diário
 * Se estudou ontem ou hoje: mantém/incrementa
 * Se perdeu um dia: zera
 */
export function atualizarStreak(
  streakAtual: number,
  ultimoDiaEstudo: string | null,
  hoje: string = new Date().toISOString().slice(0, 10)
): { streak: number; ultimoDia: string } {
  if (!ultimoDiaEstudo) {
    return { streak: 1, ultimoDia: hoje };
  }

  if (ultimoDiaEstudo === hoje) {
    return { streak: streakAtual, ultimoDia: hoje };
  }

  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const ontemStr = ontem.toISOString().slice(0, 10);

  if (ultimoDiaEstudo === ontemStr) {
    return { streak: streakAtual + 1, ultimoDia: hoje };
  }

  // Perdeu o dia → zera
  return { streak: 1, ultimoDia: hoje };
}
