import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronDown,
  X
} from 'lucide-react';
import type { SubHeaderConfig } from './Navbar';
import {
  type TrafficSignItem,
  PROHIBITORY_SIGNS,
  MANDATORY_SIGNS,
  WARNING_SIGNS,
  DASHBOARD_SIGNS
} from '../data/trafficSignsData';

export interface TrafficSignsViewProps {
  onBack: () => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

type SignTab = 'prohibitory' | 'mandatory' | 'warning' | 'dashboard';

interface TabItemConfig {
  id: SignTab;
  label: string;
}

const SIGN_TABS_CONFIG: TabItemConfig[] = [
  {
    id: 'prohibitory',
    label: 'Biển báo cấm'
  },
  {
    id: 'mandatory',
    label: 'Hiệu lệnh & Chỉ dẫn'
  },
  {
    id: 'warning',
    label: '15 Biển nguy hiểm'
  },
  {
    id: 'dashboard',
    label: 'Đèn Táp-lô'
  }
];

interface SignCategoryDropdownProps {
  activeTab: SignTab;
  onSelectTab: (tab: SignTab) => void;
  tabs: TabItemConfig[];
}

const SignCategoryDropdown: React.FC<SignCategoryDropdownProps> = ({
  activeTab,
  onSelectTab,
  tabs
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-medium shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
        title="Chọn nhóm biển báo"
      >
        <span>{currentTab.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 whitespace-nowrap">
            Chọn nhóm biển báo
          </div>
          <div className="py-1">
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const TrafficSignsView: React.FC<TrafficSignsViewProps> = ({
  onBack,
  onSubHeaderChange
}) => {
  const [activeTab, setActiveTab] = useState<SignTab>('prohibitory');
  const [selectedSign, setSelectedSign] = useState<TrafficSignItem | null>(null);

  const tabs = SIGN_TABS_CONFIG;

  // Sync subheader to Navbar: XÓA TIÊU ĐỀ Ở GIỮA, ĐẶT DROPDOWN CHỌN NHÓM SANG GÓC PHẢI
  useEffect(() => {
    onSubHeaderChange?.({
      title: '', // Xóa chữ ở giữa
      onBack,
      rightElement: (
        <SignCategoryDropdown
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          tabs={tabs}
        />
      )
    });

    return () => {
      onSubHeaderChange?.(null);
    };
  }, [activeTab, onBack, onSubHeaderChange, tabs]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSign) {
        setSelectedSign(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSign]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSign) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [selectedSign]);

  // Filter items based on active tab
  const filteredGroups = useMemo(() => {
    return {
      prohibitory: activeTab === 'prohibitory' ? PROHIBITORY_SIGNS : [],
      mandatory: activeTab === 'mandatory' ? MANDATORY_SIGNS : [],
      warning: activeTab === 'warning' ? WARNING_SIGNS : [],
      dashboard: activeTab === 'dashboard' ? DASHBOARD_SIGNS : []
    };
  }, [activeTab]);

  // Helper render for sign graphic
  const renderSignGraphic = (item: TrafficSignItem) => {
    const isTool = item.id.startsWith('tool_');
    const isTaplo = item.id.startsWith('taplo_');

    if (isTaplo) {
      return (
        <div className="h-16 sm:h-20 w-full flex items-center justify-center rounded-lg overflow-hidden bg-zinc-950 dark:bg-black/80 border border-zinc-800/80 p-1 shadow-2xs">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-auto max-w-full object-contain transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    if (isTool) {
      return (
        <div className="h-16 sm:h-20 w-full flex items-center justify-center rounded-lg overflow-hidden bg-white dark:bg-white/95 border border-slate-200/80 p-1.5 shadow-2xs">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-auto max-w-full object-contain transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <img
        src={item.image}
        alt={item.name}
        className="h-16 sm:h-20 w-auto max-w-full object-contain drop-shadow-xs transition-transform group-hover:scale-105"
        loading="lazy"
      />
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 2. NHÓM 1: BẢNG BIỂN BÁO CẤM */}
      {filteredGroups.prohibitory.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredGroups.prohibitory.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between text-center hover:border-red-400 dark:hover:border-red-600/80 hover:shadow-xs transition-all cursor-pointer group min-h-[170px]"
              >
                <div className="w-full text-left text-[11px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span>{sign.code}</span>
                </div>

                <div className="py-2 flex items-center justify-center flex-1">
                  {renderSignGraphic(sign)}
                </div>

                <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {sign.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. NHÓM 2: BIỂN HIỆU LỆNH & CHỈ DẪN */}
      {filteredGroups.mandatory.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredGroups.mandatory.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between text-center hover:border-blue-400 dark:hover:border-blue-600/80 hover:shadow-xs transition-all cursor-pointer group min-h-[170px]"
              >
                <div className="w-full text-left text-[11px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span>{sign.code}</span>
                </div>

                <div className="py-2 flex items-center justify-center flex-1">
                  {renderSignGraphic(sign)}
                </div>

                <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {sign.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. NHÓM 3: 15 BIỂN BÁO NGUY HIỂM (Mẹo 36 - Trang 11) */}
      {filteredGroups.warning.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredGroups.warning.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between text-center hover:border-amber-400 dark:hover:border-amber-600/80 hover:shadow-xs transition-all cursor-pointer group min-h-[170px]"
              >
                <div className="w-full text-left text-[11px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span>{sign.code}</span>
                </div>

                <div className="py-2 flex items-center justify-center flex-1">
                  {renderSignGraphic(sign)}
                </div>

                <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {sign.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. NHÓM 4: 9 KÝ HIỆU ĐÈN TÁP-LÔ & CỨU HỘ */}
      {filteredGroups.dashboard.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredGroups.dashboard.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setSelectedSign(sign)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between text-center hover:border-emerald-400 dark:hover:border-emerald-600/80 hover:shadow-xs transition-all cursor-pointer group min-h-[170px]"
              >
                <div className="w-full text-left text-[11px] text-slate-400 dark:text-slate-500 font-mono mb-1">
                  <span>{sign.code}</span>
                </div>

                <div className="py-2 flex items-center justify-center flex-1">
                  {renderSignGraphic(sign)}
                </div>

                <div className="w-full pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {sign.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. MODAL XEM CHI TIẾT BIỂN BÁO / TÁP-LÔ (LIGHTBOX) */}
      {selectedSign && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedSign.code}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedSign.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSign(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className={`py-5 flex items-center justify-center rounded-xl min-h-[160px] ${
              selectedSign.id.startsWith('taplo_')
                ? 'bg-zinc-950 dark:bg-black border border-zinc-800 p-4'
                : selectedSign.id.startsWith('tool_')
                ? 'bg-white dark:bg-white border border-slate-200 p-4 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80'
            }`}>
              <img
                src={selectedSign.image}
                alt={selectedSign.name}
                className="max-h-48 sm:max-h-56 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Mẹo nhớ & Quy chuẩn (Không card, không emoji, chỉ giữ chữ) */}
            <div className="space-y-3 text-xs sm:text-sm">
              {selectedSign.tip && (
                <div className="leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white">Mẹo nhớ nhanh: </span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedSign.tip}</span>
                </div>
              )}

              {selectedSign.meaning && (
                <div className="leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    Quy chuẩn QCVN 41:2019/BGTVT:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {selectedSign.meaning}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
