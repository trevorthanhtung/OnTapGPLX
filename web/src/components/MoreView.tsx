import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  ChevronRight
} from 'lucide-react';
import { ThemeService, type ThemeMode } from '../services/theme';
import { I18nService } from '../locales/i18n';
import type { SubHeaderConfig } from './Navbar';
import { BookTipsView } from './BookTipsView';
import { TrafficSignsView } from './TrafficSignsView';
import { RoadDrivingTipsView } from './RoadDrivingTipsView';
import { LawGuideView } from './LawGuideView';
import { OfflineManagerView } from './OfflineManagerView';

interface MoreViewProps {
  onGoToTab?: (tab: 'theory' | 'simulation' | 'stats' | 'more') => void;
  onOpenLanding?: () => void;
  onSubViewChange?: (isSubView: boolean) => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  onOpenLanding,
  onSubViewChange,
  onSubHeaderChange
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(ThemeService.getTheme());
  const [subView, setSubView] = useState<'main' | 'tips' | 'signs' | 'road' | 'law' | 'theme' | 'offline'>('main');

  // Modal for Exit Confirmation only
  const [showConfirmLanding, setShowConfirmLanding] = useState(false);

  // Sync theme changes
  const handleThemeChange = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    ThemeService.setTheme(mode);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmLanding(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showConfirmLanding) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmLanding]);

  // Handle browser back button for sub-views
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (subView !== 'main') {
        if (!e.state?.subView) {
          setSubView('main');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [subView]);

  const handleOpenSubView = (view: 'tips' | 'signs' | 'road' | 'law' | 'theme' | 'offline') => {
    setSubView(view);
    window.history.pushState({ component: 'moreSubView', subView: view }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMain = useCallback(() => {
    setSubView('main');
    if (window.history.state?.component === 'moreSubView') {
      window.history.back();
    }
  }, []);

  const t = (key: string) => I18nService.t(key);

  // Notify parent component (Navbar/App) when entering/exiting sub-views
  useEffect(() => {
    onSubViewChange?.(subView !== 'main');

    if (subView === 'main') {
      onSubHeaderChange?.(null);
    } else if (subView === 'theme') {
      onSubHeaderChange?.({
        title: t('theme.title'),
        onBack: handleBackToMain
      });
    }
  }, [subView, handleBackToMain, onSubViewChange, onSubHeaderChange]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      onSubHeaderChange?.(null);
      onSubViewChange?.(false);
    };
  }, [onSubHeaderChange, onSubViewChange]);

  // ==========================================
  // SUB-VIEW: CHỌN GIAO DIỆN
  // ==========================================
  if (subView === 'theme') {
    return (
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs">
          {[
            { id: 'system', label: t('theme.system') },
            { id: 'light', label: t('theme.light') },
            { id: 'dark', label: t('theme.dark') }
          ].map((item) => {
            const isSelected = currentTheme === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleThemeChange(item.id as ThemeMode)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <span className={`text-sm ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                  {item.label}
                </span>

                {isSelected && (
                  <Check className="w-4 h-4 text-slate-900 dark:text-white stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // SUB-VIEW: SÁCH MẸO THI SÁT HẠCH (CHƯƠNG 1 -> 7)
  // ==========================================
  if (subView === 'tips') {
    return (
      <BookTipsView
        onBack={handleBackToMain}
        onSubHeaderChange={onSubHeaderChange}
      />
    );
  }

  // ==========================================
  // SUB-VIEW: HỆ THỐNG BIỂN BÁO & ĐÈN TÁP-LÔ
  // ==========================================
  if (subView === 'signs') {
    return (
      <TrafficSignsView
        onBack={handleBackToMain}
        onSubHeaderChange={onSubHeaderChange}
      />
    );
  }

  // ==========================================
  // SUB-VIEW: PHƯƠNG PHÁP ĐI ĐƯỜNG TRƯỜNG
  // ==========================================
  if (subView === 'road') {
    return (
      <RoadDrivingTipsView
        onBack={handleBackToMain}
        onSubHeaderChange={onSubHeaderChange}
      />
    );
  }

  // ==========================================
  // SUB-VIEW: QUY CHẾ SÁT HẠCH & PHÂN HẠNG MỚI
  // ==========================================
  if (subView === 'law') {
    return (
      <LawGuideView
        onBack={handleBackToMain}
        onSubHeaderChange={onSubHeaderChange}
      />
    );
  }

  // ==========================================
  // SUB-VIEW: DỮ LIỆU NGOẠI TUYẾN (OFFLINE)
  // ==========================================
  if (subView === 'offline') {
    return (
      <OfflineManagerView
        onBack={handleBackToMain}
        onSubHeaderChange={onSubHeaderChange}
      />
    );
  }

  // ==========================================
  // MAIN VIEW: ZERO SUBTITLE INSET GROUPED SETTINGS
  // ==========================================
  return (
    <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* 1. Header (Không subtitle) */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t('more.title')}
        </h1>
      </div>

      {/* 2. Banner Card: Skin 4 màu với nút ở giữa (GIỮ NGUYÊN) */}
      <div
        onClick={() => handleOpenSubView('tips')}
        className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group isolate select-none border border-slate-200/60 dark:border-slate-800 p-6 sm:p-7 flex items-center justify-center min-h-[110px] sm:min-h-[120px]"
      >
        {/* Background: 4 ô màu quadrant chuẩn bìa 600 câu */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 -z-10">
          <div className="bg-[#f59e0b] relative overflow-hidden flex items-start justify-start p-3">
            <svg className="w-8 h-8 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="bg-[#ef4444] relative overflow-hidden flex items-start justify-end p-3">
            <svg className="w-8 h-8 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="bg-[#06b6d4] relative overflow-hidden flex items-end justify-start p-3">
            <svg className="w-7 h-7 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="bg-[#a855f7] relative overflow-hidden flex items-end justify-end p-3">
            <svg className="w-7 h-7 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="6" y="2" width="12" height="20" rx="6" />
              <circle cx="12" cy="7" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="17" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Nút duy nhất ở giữa */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenSubView('tips');
          }}
          className="w-full max-w-sm inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-900 font-extrabold text-sm sm:text-base shadow-md group-hover:shadow-lg transition-all cursor-pointer border border-white/50"
        >
          <span>Khám phá mẹo làm nhanh</span>
        </button>
      </div>

      {/* 3. Danh sách cài đặt & tra cứu (Gộp chung 1 card liền mạch, không header nhóm) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs">
        {/* Row 0: Quy chế sát hạch & Phân hạng mới */}
        <button
          type="button"
          onClick={() => handleOpenSubView('law')}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Quy chế sát hạch & Phân hạng mới
          </span>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Row 1: Biển báo đường bộ */}
        <button
          type="button"
          onClick={() => handleOpenSubView('signs')}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('signs.title')}
          </span>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Row 2: Phương pháp đi đường trường */}
        <button
          type="button"
          onClick={() => handleOpenSubView('road')}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('road.title')}
          </span>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Row 2: Giao diện */}
        <button
          type="button"
          onClick={() => handleOpenSubView('theme')}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('theme.title')}
          </span>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Row 3: Dữ liệu ngoại tuyến */}
        <button
          type="button"
          onClick={() => handleOpenSubView('offline')}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Dữ liệu ngoại tuyến
          </span>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Row 3: Trang giới thiệu */}
        {onOpenLanding && (
          <button
            type="button"
            onClick={() => setShowConfirmLanding(true)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
          >
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('app.landing')}
            </span>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Row 5: Version */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('app.version')}
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            v2.0.0
          </span>
        </div>
      </div>

      {/* 5. Footer */}
      <div className="pt-4 pb-2 text-center text-xs text-slate-400 dark:text-slate-500">
        <span>thực hiện bởi </span>
        <a
          href="https://github.com/trevorthanhtung"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
        >
          thanhtungg.
        </a>
      </div>

      {/* ======================================================== */}
      {/* MODAL: XÁC NHẬN QUAY LẠI TRANG GIỚI THIỆU (MINIMALIST)   */}
      {/* ======================================================== */}
      {showConfirmLanding && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-contain select-none animate-in fade-in duration-150"
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-xs sm:max-w-sm w-full p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 text-center tracking-tight">
              {t('app.landing_confirm_title')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed text-center">
              {t('app.landing_confirm_desc')}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmLanding(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('app.landing_confirm_cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLanding(false);
                  onOpenLanding?.();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
              >
                {t('app.landing_confirm_ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


