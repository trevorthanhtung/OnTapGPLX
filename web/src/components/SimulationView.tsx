import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  X
} from 'lucide-react';
import simulationsData from '../data/simulations.json';
import type { SimulationScenario } from '../types';

interface SimulationViewProps {
  onActiveStateChange?: (isActive: boolean) => void;
}

const DEFAULT_CDN = 'https://pub-c2abeb24380a45a987615e62ee85f7e8.r2.dev';
const VIDEO_CDN = (import.meta.env.VITE_VIDEO_CDN_URL || (import.meta.env.PROD ? DEFAULT_CDN : '')).replace(/\/$/, '');
const getVideoSrc = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return `${url}?v=2026.2`;
  if (!VIDEO_CDN) return `${url}?v=2026.2`;
  const cleanUrl = VIDEO_CDN.endsWith('/videos') ? url.replace(/^\/videos/, '') : url;
  return `${VIDEO_CDN}${cleanUrl}?v=2026.2`;
};

export const SimulationView: React.FC<SimulationViewProps> = ({ onActiveStateChange }) => {
  const allScenarios = simulationsData as SimulationScenario[];

  // App Navigation & Modes
  const [mode, setMode] = useState<'hub' | 'practice' | 'exam'>('hub');

  // Notify parent component when entering/exiting simulation study/exam modes
  useEffect(() => {
    onActiveStateChange?.(mode !== 'hub');
  }, [mode, onActiveStateChange]);

  const [activeScenarios, setActiveScenarios] = useState<SimulationScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Playback & Timing state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Practice Interactive Quiz state (for practicing individual scenario)
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});
  const [showPracticeQuiz, setShowPracticeQuiz] = useState(false);

  // Exam Mode state (10 scenarios, 4 questions per scenario = 40 questions total, 0.25 pts each = 10 pts max)
  // examAnswers: { [scenarioIndex: number]: { [part: number]: selectedOptionIndex } }
  const [examAnswers, setExamAnswers] = useState<Record<number, Record<number, number>>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showQuestionSheet, setShowQuestionSheet] = useState(false);

  // Prevent background scrolling and touch drag when a modal is open
  useEffect(() => {
    const isModalOpen = showQuestionSheet || showSubmitConfirm || showExitConfirm || (isExamSubmitted && showResultModal);
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const preventScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('.allow-modal-scroll')) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [showQuestionSheet, showSubmitConfirm, showExitConfirm, isExamSubmitted, showResultModal]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const examScrollRef = useRef<HTMLDivElement>(null);
  const practiceScrollRef = useRef<HTMLDivElement>(null);
  const examQuestionsRef = useRef<HTMLDivElement>(null);
  const practiceQuestionsRef = useRef<HTMLDivElement>(null);
  const currentScenario = activeScenarios[currentIndex];

  // Reset scroll to top when changing scenario
  useEffect(() => {
    if (examScrollRef.current) {
      examScrollRef.current.scrollTop = 0;
    }
    if (practiceScrollRef.current) {
      practiceScrollRef.current.scrollTop = 0;
    }
    if (examQuestionsRef.current) {
      examQuestionsRef.current.scrollTop = 0;
    }
    if (practiceQuestionsRef.current) {
      practiceQuestionsRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Start Chapter Practice
  const startChapter = (chapterId: number) => {
    const list = allScenarios.filter((s) => s.chapter === chapterId);
    setActiveScenarios(list);
    setCurrentIndex(0);
    resetPlayback();
    setPracticeAnswers({});
    setShowPracticeQuiz(false);
    setMode('practice');
  };

  // Start All 120 Scenarios Practice Mode
  const startAllScenarios = () => {
    setActiveScenarios(allScenarios);
    setCurrentIndex(0);
    resetPlayback();
    setPracticeAnswers({});
    setShowPracticeQuiz(false);
    setMode('practice');
  };

  // Start 10-scenario Graduation Exam Mode (Thang 10 điểm - Đạt từ 5.0)
  const startExamMode = () => {
    const shuffled = [...allScenarios].sort(() => Math.random() - 0.5);
    setActiveScenarios(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setExamAnswers({});
    setIsExamSubmitted(false);
    setShowResultModal(false);
    resetPlayback();
    setMode('exam');
  };

  // Submit Exam Mode
  const handleSubmitExam = () => {
    setShowSubmitConfirm(false);
    setIsExamSubmitted(true);
    setShowResultModal(true);
  };

  // Reset playback
  const resetPlayback = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIsScrubbing(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, []);

  // Sync playback on scenario switch
  useEffect(() => {
    resetPlayback();
  }, [currentScenario?.id, resetPlayback]);

  // Jump video to specific time (e.g. indirect or direct milestone)
  const jumpToTime = (timeSec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec;
      setCurrentTime(timeSec);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  // Toggle Play / Pause
  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.ended) {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  // Next / Prev Navigation
  const handleNext = () => {
    if (currentIndex < activeScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetPlayback();
      setPracticeAnswers({});
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetPlayback();
      setPracticeAnswers({});
    }
  };

  // Exam Score Calculation: 10 scenarios * 4 parts * 0.25 = 10.0 points
  const examResult = useMemo(() => {
    if (mode !== 'exam') return { totalScore: 0, isPassed: false, partScores: {} };

    let totalScore = 0;
    const details: Record<number, { score: number; total: number }> = {};

    activeScenarios.forEach((sc, scIdx) => {
      let scScore = 0;
      const userAnswersForSc = examAnswers[scIdx] || {};

      if (sc.quiz) {
        sc.quiz.forEach((q, qIdx) => {
          if (userAnswersForSc[qIdx] === q.correctIndex) {
            scScore += 0.25;
          }
        });
      }

      details[scIdx] = { score: scScore, total: 1.0 };
      totalScore += scScore;
    });

    return {
      totalScore: Number(totalScore.toFixed(2)),
      isPassed: totalScore >= 5.0,
      details
    };
  }, [mode, activeScenarios, examAnswers]);

  // Practice Quiz Answer select
  const handlePracticeSelectAnswer = (qIdx: number, optIdx: number) => {
    setPracticeAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Exam Answer select
  const handleExamSelectAnswer = (scIdx: number, qIdx: number, optIdx: number) => {
    if (isExamSubmitted) return;
    setExamAnswers((prev) => ({
      ...prev,
      [scIdx]: {
        ...(prev[scIdx] || {}),
        [qIdx]: optIdx
      }
    }));
  };

  // Render Question Selection Sheet Modal (Shared for Practice & Exam modes - Exact match to 600 câu)
  const renderQuestionSheet = () => {
    if (!showQuestionSheet) return null;

    const answeredCount =
      mode === 'exam'
        ? activeScenarios.filter((_, scIdx) => {
            const ans = examAnswers[scIdx];
            return ans && Object.keys(ans).length > 0;
          }).length
        : 0;

    return (
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      >
        <div
          className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md landscape-mobile:max-w-xl w-full max-h-[82vh] landscape-mobile:max-h-[92vh] flex flex-col p-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] landscape-mobile:p-3 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200 overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 landscape-mobile:pb-2 mb-3 landscape-mobile:mb-2 border-b border-slate-100 shrink-0">
            <div>
              <h4 className="font-bold text-slate-900 text-base landscape-mobile:text-sm">
                Danh sách câu hỏi
              </h4>
              <p className="text-xs landscape-mobile:text-[11px] text-slate-500 font-medium">
                Đã trả lời {answeredCount} / {activeScenarios.length} câu
              </p>
            </div>
            <button
              onClick={() => setShowQuestionSheet(false)}
              className="p-2 -mr-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              title="Đóng danh sách"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid buttons: 5 columns, identical styling to 600 câu */}
          <div
            style={{ WebkitOverflowScrolling: 'touch' }}
            className="allow-modal-scroll modal-scrollable grid grid-cols-5 landscape-mobile:grid-cols-10 gap-2.5 landscape-mobile:gap-1.5 overflow-y-auto p-1 max-h-[55vh] landscape-mobile:max-h-[65vh] overscroll-contain touch-pan-y"
          >
            {activeScenarios.map((sc, idx) => {
              const isCurrent = idx === currentIndex;
              let btnStyle = 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50';

              if (mode === 'exam') {
                const ansCount = Object.keys(examAnswers[idx] || {}).length;
                const isSelected = ansCount > 0;

                if (isExamSubmitted) {
                  const scScore = examResult?.details?.[idx]?.score ?? 0;
                  if (scScore >= 0.75) {
                    btnStyle = isCurrent
                      ? 'bg-emerald-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-emerald-600 text-white border-2 border-emerald-600 font-bold';
                  } else if (scScore > 0) {
                    btnStyle = isCurrent
                      ? 'bg-amber-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-amber-500 text-white border-2 border-amber-600 font-bold';
                  } else {
                    btnStyle = isCurrent
                      ? 'bg-rose-600 text-white border-2 border-slate-900 font-bold'
                      : 'bg-rose-600 text-white border-2 border-rose-600 font-bold';
                  }
                } else if (isSelected) {
                  btnStyle = isCurrent
                    ? 'bg-slate-900 text-white border-2 border-amber-500 font-bold'
                    : 'bg-slate-900 text-white border-2 border-slate-900 font-semibold';
                } else if (isCurrent) {
                  btnStyle = 'bg-amber-50 text-slate-900 border-2 border-amber-500 font-bold';
                }
              } else {
                if (isCurrent) {
                  btnStyle = 'bg-amber-50 text-slate-900 border-2 border-amber-500 font-bold';
                }
              }

              return (
                <button
                  key={sc.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    resetPlayback();
                  }}
                  className={`relative h-11 rounded-xl text-sm font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95 ${btnStyle}`}
                >
                  <span>{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER: HUB VIEW
  // ==========================================
  if (mode === 'hub') {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-6 sm:py-8 overflow-x-clip animate-in fade-in duration-200">
        {/* Banner Section */}
        <div className="bg-slate-900 rounded-2xl p-5 sm:p-7 text-white mb-8 border border-slate-800 shadow-md">
          <div className="max-w-4xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 leading-snug">
              Bộ 120 Tình Huống Mô Phỏng Giao Thông
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Phần mềm mô phỏng các tình huống giao thông dùng cho sát hạch lái xe theo chuẩn Cục Đường bộ Việt Nam (Phiên bản v2.1.0 mới nhất). Nhận diện dấu hiệu tiềm ẩn, thời điểm nguy hiểm và phương án xử lý an toàn.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={startExamMode}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Thi thử tình huống</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={startAllScenarios}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <span>Ôn luyện toàn bộ 120 tình huống</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Ôn luyện theo 6 chương</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: 1, title: 'Chương I: Giao thông trên đường phố', desc: '29 tình huống thực tế khi tham gia giao thông trong khu đô thị, khu đông dân cư đông đúc.' },
              { id: 2, title: 'Chương II: Giao thông trên đường nông thôn', desc: '14 tình huống thực tế khi tham gia giao thông ở vùng nông thôn, gia súc, chướng ngại vật bất ngờ.' },
              { id: 3, title: 'Chương III: Giao thông trên đường cao tốc', desc: '20 tình huống tham gia giao thông trên cao tốc: nhập làn, chuyển làn, giữ khoảng cách, xe phanh gấp.' },
              { id: 4, title: 'Chương IV: Giao thông trên đường núi', desc: '10 tình huống lái xe đường vùng núi: đèo dốc sương mù, đường trơn trượt, khúc cua khuất tầm nhìn.' },
              { id: 5, title: 'Chương V: Giao thông trên đường quốc lộ', desc: '17 tình huống tham gia giao thông trên quốc lộ: vượt xe, lấn làn, người đi bộ qua đường.' },
              { id: 6, title: 'Chương VI: Các tình huống va chạm giao thông thực tế', desc: '30 tình huống va chạm và tai nạn giao thông thực tế ghi nhận qua camera hành trình.' }
            ].map((ch) => (
              <div
                key={ch.id}
                onClick={() => startChapter(ch.id)}
                className="group p-5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      {ch.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: EXAM MODE (Thi thử tốt nghiệp 10 câu - Thang 10 điểm)
  // ==========================================
  if (mode === 'exam') {
    const isModalActive = (isExamSubmitted && showResultModal) || showQuestionSheet || showSubmitConfirm || showExitConfirm;
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <header className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[env(safe-area-inset-top,0px)] landscape-mobile:pt-[max(0.25rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 landscape-mobile:h-11 gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => {
                    if (mode === 'exam' && !isExamSubmitted) {
                      if (videoRef.current) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      }
                      setShowExitConfirm(true);
                    } else {
                      setMode('hub');
                    }
                  }}
                  className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0 landscape-mobile:p-1.5"
                  title="Thoát đề thi"
                >
                  <ArrowLeft className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4" />
                </button>
                <span className="font-bold text-slate-900 text-base sm:text-lg landscape-mobile:text-sm">
                  Thi thử tình huống
                </span>
              </div>

              <div className="flex items-center gap-3">
                {!isExamSubmitted ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-5 py-2 landscape-mobile:px-3 landscape-mobile:py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm landscape-mobile:text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Nộp bài
                  </button>
                ) : (
                  <button
                    onClick={startExamMode}
                    className="px-5 py-2 landscape-mobile:px-3 landscape-mobile:py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm landscape-mobile:text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Làm đề khác
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Middle Content */}
        <div ref={examScrollRef} className={`flex-1 min-h-0 ${isModalActive ? 'overflow-hidden' : 'overflow-y-auto lg:overflow-hidden landscape-mobile:overflow-hidden'}`}>
          <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-3 sm:py-4 lg:h-full landscape-mobile:py-1.5 landscape-mobile:px-3 landscape-mobile:h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 landscape-mobile:grid-cols-2 gap-4 sm:gap-6 items-start lg:items-stretch landscape-mobile:items-stretch lg:h-full landscape-mobile:h-full">

              {/* Video Column (Left on Landscape Mobile & Desktop - Fixed/Immobile, Sticky Top in Portrait) */}
              <div className="sticky top-0 z-30 bg-slate-50 pt-1 pb-3 mb-2 lg:mb-0 landscape-mobile:mb-0 lg:static landscape-mobile:static lg:h-full landscape-mobile:h-full flex flex-col lg:overflow-hidden landscape-mobile:overflow-hidden lg:col-span-7 xl:col-span-7 2xl:col-span-8">
                {/* Scenario Bar Header: Câu hỏi X / 10 & Danh sách button */}
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/80 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      Câu hỏi {currentIndex + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ {activeScenarios.length}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuestionSheet(true)}
                    className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 active:text-slate-900 cursor-pointer select-none transition-colors py-1 px-1.5 -mr-1.5"
                  >
                    Danh sách
                  </button>
                </div>

                {/* Video Player Card */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0 lg:flex-1 landscape-mobile:flex-1 flex flex-col lg:min-h-0 landscape-mobile:min-h-0">
                  <div className="relative aspect-video lg:aspect-auto landscape-mobile:aspect-auto bg-black flex items-center justify-center lg:flex-1 landscape-mobile:flex-1 lg:min-h-0 landscape-mobile:min-h-0">
                    <video
                      key={currentScenario?.id}
                      ref={videoRef}
                      src={getVideoSrc(currentScenario?.videoUrl)}
                      className="w-full h-full object-contain cursor-pointer"
                      preload="auto"
                      onClick={handlePlayToggle}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={(e) => {
                        setDuration(e.currentTarget.duration || 20);
                      }}
                      onTimeUpdate={(e) => {
                        if (!isScrubbing) {
                          setCurrentTime(e.currentTarget.currentTime);
                          setDuration(e.currentTarget.duration || 20);
                        }
                      }}
                      onEnded={() => {
                        setIsPlaying(false);
                        setCurrentTime(0);
                      }}
                      onError={() => {
                        setIsPlaying(false);
                      }}
                      playsInline
                    />

                    {!isPlaying && (
                      <div
                        onClick={handlePlayToggle}
                        className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center cursor-pointer transition-opacity z-10"
                      >
                        <div className="w-16 h-16 landscape-mobile:w-11 landscape-mobile:h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 landscape-mobile:w-5 landscape-mobile:h-5 ml-0.5 fill-current text-slate-900" />
                        </div>
                        <span className="mt-3 landscape-mobile:mt-1.5 text-white font-medium text-xs landscape-mobile:text-[11px]">
                          Bấm để xem video tình huống
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Video Controls with YouTube-style Seekbar */}
                  <div className="bg-slate-50 border-t border-slate-100 flex flex-col shrink-0">
                    {/* YouTube-style Seekbar */}
                    <div className="relative w-full px-4 pt-3 pb-1 landscape-mobile:pt-1.5 landscape-mobile:pb-0.5 select-none">
                      <div className="relative w-full h-5 landscape-mobile:h-4 flex items-center">
                        <input
                          type="range"
                          min={0}
                          max={duration > 0 ? duration : 20}
                          step={0.05}
                          value={currentTime}
                          onMouseDown={() => setIsScrubbing(true)}
                          onTouchStart={() => setIsScrubbing(true)}
                          onMouseUp={() => setIsScrubbing(false)}
                          onTouchEnd={() => setIsScrubbing(false)}
                          onChange={(e) => {
                            const newTime = parseFloat(e.target.value);
                            setCurrentTime(newTime);
                            if (videoRef.current) {
                              videoRef.current.currentTime = newTime;
                            }
                          }}
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                              duration > 0 ? (currentTime / duration) * 100 : 0
                            }%, #e2e8f0 ${
                              duration > 0 ? (currentTime / duration) * 100 : 0
                            }%, #e2e8f0 100%)`
                          }}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="px-4 pb-3 pt-1 landscape-mobile:py-1 landscape-mobile:px-3 flex items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePlayToggle}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                        <button
                          onClick={resetPlayback}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer"
                          title="Xem lại từ đầu"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <span className="font-mono font-medium">
                          {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Quiz Questions for this Scenario (Right in Landscape Mobile & Desktop, Below Video in Portrait) */}
              <div
                ref={examQuestionsRef}
                className="space-y-3 sm:space-y-4 mb-8 lg:mb-0 landscape-mobile:mb-0 lg:h-full landscape-mobile:h-full lg:overflow-y-auto landscape-mobile:overflow-y-auto pr-0 lg:pr-2 landscape-mobile:pr-1.5 lg:col-span-5 xl:col-span-5 2xl:col-span-4"
              >
            {currentScenario?.quiz?.map((q, qIdx) => {
              const selectedOpt = (examAnswers[currentIndex] || {})[qIdx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 landscape-mobile:p-3.5 shadow-2xs transition-all ${
                    isExamSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : selectedOpt !== undefined
                      ? 'border-slate-300'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm landscape-mobile:text-xs mb-2 sm:mb-3">
                    {q.question}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isOptCorrect = optIdx === q.correctIndex;

                      let optClass = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50';
                      if (isExamSubmitted) {
                        if (isOptCorrect) {
                          optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        } else if (isSelected && !isOptCorrect) {
                          optClass = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        }
                      } else if (isSelected) {
                        optClass = 'border-amber-500 bg-amber-50/60 text-amber-950 font-semibold';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleExamSelectAnswer(currentIndex, qIdx, optIdx)}
                          className={`p-2.5 sm:p-3 landscape-mobile:p-2 rounded-xl border text-xs sm:text-sm landscape-mobile:text-[11px] leading-relaxed transition-all cursor-pointer ${optClass}`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {/* Score text without card badge, placed below options */}
                  <div className="flex items-center justify-end mt-2 text-xs text-slate-400 font-medium">
                    {isExamSubmitted ? (
                      isCorrect ? (
                        <span className="text-emerald-600 font-semibold">+0.25 điểm</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">0 / 0.25 điểm</span>
                      )
                    ) : (
                      <span>0.25 điểm</span>
                    )}
                  </div>

                  {isExamSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">Giải thích: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

            </div>
          </div>
        </div>

        {/* Fixed Bottom Navigation Bar (Exact match to TheoryView) */}
        <div className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pt-1.5 sm:pt-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-[env(safe-area-inset-bottom,0px))] landscape-mobile:pt-1 landscape-mobile:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <div className="text-sm font-bold text-slate-500 font-mono">
              {currentIndex + 1} / {activeScenarios.length}
            </div>

            {currentIndex < activeScenarios.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : !isExamSubmitted ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-xs cursor-pointer"
              >
                <span>Nộp bài thi</span>
              </button>
            ) : (
              <button
                onClick={startExamMode}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span>Làm đề khác</span>
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center justify-between gap-3 landscape-mobile:gap-10 max-w-md landscape-mobile:max-w-2xl mx-auto px-4 py-1.5 landscape-mobile:py-0.5">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm landscape-mobile:text-xs bg-white hover:bg-slate-50 active:scale-97 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
              <span>Trước</span>
            </button>

            {currentIndex < activeScenarios.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-slate-800 active:scale-97 shadow-xs transition-all cursor-pointer"
              >
                <span>Tiếp</span>
                <ChevronRight className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
              </button>
            ) : !isExamSubmitted ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-emerald-700 active:scale-97 shadow-xs transition-all cursor-pointer"
              >
                <span>Nộp bài thi</span>
              </button>
            ) : (
              <button
                onClick={startExamMode}
                className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-slate-800 active:scale-97 shadow-xs transition-all cursor-pointer"
              >
                <span>Làm đề khác</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Dialog for Exam Mode */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Bạn có chắc chắn muốn nộp bài?
              </h4>
              {(() => {
                const answered = activeScenarios.filter((_, scIdx) => examAnswers[scIdx] && Object.keys(examAnswers[scIdx]).length > 0).length;
                return (
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Bạn đã làm <span className="font-bold text-slate-900">{answered}/{activeScenarios.length}</span> tình huống.
                  </p>
                );
              })()}
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

        {/* Exit Confirmation Dialog for Exam Mode */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-bold text-slate-900 mb-2">Thoát bài thi hiện tại?</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Bài thi của bạn đang được bấm giờ. Nếu thoát ra, tiến độ của đề thi này sẽ không được lưu.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Tiếp tục thi
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    if (videoRef.current) {
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                    setMode('hub');
                  }}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal for Exam Mode */}
        {isExamSubmitted && showResultModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className={`text-2xl font-extrabold mb-1 tracking-tight ${
                  examResult.isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {examResult.isPassed ? 'KẾT QUẢ: ĐẠT' : 'KẾT QUẢ: KHÔNG ĐẠT'}
              </h3>

              <div className="text-4xl font-extrabold text-slate-900 my-4 font-mono">
                {examResult.totalScore} / 10
              </div>

              <div className="flex flex-col gap-2.5 mt-6">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Xem lại bài thi vừa làm
                </button>
                <button
                  onClick={startExamMode}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Làm đề thi khác
                </button>
              </div>
            </div>
          </div>
        )}

        {renderQuestionSheet()}
      </div>
    );
  }

  // ==========================================
  // RENDER: PRACTICE / STUDY VIEW (120 Tình huống)
  // ==========================================
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Sticky Header */}
      <header className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[env(safe-area-inset-top,0px)] landscape-mobile:pt-[max(0.25rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 landscape-mobile:px-3">
          <div className="flex items-center justify-between h-14 sm:h-16 landscape-mobile:h-11 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMode('hub')}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0 landscape-mobile:p-1.5"
                title="Quay lại danh mục"
              >
                <ArrowLeft className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-slate-900 text-base sm:text-lg landscape-mobile:text-sm truncate">
                  {currentScenario?.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Middle Content Area */}
      <div ref={practiceScrollRef} className={`flex-1 min-h-0 ${showQuestionSheet ? 'overflow-hidden' : 'overflow-y-auto lg:overflow-hidden landscape-mobile:overflow-hidden'}`}>
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-3 sm:py-4 lg:h-full landscape-mobile:py-1.5 landscape-mobile:px-3 landscape-mobile:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 landscape-mobile:grid-cols-2 gap-4 sm:gap-6 items-start lg:items-stretch landscape-mobile:items-stretch lg:h-full landscape-mobile:h-full">
            {/* Sticky Video Container */}
            <div className="sticky top-0 z-30 bg-slate-50 pt-1 pb-3 mb-2 lg:mb-0 landscape-mobile:mb-0 lg:static landscape-mobile:static lg:h-full landscape-mobile:h-full flex flex-col lg:overflow-hidden landscape-mobile:overflow-hidden lg:col-span-7 xl:col-span-7 2xl:col-span-8">
              {/* Scenario Bar Header: Câu hỏi X / N & Danh sách button (Pattern matching 600 câu) */}
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/80 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Câu hỏi {currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ {activeScenarios.length}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuestionSheet(true)}
                  className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 active:text-slate-900 cursor-pointer select-none transition-colors py-1 px-1.5 -mr-1.5"
                >
                  Danh sách
                </button>
              </div>

              {/* Video Player Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0 lg:flex-1 landscape-mobile:flex-1 flex flex-col lg:min-h-0 landscape-mobile:min-h-0">
          <div className="relative aspect-video lg:aspect-auto landscape-mobile:aspect-auto bg-black flex items-center justify-center lg:flex-1 landscape-mobile:flex-1 lg:min-h-0 landscape-mobile:min-h-0">
            <video
              key={currentScenario?.id}
              ref={videoRef}
              src={getVideoSrc(currentScenario?.videoUrl)}
              className="w-full h-full object-contain cursor-pointer"
              preload="auto"
              onClick={handlePlayToggle}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration || 20);
              }}
              onTimeUpdate={(e) => {
                if (!isScrubbing) {
                  setCurrentTime(e.currentTarget.currentTime);
                  setDuration(e.currentTarget.duration || 20);
                }
              }}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              onError={() => {
                setIsPlaying(false);
              }}
              playsInline
            />

            {/* Big Play Overlay (when paused) */}
            {!isPlaying && (
              <div
                onClick={handlePlayToggle}
                className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center cursor-pointer transition-opacity z-10"
              >
                <div className="w-16 h-16 landscape-mobile:w-11 landscape-mobile:h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 landscape-mobile:w-5 landscape-mobile:h-5 ml-0.5 fill-current text-slate-900" />
                </div>
                <span className="mt-3 landscape-mobile:mt-1.5 text-white font-medium text-xs landscape-mobile:text-[11px]">
                  Bấm để xem video tình huống
                </span>
              </div>
            )}
          </div>

          {/* Video Control Bar with Interactive YouTube Seekbar & Jump Milestones */}
          <div className="bg-slate-50 border-t border-slate-100 flex flex-col shrink-0">
            {/* YouTube-style Seekbar */}
            <div className="relative w-full px-4 pt-3 pb-1 landscape-mobile:pt-1.5 landscape-mobile:pb-0.5 select-none">
              <div className="relative w-full h-5 landscape-mobile:h-4 flex items-center">
                {/* Milestone Indicators on the Track */}
                {currentScenario?.timeIndirect && duration > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-blue-500 rounded-full pointer-events-none z-10 shadow-xs"
                    style={{ left: `${(currentScenario.timeIndirect / duration) * 100}%` }}
                    title={`Dấu hiệu gián tiếp: ${currentScenario.timeIndirect}s`}
                  />
                )}
                {currentScenario?.timeDirect && duration > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-rose-500 rounded-full pointer-events-none z-10 shadow-xs"
                    style={{ left: `${(currentScenario.timeDirect / duration) * 100}%` }}
                    title={`Nguy hiểm xuất hiện: ${currentScenario.timeDirect}s`}
                  />
                )}

                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 20}
                  step={0.05}
                  value={currentTime}
                  onMouseDown={() => setIsScrubbing(true)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onMouseUp={() => setIsScrubbing(false)}
                  onTouchEnd={() => setIsScrubbing(false)}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setCurrentTime(newTime);
                    if (videoRef.current) {
                      videoRef.current.currentTime = newTime;
                    }
                  }}
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%, #e2e8f0 ${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%, #e2e8f0 100%)`
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500 outline-none z-20"
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="px-4 pb-3 pt-1 landscape-mobile:py-1 landscape-mobile:px-3 flex flex-col sm:flex-row landscape-mobile:flex-row items-center justify-between gap-2.5 landscape-mobile:gap-2">
              {/* Play/Pause & Time */}
              <div className="flex items-center gap-2 landscape-mobile:gap-1.5 w-full sm:w-auto landscape-mobile:w-auto shrink-0">
                <button
                  onClick={handlePlayToggle}
                  className="p-2 landscape-mobile:p-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer shadow-2xs"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={resetPlayback}
                  className="p-2 landscape-mobile:p-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer shadow-2xs"
                  title="Xem lại từ đầu"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="text-xs font-mono font-bold text-slate-700 ml-1 landscape-mobile:text-[11px]">
                  {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                </div>
              </div>

              {/* Jump Buttons directly to Key Milestones */}
              <div className="flex flex-wrap items-center gap-2 landscape-mobile:gap-1.5 w-full sm:w-auto landscape-mobile:w-auto justify-end">
                {currentScenario?.timeIndirect && (
                  <button
                    onClick={() => jumpToTime(currentScenario.timeIndirect!)}
                    className="px-3 py-1.5 landscape-mobile:px-2 landscape-mobile:py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs landscape-mobile:text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                    title="Tua đến thời điểm xuất hiện dấu hiệu gián tiếp"
                  >
                    Dấu hiệu gián tiếp ({currentScenario.timeIndirect}s)
                  </button>
                )}

                {currentScenario?.timeDirect && (
                  <button
                    onClick={() => jumpToTime(currentScenario.timeDirect!)}
                    className="px-3 py-1.5 landscape-mobile:px-2 landscape-mobile:py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs landscape-mobile:text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                    title="Tua đến thời điểm xuất hiện dấu hiệu trực tiếp"
                  >
                    Nguy hiểm xuất hiện ({currentScenario.timeDirect}s)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Right in Landscape Mobile & Desktop / Below Video in Portrait */}
      <div
        ref={practiceQuestionsRef}
        className="space-y-4 mb-8 lg:mb-0 landscape-mobile:mb-0 lg:h-full landscape-mobile:h-full lg:overflow-y-auto landscape-mobile:overflow-y-auto pr-0 lg:pr-2 landscape-mobile:pr-1.5 lg:col-span-5 xl:col-span-5 2xl:col-span-4"
      >
        {/* 4-Step Analysis Cards (Quy chế Thông tư mới) */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              Phân tích 4 phần chuẩn quy chế mới
            </h2>
            <button
              onClick={() => setShowPracticeQuiz(!showPracticeQuiz)}
              className="shrink-0 whitespace-nowrap text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              {showPracticeQuiz ? 'Ẩn trắc nghiệm' : 'Làm trắc nghiệm'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {/* Part 1: Tên tình huống */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Phần 1
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">Tên tình huống</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {currentScenario?.part1_name || currentScenario?.title}
                </h3>
              </div>
            </div>

            {/* Part 2: Dấu hiệu gián tiếp */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Phần 2
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">Dấu hiệu gián tiếp</span>
                  </div>
                  {currentScenario?.timeIndirect && (
                    <button
                      onClick={() => jumpToTime(currentScenario.timeIndirect!)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Xem {currentScenario.timeIndirect}s</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentScenario?.part2_indirect}
                </p>
              </div>
            </div>

            {/* Part 3: Dấu hiệu trực tiếp */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Phần 3
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">Dấu hiệu trực tiếp</span>
                  </div>
                  {currentScenario?.timeDirect && (
                    <button
                      onClick={() => jumpToTime(currentScenario.timeDirect!)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Xem {currentScenario.timeDirect}s</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentScenario?.part3_direct}
                </p>
              </div>
            </div>

            {/* Part 4: Phương án xử lý */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Phần 4
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">Phương án xử lý an toàn</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentScenario?.part4_action}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Self-Check Quiz (Optional interactive quiz) */}
        {showPracticeQuiz && currentScenario?.quiz && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8 animate-in fade-in duration-200">
            <div className="mb-3.5">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tự kiểm tra 4 câu trắc nghiệm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn đáp án để xem giải thích chi tiết
              </p>
            </div>

            <div className="space-y-4">
              {currentScenario.quiz.map((q, qIdx) => {
                const selectedOpt = practiceAnswers[qIdx];
                const isSelected = selectedOpt !== undefined;

                return (
                  <div key={qIdx} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm mb-3">
                      {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selectedOpt === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        let optClass = 'border-slate-200 hover:bg-slate-50';
                        if (isSelected) {
                          if (isCorrect) {
                            optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                          } else if (isThisSelected && !isCorrect) {
                            optClass = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                          }
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handlePracticeSelectAnswer(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${optClass}`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Giải thích: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar (Exact match to TheoryView) */}
      <div className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pt-1.5 sm:pt-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-[env(safe-area-inset-bottom,0px))] landscape-mobile:pt-1 landscape-mobile:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <div className="text-sm font-bold text-slate-500 font-mono">
            {currentIndex + 1} / {activeScenarios.length}
          </div>

          {currentIndex < activeScenarios.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
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
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm landscape-mobile:text-xs bg-white hover:bg-slate-50 active:scale-97 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
            <span>Trước</span>
          </button>

          {currentIndex < activeScenarios.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 landscape-mobile:py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm landscape-mobile:text-xs hover:bg-slate-800 active:scale-97 shadow-xs transition-all cursor-pointer"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4 landscape-mobile:w-3.5 landscape-mobile:h-3.5" />
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

      {/* Question Sheet Modal */}
      {renderQuestionSheet()}
    </div>
  );
};
