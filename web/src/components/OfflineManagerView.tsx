import React, { useState, useEffect, useRef } from 'react';
import { 
  Loader2,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  OfflineQuestionsService, 
  QUESTION_CHAPTERS,
  type QuestionsCacheStatus,
  type QuestionChapterStatus,
  type QuestionDownloadProgress
} from '../services/offlineQuestions';
import { 
  OfflineVideosService, 
  VIDEO_CHAPTERS,
  type ChapterStatus, 
  type VideoDownloadProgress 
} from '../services/offlineVideos';
import { VideoCacheService } from '../services/videoCache';
import type { SubHeaderConfig } from './Navbar';

interface OfflineManagerViewProps {
  onBack?: () => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
}

export const OfflineManagerView: React.FC<OfflineManagerViewProps> = ({ 
  onBack, 
  onSubHeaderChange 
}) => {
  const [currentView, setCurrentView] = useState<'offline' | 'data'>('offline');
  const [expandedQuestions, setExpandedQuestions] = useState(false);
  const [expandedVideos, setExpandedVideos] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmDialogState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [qStatus, setQStatus] = useState<QuestionsCacheStatus>({
    cached: 0,
    total: 600,
    isComplete: false,
    sizeBytes: 0
  });

  // State cho Modal Tải Câu hỏi lý thuyết (all & theo chương)
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionChaptersStatus, setQuestionChaptersStatus] = useState<QuestionChapterStatus[]>(
    QUESTION_CHAPTERS.map((ch) => ({
      id: ch.id,
      name: ch.name,
      cachedCount: 0,
      total: ch.total,
      isComplete: false
    }))
  );
  const [isDownloadingQ, setIsDownloadingQ] = useState(false);
  const [downloadingQTarget, setDownloadingQTarget] = useState<'all' | number | null>(null);
  const [qDownloadProgress, setQDownloadProgress] = useState<QuestionDownloadProgress>({
    loaded: 0,
    total: 600,
    percent: 0
  });
  const qAbortControllerRef = useRef<AbortController | null>(null);

  const [videoStats, setVideoStats] = useState<{ count: number; totalBytes: number }>({
    count: 0,
    totalBytes: 0
  });

  // State cho Modal Tải Video mô phỏng
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [chaptersStatus, setChaptersStatus] = useState<ChapterStatus[]>(
    VIDEO_CHAPTERS.map((ch) => ({
      id: ch.id,
      name: ch.name,
      cachedCount: 0,
      total: ch.total,
      isComplete: false
    }))
  );
  const [isDownloadingV, setIsDownloadingV] = useState(false);
  const [downloadingTarget, setDownloadingTarget] = useState<'all' | number | null>(null);
  const [videoDownloadProgress, setVideoDownloadProgress] = useState<VideoDownloadProgress>({
    current: 0,
    total: 120,
    percent: 0
  });
  const videoAbortControllerRef = useRef<AbortController | null>(null);

  // Đồng bộ tiêu đề và nút quay lại trên Navbar
  useEffect(() => {
    if (currentView === 'data') {
      onSubHeaderChange?.({
        title: 'Quản lý dữ liệu',
        onBack: () => setCurrentView('offline')
      });
    } else {
      onSubHeaderChange?.({
        title: 'Dữ liệu ngoại tuyến',
        onBack: onBack || (() => {})
      });
    }
  }, [currentView, onBack, onSubHeaderChange]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showQuestionModal || showVideoModal || confirmModal?.isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showQuestionModal, showVideoModal, confirmModal?.isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmModal?.isOpen) {
          if (!isDeleting) setConfirmModal(null);
        } else if (showQuestionModal) {
          setShowQuestionModal(false);
        } else if (showVideoModal) {
          setShowVideoModal(false);
        } else if (currentView === 'data') {
          setCurrentView('offline');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuestionModal, showVideoModal, currentView, confirmModal?.isOpen, isDeleting]);

  const loadStats = async () => {
    const qStat = await OfflineQuestionsService.getStatus();
    setQStatus(qStat);

    const qChapterStat = await OfflineQuestionsService.getChaptersStatus();
    setQuestionChaptersStatus(qChapterStat.chapters);

    const vStat = await VideoCacheService.getStats();
    setVideoStats(vStat);

    const vChapterStat = await OfflineVideosService.getStatus();
    setChaptersStatus(vChapterStat.chapters);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ==========================================
  // XỬ LÝ TẢI CÂU HỎI LÝ THUYẾT (ALL & THEO CHƯƠNG)
  // ==========================================
  const handleDownloadAllQuestions = async () => {
    if (isDownloadingQ) return;
    setIsDownloadingQ(true);
    setDownloadingQTarget('all');

    const controller = new AbortController();
    qAbortControllerRef.current = controller;

    try {
      await OfflineQuestionsService.downloadAll((prog) => {
        setQDownloadProgress(prog);
        loadStats();
      }, controller.signal);
    } finally {
      setIsDownloadingQ(false);
      setDownloadingQTarget(null);
      qAbortControllerRef.current = null;
      await loadStats();
    }
  };

  const handleDownloadQuestionChapter = async (chapterId: number) => {
    if (isDownloadingQ) return;
    setIsDownloadingQ(true);
    setDownloadingQTarget(chapterId);

    const controller = new AbortController();
    qAbortControllerRef.current = controller;

    try {
      await OfflineQuestionsService.downloadChapter(chapterId, (prog) => {
        setQDownloadProgress(prog);
        loadStats();
      }, controller.signal);
    } finally {
      setIsDownloadingQ(false);
      setDownloadingQTarget(null);
      qAbortControllerRef.current = null;
      await loadStats();
    }
  };

  const handleCancelQuestionDownload = () => {
    if (qAbortControllerRef.current) {
      qAbortControllerRef.current.abort();
      setIsDownloadingQ(false);
      setDownloadingQTarget(null);
      loadStats();
    }
  };

  // ==========================================
  // XỬ LÝ TẢI VIDEO MÔ PHỎNG (ALL & THEO CHƯƠNG)
  // ==========================================
  const handleDownloadAllVideos = async () => {
    if (isDownloadingV) return;
    setIsDownloadingV(true);
    setDownloadingTarget('all');

    const controller = new AbortController();
    videoAbortControllerRef.current = controller;

    try {
      await OfflineVideosService.downloadAll((prog) => {
        setVideoDownloadProgress(prog);
        loadStats();
      }, controller.signal);
    } finally {
      setIsDownloadingV(false);
      setDownloadingTarget(null);
      videoAbortControllerRef.current = null;
      await loadStats();
    }
  };

  const handleDownloadChapter = async (chapterId: number) => {
    if (isDownloadingV) return;
    setIsDownloadingV(true);
    setDownloadingTarget(chapterId);

    const controller = new AbortController();
    videoAbortControllerRef.current = controller;

    try {
      await OfflineVideosService.downloadChapter(chapterId, (prog) => {
        setVideoDownloadProgress(prog);
        loadStats();
      }, controller.signal);
    } finally {
      setIsDownloadingV(false);
      setDownloadingTarget(null);
      videoAbortControllerRef.current = null;
      await loadStats();
    }
  };

  const handleCancelVideoDownload = () => {
    if (videoAbortControllerRef.current) {
      videoAbortControllerRef.current.abort();
      setIsDownloadingV(false);
      setDownloadingTarget(null);
      loadStats();
    }
  };

  const handleExecuteConfirm = async () => {
    if (!confirmModal || isDeleting) return;
    setIsDeleting(true);
    try {
      await confirmModal.onConfirm();
      await loadStats();
      setConfirmModal(null);
    } catch (err) {
      console.error('Lỗi khi xóa dữ liệu:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 animate-in fade-in duration-150">
      {/* ========================================== */}
      {/* VIEW: QUẢN LÝ DỮ LIỆU                     */}
      {/* ========================================== */}
      {currentView === 'data' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in duration-150">
          {/* Mục 1: 600 câu lý thuyết */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* Header Mục 1 */}
            <div
              onClick={() => setExpandedQuestions((prev) => !prev)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  600 câu lý thuyết
                </div>
                <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                  Đã tải {qStatus.cached}/600 câu ({((qStatus.sizeBytes || 0) / (1024 * 1024)).toFixed(1)} MB)
                </div>
              </div>

              <div className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 shrink-0">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedQuestions ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {/* Danh sách các chương lý thuyết */}
            {expandedQuestions && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40">
                {questionChaptersStatus.map((ch) => {
                  const isCached = ch.cachedCount > 0;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        if (!isCached) return;
                        setConfirmModal({
                          isOpen: true,
                          title: `Xóa ${ch.name}?`,
                          description: `Xóa toàn bộ ${ch.cachedCount} câu hỏi của chương này khỏi bộ nhớ máy?`,
                          confirmLabel: 'Xóa',
                          onConfirm: async () => {
                            await OfflineQuestionsService.deleteChapter(ch.id);
                          }
                        });
                      }}
                      className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition-colors select-none ${
                        isCached
                          ? 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group active:bg-slate-200/50 dark:active:bg-slate-800/70'
                          : 'opacity-40 cursor-default'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {ch.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          {ch.cachedCount}/{ch.total} câu
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Hàng xóa tất cả ở dưới cùng danh sách chương lý thuyết */}
                <button
                  type="button"
                  disabled={qStatus.cached === 0}
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Xóa toàn bộ câu hỏi lý thuyết?',
                      description: `Xóa tất cả ${qStatus.cached} ảnh câu hỏi đã tải về khỏi bộ nhớ máy?`,
                      confirmLabel: 'Xóa tất cả',
                      onConfirm: async () => {
                        await OfflineQuestionsService.clearAll();
                      }
                    });
                  }}
                  className="w-full py-3.5 px-4 text-center text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 active:bg-rose-100/50 dark:active:bg-rose-900/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer block"
                >
                  Xóa toàn bộ 600 câu
                </button>
              </div>
            )}
          </div>

          {/* Mục 2: Video mô phỏng */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* Header Mục 2 */}
            <div
              onClick={() => setExpandedVideos((prev) => !prev)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Video mô phỏng
                </div>
                <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                  Đã tải {videoStats.count}/120 video ({((videoStats.totalBytes || 0) / (1024 * 1024)).toFixed(1)} MB)
                </div>
              </div>

              <div className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 shrink-0">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedVideos ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {/* Danh sách 6 chương video */}
            {expandedVideos && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40">
                {chaptersStatus.map((ch) => {
                  const isCached = ch.cachedCount > 0;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        if (!isCached) return;
                        setConfirmModal({
                          isOpen: true,
                          title: `Xóa ${ch.name}?`,
                          description: `Xóa toàn bộ ${ch.cachedCount} video của chương này khỏi bộ nhớ máy?`,
                          confirmLabel: 'Xóa',
                          onConfirm: async () => {
                            await OfflineVideosService.deleteChapter(ch.id);
                          }
                        });
                      }}
                      className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition-colors select-none ${
                        isCached
                          ? 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer group active:bg-slate-200/50 dark:active:bg-slate-800/70'
                          : 'opacity-40 cursor-default'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {ch.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          {ch.cachedCount}/{ch.total} video
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Hàng xóa tất cả ở dưới cùng danh sách chương video */}
                <button
                  type="button"
                  disabled={videoStats.count === 0}
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Xóa toàn bộ video mô phỏng?',
                      description: `Xóa tất cả ${videoStats.count} video đã lưu khỏi bộ nhớ máy?`,
                      confirmLabel: 'Xóa tất cả',
                      onConfirm: async () => {
                        await VideoCacheService.clearAll();
                      }
                    });
                  }}
                  className="w-full py-3.5 px-4 text-center text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 active:bg-rose-100/50 dark:active:bg-rose-900/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer block"
                >
                  Xóa toàn bộ 120 video
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* VIEW: DỮ LIỆU NGOẠI TUYẾN CHÍNH           */
        /* ========================================== */
        <div className="space-y-4 animate-in fade-in duration-150">
      {/* Card 1: Tải & Trạng thái dữ liệu */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs">
        {/* Row 1: 600 Câu lý thuyết */}
        <div className="relative p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              600 câu lý thuyết
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDownloadingQ ? (
              <button
                type="button"
                onClick={() => setShowQuestionModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-semibold cursor-pointer"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{qDownloadProgress.percent}%</span>
              </button>
            ) : qStatus.isComplete ? (
              <button
                type="button"
                onClick={() => setShowQuestionModal(true)}
                className="text-xs font-medium text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Đã tải
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuestionModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Tải về máy
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Video mô phỏng */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Video mô phỏng
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDownloadingV ? (
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-semibold cursor-pointer"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{videoDownloadProgress.percent}%</span>
              </button>
            ) : videoStats.count >= 120 ? (
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="text-xs font-medium text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Đã tải
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Tải video
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Quản lý dữ liệu */}
        <button
          type="button"
          onClick={() => setCurrentView('data')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Quản lý dữ liệu
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )}

      {/* ======================================================== */}
      {/* MODAL TẢI CÂU HỎI LÝ THUYẾT (THEO CHƯƠNG HOẶC TOÀN BỘ)   */}
      {/* ======================================================== */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          {/* Backdrop layer cố định - không tự tắt khi bấm ngoài */}
          <div
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div
            className="relative z-10 bg-white dark:bg-[#0c0d0e] rounded-xl sm:rounded-2xl max-w-md w-full max-h-[85dvh] flex flex-col p-4 sm:p-5 shadow-2xl border border-slate-200/80 dark:border-zinc-800 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80 shrink-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Tải 600 câu lý thuyết
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thân modal cuộn được (ẩn thanh scrollbar xám) */}
            <div className="overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3 space-y-3 pr-0.5 -mr-0.5">
              {/* Tùy chọn 1: Tải trọn bộ 600 câu */}
              <div className="relative overflow-hidden p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-3 shadow-2xs">
                {/* Progress bar mỏng 2px chìm dưới đáy card khi đang tải toàn bộ */}
                {downloadingQTarget === 'all' && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
                      style={{ width: `${qDownloadProgress.percent}%` }}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Tải trọn bộ 600 câu
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono">
                    {downloadingQTarget === 'all' ? (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        Đang tải {qDownloadProgress.loaded}/{qDownloadProgress.total} ({qDownloadProgress.percent}%)
                      </span>
                    ) : (
                      '~13.8 MB'
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {qStatus.isComplete ? (
                    <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                      Đã tải đủ
                    </span>
                  ) : downloadingQTarget === 'all' ? (
                    <button
                      type="button"
                      onClick={handleCancelQuestionDownload}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Dừng
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isDownloadingQ}
                      onClick={handleDownloadAllQuestions}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-100 text-white dark:text-slate-900 text-xs font-bold cursor-pointer disabled:opacity-40 transition-all shadow-2xs"
                    >
                      Tải toàn bộ
                    </button>
                  )}
                </div>
              </div>

              {/* Tùy chọn 2: Danh sách 7 chương */}
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
                  Hoặc tải theo từng chương
                </div>

                <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900/20">
                  {questionChaptersStatus.map((ch) => {
                    const isThisDownloading = downloadingQTarget === ch.id;

                    return (
                      <div
                        key={ch.id}
                        className="relative overflow-hidden p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Progress bar mỏng 2px chìm dưới đáy dòng khi chương này đang tải */}
                        {isThisDownloading && (
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200 dark:bg-zinc-800">
                            <div
                              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
                              style={{ width: `${qDownloadProgress.percent}%` }}
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                            {ch.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono">
                            {isThisDownloading ? (
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                Đang tải {qDownloadProgress.loaded}/{qDownloadProgress.total} ({qDownloadProgress.percent}%)
                              </span>
                            ) : (
                              `${ch.cachedCount}/${ch.total} câu`
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {ch.isComplete ? (
                            <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                              Đã tải
                            </span>
                          ) : isThisDownloading ? (
                            <button
                              type="button"
                              onClick={handleCancelQuestionDownload}
                              className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold cursor-pointer"
                            >
                              Dừng
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isDownloadingQ}
                              onClick={() => handleDownloadQuestionChapter(ch.id)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors"
                            >
                              Tải
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TẢI VIDEO MÔ PHỎNG (THEO CHƯƠNG HOẶC TOÀN BỘ)       */}
      {/* ======================================================== */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          {/* Backdrop layer cố định - không tự tắt khi bấm ngoài */}
          <div
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div
            className="relative z-10 bg-white dark:bg-[#0c0d0e] rounded-xl sm:rounded-2xl max-w-md w-full max-h-[85dvh] flex flex-col p-4 sm:p-5 shadow-2xl border border-slate-200/80 dark:border-zinc-800 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80 shrink-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Tải video mô phỏng
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thân modal cuộn được (ẩn thanh scrollbar xám) */}
            <div className="overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3 space-y-3 pr-0.5 -mr-0.5">
              {/* Tùy chọn 1: Tải trọn bộ 120 video */}
              <div className="relative overflow-hidden p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-3 shadow-2xs">
                {/* Progress bar mỏng 2px chìm dưới đáy card khi đang tải toàn bộ */}
                {downloadingTarget === 'all' && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
                      style={{ width: `${videoDownloadProgress.percent}%` }}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Tải trọn bộ 120 video
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono">
                    {downloadingTarget === 'all' ? (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        Đang tải {videoDownloadProgress.current}/{videoDownloadProgress.total} ({videoDownloadProgress.percent}%)
                      </span>
                    ) : (
                      '~550 MB'
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {videoStats.count >= 120 ? (
                    <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                      Đã tải đủ
                    </span>
                  ) : downloadingTarget === 'all' ? (
                    <button
                      type="button"
                      onClick={handleCancelVideoDownload}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Dừng
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isDownloadingV}
                      onClick={handleDownloadAllVideos}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-100 text-white dark:text-slate-900 text-xs font-bold cursor-pointer disabled:opacity-40 transition-all shadow-2xs"
                    >
                      Tải toàn bộ
                    </button>
                  )}
                </div>
              </div>

              {/* Tùy chọn 2: Danh sách 6 chương */}
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
                  Hoặc tải theo từng chương
                </div>

                <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900/20">
                  {chaptersStatus.map((ch) => {
                    const isThisDownloading = downloadingTarget === ch.id;

                    return (
                      <div
                        key={ch.id}
                        className="relative overflow-hidden p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Progress bar mỏng 2px chìm dưới đáy dòng khi chương này đang tải */}
                        {isThisDownloading && (
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200 dark:bg-zinc-800">
                            <div
                              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150"
                              style={{ width: `${videoDownloadProgress.percent}%` }}
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                            {ch.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono">
                            {isThisDownloading ? (
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                Đang tải {videoDownloadProgress.current}/{videoDownloadProgress.total} ({videoDownloadProgress.percent}%)
                              </span>
                            ) : (
                              `${ch.cachedCount}/{ch.total} video`
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {ch.isComplete ? (
                            <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                              Đã tải
                            </span>
                          ) : isThisDownloading ? (
                            <button
                              type="button"
                              onClick={handleCancelVideoDownload}
                              className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold cursor-pointer"
                            >
                              Dừng
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isDownloadingV}
                              onClick={() => handleDownloadChapter(ch.id)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors"
                            >
                              Tải
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CUSTOM CONFIRMATION DIALOG (XÁC NHẬN XÓA DỮ LIỆU)       */}
      {/* ======================================================== */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          {/* Backdrop layer cố định - không tự tắt khi bấm ngoài */}
          <div
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="relative z-10 bg-white dark:bg-[#0c0d0e] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200/80 dark:border-zinc-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 leading-snug">
                {confirmModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                {confirmModal.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteConfirm}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>{confirmModal.confirmLabel || 'Xác nhận xóa'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
