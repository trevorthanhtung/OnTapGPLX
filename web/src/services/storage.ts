import type { LicenseCategory } from '../types';

const STORAGE_KEYS = {
  CURRENT_CATEGORY: 'ontapgplx_current_category',
  WRONG_QUESTIONS: 'ontapgplx_wrong_questions',
  BOOKMARKED_QUESTIONS: 'ontapgplx_bookmarked_questions',
  EXAM_HISTORY: 'ontapgplx_exam_history',
  SIMULATION_HISTORY: 'ontapgplx_sim_history',
  STUDIED_QUESTIONS: 'ontapgplx_studied_questions',
  HAS_ENTERED_APP: 'ontapgplx_has_entered_app'
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

  exportBackup(): string {
    const data = {
      category: this.getCategory(),
      wrong: this.getWrongQuestions(),
      bookmarks: this.getBookmarks(),
      studied: this.getStudiedQuestions(),
      exams: this.getExamHistory(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.category) this.setCategory(data.category);
      if (Array.isArray(data.wrong)) localStorage.setItem(STORAGE_KEYS.WRONG_QUESTIONS, JSON.stringify(data.wrong));
      if (Array.isArray(data.bookmarks)) localStorage.setItem(STORAGE_KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(data.bookmarks));
      if (Array.isArray(data.studied)) localStorage.setItem(STORAGE_KEYS.STUDIED_QUESTIONS, JSON.stringify(data.studied));
      if (Array.isArray(data.exams)) localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(data.exams));
      return true;
    } catch {
      return false;
    }
  },

  hasEnteredApp(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.HAS_ENTERED_APP) === 'true';
    } catch {
      return false;
    }
  },

  setEnteredApp(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_ENTERED_APP, 'true');
    } catch {
      // ignore
    }
  },

  resetEnteredApp(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HAS_ENTERED_APP);
    } catch {
      // ignore
    }
  }
};
