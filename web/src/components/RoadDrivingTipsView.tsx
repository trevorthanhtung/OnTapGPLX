import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SubHeaderConfig } from './Navbar';
import {
  ROAD_TEST_STEPS,
  ROAD_DEDUCTIONS,
  GOLDEN_TIPS
} from '../data/roadTipsData';

export interface RoadDrivingTipsViewProps {
  onBack: () => void;
  onSubHeaderChange?: (config: SubHeaderConfig | null) => void;
}

type RoadTab = 'steps' | 'deductions' | 'tips';

interface TabItemConfig {
  id: RoadTab;
  label: string;
}

const ROAD_TABS: TabItemConfig[] = [
  { id: 'steps', label: '4 Bài thi liên hoàn' },
  { id: 'deductions', label: 'Lỗi trừ điểm & Truất quyền' },
  { id: 'tips', label: 'Mẹo vàng 100 điểm' }
];

// Clean Dropdown in Navbar Subheader (Matching TrafficSignsView & BookTipsView)
const RoadCategoryDropdown: React.FC<{
  activeTab: RoadTab;
  onSelectTab: (tab: RoadTab) => void;
  tabs: TabItemConfig[];
}> = ({ activeTab, onSelectTab, tabs }) => {
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
        title="Chọn nội dung đường trường"
      >
        <span>{currentTab.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 whitespace-nowrap">
            Nội dung đường trường
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

export const RoadDrivingTipsView: React.FC<RoadDrivingTipsViewProps> = ({
  onBack,
  onSubHeaderChange
}) => {
  const [activeTab, setActiveTab] = useState<RoadTab>('steps');

  // Register Navbar subHeader (Tiêu đề giữa để trống, Dropdown chọn mục ở góc phải)
  useEffect(() => {
    onSubHeaderChange?.({
      title: '',
      onBack,
      rightElement: (
        <RoadCategoryDropdown
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          tabs={ROAD_TABS}
        />
      )
    });

    return () => {
      onSubHeaderChange?.(null);
    };
  }, [activeTab, onBack, onSubHeaderChange]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5 animate-in fade-in duration-150">
      {/* ======================================================== */}
      {/* 1. TAB: 4 BÀI THI LIÊN HOÀN                              */}
      {/* ======================================================== */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          {ROAD_TEST_STEPS.map((step) => (
            <div
              key={step.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {step.badge}
                </span>
              </div>

              {/* Khẩu quyết / Thao tác flow */}
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {step.flow}
              </p>

              {/* Hướng dẫn chi tiết */}
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0 mt-0.5">-</span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>

              {/* Điểm trừ & Mẹo lưu ý */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 text-xs">
                {step.tips.map((tip, idx) => (
                  <div key={idx} className="text-amber-700 dark:text-amber-400 leading-relaxed">
                    <span className="font-bold">Lưu ý: </span>
                    <span>{tip}</span>
                  </div>
                ))}

                <div className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Lỗi hay trừ: </span>
                  <span>{step.deductions.join('; ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TAB: BẢNG TRỪ ĐIỂM & TRUẤT QUYỀN (HIỂN THỊ TẤT CẢ)    */}
      {/* ======================================================== */}
      {activeTab === 'deductions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-2xs">
          {ROAD_DEDUCTIONS.map((item) => {
            const isFail = item.category === 'fail';

            return (
              <div key={item.id} className="p-3.5 sm:p-4 space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <span
                    className={`text-xs sm:text-sm font-mono font-bold shrink-0 whitespace-nowrap ${
                      isFail
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-amber-600 dark:text-amber-500'
                    }`}
                  >
                    {isFail ? 'TRƯỢT' : `-${item.points}đ`}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-0.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Khắc phục: </span>
                  <span>{item.solution}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB: MẸO VÀNG 100 ĐIỂM                                */}
      {/* ======================================================== */}
      {activeTab === 'tips' && (
        <div className="space-y-3.5">
          {GOLDEN_TIPS.map((tip, idx) => (
            <div
              key={tip.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  Mẹo 0{idx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {tip.title}
                </h3>
              </div>

              {/* Formula */}
              <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">
                {tip.formula}
              </p>

              <div className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tip.content.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold">-</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
