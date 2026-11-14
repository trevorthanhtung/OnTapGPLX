/**
 * Offline Questions Service (Cache Storage API)
 * Quản lý tải theo chương hoặc toàn bộ 600 câu hỏi lý thuyết WebP (~13.8MB) vào Cache Storage
 */

export const QUESTIONS_CACHE_NAME = 'ontapgplx-questions-v2';
export const TOTAL_QUESTIONS_COUNT = 600;

export interface QuestionChapterInfo {
  id: number;
  name: string;
  total: number;
  startId: number;
  endId: number;
}

export const QUESTION_CHAPTERS: QuestionChapterInfo[] = [
  { id: 1, name: 'Chương 1: Quy tắc giao thông', total: 166, startId: 1, endId: 166 },
  { id: 2, name: 'Chương 2: Nghiệp vụ vận tải', total: 26, startId: 167, endId: 192 },
  { id: 3, name: 'Chương 3: Văn hóa & Đạo đức lái xe', total: 21, startId: 193, endId: 213 },
  { id: 4, name: 'Chương 4: Kỹ thuật lái xe', total: 56, startId: 214, endId: 269 },
  { id: 5, name: 'Chương 5: Cấu tạo & Sửa chữa ô tô', total: 35, startId: 270, endId: 304 },
  { id: 6, name: 'Chương 6: Hệ thống biển báo hiệu', total: 182, startId: 305, endId: 486 },
  { id: 7, name: 'Chương 7: Giải các thế sa hình', total: 114, startId: 487, endId: 600 }
];

export interface QuestionChapterStatus {
  id: number;
  name: string;
  cachedCount: number;
  total: number;
  isComplete: boolean;
}

export interface QuestionsCacheStatus {
  cached: number;
  total: number;
  isComplete: boolean;
  sizeBytes: number;
}

export interface QuestionDownloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export const OfflineQuestionsService = {
  /**
   * Sinh URL ảnh câu hỏi WebP theo ID (1 -> /questions/001.webp)
   */
  getUrlForId(id: number): string {
    const pad = String(id).padStart(3, '0');
    return `/questions/${pad}.webp`;
  },

  /**
   * Sinh danh sách toàn bộ 600 URL ảnh câu hỏi WebP
   */
  getAllUrls(): string[] {
    const urls: string[] = [];
    for (let i = 1; i <= TOTAL_QUESTIONS_COUNT; i++) {
      urls.push(this.getUrlForId(i));
    }
    return urls;
  },

