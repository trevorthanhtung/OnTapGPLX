import allQuestions from '../data/questions.json';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import type { LicenseCategory, Question } from '../types';

export const questionsData = allQuestions as Question[];

export const ExamGenerator = {
  // Generate a realistic exam for given license category
  generateExam(categoryId: LicenseCategory): Question[] {
    const config = LICENSE_CATEGORIES.find((c) => c.id === categoryId) || LICENSE_CATEGORIES[0];
    const total = config.totalQuestions;

    // Filter pools
    const criticals = questionsData.filter((q) => q.isCritical);
    const nonCriticals = questionsData.filter((q) => !q.isCritical);

    // Pick 1 critical question
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
    const countOthers = Math.round(total * 0.12);
    const countCh1 = total - 1 - countSigns - countSaHinh - countOthers;

    const selected: Question[] = [
      ...ch1.slice(0, countCh1),
      ...chOthers.slice(0, countOthers),
      ...chSigns.slice(0, countSigns),
      ...chSaHinh.slice(0, countSaHinh)
    ];

    // If still missing (due to rounding), fill from remaining shuffled
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

  getCriticalQuestions(): Question[] {
    return questionsData.filter((q) => q.isCritical);
  },

  getQuestionsByChapter(chapterId: number): Question[] {
    return questionsData.filter((q) => q.chapter === chapterId);
  },

  getQuestionsByIds(ids: number[]): Question[] {
    return questionsData.filter((q) => ids.includes(q.id));
  }
};
