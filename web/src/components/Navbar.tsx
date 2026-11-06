import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen, Video, BarChart2 } from 'lucide-react';
import type { LicenseCategory } from '../types';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';

interface NavbarProps {
  activeTab: 'theory' | 'simulation' | 'stats';
  setActiveTab: (tab: 'theory' | 'simulation' | 'stats') => void;
  currentCategory: LicenseCategory;
  onSelectCategory: (category: LicenseCategory) => void;
  wrongCount?: number;
  hideBottomNav?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentCategory,
  onSelectCategory,
  hideBottomNav
}) => {
  const currentConfig = LICENSE_CATEGORIES.find((c) => c.id === currentCategory) || LICENSE_CATEGORIES[0];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // When switching tabs, immediately reveal navbar
  useEffect(() => {
    setIsVisible(true);
  }, [activeTab]);

  // Facebook-style motion: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (isCategoryOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show at top of page
      if (currentScrollY <= 25) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Ignore iOS rubber-banding
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScrollY < 0 || currentScrollY > maxScroll) {
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Require a minimum 8px scroll delta to prevent jittering
      if (Math.abs(delta) > 8) {
        if (delta > 0 && currentScrollY > 70) {
          // Scrolling down -> hide
          setIsVisible(false);
        } else if (delta < 0) {
          // Scrolling up -> show
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
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
      <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[env(safe-area-inset-top,0px)] landscape-mobile:pt-[max(0.25rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-transform duration-300 ease-in-out will-change-transform ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('theory')}>
            <img
              src="/logo.jpg"
              alt="OnTapGPLX Logo"
              className="h-8 sm:h-9 w-auto rounded-md shadow-xs object-contain"
            />
            <div className="flex items-center gap-1 font-bold text-slate-900 tracking-tight text-base sm:text-lg">
              <span>OnTap</span>
              <span className="text-amber-500">GPLX</span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop only - 1024px and up) - Segmented Control (PA1) */}
          <nav className="hidden lg:inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 shadow-2xs">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'theory'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>Lý thuyết</span>
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'simulation'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>Mô phỏng</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>Thống kê</span>
            </button>
          </nav>

          {/* Category Selector (Click to toggle) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                title="Chọn hạng GPLX"
              >
                <span>Hạng {currentConfig.id}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 ml-0.5 transition-transform duration-150 ${
                    isCategoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                    Chọn hạng GPLX
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
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation Bar (Filled Icon on Active - < 1024px) */}
    {!hideBottomNav && (
      <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 lg:hidden flex items-center justify-around min-h-[4rem] h-[calc(4rem+max(0.75rem,env(safe-area-inset-bottom,0px)))] pt-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] landscape-mobile:min-h-[2.85rem] landscape-mobile:h-[calc(2.85rem+max(0.25rem,env(safe-area-inset-bottom,0px)))] landscape-mobile:pt-1 landscape-mobile:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] px-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] shadow-xs transition-transform duration-300 ease-in-out will-change-transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Theory Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('theory')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
        >
          <div className="h-6 flex items-center justify-center">
            {activeTab === 'theory' ? (
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-900 fill-slate-900 transition-transform scale-105"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"
                  stroke="currentColor"
                />
                <path d="M12 5v15.5" stroke="white" strokeWidth="2" />
              </svg>
            ) : (
              <BookOpen className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-400 group-hover:text-slate-600 stroke-[1.8] transition-colors" />
            )}
          </div>
          <span
            className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'theory'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-500 font-medium'
            }`}
          >
            Lý thuyết
          </span>
        </button>

        {/* Simulation Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
        >
          <div className="h-6 flex items-center justify-center">
            {activeTab === 'simulation' ? (
              <Video className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-900 fill-slate-900 stroke-[1.5] transition-transform scale-105" />
            ) : (
              <Video className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-400 group-hover:text-slate-600 stroke-[1.8] transition-colors" />
            )}
          </div>
          <span
            className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'simulation'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-500 font-medium'
            }`}
          >
            Mô phỏng
          </span>
        </button>

        {/* Stats Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer group"
        >
          <div className="h-6 flex items-center justify-center">
            {activeTab === 'stats' ? (
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-900 fill-slate-900 transition-transform scale-105"
              >
                <rect x="4" y="13" width="3.5" height="8" rx="1" />
                <rect x="10.25" y="4" width="3.5" height="17" rx="1" />
                <rect x="16.5" y="9" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <BarChart2 className="w-5 h-5 landscape-mobile:w-4 landscape-mobile:h-4 text-slate-400 group-hover:text-slate-600 stroke-[1.8] transition-colors" />
            )}
          </div>
          <span
            className={`text-[11px] landscape-mobile:text-[9.5px] mt-0.5 tracking-tight transition-colors ${
              activeTab === 'stats'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-500 font-medium'
            }`}
          >
            Thống kê
          </span>
        </button>
      </nav>
    )}
  </>
  );
};