  /**
   * Lấy trạng thái tổng thể số câu đã được cache
   */
  async getStatus(): Promise<QuestionsCacheStatus> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return { cached: 0, total: TOTAL_QUESTIONS_COUNT, isComplete: false, sizeBytes: 0 };
    }

    try {
      const cache = await caches.open(QUESTIONS_CACHE_NAME);
      const keys = await cache.keys();
      const questionKeys = keys.filter((req) => req.url.includes('/questions/'));

      // Ước lượng dung lượng trung bình ~23KB/câu
      const approxBytes = questionKeys.length * 23.5 * 1024;

      return {
        cached: questionKeys.length,
        total: TOTAL_QUESTIONS_COUNT,
        isComplete: questionKeys.length >= TOTAL_QUESTIONS_COUNT,
        sizeBytes: approxBytes
      };
    } catch {
      return { cached: 0, total: TOTAL_QUESTIONS_COUNT, isComplete: false, sizeBytes: 0 };
    }
  },

  /**
   * Lấy trạng thái lưu trữ của từng chương lý thuyết
   */
  async getChaptersStatus(): Promise<{
    chapters: QuestionChapterStatus[];
    totalCached: number;
    totalCount: number;
    isAllComplete: boolean;
  }> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return {
        chapters: QUESTION_CHAPTERS.map((ch) => ({
          id: ch.id,
          name: ch.name,
          cachedCount: 0,
          total: ch.total,
          isComplete: false
        })),
        totalCached: 0,
        totalCount: TOTAL_QUESTIONS_COUNT,
        isAllComplete: false
      };
    }

    try {
      const cache = await caches.open(QUESTIONS_CACHE_NAME);
      const keys = await cache.keys();
      const existingSet = new Set(keys.map((req) => new URL(req.url).pathname));

      const chapters: QuestionChapterStatus[] = QUESTION_CHAPTERS.map((ch) => {
        let cached = 0;
        for (let id = ch.startId; id <= ch.endId; id++) {
          const url = this.getUrlForId(id);
          if (existingSet.has(url)) {
            cached++;
          }
        }
        return {
          id: ch.id,
          name: ch.name,
          cachedCount: cached,
          total: ch.total,
          isComplete: cached >= ch.total
        };
      });

      const totalCached = chapters.reduce((sum, c) => sum + c.cachedCount, 0);

      return {
        chapters,
        totalCached,
        totalCount: TOTAL_QUESTIONS_COUNT,
        isAllComplete: totalCached >= TOTAL_QUESTIONS_COUNT
      };
    } catch {
      return {
        chapters: QUESTION_CHAPTERS.map((ch) => ({
          id: ch.id,
          name: ch.name,
          cachedCount: 0,
          total: ch.total,
          isComplete: false
        })),
        totalCached: 0,
        totalCount: TOTAL_QUESTIONS_COUNT,
        isAllComplete: false
      };
    }
  },

  /**
   * Tải danh sách câu hỏi cụ thể theo ID (đa luồng kiểm soát để không nghẽn)
   */
  async downloadQuestions(
    questionIds: number[],
    onProgress?: (progress: QuestionDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(QUESTIONS_CACHE_NAME);
      const urls = questionIds.map((id) => this.getUrlForId(id));
      const total = urls.length;
      const concurrency = 6;
      let currentIndex = 0;
      let loaded = 0;

      // Đếm số lượng đã có sẵn
      const existingKeys = await cache.keys();
      const existingSet = new Set(existingKeys.map((req) => new URL(req.url).pathname));

      const workers = Array.from({ length: concurrency }, async () => {
        while (currentIndex < urls.length) {
          if (abortSignal?.aborted) return;
          const idx = currentIndex++;
          const url = urls[idx];

          if (existingSet.has(url)) {
            loaded++;
            if (onProgress) {
              onProgress({
                loaded,
                total,
                percent: Math.round((loaded / total) * 100)
              });
            }
            continue;
          }

          try {
            const res = await fetch(url, { signal: abortSignal });
            if (res.ok) {
              await cache.put(url, res);
            }
          } catch (e) {
            if (abortSignal?.aborted) return;
          }

          loaded++;
          if (onProgress) {
            onProgress({
              loaded,
              total,
              percent: Math.round((loaded / total) * 100)
            });
          }
        }
      });

      await Promise.all(workers);
      return true;
    } catch (err) {
      console.warn('Lỗi tải câu hỏi:', err);
      return false;
    }
  },

  /**
   * Tải trọn bộ 600 câu lý thuyết
   */
  async downloadAll(
    onProgress?: (progress: QuestionDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    const allIds = Array.from({ length: TOTAL_QUESTIONS_COUNT }, (_, i) => i + 1);
    return this.downloadQuestions(allIds, onProgress, abortSignal);
  },

  /**
   * Tải các câu hỏi của một chương cụ thể
   */
  async downloadChapter(
    chapterId: number,
    onProgress?: (progress: QuestionDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    const chapter = QUESTION_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return false;

    const ids: number[] = [];
    for (let id = chapter.startId; id <= chapter.endId; id++) {
      ids.push(id);
    }

    return this.downloadQuestions(ids, onProgress, abortSignal);
  },

  /**
   * Xóa danh sách câu hỏi cụ thể khỏi Cache Storage
   */
  async deleteQuestions(questionIds: number[]): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;
    try {
      const cache = await caches.open(QUESTIONS_CACHE_NAME);
      await Promise.all(
        questionIds.map((id) => cache.delete(this.getUrlForId(id)))
      );
      return true;
    } catch (err) {
      console.warn('Lỗi xóa câu hỏi:', err);
      return false;
    }
  },

  /**
   * Xóa câu hỏi của một chương cụ thể khỏi Cache Storage
   */
  async deleteChapter(chapterId: number): Promise<boolean> {
    const chapter = QUESTION_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return false;

    const ids: number[] = [];
    for (let id = chapter.startId; id <= chapter.endId; id++) {
      ids.push(id);
    }

    return this.deleteQuestions(ids);
  },

  /**
   * Xóa bộ nhớ đệm câu hỏi lý thuyết
   */
  async clearAll(): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    try {
      await caches.delete(QUESTIONS_CACHE_NAME);
    } catch (err) {
      console.warn('Lỗi xóa cache câu hỏi:', err);
    }
  }
};

