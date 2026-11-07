import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import type { LicenseCategory, Question } from '../types';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import { ExamGenerator, questionsData } from '../services/examGenerator';
import { StorageService } from '../services/storage';

interface TheoryViewProps {
  currentCategory: LicenseCategory;
  onRefreshStats: () => void;
  onActiveStateChange?: (isActive: boolean) => void;
}

type Mode = 'hub' | 'exam' | 'practice_critical' | 'practice_chapter' | 'practice_wrong' | 'practice_all';

const CHAPTERS = [
  { id: 1, title: 'Chương 1: Khái niệm và quy tắc giao thông đường bộ', range: 'Câu 1 - 166', count: 166 },
  { id: 2, title: 'Chương 2: Nghiệp vụ vận tải', range: 'Câu 167 - 192', count: 26 },
  { id: 3, title: 'Chương 3: Văn hóa giao thông và đạo đức người lái xe', range: 'Câu 193 - 213', count: 21 },
  { id: 4, title: 'Chương 4: Kỹ thuật lái xe', range: 'Câu 214 - 269', count: 56 },
  { id: 5, title: 'Chương 5: Cấu tạo và sửa chữa', range: 'Câu 270 - 304', count: 35 },
  { id: 6, title: 'Chương 6: Hệ thống biển báo hiệu đường bộ', range: 'Câu 305 - 486', count: 182 },
  { id: 7, title: 'Chương 7: Giải các thế sa hình và kỹ năng xử lý tình huống giao thông', range: 'Câu 487 - 600', count: 114 }
];

