import type { LicenseCategory } from '../types';

const STORAGE_KEYS = {
  CURRENT_CATEGORY: 'ontapgplx_current_category',
  WRONG_QUESTIONS: 'ontapgplx_wrong_questions',
  WRONG_SCENARIOS: 'ontapgplx_wrong_scenarios',
  BOOKMARKED_QUESTIONS: 'ontapgplx_bookmarked_questions',
  EXAM_HISTORY: 'ontapgplx_exam_history',
  SIMULATION_HISTORY: 'ontapgplx_sim_history',
  STUDIED_QUESTIONS: 'ontapgplx_studied_questions',
  HAS_ENTERED_APP: 'ontapgplx_has_entered_app',
  HAS_ENTERED_WEB: 'ontapgplx_has_entered_web',
  HAS_ENTERED_PWA: 'ontapgplx_has_entered_pwa',
  DISMISSED_LAW_UPDATE_BANNER: 'ontapgplx_dismissed_law_update_banner_2025'
};

export interface ExamHistoryItem {
  id: string;
  category: LicenseCategory;
  date: string;
  score: number;
  total: number;
  isPassed: boolean;
  failedCriticalId?: number;
  durationSeconds: number;
  questionIds?: number[];
  userAnswers?: Record<number, number>;
}

export interface SimulationExamHistoryItem {
  id: string;
  date: string;
  score: number;
  total: number;
  isPassed: boolean;
  durationSeconds: number;
  scenarioIds?: number[];
  userAnswers?: Record<number, Record<number, number>>;
}

export const StorageService = {
  getCategory(): LicenseCategory {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_CATEGORY) as LicenseCategory) || 'B';
  },

  setCategory(category: LicenseCategory): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CATEGORY, category);
  },

  getWrongQuestions(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WRONG_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordWrongQuestion(id: number): void {
    const list = this.getWrongQuestions();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.WRONG_QUESTIONS, JSON.stringify(list));
    }
  },

  removeWrongQuestion(id: number): void {
    const list = this.getWrongQuestions().filter((qId) => qId !== id);
    localStorage.setItem(STORAGE_KEYS.WRONG_QUESTIONS, JSON.stringify(list));
  },

  getWrongScenarios(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WRONG_SCENARIOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordWrongScenario(id: number): void {
    const list = this.getWrongScenarios();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.WRONG_SCENARIOS, JSON.stringify(list));
    }
  },

  removeWrongScenario(id: number): void {
    const list = this.getWrongScenarios().filter((sId) => sId !== id);
    localStorage.setItem(STORAGE_KEYS.WRONG_SCENARIOS, JSON.stringify(list));
  },

  clearWrongScenarios(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WRONG_SCENARIOS);
    } catch {
      // ignore
    }
  },

  getBookmarks(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(id: number): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(id);
    let isBookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      isBookmarked = false;
    } else {
      list.push(id);
      isBookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(list));
    return isBookmarked;
  },

  getStudiedQuestions(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDIED_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markStudied(id: number): void {
    const list = this.getStudiedQuestions();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.STUDIED_QUESTIONS, JSON.stringify(list));
    }
  },

  getExamHistory(): ExamHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addExamHistory(item: ExamHistoryItem): void {
    const history = this.getExamHistory();
    history.unshift(item);
    // keep maximum 50 most recent exams
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history));
  },

  clearExamHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
    } catch {
      // ignore
    }
  },

  getSimulationHistory(): SimulationExamHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIMULATION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSimulationHistory(item: SimulationExamHistoryItem): void {
    const history = this.getSimulationHistory();
    history.unshift(item);
    // keep maximum 50 most recent simulation exams
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.SIMULATION_HISTORY, JSON.stringify(history));
  },

  clearSimulationHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SIMULATION_HISTORY);
    } catch {
      // ignore
    }
  },

  clearStudiedQuestions(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDIED_QUESTIONS);
    } catch {
      // ignore
    }
  },

  clearWrongQuestions(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WRONG_QUESTIONS);
    } catch {
      // ignore
    }
  },

  clearAllProgress(): void {
    this.clearExamHistory();
    this.clearSimulationHistory();
    this.clearStudiedQuestions();
    this.clearWrongQuestions();
    this.clearWrongScenarios();
  },

  exportBackup(): string {
    const data = {
      category: this.getCategory(),
      wrong: this.getWrongQuestions(),
      wrongScenarios: this.getWrongScenarios(),
      bookmarks: this.getBookmarks(),
      studied: this.getStudiedQuestions(),
      exams: this.getExamHistory(),
      simulationExams: this.getSimulationHistory(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.category) this.setCategory(data.category);
      if (Array.isArray(data.wrong)) localStorage.setItem(STORAGE_KEYS.WRONG_QUESTIONS, JSON.stringify(data.wrong));
      if (Array.isArray(data.wrongScenarios)) localStorage.setItem(STORAGE_KEYS.WRONG_SCENARIOS, JSON.stringify(data.wrongScenarios));
      if (Array.isArray(data.bookmarks)) localStorage.setItem(STORAGE_KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(data.bookmarks));
      if (Array.isArray(data.studied)) localStorage.setItem(STORAGE_KEYS.STUDIED_QUESTIONS, JSON.stringify(data.studied));
      if (Array.isArray(data.exams)) localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(data.exams));
      if (Array.isArray(data.simulationExams)) localStorage.setItem(STORAGE_KEYS.SIMULATION_HISTORY, JSON.stringify(data.simulationExams));
      return true;
    } catch {
      return false;
    }
  },

  hasEnteredApp(isPWA = false): boolean {
    try {
      if (isPWA) {
        return localStorage.getItem(STORAGE_KEYS.HAS_ENTERED_PWA) === 'true';
      }
      return (
        localStorage.getItem(STORAGE_KEYS.HAS_ENTERED_WEB) === 'true' ||
        localStorage.getItem(STORAGE_KEYS.HAS_ENTERED_APP) === 'true'
      );
    } catch {
      return false;
    }
  },

  setEnteredApp(isPWA = false): void {
    try {
      if (isPWA) {
        localStorage.setItem(STORAGE_KEYS.HAS_ENTERED_PWA, 'true');
      } else {
        localStorage.setItem(STORAGE_KEYS.HAS_ENTERED_WEB, 'true');
      }
      localStorage.setItem(STORAGE_KEYS.HAS_ENTERED_APP, 'true');
    } catch {
      // ignore
    }
  },

  resetEnteredApp(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HAS_ENTERED_APP);
      localStorage.removeItem(STORAGE_KEYS.HAS_ENTERED_WEB);
      localStorage.removeItem(STORAGE_KEYS.HAS_ENTERED_PWA);
    } catch {
      // ignore
    }
  },

  isLawUpdateBannerDismissed(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.DISMISSED_LAW_UPDATE_BANNER) === 'true';
    } catch {
      return false;
    }
  },

  dismissLawUpdateBanner(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISMISSED_LAW_UPDATE_BANNER, 'true');
    } catch {
      // ignore
    }
  },

  resetLawUpdateBanner(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.DISMISSED_LAW_UPDATE_BANNER);
    } catch {
      // ignore
    }
  }
};
