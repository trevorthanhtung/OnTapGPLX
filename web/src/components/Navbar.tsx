import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen, BarChart2, ArrowLeft } from 'lucide-react';
import type { LicenseCategory } from '../types';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import { I18nService, type AppLanguage } from '../locales/i18n';

export interface SubHeaderConfig {
  title: string;
  onBack: () => void;
  rightElement?: React.ReactNode;
}

interface NavbarProps {
  activeTab: 'theory' | 'simulation' | 'stats' | 'more';
  setActiveTab: (tab: 'theory' | 'simulation' | 'stats' | 'more') => void;
  currentCategory: LicenseCategory;
  onSelectCategory: (category: LicenseCategory) => void;
  wrongCount?: number;
  hideBottomNav?: boolean;
  subHeader?: SubHeaderConfig | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentCategory,
  onSelectCategory,
  hideBottomNav,
  subHeader
}) => {
  const currentConfig = LICENSE_CATEGORIES.find((c) => c.id === currentCategory) || LICENSE_CATEGORIES[0];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentLang, setCurrentLang] = useState<AppLanguage>(I18nService.getLanguage());
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync language changes dynamically
  useEffect(() => {
    const handleLangChange = (e: any) => {
      setCurrentLang(e.detail || I18nService.getLanguage());
    };
    window.addEventListener('ontapgplx:language_change', handleLangChange);
    return () => window.removeEventListener('ontapgplx:language_change', handleLangChange);
  }, []);

  const t = (key: string) => I18nService.t(key, currentLang);

  // When switching tabs, immediately reveal navbar
  useEffect(() => {
    setIsVisible(true);
  }, [activeTab]);

  // Motion navbar: show immediately when scrolling up anywhere, or when near top
  useEffect(() => {
    const handleScroll = () => {
      if (isCategoryOpen || subHeader) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show when near top of page
      if (currentScrollY <= 25) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // When scrolling up anywhere, show immediately
      if (delta < -3) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // When scrolling down past 60px, hide
      if (delta > 8 && currentScrollY > 60) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCategoryOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryOpen]);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[env(safe-area-inset-top,0px)] landscape-mobile:pt-[max(0.25rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-transform duration-300 ease-in-out will-change-transform ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-14 sm:h-16">
            {subHeader ? (
              <div className="relative flex items-center justify-between w-full h-full">
                <button
                  type="button"
                  onClick={subHeader.onBack}
                  className="p-2 -ml-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all cursor-pointer z-10 shrink-0"
                  aria-label={t('tips.back') || 'Quay lại'}
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {subHeader.title ? (
                  <h1 className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-bold text-slate-900 dark:text-white pointer-events-none truncate px-12">
                    {subHeader.title}
                  </h1>
                ) : null}

                {subHeader.rightElement ? (
                  <div className="z-10 shrink-0">{subHeader.rightElement}</div>
                ) : (
                  <div className="w-9 sm:w-10 shrink-0 pointer-events-none" aria-hidden="true" />
                )}
              </div>
            ) : (
              <>
                {/* Logo & Brand */}
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('theory')}>
                  <img
                    src="/logo.jpg"
                    alt="OnTapGPLX Logo"
                    className="h-8 sm:h-9 w-auto rounded-md shadow-xs object-contain"
                  />
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                    <span>OnTap</span>
                    <span className="text-amber-500">GPLX</span>
                  </div>
                </div>

                {/* Navigation Tabs (Desktop only - 1024px and up) */}
                <nav className="hidden lg:inline-flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs absolute left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('theory')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'theory'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{t('nav.theory')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('simulation')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'simulation'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{t('nav.simulation')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('stats')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'stats'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{t('nav.stats')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('more')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'more'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{t('nav.more')}</span>
                  </button>
                </nav>

                {/* Category Selector (Click to toggle) */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center justify-between w-[92px] sm:w-[100px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                      title={t('cat.select')}
                    >
                      <span>{t('cat.prefix')} {currentConfig.id}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
                          isCategoryOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoryOpen && (
                      <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 whitespace-nowrap">
                          {t('cat.select')}
                        </div>
                        {LICENSE_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.id);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                              cat.id === currentCategory
                                ? 'bg-slate-100 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (4 Tabs: Lý thuyết | Mô phỏng | Thống kê | Thêm) */}
      {!hideBottomNav && !subHeader && (
        <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 lg:hidden flex items-center justify-around min-h-[4rem] h-[calc(4rem+max(0.75rem,env(safe-area-inset-bottom,0px)))] pt-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] landscape-mobile:min-h-[2.85rem] landscape-mobile:h-[calc(2.85rem+max(0.25rem,env(safe-area-inset-bottom,0px)))] landscape-mobile:pt-1 landscape-mobile:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] px-2 pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] shadow-xs transition-transform duration-300 ease-in-out will-change-transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* 1. Theory Tab (2.5D Minimalist Book) */}
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
          >
            <div className="h-6.5 sm:h-7 landscape-mobile:h-5 flex items-center justify-center">
              {activeTab === 'theory' ? (
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 landscape-mobile:w-4.5 landscape-mobile:h-4.5 transition-all duration-200 scale-105 -translate-y-0.5 drop-shadow-[0_3px_6px_rgba(37,99,235,0.35)]"
                >
                  <defs>
                    <linearGradient id="minTheoryL" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="minTheoryR" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  {/* Cánh trái */}
                  <path
                    d="M3 6.5 C3 5.4 3.9 4.5 5 4.5 C7.5 4.5 10 5.4 11.5 6.5 V19 C10 17.9 7.5 17 5 17 C3.9 17 3 17.9 3 19 Z"
                    fill="url(#minTheoryL)"
                  />
                  {/* Cánh phải */}
                  <path
                    d="M21 6.5 C21 5.4 20.1 4.5 19 4.5 C16.5 4.5 14 5.4 12.5 6.5 V19 C14 17.9 16.5 17 19 17 C20.1 17 21 17.9 21 19 Z"
                    fill="url(#minTheoryR)"
                  />
                  {/* Nếp lật trang 2.5D mờ tinh tế */}
                  <path
                    d="M13.5 8 C15.5 7.2 17.5 7 19.5 7.2 V16.2 C17.5 16 15.5 16.2 13.5 17 Z"
                    fill="#ffffff"
                    opacity="0.22"
                  />
                </svg>
              ) : (
                <BookOpen className="w-5.5 h-5.5 landscape-mobile:w-4 landscape-mobile:h-4 stroke-[1.8] text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              )}
            </div>
            <span
              className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-all duration-200 ${
                activeTab === 'theory'
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              {t('nav.theory')}
            </span>
          </button>

          {/* 2. Simulation Tab (2.5D Minimalist Steering Wheel) */}
          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
          >
            <div className="h-6.5 sm:h-7 landscape-mobile:h-5 flex items-center justify-center">
              {activeTab === 'simulation' ? (
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 landscape-mobile:w-4.5 landscape-mobile:h-4.5 transition-all duration-200 scale-105 -translate-y-0.5 drop-shadow-[0_3px_6px_rgba(147,51,234,0.35)]"
                >
                  <defs>
                    <linearGradient id="minSteerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                  </defs>
                  {/* Vành vô lăng ngoài */}
                  <circle cx="12" cy="12" r="9" stroke="url(#minSteerGrad)" strokeWidth="2.5" fill="none" />
                  {/* Tâm còi tròn */}
                  <circle cx="12" cy="12" r="3.2" fill="url(#minSteerGrad)" />
                  <circle cx="12" cy="12" r="1.3" fill="#ffffff" opacity="0.75" />
                  {/* 3 chấu vô lăng thể thao */}
                  <line x1="3.2" y1="12" x2="8.8" y2="12" stroke="url(#minSteerGrad)" strokeWidth="2.4" strokeLinecap="round" />
                  <line x1="15.2" y1="12" x2="20.8" y2="12" stroke="url(#minSteerGrad)" strokeWidth="2.4" strokeLinecap="round" />
                  <line x1="12" y1="15.2" x2="12" y2="20.8" stroke="url(#minSteerGrad)" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Vạch căn tâm lái 2.5D */}
                  <rect x="11.2" y="1.2" width="1.6" height="2.8" rx="0.8" fill="#f3e8ff" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-5.5 h-5.5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.8" />
                  <line x1="3.2" y1="12" x2="9.2" y2="12" strokeLinecap="round" />
                  <line x1="14.8" y1="12" x2="20.8" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="14.8" x2="12" y2="20.8" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-all duration-200 ${
                activeTab === 'simulation'
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              {t('nav.simulation')}
            </span>
          </button>

          {/* 3. Stats Tab (2.5D Minimalist Growth Bars) */}
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
          >
            <div className="h-6.5 sm:h-7 landscape-mobile:h-5 flex items-center justify-center">
              {activeTab === 'stats' ? (
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 landscape-mobile:w-4.5 landscape-mobile:h-4.5 transition-all duration-200 scale-105 -translate-y-0.5 drop-shadow-[0_3px_6px_rgba(16,185,129,0.35)]"
                >
                  <defs>
                    <linearGradient id="minStatsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  {/* Cột 1 (thấp) */}
                  <rect x="3.5" y="13" width="4.2" height="8" rx="2.1" fill="url(#minStatsGrad)" opacity="0.65" />
                  {/* Cột 2 (vừa) */}
                  <rect x="9.9" y="8" width="4.2" height="13" rx="2.1" fill="url(#minStatsGrad)" opacity="0.85" />
                  {/* Cột 3 (cao nhất) */}
                  <rect x="16.3" y="3.5" width="4.2" height="17.5" rx="2.1" fill="url(#minStatsGrad)" />
                  {/* Đốm sáng đỉnh cột 3 */}
                  <circle cx="18.4" cy="5.5" r="1.1" fill="#ffffff" opacity="0.8" />
                </svg>
              ) : (
                <BarChart2 className="w-5.5 h-5.5 landscape-mobile:w-4 landscape-mobile:h-4 stroke-[1.8] text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              )}
            </div>
            <span
              className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              {t('nav.stats')}
            </span>
          </button>

          {/* 4. More Tab (2.5D Minimalist Bento Grid) */}
          <button
            type="button"
            onClick={() => setActiveTab('more')}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
          >
            <div className="h-6.5 sm:h-7 landscape-mobile:h-5 flex items-center justify-center">
              {activeTab === 'more' ? (
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 landscape-mobile:w-4.5 landscape-mobile:h-4.5 transition-all duration-200 scale-105 -translate-y-0.5 drop-shadow-[0_3px_6px_rgba(245,158,11,0.35)]"
                >
                  <defs>
                    <linearGradient id="minMoreGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="minMoreGradSub" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Ô trên-trái (tiêu điểm) */}
                  <rect x="3" y="3" width="8" height="8" rx="2.8" fill="url(#minMoreGradMain)" />
                  <circle cx="7" cy="7" r="1.3" fill="#ffffff" opacity="0.75" />
                  {/* Ô trên-phải */}
                  <rect x="13" y="3" width="8" height="8" rx="2.8" fill="url(#minMoreGradSub)" opacity="0.88" />
                  {/* Ô dưới-trái */}
                  <rect x="3" y="13" width="8" height="8" rx="2.8" fill="url(#minMoreGradSub)" opacity="0.88" />
                  {/* Ô dưới-phải */}
                  <rect x="13" y="13" width="8" height="8" rx="2.8" fill="url(#minMoreGradSub)" opacity="0.7" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-5.5 h-5.5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" />
                  <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" />
                  <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" />
                  <rect x="13.5" y="13.5" width="7" height="7" rx="2.2" />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-all duration-200 ${
                activeTab === 'more'
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              {t('nav.more')}
            </span>
          </button>
        </nav>
      )}
    </>
  );
};