export const TheoryView: React.FC<TheoryViewProps> = ({ currentCategory, onRefreshStats, onActiveStateChange }) => {
  const currentConfig = useMemo(
    () => LICENSE_CATEGORIES.find((c) => c.id === currentCategory) || LICENSE_CATEGORIES[0],
    [currentCategory]
  );

  const [mode, setMode] = useState<Mode>('hub');

  // Notify parent component when entering/exiting study/exam modes to toggle mobile bottom nav
  useEffect(() => {
    onActiveStateChange?.(mode !== 'hub');
  }, [mode, onActiveStateChange]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>(StorageService.getBookmarks());
  const [wrongQuestionIds, setWrongQuestionIds] = useState<number[]>(StorageService.getWrongQuestions());
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showMobileQuestionSheet, setShowMobileQuestionSheet] = useState(false);

  // Mobile chapter carousel state
  const [currentChapterSlide, setCurrentChapterSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 35) {
      if (delta > 0) {
        setCurrentChapterSlide((prev) => (prev + 1) % CHAPTERS.length);
      } else {
        setCurrentChapterSlide((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current !== 0) {
      touchEndX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    if (touchStartX.current !== 0) {
      const delta = touchStartX.current - touchEndX.current;
      if (Math.abs(delta) > 35) {
        if (delta > 0) {
          setCurrentChapterSlide((prev) => (prev + 1) % CHAPTERS.length);
        } else {
          setCurrentChapterSlide((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
        }
      }
      touchStartX.current = 0;
      touchEndX.current = 0;
    }
  };

  const currentQ = activeQuestions[currentIndex];

  // Start Exam
  const startExam = useCallback(() => {
    const questions = ExamGenerator.generateExam(currentCategory);
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setTimeLeftSeconds(currentConfig.timeMinutes * 60);
    setMode('exam');
  }, [currentCategory, currentConfig]);

  // Start 60 Critical Questions Practice
  const startCriticalPractice = useCallback(() => {
    const questions = ExamGenerator.getCriticalQuestions();
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(0);
    setMode('practice_critical');
  }, []);

  // Start Practice by Chapter
  const startChapterPractice = useCallback((chapterId: number) => {
    const questions = ExamGenerator.getQuestionsByChapter(chapterId);
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(0);
    setSelectedChapter(chapterId);
    setMode('practice_chapter');
  }, []);

  // Start Practice Wrong Questions
  const startWrongPractice = useCallback(() => {
    const ids = StorageService.getWrongQuestions();
    if (ids.length === 0) return;
    const questions = ExamGenerator.getQuestionsByIds(ids);
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(0);
    setMode('practice_wrong');
  }, []);

  // Start All 600 Questions
  const startAllQuestions = useCallback(() => {
    setActiveQuestions(questionsData);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeftSeconds(0);
    setMode('practice_all');
  }, []);

  // Timer countdown for exam mode
  useEffect(() => {
    if (mode !== 'exam' || isSubmitted || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isSubmitted, timeLeftSeconds]);

  // Handle select answer
  const handleSelectAnswer = (choice: number) => {
    if (isSubmitted && mode === 'exam') return;
    if (!currentQ) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choice
    }));

    StorageService.markStudied(currentQ.id);

    // In practice modes, record wrong answers immediately
    if (mode !== 'exam') {
      if (choice !== currentQ.correctAnswer) {
        StorageService.recordWrongQuestion(currentQ.id);
        setWrongQuestionIds(StorageService.getWrongQuestions());
      } else {
        StorageService.removeWrongQuestion(currentQ.id);
        setWrongQuestionIds(StorageService.getWrongQuestions());
      }
      onRefreshStats();
    }
  };

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    if (mode === 'hub') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentIndex < activeQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentIndex, activeQuestions.length]);

  // Submit Exam
  const handleSubmitExam = useCallback(() => {
    setShowSubmitConfirm(false);
    setIsSubmitted(true);
    setShowResultModal(true);
    let correctCount = 0;
    let failedCritId: number | undefined;

    activeQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctAnswer) {
        correctCount++;
        StorageService.removeWrongQuestion(q.id);
      } else {
        StorageService.recordWrongQuestion(q.id);
        if (q.isCritical && !failedCritId) {
          failedCritId = q.id;
        }
      }
    });

    const isPassed = correctCount >= currentConfig.passScore && !failedCritId;

    StorageService.addExamHistory({
      id: Date.now().toString(),
      category: currentCategory,
      date: new Date().toLocaleDateString('vi-VN'),
      score: correctCount,
      total: activeQuestions.length,
      isPassed,
      failedCriticalId: failedCritId,
      durationSeconds: currentConfig.timeMinutes * 60 - timeLeftSeconds
    });

    setWrongQuestionIds(StorageService.getWrongQuestions());
    onRefreshStats();
  }, [activeQuestions, userAnswers, currentConfig, currentCategory, timeLeftSeconds, onRefreshStats]);

  // Toggle bookmark on question
  const toggleBookmark = (id: number) => {
    StorageService.toggleBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  };

  // Calculation of exam results
  const examStats = useMemo(() => {
    if (!isSubmitted) return null;
    let correct = 0;
    let failedCritical: number | null = null;

    activeQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === q.correctAnswer) {
        correct++;
      } else if (q.isCritical && !failedCritical) {
        failedCritical = q.id;
      }
    });

    const isPassed = correct >= currentConfig.passScore && !failedCritical;
    return {
      correct,
      total: activeQuestions.length,
      isPassed,
      failedCritical
    };
  }, [isSubmitted, activeQuestions, userAnswers, currentConfig]);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    const isModalOpen = showExitConfirm || showSubmitConfirm || (isSubmitted && Boolean(examStats) && showResultModal) || showMobileQuestionSheet;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showExitConfirm, showSubmitConfirm, isSubmitted, examStats, showResultModal, showMobileQuestionSheet]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Prevent accidental tab close / reload during exam on Web
  useEffect(() => {
    if (mode === 'exam' && !isSubmitted) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [mode, isSubmitted]);

  // History Back navigation for mobile swipe gesture and browser back button
  useEffect(() => {
    if (mode === 'hub') return;

    window.history.pushState({ component: 'theory', mode }, '');

    const handlePopState = () => {
      // 1. If mobile question sheet is open, close it first
      if (showMobileQuestionSheet) {
        setShowMobileQuestionSheet(false);
        window.history.pushState({ component: 'theory', mode }, '');
        return;
      }

      // 2. If submit confirmation is open, close it
      if (showSubmitConfirm) {
        setShowSubmitConfirm(false);
        window.history.pushState({ component: 'theory', mode }, '');
        return;
      }

      // 3. If exit confirmation is open, close it
      if (showExitConfirm) {
        setShowExitConfirm(false);
        window.history.pushState({ component: 'theory', mode }, '');
        return;
      }

      // 4. If in active exam and not submitted, prompt exit confirmation
      if (mode === 'exam' && !isSubmitted) {
        setShowExitConfirm(true);
        window.history.pushState({ component: 'theory', mode }, '');
        return;
      }

      // 5. Otherwise (practice mode or submitted exam), exit to hub
      setMode('hub');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [mode, isSubmitted, showMobileQuestionSheet, showSubmitConfirm, showExitConfirm]);

  // ==========================================
  // RENDER: HUB VIEW
  // ==========================================
  if (mode === 'hub') {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-6 sm:py-8 animate-in fade-in duration-200">
        {/* Banner Section - Merged with Browse 600 Questions */}
        <div className="bg-slate-900 rounded-2xl p-5 sm:p-7 text-white mb-8 border border-slate-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5 leading-snug">
                Bộ 600 Câu Hỏi Lý Thuyết Sát Hạch Lái Xe
              </h1>

              <button
                onClick={startAllQuestions}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Luyện toàn bộ 600 câu</span>
              </button>
            </div>

            {/* Structured 3-column Telemetry / Exam Specs Card */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center lg:min-w-[340px]">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-700/60 text-center">
                Tiêu chuẩn đạt sát hạch
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1 whitespace-nowrap">Thời gian</span>
                  <span className="text-sm sm:text-base font-bold text-slate-100 whitespace-nowrap">{currentConfig.timeMinutes} phút</span>
                </div>
                <div className="flex flex-col justify-center border-x border-slate-700/60 px-1 sm:px-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1 whitespace-nowrap">Điểm đạt</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400 whitespace-nowrap">{currentConfig.passScore}/{currentConfig.totalQuestions}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1 whitespace-nowrap">Điểm liệt</span>
                  <span className="text-sm sm:text-base font-bold text-rose-400 whitespace-nowrap">0 câu sai</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid: 3 balanced cards with subtle watermark art */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Card 1: Thi Thử */}
          <div
            onClick={startExam}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden isolate"
          >
            {/* Subtle Watermark Art: Exam Timer & Checklist */}
            <div className="absolute right-0 top-0 w-32 h-32 opacity-[0.06] group-hover:opacity-[0.11] group-hover:scale-105 transition-all pointer-events-none text-slate-900 overflow-hidden">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="50" cy="50" r="40" strokeDasharray="180 80" />
                <path d="M50 20 V50 L68 50" strokeLinecap="round" />
                <path d="M26 72 L34 80 L48 64" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                Thi thử theo đề chuẩn
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Tạo đề thi ngẫu nhiên gồm {currentConfig.totalQuestions} câu theo đúng cấu trúc đề sát hạch lái xe hạng {currentConfig.id}.
              </p>
            </div>

            <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors pt-3 border-t border-slate-100">
              <span>Bắt đầu thi thử</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 60 Câu Điểm Liệt */}
          <div
            onClick={startCriticalPractice}
            className="group relative bg-white rounded-2xl border border-rose-200/80 p-5 sm:p-6 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden isolate"
          >
            {/* Subtle Watermark Art: Caution Triangle Hazard */}
            <div className="absolute right-0 top-0 w-32 h-32 opacity-[0.08] group-hover:opacity-[0.14] group-hover:scale-105 transition-all pointer-events-none text-rose-600 overflow-hidden">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M50 14 L90 84 H10 Z" strokeLinejoin="round" />
                <line x1="50" y1="36" x2="50" y2="60" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="72" r="3.5" fill="currentColor" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                60 Câu hỏi điểm liệt
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                60 câu hỏi về tình huống mất an toàn giao thông nghiêm trọng. Trả lời sai 1 câu hỏi điểm liệt bị tính không đạt ngay lập tức.
              </p>
            </div>

            <div className="flex items-center text-sm font-semibold text-rose-600 group-hover:text-rose-700 transition-colors pt-3 border-t border-rose-50">
              <span>Luyện 60 câu điểm liệt</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Ôn lại câu sai */}
          <div
            onClick={startWrongPractice}
            className={`group relative bg-white rounded-2xl border p-5 sm:p-6 transition-all flex flex-col justify-between overflow-hidden isolate ${
              wrongQuestionIds.length > 0
                ? 'border-amber-200/90 hover:border-amber-300 hover:shadow-md cursor-pointer'
                : 'border-slate-200 opacity-75 cursor-not-allowed'
            }`}
          >
            {/* Subtle Watermark Art: Revision Notebook / Checkmark Loop */}
            <div className="absolute right-0 top-0 w-32 h-32 opacity-[0.08] group-hover:opacity-[0.14] group-hover:scale-105 transition-all pointer-events-none text-amber-600 overflow-hidden">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="22" y="16" width="56" height="68" rx="8" />
                <line x1="14" y1="30" x2="22" y2="30" strokeWidth="4" strokeLinecap="round" />
                <line x1="14" y1="46" x2="22" y2="46" strokeWidth="4" strokeLinecap="round" />
                <line x1="14" y1="62" x2="22" y2="62" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 40 L42 48 L58 30" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="36" y1="60" x2="62" y2="60" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                Câu hay làm sai
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Tự động tổng hợp các câu hỏi bạn từng trả lời sai để rèn luyện và ôn tập lại kỹ càng.
              </p>
            </div>

            <div className="flex items-center text-sm font-semibold text-amber-700 group-hover:text-amber-800 transition-colors pt-3 border-t border-amber-50">
              <span>{wrongQuestionIds.length > 0 ? 'Ôn lại câu sai' : 'Chưa có câu sai nào'}</span>
              {wrongQuestionIds.length > 0 && <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
            </div>
          </div>
        </div>

        {/* Section: Ôn tập theo 7 chương */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
            Ôn luyện theo 7 chương lý thuyết
          </h2>

          {/* Mobile Single Card Carousel with swipe */}
          <div className="block md:hidden w-full max-w-full overflow-hidden">
            <div
              className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 overflow-hidden w-full max-w-full transition-all select-none cursor-pointer touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (touchStartX.current !== 0) handleMouseUp();
              }}
            >
              {/* Slider Track */}
              <div className="overflow-hidden w-full max-w-full">
                <div
                  className="flex transition-transform duration-300 ease-out w-full"
                  style={{ transform: `translateX(-${currentChapterSlide * 100}%)` }}
                >
                  {CHAPTERS.map((ch) => (
                    <div
                      key={ch.id}
                      className="w-full shrink-0 py-2 cursor-pointer"
                      onClick={() => startChapterPractice(ch.id)}
                    >
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {ch.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls & Dot Indicators */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentChapterSlide((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
                  }}
                  className="p-1.5 -ml-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Chương trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* 7 dots */}
                <div className="flex items-center gap-1.5">
                  {CHAPTERS.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentChapterSlide(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        currentChapterSlide === idx
                          ? 'w-6 bg-amber-500'
                          : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Chuyển đến chương ${ch.id}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentChapterSlide((prev) => (prev + 1) % CHAPTERS.length);
                  }}
                  className="p-1.5 -mr-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Chương tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                onClick={() => startChapterPractice(ch.id)}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{ch.title}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: EXAM / PRACTICE VIEW
  // ==========================================
  const currentNumOptions = currentQ?.totalOptions || 4;
  const currentChoices = Array.from({ length: currentNumOptions }, (_, i) => i + 1);
  const optionsGridClass =
    currentNumOptions === 2
      ? 'grid-cols-2'
      : currentNumOptions === 3
      ? 'grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-4 landscape-mobile:grid-cols-2';

  // In real exams, candidates are NOT shown which question is critical until after submit.
  // In 'practice_critical', 100% of questions are already critical, so red dots and badges are omitted to avoid visual clutter.
  const showCriticalHint = mode !== 'practice_critical' && (mode !== 'exam' || isSubmitted);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Sticky Unified Header Bar */}
      <header className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[env(safe-area-inset-top,0px)] landscape-mobile:pt-[max(0.25rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 landscape-mobile:px-3">
          <div className="flex items-center justify-between h-14 sm:h-16 landscape-mobile:h-11 gap-3">
            {/* Left: Exit/Back Button & Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => {
                  if (mode === 'exam' && !isSubmitted) {
                    setShowExitConfirm(true);
                  } else {
                    setMode('hub');
                  }
                }}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shrink-0 cursor-pointer landscape-mobile:p-1.5"
                title="Quay lại danh mục"
              >
                <ArrowLeft className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-slate-900 text-base sm:text-lg landscape-mobile:text-sm truncate">
                  {mode === 'exam'
                    ? `Đề thi sát hạch ${currentConfig.id}`
                    : mode === 'practice_critical'
                    ? '60 Câu hỏi điểm liệt'
                    : mode === 'practice_chapter'
                    ? `Chương ${selectedChapter}`
                    : mode === 'practice_wrong'
                    ? 'Ôn lại các câu sai'
                    : 'Toàn bộ 600 câu'}
                </span>
              </div>
            </div>

            {/* Right: Timer / Submit / Bookmark */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {mode === 'exam' && !isSubmitted && (
                <div
                  className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl border font-mono font-bold text-sm tracking-wide flex items-center justify-center shrink-0 ${
                    timeLeftSeconds < 180
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>
              )}

              {mode === 'exam' && !isSubmitted && (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="lg:hidden h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  Nộp bài
                </button>
              )}

              {isSubmitted && (
                <button
                  onClick={startExam}
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  <span className="hidden sm:inline">Thi đề mới</span>
                  <span className="sm:hidden">Đề mới</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => currentQ && toggleBookmark(currentQ.id)}
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  currentQ && bookmarks.includes(currentQ.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={currentQ && bookmarks.includes(currentQ.id) ? 'Bỏ lưu câu hỏi này' : 'Lưu câu hỏi để xem lại'}
              >
                <Bookmark
                  className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4"
                  fill={currentQ && bookmarks.includes(currentQ.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Study Body */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 landscape-mobile:py-1.5 landscape-mobile:px-3 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] flex-1 min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden">

      {/* Main Study Grid: Left Desktop Sidebar + Center Question Image & Choices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">
        {/* Left Side: Desktop Question Navigator Map */}
        <div className="hidden lg:flex lg:col-span-4 flex-col h-full min-h-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-full flex flex-col min-h-0">
            <div className="mb-4 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Danh sách câu hỏi</span>
                <span className="text-xs text-slate-500 font-medium">
                  {Object.keys(userAnswers).length} / {activeQuestions.length} đã làm
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                  style={{
                    width: `${activeQuestions.length > 0 ? (Object.keys(userAnswers).length / activeQuestions.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 flex-1 min-h-0 overflow-y-auto p-1 content-start">
              {activeQuestions.map((q, idx) => {
                const isSelected = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const showResultForQ = isSubmitted || (mode !== 'exam' && isSelected);
                const isCorrect = showResultForQ && userAnswers[q.id] === q.correctAnswer;
                const isWrong = showResultForQ && isSelected && !isCorrect;
                const isBookmarked = bookmarks.includes(q.id);

                let btnStyle = 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300';

                if (showResultForQ) {
                  if (isCorrect) {
                    btnStyle = isCurrent
                      ? 'bg-emerald-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-emerald-600 text-white border-2 border-emerald-700 font-bold';
                  } else if (isWrong) {
                    btnStyle = isCurrent
                      ? 'bg-rose-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-rose-600 text-white border-2 border-rose-700 font-bold';
                  } else {
                    btnStyle = isCurrent
                      ? 'bg-slate-100 text-slate-800 border-2 border-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200';
                  }
                } else if (isBookmarked) {
                  // Tô vàng theo yêu cầu của user
                  btnStyle = isCurrent
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 ring-2 ring-amber-400 font-bold shadow-xs'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 font-bold shadow-xs'
                    : 'bg-amber-400 text-slate-950 border-2 border-amber-500 font-bold shadow-xs';
                } else if (isSelected) {
                  btnStyle = isCurrent
                    ? 'bg-slate-900 text-white border-2 border-amber-400 ring-2 ring-slate-900 font-bold shadow-xs'
                    : 'bg-slate-900 text-white border-2 border-slate-900 font-semibold';
                } else if (isCurrent) {
                  btnStyle = 'bg-slate-100 text-slate-900 border-2 border-slate-900 font-bold shadow-xs';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-10 rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {q.isCritical && showCriticalHint && (
                      <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-rose-500" title="Câu điểm liệt" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-900"></span> Đã làm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-white border-2 border-slate-300"></span> Chưa làm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 border border-amber-500"></span> Đã lưu
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border-2 border-slate-900"></span> Đang xem
              </span>
              {showCriticalHint && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Điểm liệt
                </span>
              )}
            </div>

            {/* Quick Submit button on Desktop */}
            {mode === 'exam' && !isSubmitted && (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full mt-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                Nộp bài thi
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Main Question Card */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-0">
          {currentQ ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 landscape-mobile:p-2.5 shadow-xs flex flex-col justify-between h-full min-h-0 overflow-y-auto no-scrollbar">
              <div className="flex flex-col flex-1 min-h-0 justify-between">
                {/* Question Card Header */}
                <div className="flex items-center justify-between pb-2 mb-2 sm:mb-3 landscape-mobile:pb-1.5 landscape-mobile:mb-1.5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      Câu hỏi {currentIndex + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ {activeQuestions.length}</span>
                  </div>

                  {/* Right: Plain text "Danh sách" (no card, pure text) */}
                  <button
                    type="button"
                    onClick={() => setShowMobileQuestionSheet(true)}
                    className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 active:text-slate-900 cursor-pointer select-none lg:hidden transition-colors py-1 px-1.5 -mr-1.5"
                  >
                    Danh sách
                  </button>
                </div>

                {/* Card Inner Content: Column in Portrait/Desktop, 2-Col Row in Landscape Mobile */}
                <div className="flex flex-col landscape-mobile:flex-row landscape-mobile:gap-3 flex-1 min-h-0 justify-between">
                  {/* Left Column in Landscape Mobile / Image Box in Portrait */}
                  <div className="w-full mb-3 sm:mb-4 landscape-mobile:mb-0 rounded-xl overflow-hidden border border-slate-100 bg-white flex items-center justify-center p-1 sm:p-2.5 landscape-mobile:p-1 flex-1 min-h-0 max-h-[42vh] sm:max-h-none landscape-mobile:max-h-none landscape-mobile:w-[58%]">
                    <img
                      src={currentQ.image}
                      alt={`Câu hỏi ${currentIndex + 1}`}
                      className="w-full h-full max-w-full max-h-full object-contain select-none"
                      loading="eager"
                    />
                  </div>

                  {/* Right Column in Landscape Mobile / Choices + Tip in Portrait */}
                  <div className="flex flex-col shrink-0 landscape-mobile:shrink landscape-mobile:w-[42%] landscape-mobile:justify-between landscape-mobile:min-h-0 landscape-mobile:overflow-y-auto no-scrollbar">
                    <div>
                      {/* Dynamic Answer Choices */}
                      <div className="mb-2 sm:mb-4 landscape-mobile:mb-2 shrink-0">
                        <div className="mb-1.5 landscape-mobile:mb-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                          Chọn đáp án đúng
                        </div>
                        <div className={`grid ${optionsGridClass} gap-2 sm:gap-3 landscape-mobile:gap-1.5`}>
                          {currentChoices.map((choice) => {
                            const isSelected = userAnswers[currentQ.id] === choice;
                            const isCorrectAnswer = currentQ.correctAnswer === choice;
                            const hasAnswered = userAnswers[currentQ.id] !== undefined;
                            const showResult = isSubmitted || (mode !== 'exam' && hasAnswered);

                            let btnStyle = 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

                            if (showResult && isCorrectAnswer) {
                              btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs';
                            } else if (showResult && isSelected && !isCorrectAnswer) {
                              btnStyle = 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-xs';
                            } else if (isSelected) {
                              btnStyle = 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs';
                            }

                            return (
                              <button
                                key={choice}
                                onClick={() => handleSelectAnswer(choice)}
                                className={`h-12 sm:h-14 landscape-mobile:h-10 rounded-xl border-2 flex items-center justify-center text-base sm:text-lg landscape-mobile:text-sm font-bold transition-all cursor-pointer active:scale-98 ${btnStyle}`}
                              >
                                Ý {choice}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tip / Explanation in Practice Mode (only after selecting an answer) or after Submit in Exam */}
                      {(isSubmitted || (mode !== 'exam' && userAnswers[currentQ.id] !== undefined)) && (
                        <div className="p-3 landscape-mobile:p-2 rounded-xl bg-slate-50 border border-slate-200 mb-2 shrink-0 animate-in fade-in duration-150">
                          <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                            Đáp án đúng: Ý {currentQ.correctAnswer}
                          </div>
                          <p className="text-xs sm:text-sm landscape-mobile:text-xs text-slate-700 leading-relaxed font-medium">
                            {currentQ.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Không tìm thấy câu hỏi</div>
          )}
        </div>
      </div>
      </div>

      {/* Fixed Bottom Navigation Bar (Unified for Desktop and Mobile) */}
      <div className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pt-1.5 sm:pt-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-[env(safe-area-inset-bottom,0px)] landscape-mobile:pt-1 landscape-mobile:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <div className="text-sm font-bold text-slate-500 font-mono">
            {currentIndex + 1} / {activeQuestions.length}
          </div>

          {currentIndex < activeQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : mode === 'exam' && !isSubmitted ? (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-xs cursor-pointer"
            >
              <span>Nộp bài thi</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('hub')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Hoàn thành</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between gap-3 landscape-mobile:gap-10 max-w-md landscape-mobile:max-w-2xl mx-auto px-4 py-1.5 landscape-mobile:py-0.5">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm landscape-mobile:text-xs bg-white hover:bg-slate-50 active:scale-97 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
            <span>Trước</span>
          </button>

          {currentIndex < activeQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
              className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-slate-800 active:scale-97 shadow-xs transition-all cursor-pointer"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
            </button>
          ) : mode === 'exam' && !isSubmitted ? (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-emerald-700 active:scale-97 shadow-xs transition-all cursor-pointer"
            >
              <span>Nộp bài thi</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('hub')}
              className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-slate-800 active:scale-97 shadow-xs transition-all cursor-pointer"
            >
              <span>Hoàn thành</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Question Grid Sheet Modal */}
      {showMobileQuestionSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md landscape-mobile:max-w-xl w-full max-h-[82vh] landscape-mobile:max-h-[92vh] flex flex-col p-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] landscape-mobile:p-3 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 landscape-mobile:pb-2 mb-3 landscape-mobile:mb-2 border-b border-slate-100 shrink-0">
              <div>
                <h4 className="font-bold text-slate-900 text-base landscape-mobile:text-sm">Danh sách câu hỏi</h4>
                <p className="text-xs landscape-mobile:text-[11px] text-slate-500 font-medium">
                  Đã trả lời {Object.keys(userAnswers).length} / {activeQuestions.length} câu
                </p>
              </div>
              <button
                onClick={() => setShowMobileQuestionSheet(false)}
                className="p-2 -mr-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="modal-scrollable grid grid-cols-5 landscape-mobile:grid-cols-10 gap-2.5 landscape-mobile:gap-1.5 overflow-y-auto p-1 max-h-[55vh] landscape-mobile:max-h-[65vh] overscroll-contain touch-pan-y"
            >
              {activeQuestions.map((q, idx) => {
                const isSelected = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const showResultForQ = isSubmitted || (mode !== 'exam' && isSelected);
                const isCorrect = showResultForQ && userAnswers[q.id] === q.correctAnswer;
                const isWrong = showResultForQ && isSelected && !isCorrect;
                const isBookmarked = bookmarks.includes(q.id);

                let btnStyle = 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50';

                if (showResultForQ) {
                  if (isCorrect) {
                    btnStyle = isCurrent
                      ? 'bg-emerald-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-emerald-600 text-white border-2 border-emerald-600 font-bold';
                  } else if (isWrong) {
                    btnStyle = isCurrent
                      ? 'bg-rose-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-rose-600 text-white border-2 border-rose-600 font-bold';
                  } else {
                    btnStyle = isCurrent
                      ? 'bg-slate-100 text-slate-800 border-2 border-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200';
                  }
                } else if (isBookmarked) {
                  // Tô vàng theo yêu cầu của user
                  btnStyle = isCurrent
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 ring-2 ring-amber-400 font-bold shadow-xs'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 font-bold shadow-xs'
                    : 'bg-amber-400 text-slate-950 border-2 border-amber-500 font-bold shadow-xs';
                } else if (isSelected) {
                  btnStyle = isCurrent
                    ? 'bg-slate-900 text-white border-2 border-amber-400 font-bold shadow-xs'
                    : 'bg-slate-900 text-white border-2 border-slate-900 font-semibold';
                } else if (isCurrent) {
                  btnStyle = 'bg-slate-100 text-slate-900 border-2 border-slate-900 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMobileQuestionSheet(false);
                    }}
                    className={`relative h-11 rounded-xl text-sm font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95 ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {q.isCritical && showCriticalHint && (
                      <span
                        className="absolute top-1 left-1 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white"
                        title="Câu điểm liệt"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Sheet Legend */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-1.5 text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-slate-900"></span> Đã làm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-white border border-slate-300"></span> Chưa làm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-400 border border-amber-500"></span> Đã lưu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-slate-100 border border-slate-900"></span> Đang xem
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal for Exam Mode */}
      {isSubmitted && examStats && showResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-2xl font-extrabold mb-1 tracking-tight ${
                examStats.isPassed ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {examStats.isPassed ? 'KẾT QUẢ: ĐẠT' : 'KẾT QUẢ: KHÔNG ĐẠT'}
            </h3>

            <div className="text-4xl font-extrabold text-slate-900 my-4 font-mono">
              {examStats.correct} / {examStats.total}
            </div>

            <div className="flex flex-col gap-2.5 mt-6">
              <button
                onClick={() => setShowResultModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Xem lại bài thi vừa làm
              </button>
              <button
                onClick={startExam}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
              >
                Làm đề thi khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Bạn có chắc chắn muốn nộp bài?
            </h4>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn đã hoàn thành <span className="font-bold text-slate-900">{Object.keys(userAnswers).length}/{activeQuestions.length}</span> câu hỏi.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmitExam();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold text-slate-900 mb-2">Thoát bài thi hiện tại?</h4>
            <p className="text-xs text-slate-500 mb-6">
              Bài thi của bạn đang được bấm giờ. Nếu thoát ra, tiến độ của đề thi này sẽ không được lưu.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Tiếp tục thi
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setMode('hub');
                }}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
