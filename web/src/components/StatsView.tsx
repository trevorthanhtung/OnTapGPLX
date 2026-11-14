import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { ExamHistoryItem, SimulationExamHistoryItem } from '../services/storage';
import { StorageService } from '../services/storage';
import { I18nService, type AppLanguage } from '../locales/i18n';

interface StatsViewProps {
  onGoToWrongQuestions: () => void;
  onRefresh: () => void;
  onReviewExam?: (item: ExamHistoryItem) => void;
  onReviewSimExam?: (item: SimulationExamHistoryItem) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  onGoToWrongQuestions,
  onRefresh,
  onReviewExam,
  onReviewSimExam
}) => {
  const [currentLang, setCurrentLang] = useState<AppLanguage>(I18nService.getLanguage());

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setCurrentLang(e.detail || I18nService.getLanguage());
    };
    window.addEventListener('ontapgplx:language_change', handleLangChange);
    return () => window.removeEventListener('ontapgplx:language_change', handleLangChange);
  }, []);

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = I18nService.t(key, currentLang);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };

  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>(StorageService.getExamHistory());
  const [simHistory, setSimHistory] = useState<SimulationExamHistoryItem[]>(StorageService.getSimulationHistory());
  const [historyTab, setHistoryTab] = useState<'theory' | 'simulation'>('theory');
  const [wrongCount, setWrongCount] = useState<number>(StorageService.getWrongQuestions().length);
  const [studiedCount, setStudiedCount] = useState<number>(StorageService.getStudiedQuestions().length);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Lock body & window scroll when confirmation modal is visible
  useEffect(() => {
    if (showConfirmClear) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmClear]);

  const handleClearHistory = () => {
    StorageService.clearAllProgress();
    setExamHistory([]);
    setSimHistory([]);
    setStudiedCount(0);
    setWrongCount(0);
    setShowConfirmClear(false);
    onRefresh?.();
  };

  // Pass rate calculation (Theory)
  const totalExams = examHistory.length;
  const passedExams = examHistory.filter((e) => e.isPassed).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

  // Mobile carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
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
        setCurrentSlide((prev) => (prev + 1) % 4);
      } else {
        setCurrentSlide((prev) => (prev - 1 + 4) % 4);
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
          setCurrentSlide((prev) => (prev + 1) % 4);
        } else {
          setCurrentSlide((prev) => (prev - 1 + 4) % 4);
        }
      }
      touchStartX.current = 0;
      touchEndX.current = 0;
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('stats.title')}</h1>
      </div>

      {/* Mobile Stat Carousel */}
      <div className="block md:hidden mb-8 w-full max-w-full overflow-hidden">
        <div
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs overflow-hidden w-full max-w-full select-none touch-pan-y"
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
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: Tiến độ câu hỏi */}
              <div className="w-full shrink-0 py-1 min-h-[76px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('stats.progressTitle')}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {studiedCount} / 600
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-900 dark:bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${(studiedCount / 600) * 100}%` }}
                  />
                </div>
              </div>

              {/* Slide 2: Câu hay làm sai */}
              <div
                className="w-full shrink-0 py-1 min-h-[76px] cursor-pointer"
                onClick={onGoToWrongQuestions}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('stats.wrongTitle')}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {wrongCount} {t('theory.questionsShort')}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  {t('stats.reviewNow')}
                </p>
              </div>

              {/* Slide 3: Bài thi đã làm */}
              <div className="w-full shrink-0 py-1 min-h-[76px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('stats.examsDone')}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {totalExams} {t('stats.examsUnit')}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {t('stats.passedUnit', { count: passedExams })}
                </p>
              </div>

              {/* Slide 4: Tỷ lệ đạt sát hạch */}
              <div className="w-full shrink-0 py-1 min-h-[76px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t('stats.passRate')}
                </div>
                <div className={`text-2xl font-extrabold mb-1 ${passRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {passRate}%
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {passRate >= 80 ? t('stats.eligible') : t('stats.needPractice')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls & Dot Indicators */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + 4) % 4);
              }}
              className="p-1.5 -ml-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Thẻ trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 4 dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx
                      ? 'w-6 bg-amber-500'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`Chuyển đến thẻ ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % 4);
              }}
              className="p-1.5 -mr-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Thẻ tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Overview Stat Cards */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Số câu đã học */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {t('stats.progressTitle')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {studiedCount} / 600
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-slate-900 dark:bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${(studiedCount / 600) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Câu làm sai */}
        <div
          onClick={onGoToWrongQuestions}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {t('stats.wrongTitle')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {wrongCount} {t('theory.questionsShort')}
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
            {t('stats.reviewNow')}
          </p>
        </div>

        {/* Card 3: Số đề đã thi */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {t('stats.examsDone')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalExams} {t('stats.examsUnit')}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {t('stats.passedUnit', { count: passedExams })}
          </p>
        </div>

        {/* Card 4: Tỷ lệ đạt sát hạch */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {t('stats.passRate')}
          </div>
          <div className={`text-2xl font-extrabold ${passRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
            {passRate}%
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {passRate >= 80 ? t('stats.eligible') : t('stats.needPractice')}
          </p>
        </div>
      </div>

      {/* Recent Exam History Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('stats.historyTitle')}
            </h2>
            {(examHistory.length > 0 || simHistory.length > 0 || studiedCount > 0 || wrongCount > 0) && (
              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={t('stats.resetTooltip')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Segmented Switcher giữa Lý thuyết và Mô phỏng */}
          <div className="w-full sm:w-auto flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setHistoryTab('theory')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-center ${
                historyTab === 'theory'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Lý thuyết
            </button>
            <button
              type="button"
              onClick={() => setHistoryTab('simulation')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-center ${
                historyTab === 'simulation'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Mô phỏng
            </button>
          </div>
        </div>

        {historyTab === 'theory' ? (
          examHistory.length > 0 ? (
            <>
              {/* Mobile Card List View (Clean & No horizontal scroll) */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                {examHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onReviewExam?.(item)}
                    className="py-3 flex items-center justify-between gap-3 active:bg-slate-50 dark:active:bg-slate-800/50 cursor-pointer select-none transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Hạng {item.category}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {item.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        {item.isPassed ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {t('stats.pass')}
                          </span>
                        ) : (
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {item.failedCriticalId ? t('stats.failCritical') : t('stats.fail')}
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-slate-500 font-mono">
                          - {String(Math.floor(item.durationSeconds / 60)).padStart(2, '0')}:{String(item.durationSeconds % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                        {item.score}/{item.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thDate')}</th>
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thCategory')}</th>
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thScore')}</th>
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thDuration')}</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">{t('stats.thResult')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {examHistory.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => onReviewExam?.(item)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        title="Nhấn để xem lại chi tiết bài thi"
                      >
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.date}</td>
                        <td className="py-3.5 px-4 text-slate-900 dark:text-white font-semibold whitespace-nowrap">{item.category}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {item.score} / {item.total}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                          {String(Math.floor(item.durationSeconds / 60)).padStart(2, '0')}:{String(item.durationSeconds % 60).padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {item.isPassed ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {t('stats.pass')}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                              {item.failedCriticalId ? t('stats.failCritical') : t('stats.fail')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
              {t('stats.emptyHistory')}
            </div>
          )
        ) : (
          simHistory.length > 0 ? (
            <>
              {/* Mobile Card List View for Simulation */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                {simHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onReviewSimExam?.(item)}
                    className="py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg px-2 -mx-2"
                    title="Nhấn để xem lại chi tiết bài thi mô phỏng"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          10 tình huống
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {item.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        {item.isPassed ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {t('stats.pass')}
                          </span>
                        ) : (
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {t('stats.fail')}
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-slate-500 font-mono">
                          - {String(Math.floor(item.durationSeconds / 60)).padStart(2, '0')}:{String(item.durationSeconds % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                        {item.score}/{item.total} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View for Simulation */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thDate')}</th>
                      <th className="py-3 px-4 whitespace-nowrap">Nội dung thi</th>
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thScore')}</th>
                      <th className="py-3 px-4 whitespace-nowrap">{t('stats.thDuration')}</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">{t('stats.thResult')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {simHistory.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => onReviewSimExam?.(item)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        title="Nhấn để xem lại chi tiết bài thi mô phỏng"
                      >
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.date}</td>
                        <td className="py-3.5 px-4 text-slate-900 dark:text-white font-semibold whitespace-nowrap">10 tình huống mô phỏng</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {item.score} / {item.total} đ
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                          {String(Math.floor(item.durationSeconds / 60)).padStart(2, '0')}:{String(item.durationSeconds % 60).padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {item.isPassed ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {t('stats.pass')}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                              {t('stats.fail')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
              Chưa có bài thi mô phỏng nào được ghi nhận. Hãy vào mục "Mô phỏng" để bắt đầu bài thi thử đầu tiên.
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal to Clear Exam History */}
      {showConfirmClear && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-contain select-none animate-in fade-in duration-150"
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-150"
          >
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('stats.modalTitle')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t('stats.modalDesc')}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('stats.modalCancel')}
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer"
              >
                {t('stats.modalConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
