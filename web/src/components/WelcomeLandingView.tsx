import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { StorageService } from '../services/storage';
import { LICENSE_CATEGORIES } from '../data/licenseCategories';
import type { LicenseCategory } from '../types';

interface WelcomeLandingViewProps {
  onStartExperience: () => void;
}

export const WelcomeLandingView: React.FC<WelcomeLandingViewProps> = ({ onStartExperience }) => {
  // Mode: 'landing' (Màn tối giản: Trải nghiệm ngay & Hướng dẫn cài) -> 'walkthrough' (3 bước onboarding)
  const [viewMode, setViewMode] = useState<'landing' | 'walkthrough'>('landing');

  // Walkthrough slide step: 0 (01), 1 (02), 2 (03)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Modals & PWA
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installTab, setInstallTab] = useState<'ios' | 'android' | 'pc'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | 'cookie' | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const isDraggingRef = useRef(false);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchEndYRef = useRef<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory>(() =>
    StorageService.getCategory()
  );

  const handleCategorySelect = (cat: LicenseCategory) => {
    setSelectedCategory(cat);
    StorageService.setCategory(cat);
  };

  const activeCategoryConfig =
    LICENSE_CATEGORIES.find((c) => c.id === selectedCategory) || LICENSE_CATEGORIES[0];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setInstallTab('ios');
    } else if (/android/i.test(userAgent)) {
      setInstallTab('android');
    } else {
      setInstallTab('pc');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Prevent background scrolling while on Welcome / Onboarding screen
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const slides = [
    {
      step: '01',
      titlePrefix: 'NGÂN HÀNG',
      titleHighlight: '600 CÂU HỎI',
      desc: 'Bộ câu hỏi sát hạch chuẩn Cục Đường bộ Việt Nam. Phân chia rõ từng hạng bằng, có giải thích chi tiết và gắn cờ cảnh báo 60 câu điểm liệt không được sai.',
      buttonText: 'TIẾP TỤC',
    },
    {
      step: '02',
      titlePrefix: '120 TÌNH HUỐNG',
      titleHighlight: 'MÔ PHỎNG',
      desc: 'Hệ thống video 3D thực tế gồm 6 chương giao thông. Xem clip nhận diện tình huống và chọn đáp án trắc nghiệm phương án xử lý an toàn chuẩn quy chế mới.',
      buttonText: 'TIẾP TỤC',
    },
    {
      step: '03',
      titlePrefix: 'CHỌN HẠNG BẰNG',
      titleHighlight: 'SÁT HẠCH',
      desc: 'Chọn loại giấy phép lái xe bạn đang học để ứng dụng tự động thiết lập bộ đề thi, ngân hàng câu hỏi lý thuyết và thời gian làm bài chuẩn quy chế 2026.',
      buttonText: 'BẮT ĐẦU NGAY',
    },
  ];

  const handleStartWalkthrough = () => {
    setViewMode('walkthrough');
    setCurrentStep(0);
  };

  const handleNextSlide = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartExperience();
    }
  };

  const handleSkip = () => {
    onStartExperience();
  };

  // Intentional Swipe & Drag support (kéo/vuốt để chuyển slide, chạm nhẹ không bị nhảy)
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    touchStartXRef.current = clientX;
    touchEndXRef.current = clientX;
    touchStartYRef.current = clientY;
    touchEndYRef.current = clientY;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    touchEndXRef.current = clientX;
    touchEndYRef.current = clientY;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (viewMode !== 'walkthrough') return;

    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const deltaY = touchStartYRef.current - touchEndYRef.current;

    // Chỉ chuyển slide khi kéo/vuốt chủ đích: khoảng cách vuốt > 50px và theo phương ngang
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0 && currentStep < slides.length - 1) {
        // Vuốt sang trái -> xem slide tiếp theo
        setCurrentStep(currentStep + 1);
      } else if (deltaX < 0 && currentStep > 0) {
        // Vuốt sang phải -> quay lại slide trước
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Touch handlers: Dành riêng cho màn hình cảm ứng (Mobile & Tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    handlePointerDown(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handlePointerMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    handlePointerUp();
  };

  // Desktop keyboard controls: Phím mũi tên <- -> để chuyển slide, Enter để tiếp tục
  useEffect(() => {
    if (viewMode !== 'walkthrough') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang mở modal chính sách hoặc cài đặt
      if (policyModal || showInstallModal) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentStep < slides.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          onStartExperience();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentStep, slides.length, policyModal, showInstallModal]);

  const currentSlide = slides[currentStep];

  return (
    <div
      className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none select-none flex flex-col justify-between pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] bg-slate-50 text-slate-900 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================================= */}
      {/* 1. MÀN MINIMALISM TRẢI NGHIỆM NGAY & HƯỚNG DẪN CÀI (MÀN ĐẦU TIÊN)         */}
      {/* ========================================================================= */}
      {viewMode === 'landing' && (
        <div className="w-full h-full flex flex-col justify-between animate-in fade-in duration-200">
          {/* Top balance spacer */}
          <div aria-hidden="true" className="h-3 sm:h-6 landscape-mobile:h-1 shrink-0" />

          {/* Centered Main Container */}
          <main className="w-full max-w-md sm:max-w-lg lg:max-w-xl landscape-mobile:max-w-2xl mx-auto px-5 sm:px-8 landscape-mobile:px-6 my-auto py-4 sm:py-6 landscape-mobile:py-1.5 flex flex-col items-center">
            {/* App Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 landscape-mobile:w-11 landscape-mobile:h-11 rounded-2xl landscape-mobile:rounded-xl bg-white border border-slate-200 p-2 landscape-mobile:p-1.5 shadow-xs flex items-center justify-center mb-4 sm:mb-5 landscape-mobile:mb-1.5">
              <img
                src="/logo.jpg"
                alt="OnTap GPLX Logo"
                className="w-full h-full object-contain rounded-xl landscape-mobile:rounded-lg"
              />
            </div>

            {/* Header Text */}
            <div className="text-center mb-6 sm:mb-8 landscape-mobile:mb-2.5 space-y-1 landscape-mobile:space-y-0.5">
              <div className="text-2xl sm:text-3xl lg:text-4xl landscape-mobile:text-lg font-black text-slate-900 tracking-tight">
                OnTap <span className="text-amber-500">GPLX</span>
              </div>
              <div className="text-xs sm:text-sm landscape-mobile:text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Ôn thi giấy phép lái xe 2026
              </div>
            </div>

            {/* 2 Clean Action Cards */}
            <div className="w-full space-y-3 sm:space-y-4 landscape-mobile:space-y-0 landscape-mobile:grid landscape-mobile:grid-cols-2 landscape-mobile:gap-3 mb-5 sm:mb-6 landscape-mobile:mb-2">
              {/* Card 1: Trải nghiệm ngay -> Bấm vào ra 3 bước Onboarding */}
              <button
                type="button"
                onClick={handleStartWalkthrough}
                className="w-full text-left bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl landscape-mobile:rounded-xl p-5 sm:p-6 landscape-mobile:p-3.5 transition-all duration-150 cursor-pointer shadow-xs block"
              >
                <div className="space-y-1 landscape-mobile:space-y-0.5">
                  <div className="text-base sm:text-lg lg:text-xl landscape-mobile:text-sm font-bold tracking-tight text-white">
                    Trải nghiệm ngay
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-snug font-normal">
                    Ôn tập 600 câu lý thuyết phân hạng và 120 tình huống mô phỏng trắc nghiệm.
                  </p>
                </div>
              </button>

              {/* Card 2: Hướng dẫn cài đặt ứng dụng */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full text-left bg-white hover:bg-slate-50/90 active:bg-slate-100 text-slate-900 rounded-2xl landscape-mobile:rounded-xl p-5 sm:p-6 landscape-mobile:p-3.5 border border-slate-200 hover:border-slate-300 shadow-xs transition-all duration-150 cursor-pointer block"
              >
                <div className="space-y-1 landscape-mobile:space-y-0.5">
                  <div className="text-base sm:text-lg lg:text-xl landscape-mobile:text-sm font-bold text-slate-900 tracking-tight">
                    Hướng dẫn cài đặt ứng dụng
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 leading-relaxed font-normal">
                    Cài OnTap GPLX vào màn hình chính điện thoại hoặc máy tính để mở nhanh và thuận tiện hơn.
                  </p>
                </div>
              </button>
            </div>

            {/* Terms, Privacy & Cookie Agreement Text */}
            <div className="w-full text-center px-1">
              <p className="text-[11px] sm:text-xs landscape-mobile:text-[10px] text-slate-500 leading-relaxed max-w-sm landscape-mobile:max-w-xl mx-auto font-normal">
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('terms')}
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900 cursor-pointer font-medium"
                >
                  Điều khoản
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900 cursor-pointer font-medium"
                >
                  Quyền riêng tư
                </button>{' '}
                và{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('cookie')}
                  className="text-slate-700 underline underline-offset-2 hover:text-slate-900 cursor-pointer font-medium"
                >
                  Cookie
                </button>
                .
              </p>
            </div>
          </main>

          {/* Minimalist Landing Footer */}
          <footer className="w-full shrink-0 py-2 sm:py-3 landscape-mobile:py-1 text-center text-[11px] landscape-mobile:text-[10px] text-slate-400 font-mono">
            thực hiện bởi <span className="font-semibold text-slate-600">thanhtungg.</span>
            <span className="block text-[10px] landscape-mobile:text-[9px] text-slate-400 font-mono mt-0.5">
              Phiên bản 1.1.0
            </span>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MÀN 3 BƯỚC ONBOARDING CAROUSEL (01 - 02 - 03) - CHUẨN NỀN SÁNG ONTAP GPLX */}
      {/* ========================================================================= */}
      {viewMode === 'walkthrough' && (
        <div className="w-full h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-250 relative">
          {/* Desktop Floating Navigation Arrows (Phím ← và →) */}
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              aria-label="Slide trước (Phím ←)"
              title="Phím mũi tên ←"
              className="hidden lg:flex absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white active:scale-95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-slate-950 transition-all cursor-pointer z-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentStep < slides.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              aria-label="Slide tiếp theo (Phím →)"
              title="Phím mũi tên →"
              className="hidden lg:flex absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white active:scale-95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-slate-950 transition-all cursor-pointer z-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Top Bar: "BỎ QUA" on the right only */}
          <header className="w-full max-w-md md:max-w-xl lg:max-w-5xl landscape-mobile:max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pt-2 sm:pt-4 lg:pt-6 pb-1 sm:pb-2 flex items-center justify-end shrink-0 z-20">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 active:text-slate-950 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-200/50"
            >
              BỎ QUA
            </button>
          </header>

          {/* Main Walkthrough Container: Responsive 2-Column on Desktop & Landscape Mobile, Centered Stage on Tablet Portrait, Single-Column on Mobile Portrait */}
          <div className="w-full max-w-md md:max-w-xl lg:max-w-5xl landscape-mobile:max-w-4xl mx-auto flex-1 flex flex-col lg:flex-row landscape-mobile:flex-row items-center justify-between md:justify-center px-5 sm:px-8 lg:px-10 pb-4 sm:pb-6 lg:pb-8 landscape-mobile:pb-2 gap-4 sm:gap-6 md:gap-8 lg:gap-14 landscape-mobile:gap-6 overflow-hidden my-auto">
            {/* Left Column (Desktop/Landscape) / Upper Half (Mobile/Tablet Portrait): Graphic Area */}
            <div className="relative flex-1 md:flex-none lg:w-1/2 landscape-mobile:flex-none landscape-mobile:w-[48%] flex items-center justify-center min-h-[200px] sm:min-h-[240px] md:min-h-0 lg:min-h-[420px] landscape-mobile:min-h-0 overflow-visible">
              {/* Faint Large Watermark Number behind graphic */}
              <div
                key={`watermark-${currentSlide.step}`}
                className="absolute select-none font-black text-[130px] sm:text-[170px] md:text-[220px] lg:text-[250px] landscape-mobile:text-[90px] text-slate-900/[0.04] pointer-events-none tracking-tighter leading-none animate-in fade-in zoom-in-90 duration-300"
              >
                {currentSlide.step}
              </div>

              {/* Graphic Container: 3D Book for Slide 01, 3D Exam Monitor for Slide 02, 3D PET Card for Slide 03 */}
              <div
                key={`graphic-${currentStep}`}
                className={
                  currentStep === 0
                    ? 'relative z-10 w-48 sm:w-56 md:w-64 lg:w-72 h-[272px] sm:h-[310px] md:h-[380px] lg:h-[420px] landscape-mobile:w-36 landscape-mobile:h-[195px] bg-[#fffdfa] rounded-r-lg rounded-l-xs border-r border-t border-b border-slate-300/80 border-l-[7px] border-l-slate-300 shadow-2xl shadow-slate-400/40 p-2 sm:p-2.5 md:p-3 landscape-mobile:p-1.5 flex flex-col justify-between animate-in zoom-in-95 fade-in duration-250 select-none'
                    : currentStep === 1
                    ? 'relative z-10 w-[316px] sm:w-[360px] md:w-[450px] lg:w-[480px] max-w-full h-[216px] sm:h-[240px] md:h-[300px] lg:h-[320px] landscape-mobile:w-72 landscape-mobile:h-[175px] flex flex-col items-center justify-between animate-in zoom-in-95 fade-in duration-250 select-none'
                    : 'relative z-10 w-[316px] sm:w-[350px] md:w-[440px] lg:w-[460px] max-w-full h-[228px] sm:h-[248px] md:h-[300px] lg:h-[315px] landscape-mobile:w-72 landscape-mobile:h-[180px] flex flex-col justify-between animate-in zoom-in-95 fade-in duration-250 select-none'
                }
              >
                {/* ------------------------------------------------------------- */}
                {/* Slide 01 Graphic: Cuốn sách ÔN THI CẤP TỐC 600 CÂU & 120 TH MÔ PHỎNG */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 0 && (
                  <div className="w-full h-full border border-indigo-950/80 p-1 sm:p-1.5 lg:p-2 flex flex-col justify-between relative">
                    {/* Corner square accents */}
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 border border-indigo-950" />

                    {/* Inner border box */}
                    <div className="w-full h-full border border-indigo-950/70 p-1.5 sm:p-2 lg:p-2.5 landscape-mobile:p-1 flex flex-col justify-between items-center text-center">
                      {/* Top Titles */}
                      <div className="space-y-0.5 pt-1">
                        <div className="font-black tracking-widest text-[11px] sm:text-[12px] lg:text-[13px] landscape-mobile:text-[8px] text-slate-900 uppercase leading-none">
                          PHƯƠNG PHÁP
                        </div>
                        <div className="font-bold tracking-wider text-[8.5px] sm:text-[9.5px] lg:text-[10.5px] landscape-mobile:text-[6.5px] text-slate-700 uppercase">
                          HỌC NHANH FULL
                        </div>
                      </div>

                      {/* Big Title & Pill */}
                      <div className="space-y-1 my-1">
                        <div className="font-black text-slate-900 text-sm sm:text-base lg:text-lg landscape-mobile:text-[10px] tracking-tight uppercase leading-none">
                          ÔN THI CẤP TỐC
                        </div>
                        <div className="inline-block px-2 lg:px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[7px] sm:text-[8px] lg:text-[9px] landscape-mobile:text-[5.5px] tracking-normal shadow-2xs">
                          Câu Hỏi Luật Mới Bộ Công An
                        </div>
                      </div>

                      {/* Sa hình ngã tư (Intersection Illustration SVG) */}
                      <div className="w-full h-18 sm:h-22 lg:h-28 landscape-mobile:h-13 bg-[#f3f7eb] border border-slate-300/80 rounded-xs overflow-hidden relative shadow-inner my-0.5">
                        <svg viewBox="0 0 200 130" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                          {/* 4 Green Grass Corner Lawns */}
                          <rect x="0" y="0" width="60" height="40" fill="#dcfce7" />
                          <rect x="140" y="0" width="60" height="40" fill="#dcfce7" />
                          <rect x="0" y="90" width="60" height="40" fill="#dcfce7" />
                          <rect x="140" y="90" width="60" height="40" fill="#dcfce7" />

                          {/* Roads */}
                          <rect x="60" y="0" width="80" height="130" fill="#cbd5e1" />
                          <rect x="0" y="40" width="200" height="50" fill="#cbd5e1" />

                          {/* Road lane markings */}
                          <line x1="100" y1="0" x2="100" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                          <line x1="100" y1="90" x2="100" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                          <line x1="0" y1="65" x2="60" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                          <line x1="140" y1="65" x2="200" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />

                          {/* Red Curved Turning Arrow (From bottom lane turning right) */}
                          <path d="M 85 115 Q 85 78 145 78" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
                          <polygon points="143,74 152,78 143,82" fill="#dc2626" />

                          {/* Red Straight Arrow (For motorbike / straight lane) */}
                          <path d="M 115 115 L 115 50" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />

                          {/* Traffic Police Officer (CSGT) in center of crossroads */}
                          <g transform="translate(100, 65)">
                            {/* Officer shadow */}
                            <ellipse cx="0" cy="8" rx="6" ry="2" fill="#94a3b8" opacity="0.6" />
                            {/* Outstretched Arms (directing both ways) */}
                            <line x1="-14" y1="-1" x2="14" y2="-1" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="-14" cy="-1" r="1.5" fill="#fbcfe8" />
                            <circle cx="14" cy="-1" r="1.5" fill="#fbcfe8" />
                            {/* Body in yellow khaki uniform */}
                            <path d="M -4,2 L -3,-4 L 3,-4 L 4,2 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                            {/* Legs */}
                            <line x1="-2" y1="2" x2="-2" y2="8" stroke="#ca8a04" strokeWidth="1.5" />
                            <line x1="2" y1="2" x2="2" y2="8" stroke="#ca8a04" strokeWidth="1.5" />
                            {/* Head & Police Cap */}
                            <circle cx="0" cy="-7" r="2.5" fill="#fbcfe8" />
                            <ellipse cx="0" cy="-8.5" rx="3.2" ry="1.2" fill="#ffffff" stroke="#ca8a04" strokeWidth="0.6" />
                          </g>

                          {/* Blue Sedan (Car turning) */}
                          <g transform="translate(73, 98) rotate(-15)">
                            <rect x="0" y="0" width="16" height="25" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
                            {/* Windshield */}
                            <rect x="2" y="5" width="12" height="6" rx="1" fill="#93c5fd" />
                            <rect x="2" y="15" width="12" height="4" rx="1" fill="#93c5fd" />
                            {/* Headlights */}
                            <circle cx="2" cy="2" r="1" fill="#fef08a" />
                            <circle cx="14" cy="2" r="1" fill="#fef08a" />
                          </g>

                          {/* Cyan Truck on the right side */}
                          <g transform="translate(150, 50)">
                            <rect x="0" y="0" width="30" height="12" rx="1" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
                            <rect x="0" y="1" width="10" height="10" rx="1" fill="#38bdf8" />
                            <circle cx="4" cy="12" r="2" fill="#334155" />
                            <circle cx="24" cy="12" r="2" fill="#334155" />
                          </g>

                          {/* Motorbike on top left */}
                          <g transform="translate(75, 15)">
                            <ellipse cx="5" cy="8" rx="3" ry="8" fill="#dc2626" />
                            <circle cx="5" cy="5" r="2.5" fill="#f43f5e" />
                          </g>
                        </svg>
                      </div>

                      {/* Bottom Text */}
                      <div className="space-y-0.5 mt-0.5 pb-0.5">
                        <div className="font-black text-indigo-950 text-[10.5px] sm:text-[12px] lg:text-[13px] landscape-mobile:text-[8px] leading-tight tracking-normal">
                          600 câu hỏi và 120 TH Mô Phỏng
                        </div>
                        <div className="italic text-slate-500 text-[8px] sm:text-[9px] lg:text-[10px] landscape-mobile:text-[6.5px] tracking-normal font-medium">
                          ( Lưu hành nội bộ )
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 02 Graphic: Laptop MacBook Pro Mô Phỏng 3D (Chuẩn Tỷ Lệ) */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 1 && (
                  <div className="w-full h-full flex flex-col items-center justify-between">
                    {/* MacBook Display Lid (Midnight / Space Gray Aluminum Casing) */}
                    <div className="w-full flex-1 rounded-t-2xl rounded-b-none bg-[#0c101c] border-t border-x border-slate-700/80 shadow-2xl shadow-slate-950/60 p-1.5 sm:p-2 flex flex-col justify-between relative overflow-hidden">
                      {/* Top Bezel: Centered Slim Camera Notch */}
                      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black rounded-b-sm flex items-center justify-center z-20">
                        <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
                      </div>

                      {/* Inner Retina Screen (Widescreen 16:10 Ratio) */}
                      <div className="w-full h-full rounded-lg bg-slate-950 border border-slate-800/90 p-1.5 flex flex-col justify-between overflow-hidden">
                        {/* macOS Window Title Bar */}
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800/90 text-[8px] sm:text-[9px] lg:text-[10px] font-mono">
                          {/* 3 macOS Traffic Light Window Buttons */}
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-rose-500 shadow-2xs" />
                            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-amber-500 shadow-2xs" />
                            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                            <span className="font-bold text-slate-200 uppercase tracking-tight ml-1 text-[8px] sm:text-[8.5px] lg:text-[9.5px]">
                              MÔ PHỎNG 120 TÌNH HUỐNG
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono text-[7.5px] sm:text-[8px] lg:text-[9px]">
                            Tình huống 18/120
                          </span>
                        </div>

                        {/* Video Scene (Simulated Highway 3D Widescreen) */}
                        <div className="w-full h-18 sm:h-21 lg:h-28 landscape-mobile:h-14 rounded-md bg-[#090d16] border border-slate-800/80 overflow-hidden relative my-0.5">
                          <svg viewBox="0 0 280 110" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <linearGradient id="skyGradDark" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0f172a" />
                                <stop offset="100%" stopColor="#1e293b" />
                              </linearGradient>
                            </defs>

                            {/* Sky */}
                            <rect x="0" y="0" width="280" height="42" fill="url(#skyGradDark)" />
                            {/* Distant Hills */}
                            <polygon points="0,42 40,28 80,42" fill="#334155" />
                            <polygon points="65,42 115,22 165,42" fill="#1e293b" />
                            <polygon points="150,42 200,26 250,42" fill="#334155" />
                            <polygon points="230,42 265,32 280,42" fill="#1e293b" />

                            {/* Highway Asphalt Road */}
                            <polygon points="0,110 140,42 280,110" fill="#1e293b" />
                            {/* Yellow Dashed Center Line */}
                            <line x1="140" y1="42" x2="140" y2="105" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
                            {/* White Side Lines */}
                            <line x1="0" y1="110" x2="140" y2="42" stroke="#64748b" strokeWidth="1.2" />
                            <line x1="280" y1="110" x2="140" y2="42" stroke="#64748b" strokeWidth="1.2" />

                            {/* Blue Car in front with glowing red brake lights */}
                            <g transform="translate(125, 48)">
                              <rect x="0" y="0" width="30" height="20" rx="2" fill="#2563eb" stroke="#3b82f6" strokeWidth="0.8" />
                              <rect x="3" y="3" width="24" height="10" rx="1" fill="#93c5fd" />
                              {/* Brake Lights */}
                              <circle cx="5" cy="16" r="2.2" fill="#ef4444" />
                              <circle cx="25" cy="16" r="2.2" fill="#ef4444" />
                              {/* Plate */}
                              <rect x="11" y="14" width="8" height="3" fill="#ffffff" />
                            </g>

                            {/* Steering Wheel Arc at bottom */}
                            <path d="M 90 110 Q 140 85 190 110" fill="none" stroke="#475569" strokeWidth="7" />
                            <circle cx="140" cy="102" r="4.5" fill="#64748b" />

                            {/* Minimalist Situation Tag */}
                            <g transform="translate(10, 8)">
                              <rect x="0" y="0" width="135" height="14" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                              <text x="67.5" y="10" textAnchor="middle" fill="#f8fafc" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                                Tình huống: Xe phía trước giảm tốc
                              </text>
                            </g>
                          </svg>
                        </div>

                        {/* 4 Minimalist Flat Options (Dark Theme) */}
                        <div className="grid grid-cols-2 gap-1 my-0.5">
                          <div className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-slate-900 border border-slate-800 text-[8px] sm:text-[8.5px] lg:text-[10px] text-slate-300 truncate">
                            A. Giữ nguyên tốc độ
                          </div>
                          <div className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-emerald-950/80 border border-emerald-500/80 text-[8px] sm:text-[8.5px] lg:text-[10px] text-emerald-300 font-bold flex items-center justify-between shadow-2xs">
                            <span className="truncate">B. Phanh giảm tốc</span>
                            <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-400 stroke-[3] shrink-0 ml-1" />
                          </div>
                          <div className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-slate-900 border border-slate-800 text-[8px] sm:text-[8.5px] lg:text-[10px] text-slate-300 truncate">
                            C. Bấm còi vượt xe
                          </div>
                          <div className="p-1 sm:p-1.5 lg:p-2 rounded-md bg-slate-900 border border-slate-800 text-[8px] sm:text-[8.5px] lg:text-[10px] text-slate-300 truncate">
                            D. Đánh lái sang phải
                          </div>
                        </div>

                        {/* Bottom Footer Caption (Minimalist Dark) */}
                        <div className="pt-1 lg:pt-1.5 border-t border-slate-850 flex items-center justify-between text-[7.5px] sm:text-[8px] lg:text-[9.5px] text-slate-400 font-mono">
                          <span>Trắc nghiệm 4 mốc thời điểm</span>
                          <span className="text-emerald-400 font-bold">10 điểm tối đa</span>
                        </div>
                      </div>
                    </div>

                    {/* MacBook Base (Unibody Aluminum Keyboard Deck, Widescreen Lip & Thumb Scoop) */}
                    <div className="w-[105%] flex flex-col items-center relative z-10 -mt-[1px]">
                      <div className="w-full h-3 sm:h-3.5 lg:h-4 bg-linear-to-b from-slate-700 via-slate-800 to-slate-900 border-t border-slate-600/90 rounded-b-lg shadow-xl shadow-slate-950/60 flex items-start justify-center relative">
                        {/* Center Thumb Opening Scoop */}
                        <div className="w-12 sm:w-14 lg:w-18 h-1 lg:h-1.5 rounded-b-sm bg-slate-600/90 shadow-inner" />
                        {/* Slim Chamfer Metallic Highlight Edge */}
                        <div className="w-full h-[0.5px] bg-slate-400/40 absolute bottom-0" />
                      </div>
                      {/* Rubber feet left & right */}
                      <div className="w-[96%] flex justify-between px-2 -mt-0.5">
                        <div className="w-4 h-0.5 rounded-full bg-slate-950/80" />
                        <div className="w-4 h-0.5 rounded-full bg-slate-950/80" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 03 Graphic: Thẻ GPLX PET với Ô Picker 7 Hạng Chuẩn      */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 2 && (
                  <div className="w-full h-full rounded-2xl lg:rounded-3xl border border-rose-300/80 bg-linear-to-br from-[#ffe4e6] via-[#fff1f2] to-[#fed7aa]/35 p-3 sm:p-3.5 md:p-4 pb-3 sm:pb-3.5 md:pb-4.5 landscape-mobile:p-2 shadow-xl shadow-rose-950/10 flex flex-col justify-between overflow-hidden relative select-none">
                    {/* Official National Header & Red Title (Màu sắc chuẩn phôi GPLX) */}
                    <div className="text-center pb-1.5 border-b border-rose-200/90 shrink-0">
                      <div className="font-bold text-[8.5px] sm:text-[9.5px] md:text-[11px] lg:text-[11.5px] text-slate-900 uppercase tracking-tight leading-tight">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </div>
                      <div className="italic text-[7px] sm:text-[7.5px] md:text-[8.5px] lg:text-[9px] text-slate-600 leading-none mt-0.5 font-medium">
                        Độc lập - Tự do - Hạnh phúc
                      </div>
                      <div className="w-12 h-[0.5px] bg-slate-400 mx-auto mt-0.5 mb-1" />

                      {/* Tiêu đề đỏ chữ đậm chuẩn GPLX thật */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-red-600 font-black text-xs sm:text-[13px] md:text-[14.5px] lg:text-[15px] uppercase tracking-wider">
                          GIẤY PHÉP LÁI XE
                        </span>
                        <span className="text-red-600/90 font-mono font-bold text-[8px] sm:text-[8.5px] md:text-[9.5px] lg:text-[10px]">
                          Số: 0102600899
                        </span>
                      </div>
                    </div>

                    {/* Card Center: Official Info Row & Main Picker Box */}
                    <div className="w-full flex-1 flex flex-col justify-center py-1 sm:py-2 px-0.5">
                      {/* Learner Info Row */}
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] md:text-[10.5px] text-slate-600 mb-2 pb-1.5 border-b border-rose-200/60 font-medium">
                        <div>
                          Họ và tên: <strong className="text-slate-900 font-bold uppercase">ONTAP GPLX</strong>
                        </div>
                      </div>

                      {/* Main Category Picker Trigger */}
                      <div className="relative">
                        <div className="mb-1">
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                            Hạng:
                          </span>
                        </div>

                        {/* Picker Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setIsPickerOpen(true)}
                          className="w-full bg-white/95 hover:bg-white active:scale-[0.99] border-2 border-red-500/80 rounded-xl p-2 sm:p-2.5 md:p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="text-left min-w-0 pr-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="text-xs sm:text-sm md:text-base font-black text-red-950 tracking-tight">
                                {activeCategoryConfig.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-mono font-bold text-[8px] sm:text-[9px] md:text-[10px] shrink-0">
                                {activeCategoryConfig.totalQuestions} câu • {activeCategoryConfig.timeMinutes}p
                              </span>
                            </div>
                            <div className="text-[8.5px] sm:text-[9.5px] md:text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                              {activeCategoryConfig.description}
                            </div>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0 text-red-600 transition-colors">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                      </div>

                      {/* Official Exam Specs Footer strip */}
                      <div className="mt-2 pt-1.5 border-t border-rose-200/60 flex items-center justify-between text-[8px] sm:text-[8.5px] md:text-[10px] text-slate-600">
                        <div>
                          Tiêu chuẩn đạt: <strong className="text-emerald-700 font-bold">{activeCategoryConfig.passScore}/{activeCategoryConfig.totalQuestions} câu</strong>
                        </div>
                        <div className="text-slate-500">
                          Tối đa sai: <strong className="text-slate-700 font-bold">{activeCategoryConfig.allowedWrong} câu</strong> (0 câu liệt)
                        </div>
                      </div>
                    </div>

                    {/* Popover / Sheet: 7 Categories in Exact Order (A1 -> A -> B1 -> B -> C1 -> C -> D) */}
                    {isPickerOpen && (
                      <div className="absolute inset-0 z-40 bg-white/98 backdrop-blur-md p-2.5 sm:p-3 flex flex-col justify-between shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 shrink-0">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Chọn hạng GPLX (7 Hạng chuẩn 2026)
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPickerOpen(false)}
                            className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 7 Categories List in Exact Canonical Order */}
                        <div className="flex-1 overflow-y-auto py-1 space-y-1 pr-0.5">
                          {LICENSE_CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  handleCategorySelect(cat.id);
                                  setIsPickerOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-red-50 text-red-950 font-bold border border-red-200 shadow-2xs'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] leading-tight">
                                    <span className={isSelected ? 'font-black text-red-600' : 'font-bold'}>
                                      {cat.name}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                                      ({cat.totalQuestions} câu • {cat.timeMinutes}p)
                                    </span>
                                  </div>
                                  <div className="text-[8.5px] sm:text-[9.5px] text-slate-500 truncate mt-0.5">
                                    {cat.description}
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-red-600 stroke-[3] shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Subtle Divider Line: Visible only on mobile portrait, hidden on tablet, desktop & landscape mobile */}
            <div className="w-full border-t border-slate-200/80 my-1.5 sm:my-2 landscape-mobile:hidden md:hidden lg:hidden shrink-0" />

            {/* Right Column (Desktop/Landscape) / Lower Half (Mobile/Tablet Portrait): Step Counter, Title, Description, and Layered CTA Button */}
            <div className="w-full md:max-w-xl lg:max-w-none lg:w-1/2 landscape-mobile:w-[50%] pt-1 md:pt-0 landscape-mobile:pt-0 flex flex-col justify-center shrink-0">
              {/* Step Counter Row: 01 / 03 & Modern Pagination Indicator */}
              <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 md:mb-4 lg:mb-4 landscape-mobile:mb-1.5">
                {/* Step Number (01 / 03) */}
                <div className="flex items-baseline gap-1.5 font-mono select-none">
                  <span className="text-2xl sm:text-3xl md:text-4xl landscape-mobile:text-xl font-black text-slate-900 tracking-tight">
                    {currentSlide.step}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-slate-400">
                    / 03
                  </span>
                </div>

                {/* 3 Sleek Interactive Pagination Pills */}
                <div
                  className="flex items-center gap-1.5 lg:gap-2 p-1 -m-1"
                  role="tablist"
                  aria-label="Các bước giới thiệu"
                >
                    {slides.map((_, idx) => {
                      const isCurrent = idx === currentStep;
                      return (
                        <button
                          key={idx}
                          type="button"
                          role="tab"
                          aria-selected={isCurrent}
                          onClick={() => setCurrentStep(idx)}
                          aria-label={`Chuyển đến bước ${idx + 1}`}
                          className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                            isCurrent
                              ? 'w-8 sm:w-10 md:w-12 bg-linear-to-r from-amber-500 to-orange-500 shadow-xs shadow-amber-500/40'
                              : 'w-2 sm:w-2.5 md:w-3 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

              {/* Heading Title (Crisp Slate with Amber Accent) */}
              <h2
                key={`title-${currentStep}`}
                className="text-xl sm:text-2xl md:text-3xl landscape-mobile:text-base font-black text-slate-900 tracking-tight uppercase mb-1.5 sm:mb-2.5 md:mb-3.5 landscape-mobile:mb-1 leading-snug animate-in fade-in duration-200"
              >
                <span>{currentSlide.titlePrefix} </span>
                <span className="text-amber-500">{currentSlide.titleHighlight}</span>
              </h2>

              {/* Description Body */}
              <p
                key={`desc-${currentStep}`}
                className="text-xs sm:text-sm md:text-base landscape-mobile:text-[11px] text-slate-600 leading-relaxed font-normal mb-4 sm:mb-6 md:mb-7 landscape-mobile:mb-2 line-clamp-3 sm:line-clamp-none animate-in fade-in duration-200"
              >
                {currentStep === 2
                  ? `Đang chọn ${activeCategoryConfig.name} (${activeCategoryConfig.description}). Đề thi gồm ${activeCategoryConfig.totalQuestions} câu làm trong ${activeCategoryConfig.timeMinutes} phút, đạt từ ${activeCategoryConfig.passScore}/${activeCategoryConfig.totalQuestions} câu trở lên.`
                  : currentSlide.desc}
              </p>

              {/* 3D Layered Offset CTA Button */}
              <div className="w-full relative select-none">
                {/* Orange Bottom Offset Layer */}
                <div
                  className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl bg-orange-600 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Interactive Button Layer */}
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="relative w-full py-3.5 sm:py-4 md:py-4.5 landscape-mobile:py-2.5 px-6 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:translate-x-1 active:translate-y-1 text-slate-950 font-black text-sm sm:text-base md:text-lg tracking-wider uppercase flex items-center justify-center gap-2 transition-transform duration-75 cursor-pointer shadow-md"
                >
                  <span>{currentSlide.buttonText}</span>
                  <span className="text-lg md:text-xl leading-none font-black">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL CHÍNH SÁCH & ĐIỀU KHOẢN (TERMS / PRIVACY / COOKIE)               */}
      {/* ========================================================================= */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape-mobile:p-2 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-900/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 w-full max-w-md landscape-mobile:max-w-xl rounded-2xl p-5 sm:p-6 landscape-mobile:p-3.5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 landscape-mobile:pb-2 border-b border-slate-100 mb-4 landscape-mobile:mb-2">
              <h3 className="font-bold text-slate-900 text-base landscape-mobile:text-sm">
                {policyModal === 'terms' && 'Điều khoản Sử dụng'}
                {policyModal === 'privacy' && 'Chính sách Quyền riêng tư'}
                {policyModal === 'cookie' && 'Chính sách Cookie'}
              </h3>
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-4 landscape-mobile:space-y-2.5 pr-1 text-xs sm:text-sm landscape-mobile:text-xs text-slate-600 leading-relaxed">
              {policyModal === 'privacy' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Không thu thập thông tin định danh
                    </h4>
                    <p>
                      OnTap GPLX không yêu cầu đăng ký hay đăng nhập tài khoản. Chúng tôi tuyệt đối
                      không thu thập họ tên, email, số điện thoại, danh bạ hay vị trí địa lý của bạn.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Lưu trữ hoàn toàn trên thiết bị của bạn
                    </h4>
                    <p>
                      Toàn bộ tiến độ ôn tập, danh sách câu trả lời sai, câu hỏi điểm liệt đã đánh dấu
                      và kết quả các bài thi sát hạch thử được lưu trực tiếp trên chính thiết bị của bạn,
                      hoàn toàn không tải lên máy chủ bên ngoài.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Quyền làm chủ dữ liệu của học viên
                    </h4>
                    <p>
                      Học viên có toàn quyền xóa lịch sử thi, đặt lại tiến độ học tập hoặc sao lưu dữ
                      liệu cá nhân bất cứ lúc nào trong mục Thống kê của ứng dụng.
                    </p>
                  </div>
                </>
              )}

              {policyModal === 'terms' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Mục đích học tập phi thương mại
                    </h4>
                    <p>
                      OnTap GPLX là ứng dụng học tập phi thương mại hỗ trợ học viên ôn luyện sát hạch
                      cấp giấy phép lái xe cơ giới đường bộ, hoàn toàn miễn phí và không chèn banner
                      quảng cáo.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Dữ liệu chuẩn Cục Đường bộ Việt Nam
                    </h4>
                    <p>
                      Ngân hàng 600 câu hỏi sát hạch lý thuyết (bao gồm 60 câu hỏi điểm liệt) và 120
                      tình huống mô phỏng giao thông chuẩn trắc nghiệm 4 phần theo quy chế mới được đối
                      soát bám sát tài liệu chuẩn của Cục Đường bộ Việt Nam.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Trách nhiệm của người học
                    </h4>
                    <p>
                      Ứng dụng đóng vai trò là tài liệu hỗ trợ tự học và rèn luyện kỹ năng. Thí sinh cần
                      chủ động nắm vững Luật Trật tự, an toàn giao thông đường bộ và các quy định sát
                      hạch chính thức do Sở Giao thông vận tải tổ chức.
                    </p>
                  </div>
                </>
              )}

              {policyModal === 'cookie' && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      1. Bộ nhớ kỹ thuật thiết yếu
                    </h4>
                    <p>
                      Ứng dụng chỉ sử dụng bộ nhớ cục bộ để ghi nhớ hạng giấy phép lái xe bạn đang ôn
                      tập (A1, A, B, C1, C...) và lưu trữ tiến độ làm bài giữa các phiên học.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      2. Tuyệt đối không có mã theo dõi
                    </h4>
                    <p>
                      OnTap GPLX cam kết không nhúng bất kỳ mã theo dõi hành vi, phân tích người dùng
                      hay quảng cáo nào từ các bên thứ ba.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      3. Tối ưu tốc độ tải trang
                    </h4>
                    <p>
                      Hệ thống lưu tạm tài nguyên giao diện và hình ảnh trên trình duyệt nhằm giúp ứng
                      dụng phản hồi nhanh chóng, mượt mà và tiết kiệm dữ liệu di động của bạn.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Action Button */}
            <div className="pt-4 landscape-mobile:pt-2 mt-4 landscape-mobile:mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="w-full py-2.5 landscape-mobile:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL HƯỚNG DẪN CÀI ĐẶT ỨNG DỤNG (PWA)                                */}
      {/* ========================================================================= */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape-mobile:p-2 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-slate-900/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 w-full max-w-md landscape-mobile:max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] landscape-mobile:max-h-[92vh] animate-in zoom-in-95 duration-150 touch-auto">
            {/* Modal Header */}
            <div className="px-5 py-3.5 landscape-mobile:py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm">Hướng dẫn cài đặt ứng dụng</div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 landscape-mobile:p-1 gap-1">
              <button
                type="button"
                onClick={() => setInstallTab('ios')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'ios'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                type="button"
                onClick={() => setInstallTab('android')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'android'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Android
              </button>
              <button
                type="button"
                onClick={() => setInstallTab('pc')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  installTab === 'pc'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Máy tính
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5 landscape-mobile:p-3 text-xs text-slate-700 space-y-3 landscape-mobile:space-y-1.5 leading-relaxed overflow-y-auto">
              {installTab === 'ios' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Mở trang web bằng trình duyệt <strong>Safari</strong> trên thiết bị.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Nhấn biểu tượng <strong>Chia sẻ</strong> (hình ô vuông có mũi tên hướng lên) ở
                      thanh dưới cùng.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Chọn <strong>Thêm vào Màn hình chính</strong> (Add to Home Screen).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      4
                    </span>
                    <span>
                      Nhấn <strong>Thêm</strong> ở góc trên bên phải để hoàn tất.
                    </span>
                  </div>
                </div>
              )}

              {installTab === 'android' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Mở trang web bằng <strong>Google Chrome</strong> hoặc Cốc Cốc.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Nhấn biểu tượng <strong>Menu 3 dấu chấm</strong> ở góc trên bên phải.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào Màn hình chính</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      4
                    </span>
                    <span>
                      Xác nhận <strong>Cài đặt</strong> để đưa biểu tượng app ra ngoài màn hình.
                    </span>
                  </div>
                </div>
              )}

              {installTab === 'pc' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Mở web bằng trình duyệt <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Nhấn vào biểu tượng <strong>Cài đặt</strong> ở cuối thanh địa chỉ (URL).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Chọn <strong>Cài đặt</strong> để sử dụng OnTap GPLX trong cửa sổ ứng dụng độc lập.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 landscape-mobile:py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cài đặt ngay vào máy
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
