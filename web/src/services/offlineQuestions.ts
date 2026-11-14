/**
 * Offline Questions Service (Cache Storage API)
 * Quản lý tải trọn bộ và kiểm tra trạng thái ngoại tuyến của 600 câu hỏi lý thuyết WebP (~13.8MB)
 */

export const QUESTIONS_CACHE_NAME = 'ontapgplx-questions-v2';
export const TOTAL_QUESTIONS_COUNT = 600;

export interface QuestionsCacheStatus {
  cached: number;
  total: number;
  isComplete: boolean;
  sizeBytes: number;
}

export const OfflineQuestionsService = {
  /**
   * Sinh danh sách toàn bộ URL ảnh câu hỏi WebP
   */
  getAllUrls(): string[] {
    const urls: string[] = [];
    for (let i = 1; i <= TOTAL_QUESTIONS_COUNT; i++) {
      const pad = String(i).padStart(3, '0');
      urls.push(`/questions/${pad}.webp`);
    }
    return urls;
  },

  /**
   * Lấy trạng thái số câu đã được cache
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
   * Tải trọn bộ 600 câu lý thuyết vào Cache Storage (đa luồng kiểm soát để không nghẽn)
   */
  async downloadAll(
    onProgress?: (progress: { loaded: number; total: number; percent: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return false;
    }

    try {
      const cache = await caches.open(QUESTIONS_CACHE_NAME);
      const urls = this.getAllUrls();
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
                total: TOTAL_QUESTIONS_COUNT,
                percent: Math.round((loaded / TOTAL_QUESTIONS_COUNT) * 100)
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
            // Bỏ qua lỗi lẻ tẻ, tiếp tục câu tiếp theo
          }

          loaded++;
          if (onProgress) {
            onProgress({
              loaded,
              total: TOTAL_QUESTIONS_COUNT,
              percent: Math.round((loaded / TOTAL_QUESTIONS_COUNT) * 100)
            });
          }
        }
      });

      await Promise.all(workers);
      return true;
    } catch (err) {
      console.warn('Lỗi tải trọn bộ câu hỏi:', err);
      return false;
    }
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
