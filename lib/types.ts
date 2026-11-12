export type Dificuldade = "Fácil" | "Médio" | "Difícil";

export interface Questao {
  id: string;
  disciplina: string;
  ano: number;
  banca: string;
  dificuldade: Dificuldade;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
  pontosBase: number;
  tempoLimiteSeg: number;
}

export interface UserProgress {
  nome: string;
  email: string;
  pontosTotais: number;
  streakDias: number;
  ultimoDiaEstudo: string | null; // YYYY-MM-DD
  acertosPorDisciplina: Record<string, { acertos: number; total: number }>;
  historico: {
    questaoId: string;
    acertou: boolean;
    pontos: number;
    data: string;
  }[];
}

export interface ScoreInput {
  pontosBase: number;
  dificuldade: Dificuldade;
  tempoGastoSeg: number;
  tempoLimiteSeg: number;
  streakDias: number;
}
