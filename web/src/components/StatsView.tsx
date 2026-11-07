import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExamHistoryItem } from '../services/storage';
import { StorageService } from '../services/storage';

interface StatsViewProps {
  onGoToWrongQuestions: () => void;
  onRefresh: () => void;
  onOpenLanding?: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onGoToWrongQuestions, onOpenLanding }) => {
  const [examHistory] = useState<ExamHistoryItem[]>(StorageService.getExamHistory());
  const [wrongCount] = useState<number>(StorageService.getWrongQuestions().length);
  const [studiedCount] = useState<number>(StorageService.getStudiedQuestions().length);
  const [showConfirmLanding, setShowConfirmLanding] = useState(false);

  // Lock body & window scroll when confirmation modal is visible
  useEffect(() => {
    if (showConfirmLanding) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmLanding]);

  // Pass rate calculation
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thống kê tiến độ</h1>
      </div>

      {/* Mobile Stat Carousel */}
      <div className="block md:hidden mb-8 w-full max-w-full overflow-hidden">
        <div
          className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden w-full max-w-full select-none touch-pan-y"
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
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tiến độ câu hỏi
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-2">
                  {studiedCount} / 600
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full transition-all"
                    style={{ width: `${(studiedCount / 600) * 100}%` }}
                  />
                </div>
              </div>

              {/* Slide 2: Câu hay làm sai */}
              <div
                className="w-full shrink-0 py-1 min-h-[76px] cursor-pointer"
                onClick={onGoToWrongQuestions}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Câu hay làm sai
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">
                  {wrongCount} câu
                </div>
                <p className="text-xs text-amber-700 font-medium">Ôn lại ngay →</p>
              </div>

              {/* Slide 3: Bài thi đã làm */}
              <div className="w-full shrink-0 py-1 min-h-[76px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Bài thi đã làm
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">
                  {totalExams} đề
                </div>
                <p className="text-xs text-slate-400 font-medium">Đạt {passedExams} đề</p>
              </div>

              {/* Slide 4: Tỷ lệ đạt sát hạch */}
              <div className="w-full shrink-0 py-1 min-h-[76px]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tỷ lệ đạt sát hạch
                </div>
                <div className={`text-2xl font-extrabold mb-1 ${passRate >= 80 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {passRate}%
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {passRate >= 80 ? 'Đủ điều kiện dự thi' : 'Cần rèn luyện thêm'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls & Dot Indicators */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + 4) % 4);
              }}
              className="p-1.5 -ml-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
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
              className="p-1.5 -mr-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Tiến độ câu hỏi
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{studiedCount} / 600</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all"
              style={{ width: `${(studiedCount / 600) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Câu làm sai */}
        <div
          onClick={onGoToWrongQuestions}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Câu hay làm sai
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{wrongCount} câu</div>
          <p className="text-xs text-amber-700 mt-2 font-medium">Ôn lại ngay →</p>
        </div>

        {/* Card 3: Số đề đã thi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Bài thi đã làm
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalExams} đề</div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Đạt {passedExams} đề</p>
        </div>

        {/* Card 4: Tỷ lệ đạt sát hạch */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Tỷ lệ đạt sát hạch
          </div>
          <div className={`text-2xl font-extrabold ${passRate >= 80 ? 'text-emerald-600' : 'text-slate-900'}`}>
            {passRate}%
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {passRate >= 80 ? 'Đủ điều kiện dự thi' : 'Cần rèn luyện thêm'}
          </p>
        </div>
      </div>

      {/* Recent Exam History Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
          Lịch sử thi thử gần nhất
        </h2>

        {examHistory.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Ngày thi</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Hạng</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Điểm</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Thời gian</th>
                  <th className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {examHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 sm:px-4 text-slate-600 whitespace-nowrap">{item.date}</td>
                    <td className="py-3.5 px-3 sm:px-4 text-slate-900 font-semibold whitespace-nowrap">{item.category}</td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.score} / {item.total}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-slate-500 font-mono whitespace-nowrap">
                      {String(Math.floor(item.durationSeconds / 60)).padStart(2, '0')}:{String(item.durationSeconds % 60).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                      {item.isPassed ? (
                        <span className="text-xs font-semibold text-emerald-600">
                          Đạt
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600">
                          {item.failedCriticalId ? 'Không đạt (Điểm liệt)' : 'Không đạt'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            Chưa có bài thi thử nào được ghi nhận. Hãy vào mục "Lý thuyết" để bắt đầu bài thi đầu tiên.
          </div>
        )}
      </div>

      {/* Revisit Landing Page */}
      {onOpenLanding && (
        <div className="flex justify-center mt-6 pb-2">
          <button
            type="button"
            onClick={() => setShowConfirmLanding(true)}
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-700 hover:underline transition-colors cursor-pointer py-1 px-2"
          >
            <span>Trang giới thiệu</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal to return to Landing Page */}
      {showConfirmLanding && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-contain select-none animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              Quay lại trang giới thiệu?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Bạn có muốn quay về trang giới thiệu không? Dữ liệu ôn tập của bạn vẫn được lưu trữ đầy đủ.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmLanding(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLanding(false);
                  onOpenLanding?.();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
