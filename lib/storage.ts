import type { UserProgress } from "./types";

const KEY = "studying-game-progress";

export const defaultProgress = (nome = "Estudante", email = ""): UserProgress => ({
  nome,
  email,
  pontosTotais: 0,
  streakDias: 0,
  ultimoDiaEstudo: null,
  acertosPorDisciplina: {},
  historico: [],
});

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
