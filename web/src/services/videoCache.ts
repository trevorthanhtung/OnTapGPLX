/**
 * IndexedDB Video Cache Service (Cache-As-You-Play)
 * Lưu trữ video tình huống mô phỏng vào IndexedDB để phát offline 100% mượt mà,
 * không nghẽn mạng và tương thích hoàn hảo trên cả iOS Safari và Android Chrome.
 */

const DB_NAME = 'OnTapGPLX_VideoCache_v1';
const STORE_NAME = 'video_blobs';
const DB_VERSION = 1;

interface CachedVideoRecord {
  id: string; // Video URL hoặc Scenario ID
  blob: Blob;
  size: number;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Map lưu object URL đang hoạt động trong phiên để tái sử dụng, tránh tạo nhiều URL blob trùng lặp
const activeObjectUrls = new Map<string, string>();

export const VideoCacheService = {
  /**
   * Kiểm tra xem video đã được lưu trong IndexedDB hay chưa
   */
  async isCached(url: string): Promise<boolean> {
    if (!url) return false;
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(url);
        req.onsuccess = () => resolve(!!req.result);
        req.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  },

  /**
   * Lấy blob URL đã lưu từ IndexedDB. Trả về null nếu chưa có trong cache.
   */
  async getCachedVideoUrl(url: string): Promise<string | null> {
    if (!url) return null;

    // Trả về ngay nếu đã tạo object URL trong phiên hiện tại
    if (activeObjectUrls.has(url)) {
      return activeObjectUrls.get(url)!;
    }

    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(url);

        req.onsuccess = () => {
          const record = req.result as CachedVideoRecord | undefined;
          if (record && record.blob) {
            const blobUrl = URL.createObjectURL(record.blob);
            activeObjectUrls.set(url, blobUrl);
            resolve(blobUrl);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  /**
   * Tải video ngầm và lưu vào IndexedDB (Cache-As-You-Play)
   */
  async cacheVideo(url: string, onProgress?: (percent: number) => void): Promise<string | null> {
    if (!url) return null;

    // Nếu đã cache rồi thì trả về luôn
    const existing = await this.getCachedVideoUrl(url);
    if (existing) return existing;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

      let blob: Blob;

      if (response.body && totalBytes > 0 && onProgress) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedBytes += value.length;
          onProgress(Math.min(100, Math.round((receivedBytes / totalBytes) * 100)));
        }

        blob = new Blob(chunks as unknown as BlobPart[], { type: 'video/mp4' });
      } else {
        blob = await response.blob();
      }

      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record: CachedVideoRecord = {
          id: url,
          blob,
          size: blob.size,
          timestamp: Date.now()
        };
        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      const blobUrl = URL.createObjectURL(blob);
      activeObjectUrls.set(url, blobUrl);
      return blobUrl;
    } catch (err) {
      console.warn('Lưu video cache thất bại:', err);
      return null;
    }
  },

  /**
   * Lấy thống kê số lượng và dung lượng video đã cache
   */
  async getStats(): Promise<{ count: number; totalBytes: number }> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const records: CachedVideoRecord[] = req.result || [];
          const totalBytes = records.reduce((sum, r) => sum + (r.size || 0), 0);
          resolve({ count: records.length, totalBytes });
        };

        req.onerror = () => resolve({ count: 0, totalBytes: 0 });
      });
    } catch {
      return { count: 0, totalBytes: 0 };
    }
  },

  /**
   * Xóa toàn bộ video đã lưu trong cache
   */
  async clearAll(): Promise<void> {
    try {
      activeObjectUrls.forEach((blobUrl) => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {}
      });
      activeObjectUrls.clear();

      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Xóa video cache thất bại:', err);
    }
  }
};
