export type LicenseCategory = 'B1' | 'B' | 'C1' | 'C' | 'D' | 'A1' | 'A';

export interface LicenseConfig {
  id: LicenseCategory;
  name: string;
  description: string;
  totalQuestions: number;
  timeMinutes: number;
  passScore: number;
  allowedWrong: number;
  criticalAllowed: number; // 0
}

export interface Question {
  id: number;
  image: string;
  correctAnswer: number;
  isCritical: boolean;
  chapter: number;
  chapterTitle: string;
  tip: string;
  totalOptions?: number;
}

export interface ExamSession {
  categoryId: LicenseCategory;
  questions: Question[];
  userAnswers: Record<number, number>; // questionId -> selectedAnswer (1, 2, 3, 4)
  startedAt: number;
  durationSeconds: number;
  isSubmitted: boolean;
  score: number;
  isPassed: boolean;
  failedCriticalId?: number;
}

export interface SimulationQuizQuestion {
  part: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SimulationScenario {
  id: number;
  title: string;
  name?: string;
  chapter: number;
  chapterName: string;
  videoUrl: string;
  timeIndirect?: number;
  timeDirect?: number;
  part1_name?: string;
  part2_indirect?: string;
  part3_direct?: string;
  part4_action?: string;
  quiz?: SimulationQuizQuestion[];
  timeStart5?: number;
  timeEnd5?: number;
  timeEnd1?: number;
  hint?: string;
}

export interface SimulationResult {
  scenarioId: number;
  spacePressedAt?: number | null;
  score: number;
}

