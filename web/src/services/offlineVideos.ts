/**
 * Offline Videos Service (IndexedDB)
 * Quản lý tải theo chương hoặc tải toàn bộ 120 video mô phỏng vào IndexedDB
 */

import simulationsData from '../data/simulations.json';
import type { SimulationScenario } from '../types';
import { VideoCacheService, getVideoSrc } from './videoCache';

export interface ChapterVideoInfo {
  id: number;
  name: string;
  total: number;
  startId: number;
  endId: number;
}

export const VIDEO_CHAPTERS: ChapterVideoInfo[] = [
  { id: 1, name: 'Chương 1: Đô thị', total: 29, startId: 1, endId: 29 },
  { id: 2, name: 'Chương 2: Nông thôn', total: 14, startId: 30, endId: 43 },
  { id: 3, name: 'Chương 3: Cao tốc', total: 20, startId: 44, endId: 63 },
  { id: 4, name: 'Chương 4: Đường núi', total: 10, startId: 64, endId: 73 },
  { id: 5, name: 'Chương 5: Quốc lộ', total: 17, startId: 74, endId: 90 },
  { id: 6, name: 'Chương 6: Tai nạn giao thông', total: 30, startId: 91, endId: 120 }
];

export interface ChapterStatus {
  id: number;
  name: string;
  cachedCount: number;
  total: number;
  isComplete: boolean;
}

export interface VideoDownloadProgress {
  current: number;
  total: number;
  percent: number;
  scenarioId?: number;
}

const allScenarios = simulationsData as SimulationScenario[];
const scenarioMap = new Map<number, SimulationScenario>(
  allScenarios.map((s) => [s.id, s])
);

export const OfflineVideosService = {
  /**
   * Lấy trạng thái lưu trữ của từng chương và tổng thể
   */
  async getStatus(): Promise<{
    chapters: ChapterStatus[];
    totalCached: number;
    totalCount: number;
    isAllComplete: boolean;
  }> {
    const cachedKeys = await VideoCacheService.getCachedKeys();

    const chapters: ChapterStatus[] = VIDEO_CHAPTERS.map((ch) => {
      let cached = 0;
      for (let id = ch.startId; id <= ch.endId; id++) {
        const scenario = scenarioMap.get(id);
        if (!scenario) continue;
        const rawSrc = getVideoSrc(scenario.videoUrl);
        if (rawSrc && cachedKeys.has(rawSrc)) {
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
    const totalCount = 120;

    return {
      chapters,
      totalCached,
      totalCount,
      isAllComplete: totalCached >= totalCount
    };
  },

  /**
   * Tải danh sách video theo scenario IDs
   */
  async downloadScenarios(
    scenarioIds: number[],
    onProgress?: (progress: VideoDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    const cachedKeys = await VideoCacheService.getCachedKeys();
    const toDownload = scenarioIds.filter((id) => {
      const scenario = scenarioMap.get(id);
      if (!scenario) return false;
      const rawSrc = getVideoSrc(scenario.videoUrl);
      return !rawSrc || !cachedKeys.has(rawSrc);
    });

    const total = scenarioIds.length;
    let completed = total - toDownload.length;

    // Báo cáo tiến độ ban đầu
    if (onProgress) {
      onProgress({
        current: completed,
        total,
        percent: Math.round((completed / total) * 100)
      });
    }

    if (toDownload.length === 0) {
      return true;
    }

    // Tải tuần tự để tránh nghẽn băng thông và memory IndexedDB
    for (const id of toDownload) {
      if (abortSignal?.aborted) return false;

      const scenario = scenarioMap.get(id);
      if (!scenario) continue;
      const rawSrc = getVideoSrc(scenario.videoUrl);
      if (!rawSrc) continue;

      try {
        await VideoCacheService.cacheVideo(rawSrc, undefined, abortSignal);
        completed++;
        if (onProgress) {
          onProgress({
            current: completed,
            total,
            percent: Math.round((completed / total) * 100),
            scenarioId: id
          });
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError' || abortSignal?.aborted) {
          return false;
        }
        console.warn(`Lỗi khi tải video tình huống ${id}:`, err);
      }
    }

    return true;
  },

  /**
   * Tải toàn bộ 120 video
   */
  async downloadAll(
    onProgress?: (progress: VideoDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    const allIds = Array.from({ length: 120 }, (_, i) => i + 1);
    return this.downloadScenarios(allIds, onProgress, abortSignal);
  },

  /**
   * Tải các video của một chương cụ thể
   */
  async downloadChapter(
    chapterId: number,
    onProgress?: (progress: VideoDownloadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<boolean> {
    const chapter = VIDEO_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return false;

    const ids: number[] = [];
    for (let id = chapter.startId; id <= chapter.endId; id++) {
      ids.push(id);
    }

    return this.downloadScenarios(ids, onProgress, abortSignal);
  },

  /**
   * Xóa video của một chương cụ thể khỏi IndexedDB
   */
  async deleteChapter(chapterId: number): Promise<boolean> {
    const chapter = VIDEO_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return false;

    const urls: string[] = [];
    for (let id = chapter.startId; id <= chapter.endId; id++) {
      const scenario = scenarioMap.get(id);
      if (scenario) {
        const rawSrc = getVideoSrc(scenario.videoUrl);
        if (rawSrc) urls.push(rawSrc);
      }
    }

    await VideoCacheService.deleteVideos(urls);
    return true;
  }
};

