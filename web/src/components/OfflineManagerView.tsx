import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Video,
  Database
} from 'lucide-react';
import { OfflineQuestionsService, type QuestionsCacheStatus } from '../services/offlineQuestions';
import { VideoCacheService } from '../services/videoCache';

interface OfflineManagerViewProps {
  onBack: () => void;
}

export const OfflineManagerView: React.FC<OfflineManagerViewProps> = ({ onBack }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [qStatus, setQStatus] = useState<QuestionsCacheStatus>({
    cached: 0,
    total: 600,
    isComplete: false,
    sizeBytes: 0
  });
  const [isDownloadingQ, setIsDownloadingQ] = useState(false);
  const [qDownloadProgress, setQDownloadProgress] = useState({ loaded: 0, total: 600, percent: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);

  const [videoStats, setVideoStats] = useState<{ count: number; totalBytes: number }>({
    count: 0,
    totalBytes: 0
  });
  const [isClearingVideos, setIsClearingVideos] = useState(false);
  const [isClearingQuestions, setIsClearingQuestions] = useState(false);

  // Theo dõi trạng thái online/offline của thiết bị
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Tải trạng thái cache khi mở view
  const loadStats = async () => {
    const qStat = await OfflineQuestionsService.getStatus();
    setQStatus(qStat);

    const vStat = await VideoCacheService.getStats();
    setVideoStats(vStat);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Bắt đầu tải trọn bộ 600 câu hỏi lý thuyết
  const handleDownloadQuestions = async () => {
    if (isDownloadingQ) return;
    setIsDownloadingQ(true);
    setQDownloadProgress({ loaded: 0, total: 600, percent: 0 });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await OfflineQuestionsService.downloadAll((prog) => {
        setQDownloadProgress(prog);
      }, controller.signal);
    } finally {
      setIsDownloadingQ(false);
      abortControllerRef.current = null;
      loadStats();
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsDownloadingQ(false);
      loadStats();
    }
  };

  // Xóa cache 600 câu
  const handleClearQuestions = async () => {
    if (window.confirm('Bạn có chắc muốn xóa dữ liệu ngoại tuyến của 600 câu lý thuyết?')) {
      setIsClearingQuestions(true);
      await OfflineQuestionsService.clearAll();
      await loadStats();
      setIsClearingQuestions(false);
    }
  };

  // Xóa cache video
  const handleClearVideos = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ video mô phỏng đã lưu trong bộ nhớ máy?')) {
      setIsClearingVideos(true);
      await VideoCacheService.clearAll();
      await loadStats();
      setIsClearingVideos(false);
    }
  };

  const formatMB = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Dữ liệu Ngoại tuyến (Offline)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý tải trước nội dung để học khi mạng yếu hoặc không có Internet
          </p>
        </div>
      </div>

      {/* Network Status Banner */}
      <div className={`mb-6 p-3.5 sm:p-4 rounded-xl border flex items-center justify-between transition-colors ${
        isOnline 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <div>
            <div className="text-sm font-bold">
              {isOnline ? 'Đang kết nối Internet' : 'Đang ở chế độ Ngoại tuyến (Offline)'}
            </div>
            <div className="text-xs opacity-80 mt-0.5">
              {isOnline 
                ? 'Sẵn sàng tải trước dữ liệu hoặc học trực tuyến.' 
                : 'App vẫn hoạt động bình thường với dữ liệu đã được lưu trên máy.'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Card 1: 600 Câu Lý Thuyết (Ảnh WebP) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  600 Câu hỏi Lý thuyết
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Định dạng WebP tối ưu (~13.8 MB trọn bộ)
                </div>
              </div>
            </div>

            {qStatus.isComplete && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã sẵn sàng
              </span>
            )}
          </div>

          {/* Tiến độ và trạng thái */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 sm:p-3.5 mb-4 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-1.5">
              <span className="text-slate-600 dark:text-slate-300">Đã lưu trên thiết bị:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {qStatus.cached} / {qStatus.total} câu ({Math.round((qStatus.cached / qStatus.total) * 100)}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.round((qStatus.cached / qStatus.total) * 100)}%` }}
              />
            </div>

            {isDownloadingQ && (
              <div className="mt-2.5 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Đang tải: {qDownloadProgress.loaded} / {qDownloadProgress.total} câu ({qDownloadProgress.percent}%)
                </span>
                <button
                  type="button"
                  onClick={handleCancelDownload}
                  className="underline hover:text-blue-700 cursor-pointer"
                >
                  Dừng lại
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5">
            {!qStatus.isComplete && (
              <button
                type="button"
                onClick={handleDownloadQuestions}
                disabled={isDownloadingQ || !isOnline}
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isDownloadingQ ? 'Đang tải...' : 'Tải trọn bộ 600 câu (~14 MB)'}
              </button>
            )}

            {qStatus.cached > 0 && (
              <button
                type="button"
                onClick={handleClearQuestions}
                disabled={isClearingQuestions || isDownloadingQ}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                {isClearingQuestions ? 'Đang xóa...' : 'Xóa bộ nhớ lý thuyết'}
              </button>
            )}
          </div>
        </div>

        {/* Card 2: 120 Tình Huống Mô Phỏng (Cache-As-You-Play) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  120 Tình huống Mô phỏng
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cơ chế Cache-As-You-Play (Tự động lưu khi xem)
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Database className="w-3.5 h-3.5" />
              IndexedDB
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Mỗi khi bạn mở xem một tình huống mô phỏng, clip sẽ tự động được lưu vào bộ nhớ máy. Lần sau mở lại tình huống đó sẽ phát tức thì từ máy, tốn 0 byte 4G và không phụ thuộc mạng.
          </p>

          {/* Stats Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 sm:p-3.5 mb-4 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Số clip đã lưu trong máy:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {videoStats.count} / 120 clip
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Tổng dung lượng chiếm dụng:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                ~{formatMB(videoStats.totalBytes)} MB
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {videoStats.count > 0 && (
              <button
                type="button"
                onClick={handleClearVideos}
                disabled={isClearingVideos}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                {isClearingVideos ? 'Đang xóa...' : 'Xóa bộ nhớ đệm video'}
              </button>
            )}
            <div className="text-[11px] text-slate-400">
              Bộ nhớ cache video an toàn, không làm đầy dung lượng khi không sử dụng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
