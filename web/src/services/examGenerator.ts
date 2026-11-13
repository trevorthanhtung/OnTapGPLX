import allQuestions from '../data/questions.json';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import type { LicenseCategory, Question } from '../types';

export const questionsData = allQuestions as Question[];

// 20 câu hỏi điểm liệt chuẩn của Hạng A1 (mô tô 2 bánh)
const A1_CRITICAL_IDS = [
  19, 21, 22, 23, 24, 25, 26, 27, 28, 30,
  32, 47, 48, 52, 53, 63, 64, 65, 70, 71
];

export const ExamGenerator = {
  // Lấy toàn bộ ngân hàng câu hỏi tương ứng cho từng hạng GPLX
  getPoolForCategory(categoryId: LicenseCategory): Question[] {
    if (categoryId === 'A1') {
      // 200 câu chuẩn Hạng A1: 100 câu luật + 65 câu biển báo + 35 câu sa hình
      return questionsData.filter(
        (q) =>
          (q.id >= 1 && q.id <= 100) ||
          (q.id >= 305 && q.id <= 369) ||
          (q.id >= 487 && q.id <= 521)
      );
    }

    if (categoryId === 'A') {
      // 450 câu chuẩn Hạng A (A2 cũ - môtô PKL > 125cc)
      return questionsData.filter(
        (q) =>
          (q.id >= 1 && q.id <= 150) ||
          (q.id >= 193 && q.id <= 242) ||
          (q.id >= 305 && q.id <= 454) ||
          (q.id >= 487 && q.id <= 586)
      );
    }

    if (categoryId === 'B1') {
      // 574 câu: loại bỏ 26 câu Chương 2 (Nghiệp vụ vận tải 167..192)
      return questionsData.filter((q) => q.chapter !== 2);
    }

    // Hạng B, C1, C, D: Đầy đủ 600 câu
    return questionsData;
  },

  // Generate a realistic exam for given license category
  generateExam(categoryId: LicenseCategory): Question[] {
    const config = LICENSE_CATEGORIES.find((c) => c.id === categoryId) || LICENSE_CATEGORIES[0];
    const total = config.totalQuestions;

    // Filter pool specifically for this category
    const pool = this.getPoolForCategory(categoryId);
    const criticals = this.getCriticalQuestions(categoryId);
    const criticalIds = new Set(criticals.map((c) => c.id));
    const nonCriticals = pool.filter((q) => !criticalIds.has(q.id));

    // Pick 1 critical question from category's critical pool
    const pickedCritical = criticals[Math.floor(Math.random() * criticals.length)];

    // Shuffle non-criticals and take (total - 1)
    const shuffledNonCrit = [...nonCriticals].sort(() => Math.random() - 0.5);

    // Categorized balance:
    // Chapter 1 (1..166), Chapter 6 (305..486), Chapter 7 (487..600), Others (167..304)
    const ch1 = shuffledNonCrit.filter((q) => q.chapter === 1);
    const chSigns = shuffledNonCrit.filter((q) => q.chapter === 6);
    const chSaHinh = shuffledNonCrit.filter((q) => q.chapter === 7);
    const chOthers = shuffledNonCrit.filter((q) => q.chapter >= 2 && q.chapter <= 5);

    const countSigns = Math.round(total * 0.3);
    const countSaHinh = Math.round(total * 0.28);
    const countOthers = chOthers.length > 0 ? Math.round(total * 0.12) : 0;
    const countCh1 = total - 1 - countSigns - countSaHinh - countOthers;

    const selected: Question[] = [
      ...ch1.slice(0, countCh1),
      ...chOthers.slice(0, countOthers),
      ...chSigns.slice(0, countSigns),
      ...chSaHinh.slice(0, countSaHinh)
    ];

    // If still missing (due to rounding or small pool), fill from remaining shuffled
    while (selected.length < total - 1) {
      const remaining = shuffledNonCrit.find((q) => !selected.some((s) => s.id === q.id));
      if (remaining) selected.push(remaining);
      else break;
    }

    // Insert critical question at random position among first 10 questions
    const insertPos = Math.floor(Math.random() * Math.min(10, selected.length));
    selected.splice(insertPos, 0, pickedCritical);

    return selected;
  },

  getCriticalQuestions(categoryId?: LicenseCategory): Question[] {
    if (categoryId === 'A1') {
      return questionsData.filter((q) => A1_CRITICAL_IDS.includes(q.id));
    }
    if (categoryId) {
      const pool = this.getPoolForCategory(categoryId);
      return pool.filter((q) => q.isCritical);
    }
    return questionsData.filter((q) => q.isCritical);
  },

  getQuestionsByChapter(chapterId: number, categoryId?: LicenseCategory): Question[] {
    if (categoryId) {
      const pool = this.getPoolForCategory(categoryId);
      return pool.filter((q) => q.chapter === chapterId);
    }
    return questionsData.filter((q) => q.chapter === chapterId);
  },

  getQuestionsByIds(ids: number[]): Question[] {
    return questionsData.filter((q) => ids.includes(q.id));
  }
};
