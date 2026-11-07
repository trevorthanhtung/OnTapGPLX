import React, { useState, useEffect, useRef } from 'react';
import { X, Award } from 'lucide-react';

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

  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

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
      titlePrefix: 'THI THỬ',
      titleHighlight: 'CHUẨN SÁT HẠCH',
      desc: 'Cấu trúc đề thi sát với phòng thi thật, tự động bấm giờ và chấm điểm tức thì. Thống kê câu hay làm sai để ôn luyện cấp tốc đến khi tự tin đỗ 100%.',
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

  // Touch swipe support (left/right swipe to switch slides in walkthrough)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (viewMode !== 'walkthrough') return;
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    if (deltaX > 45 && currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (deltaX < -45 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentSlide = slides[currentStep];

  return (
    <div
      className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none select-none flex flex-col justify-between pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] bg-slate-50 text-slate-900"
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
          <div aria-hidden="true" className="h-2 sm:h-6 landscape-mobile:h-1 shrink-0" />

          {/* Centered Main Container */}
          <main className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto px-5 landscape-mobile:px-6 my-auto py-4 landscape-mobile:py-1.5 flex flex-col items-center">
            {/* App Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 landscape-mobile:w-11 landscape-mobile:h-11 rounded-2xl landscape-mobile:rounded-xl bg-white border border-slate-200 p-2 landscape-mobile:p-1.5 shadow-xs flex items-center justify-center mb-4 landscape-mobile:mb-1.5">
              <img
                src="/logo.jpg"
                alt="OnTap GPLX Logo"
                className="w-full h-full object-contain rounded-xl landscape-mobile:rounded-lg"
              />
            </div>

            {/* Header Text */}
            <div className="text-center mb-6 landscape-mobile:mb-2.5 space-y-1 landscape-mobile:space-y-0.5">
              <div className="text-2xl sm:text-3xl landscape-mobile:text-lg font-black text-slate-900 tracking-tight">
                OnTap <span className="text-amber-500">GPLX</span>
              </div>
              <div className="text-xs landscape-mobile:text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Ôn thi giấy phép lái xe 2026
              </div>
            </div>

            {/* 2 Clean Action Cards */}
            <div className="w-full space-y-3 landscape-mobile:space-y-0 landscape-mobile:grid landscape-mobile:grid-cols-2 landscape-mobile:gap-3 mb-5 landscape-mobile:mb-2">
              {/* Card 1: Trải nghiệm ngay -> Bấm vào ra 3 bước Onboarding */}
              <button
                type="button"
                onClick={handleStartWalkthrough}
                className="w-full text-left bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl landscape-mobile:rounded-xl p-5 landscape-mobile:p-3.5 transition-all duration-150 cursor-pointer shadow-xs block"
              >
                <div className="space-y-1 landscape-mobile:space-y-0.5">
                  <div className="text-base sm:text-lg landscape-mobile:text-sm font-bold tracking-tight text-white">
                    Trải nghiệm ngay
                  </div>
                  <p className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-300 leading-snug font-normal">
                    Ôn tập 600 câu lý thuyết phân hạng và 120 tình huống mô phỏng trắc nghiệm.
                  </p>
                </div>
              </button>

              {/* Card 2: Hướng dẫn cài đặt ứng dụng */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full text-left bg-white hover:bg-slate-50/90 active:bg-slate-100 text-slate-900 rounded-2xl landscape-mobile:rounded-xl p-5 landscape-mobile:p-3.5 border border-slate-200 hover:border-slate-300 shadow-xs transition-all duration-150 cursor-pointer block"
              >
                <div className="space-y-1 landscape-mobile:space-y-0.5">
                  <div className="text-base sm:text-lg landscape-mobile:text-sm font-bold text-slate-900 tracking-tight">
                    Hướng dẫn cài đặt ứng dụng
                  </div>
                  <p className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-500 leading-relaxed font-normal">
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
          <footer className="w-full shrink-0 py-3 sm:py-4 landscape-mobile:py-1 text-center text-[11px] landscape-mobile:text-[10px] text-slate-400 font-mono">
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
        <div className="w-full h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-250">
          {/* Top Bar: "BỎ QUA" on the right only */}
          <header className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto px-5 py-3 sm:py-4 flex items-center justify-end shrink-0 z-20">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 active:text-slate-950 transition-colors cursor-pointer py-1 px-2"
            >
              BỎ QUA
            </button>
          </header>

          {/* Main Walkthrough Container */}
          <div className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto flex-1 flex flex-col justify-between px-5 landscape-mobile:px-8 overflow-hidden">
            {/* Upper Half: Graphic Area with watermark number */}
            <div className="relative flex-1 flex items-center justify-center min-h-[220px] landscape-mobile:min-h-[140px] overflow-hidden">
              {/* Faint Large Watermark Number behind graphic */}
              <div
                key={`watermark-${currentSlide.step}`}
                className="absolute select-none font-black text-[130px] sm:text-[170px] landscape-mobile:text-[100px] text-slate-900/[0.04] pointer-events-none tracking-tighter leading-none animate-in fade-in zoom-in-90 duration-300"
              >
                {currentSlide.step}
              </div>

              {/* Graphic Container: 3D Book for Slide 01, Card for Slide 02 & 03 */}
              <div
                key={`graphic-${currentStep}`}
                className={
                  currentStep === 0
                    ? 'relative z-10 w-48 sm:w-52 h-[272px] sm:h-[304px] landscape-mobile:w-36 landscape-mobile:h-[195px] bg-[#fffdfa] rounded-r-lg rounded-l-xs border-r border-t border-b border-slate-300/80 border-l-[7px] border-l-slate-300 shadow-2xl shadow-slate-400/40 p-2 sm:p-2.5 landscape-mobile:p-1.5 flex flex-col justify-between animate-in zoom-in-95 fade-in duration-250 select-none'
                    : 'relative z-10 w-64 h-56 sm:w-72 sm:h-60 landscape-mobile:w-48 landscape-mobile:h-36 rounded-2xl border border-slate-200/90 bg-white p-3.5 landscape-mobile:p-2.5 shadow-xl shadow-slate-200/60 flex items-center justify-center animate-in zoom-in-95 fade-in duration-250'
                }
              >
                {/* ------------------------------------------------------------- */}
                {/* Slide 01 Graphic: Cuốn sách ÔN THI CẤP TỐC 600 CÂU & 120 TH MÔ PHỎNG */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 0 && (
                  <div className="w-full h-full border border-indigo-950/80 p-1 sm:p-1.5 flex flex-col justify-between relative">
                    {/* Corner square accents */}
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 border border-indigo-950" />
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 border border-indigo-950" />

                    {/* Inner border box */}
                    <div className="w-full h-full border border-indigo-950/70 p-1.5 sm:p-2 landscape-mobile:p-1 flex flex-col justify-between items-center text-center">
                      {/* Top Titles */}
                      <div className="space-y-0.2">
                        <div className="font-serif font-black tracking-widest text-[10.5px] sm:text-[11.5px] landscape-mobile:text-[8px] text-slate-900 uppercase leading-none">
                          PHƯƠNG PHÁP
                        </div>
                        <div className="font-serif font-bold tracking-wider text-[8px] sm:text-[9px] landscape-mobile:text-[6.5px] text-slate-800 uppercase">
                          HỌC NHANH FULL
                        </div>
                      </div>

                      {/* Starburst Badge: Mới 2026 */}
                      <div className="relative my-0.5">
                        <svg viewBox="0 0 90 32" className="w-14 sm:w-16 h-5 sm:h-6 landscape-mobile:w-11 landscape-mobile:h-4 drop-shadow-2xs">
                          <polygon
                            points="45,0 52,6 63,3 67,11 78,11 76,19 86,22 80,28 88,32 76,32 71,38 61,33 52,38 45,32 38,38 29,33 19,38 14,32 2,32 10,28 4,22 14,19 12,11 23,11 27,6 38,0"
                            fill="#dc2626"
                          />
                          <text x="45" y="19" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="900" fontFamily="sans-serif">
                            Mới 2026
                          </text>
                        </svg>
                      </div>

                      {/* Big Title & Pill */}
                      <div className="space-y-0.5">
                        <div className="font-serif font-black text-slate-900 text-xs sm:text-[14px] landscape-mobile:text-[9.5px] tracking-wide uppercase leading-tight">
                          ÔN THI CẤP TỐC
                        </div>
                        <div className="inline-block px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold text-[6.5px] sm:text-[7.5px] landscape-mobile:text-[5.5px] tracking-tight shadow-2xs">
                          Câu Hỏi Luật Mới Bộ Công An
                        </div>
                      </div>

                      {/* Sa hình ngã tư (Intersection Illustration SVG) */}
                      <div className="w-full h-18 sm:h-22 landscape-mobile:h-13 bg-[#f3f7eb] border border-slate-300/80 rounded-xs overflow-hidden relative shadow-inner my-0.5">
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
                      <div className="space-y-0.2 mt-0.5">
                        <div className="font-serif font-black text-indigo-950 text-[10px] sm:text-[11.5px] landscape-mobile:text-[8px] leading-tight tracking-tight">
                          600 câu hỏi và 120 TH Mô Phỏng
                        </div>
                        <div className="font-serif italic text-slate-500 text-[7px] sm:text-[8px] landscape-mobile:text-[6px]">
                          ( Lưu hành nội bộ )
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 02 Graphic: Bộ PC và người đang xem clip mô phỏng trắc nghiệm */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 1 && (
                  <div className="w-full h-full rounded-xl bg-slate-50 border border-slate-200/90 p-2.5 landscape-mobile:p-1.5 flex flex-col justify-between shadow-inner">
                    {/* Header: Scenario & Multiple Choice Badge */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-800 tracking-tight">
                          CLIP MÔ PHỎNG 3D
                        </span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-bold">
                        TRẮC NGHIỆM 4 CÂU
                      </div>
                    </div>

                    {/* Scene SVG: Person at PC desk studying driving video simulation */}
                    <div className="my-auto w-full h-32 sm:h-36 landscape-mobile:h-24 bg-white rounded-lg border border-slate-200/80 overflow-hidden relative shadow-2xs">
                      <svg viewBox="0 0 240 145" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {/* Soft background ambient gradient */}
                        <defs>
                          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7dd3fc" />
                            <stop offset="100%" stopColor="#bae6fd" />
                          </linearGradient>
                        </defs>

                        {/* Ambient screen light beam on wall */}
                        <polygon points="120,40 50,140 220,140" fill="url(#screenGlow)" />

                        {/* Desk Line */}
                        <rect x="20" y="122" width="205" height="4" rx="2" fill="#94a3b8" />
                        <line x1="40" y1="126" x2="40" y2="145" stroke="#cbd5e1" strokeWidth="2.5" />
                        <line x1="205" y1="126" x2="205" y2="145" stroke="#cbd5e1" strokeWidth="2.5" />

                        {/* Desktop PC Tower */}
                        <g transform="translate(182, 60)">
                          <rect x="0" y="0" width="22" height="62" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                          {/* Power button & USB slots */}
                          <circle cx="11" cy="8" r="2" fill="#38bdf8" />
                          <line x1="6" y1="14" x2="16" y2="14" stroke="#64748b" strokeWidth="1" />
                          <line x1="6" y1="18" x2="16" y2="18" stroke="#64748b" strokeWidth="1" />
                          {/* Fan grille */}
                          <rect x="4" y="32" width="14" height="24" rx="1" fill="#0f172a" />
                          <line x1="6" y1="38" x2="16" y2="38" stroke="#334155" strokeWidth="0.8" />
                          <line x1="6" y1="44" x2="16" y2="44" stroke="#334155" strokeWidth="0.8" />
                          <line x1="6" y1="50" x2="16" y2="50" stroke="#334155" strokeWidth="0.8" />
                        </g>

                        {/* PC Monitor */}
                        <g transform="translate(80, 20)">
                          {/* Stand */}
                          <path d="M 45 74 L 40 102 L 56 102 L 51 74 Z" fill="#64748b" />
                          <rect x="32" y="101" width="32" height="3" rx="1.5" fill="#475569" />

                          {/* Monitor Frame */}
                          <rect x="0" y="0" width="96" height="74" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />

                          {/* Screen Content: Driving Video Simulation Clip */}
                          <rect x="3" y="3" width="90" height="64" rx="2" fill="#020617" />
                          <g transform="translate(3, 3)">
                            {/* Sky */}
                            <rect x="0" y="0" width="90" height="32" fill="url(#skyGrad)" />
                            {/* Mountains in background */}
                            <polygon points="0,32 20,18 40,32" fill="#93c5fd" />
                            <polygon points="35,32 55,14 75,32" fill="#60a5fa" />
                            {/* Highway Road with Vanishing Point */}
                            <polygon points="0,64 45,32 90,64" fill="#334155" />
                            {/* Dashed center lane divider */}
                            <line x1="45" y1="32" x2="45" y2="60" stroke="#fde047" strokeWidth="1.2" strokeDasharray="3 2" />

                            {/* Car in front on the road */}
                            <g transform="translate(39, 40)">
                              <rect x="0" y="0" width="12" height="10" rx="2" fill="#dc2626" />
                              <rect x="2" y="2" width="8" height="4" rx="1" fill="#fee2e2" />
                              {/* Brake lights glowing red */}
                              <circle cx="1.5" cy="8" r="1.2" fill="#ef4444" />
                              <circle cx="10.5" cy="8" r="1.2" fill="#ef4444" />
                            </g>

                            {/* Video Playback Bar at bottom of screen */}
                            <rect x="0" y="59" width="90" height="5" fill="#0f172a" opacity="0.9" />
                            <rect x="0" y="60" width="45" height="3" fill="#ef4444" />
                            <circle cx="45" cy="61.5" r="2" fill="#ffffff" />
                            <text x="86" y="63" textAnchor="end" fill="#94a3b8" fontSize="3.5" fontFamily="monospace">14s</text>

                            {/* Video Live Badge */}
                            <rect x="3" y="3" width="16" height="6" rx="1" fill="#ef4444" />
                            <text x="11" y="7.5" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold">CLIP</text>

                            {/* Multiple Choice Options overlay on top-right of monitor */}
                            <g transform="translate(56, 4)">
                              <rect x="0" y="0" width="31" height="15" rx="2" fill="#0f172a" opacity="0.85" stroke="#334155" strokeWidth="0.5" />
                              <text x="3" y="5" fill="#e2e8f0" fontSize="3.5" fontWeight="bold">Trắc nghiệm:</text>
                              {/* Option A */}
                              <rect x="3" y="7" width="11" height="3" rx="0.5" fill="#1e293b" />
                              <text x="8.5" y="9.2" textAnchor="middle" fill="#94a3b8" fontSize="2.5">A. Phanh</text>
                              {/* Option B (Correct check) */}
                              <rect x="16" y="7" width="12" height="3" rx="0.5" fill="#059669" />
                              <text x="22" y="9.2" textAnchor="middle" fill="#ffffff" fontSize="2.5" fontWeight="bold">B. Giảm tốc ✓</text>
                              {/* Option C */}
                              <rect x="3" y="11" width="11" height="3" rx="0.5" fill="#1e293b" />
                              <text x="8.5" y="13.2" textAnchor="middle" fill="#94a3b8" fontSize="2.5">C. Rẽ trái</text>
                              {/* Option D */}
                              <rect x="16" y="11" width="12" height="3" rx="0.5" fill="#1e293b" />
                              <text x="22" y="13.2" textAnchor="middle" fill="#94a3b8" fontSize="2.5">D. Tăng ga</text>
                            </g>
                          </g>

                          {/* Monitor Power LED */}
                          <circle cx="48" cy="71" r="1" fill="#38bdf8" />
                        </g>

                        {/* Keyboard & Mouse on Desk */}
                        <g transform="translate(92, 114)">
                          <rect x="0" y="0" width="46" height="7" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.5" />
                          <line x1="3" y1="3.5" x2="43" y2="3.5" stroke="#64748b" strokeWidth="1" strokeDasharray="2 1" />
                          {/* Mouse */}
                          <rect x="52" y="1" width="7" height="9" rx="3" fill="#334155" stroke="#475569" strokeWidth="0.5" />
                          <line x1="55.5" y1="1" x2="55.5" y2="5" stroke="#64748b" strokeWidth="0.6" />
                        </g>

                        {/* Student / Person sitting at desk watching the simulation */}
                        <g transform="translate(38, 48)">
                          {/* Chair backrest */}
                          <path d="M 12 40 Q 6 15 16 -5 Q 26 -5 32 40 Z" fill="#0f172a" />
                          <rect x="12" y="38" width="22" height="6" rx="2" fill="#1e293b" />

                          {/* Person Back/Side View */}
                          {/* Torso / Shirt in blue */}
                          <path d="M 22 28 Q 28 26 36 28 L 42 70 L 18 70 Z" fill="#2563eb" />
                          {/* Arm resting toward desk/mouse */}
                          <path d="M 34 32 Q 46 45 56 66 L 50 68 Q 42 50 32 36 Z" fill="#1d4ed8" />
                          <circle cx="56" cy="67" r="2.5" fill="#fed7aa" />

                          {/* Neck */}
                          <rect x="25" y="18" width="6" height="8" fill="#fed7aa" />

                          {/* Head & Hair */}
                          <ellipse cx="28" cy="14" rx="9" ry="11" fill="#1e293b" />
                          <circle cx="30" cy="15" r="7.5" fill="#fed7aa" />
                          {/* Hair back */}
                          <path d="M 20 12 Q 22 4 30 5 Q 36 6 36 12 Q 33 21 21 18 Z" fill="#1e293b" />

                          {/* Headphones over head */}
                          <path d="M 23 8 Q 28 3 34 8" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
                          <rect x="20" y="8" width="4" height="8" rx="2" fill="#0f172a" />
                          <rect x="33" y="8" width="4" height="8" rx="2" fill="#0f172a" />
                        </g>

                        {/* Floating Success Pill */}
                        <g transform="translate(142, 10)">
                          <rect x="0" y="0" width="76" height="14" rx="7" fill="#ecfdf5" stroke="#10b981" strokeWidth="0.8" />
                          <circle cx="8" cy="7" r="4.5" fill="#10b981" />
                          <path d="M 6 7 L 7.5 8.5 L 10 5.5" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                          <text x="16" y="9.5" fill="#065f46" fontSize="5.5" fontWeight="bold">Chọn đúng +2.5đ</text>
                        </g>
                      </svg>
                    </div>

                    {/* Footer summary: Trắc nghiệm 4 mốc thời điểm */}
                    <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-500">
                      <span className="flex items-center gap-1 text-blue-700 font-medium">
                        🎯 4 mốc trắc nghiệm theo video
                      </span>
                      <span className="font-mono text-slate-400">10 điểm tối đa</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 03 Graphic: Chứng nhận Kết quả Sát hạch Thi thử          */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 2 && (
                  <div className="w-full h-full rounded-xl bg-slate-50 border border-emerald-200 p-3 landscape-mobile:p-2 flex flex-col justify-between shadow-2xs">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-[10px] font-bold text-slate-700">KẾT QUẢ THI THỬ</span>
                      <span className="text-[9px] font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        HẠNG B
                      </span>
                    </div>

                    {/* Center Score & Pass Badge */}
                    <div className="my-auto flex flex-col items-center justify-center text-center py-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mb-1 shadow-sm">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="font-black text-sm text-emerald-700 tracking-wider">
                        ĐẠT SÁT HẠCH
                      </div>
                      <div className="text-lg font-black font-mono text-slate-900 mt-0.5 tracking-tight">
                        35 <span className="text-slate-400 text-xs font-normal">/ 35 CÂU</span>
                      </div>
                    </div>

                    {/* Sub Metrics */}
                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>⏱️ 16:24 / 22:00</span>
                      <span className="text-emerald-600 font-bold">✓ 0 câu liệt sai</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thin Divider Line separating graphics from text */}
            <div className="w-full border-t border-slate-200 my-2 shrink-0" />

            {/* Lower Half: Step Counter, Title, Description, and Layered CTA Button */}
            <div className="w-full pt-1 pb-4 sm:pb-6 landscape-mobile:pb-2 flex flex-col shrink-0">
              {/* Step Counter Row (01 ————— 03) */}
              <div className="flex items-center justify-between mb-3 landscape-mobile:mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl landscape-mobile:text-xl font-black font-mono text-slate-900 tracking-tight">
                    {currentSlide.step}
                  </span>
                  {/* Amber Accent Indicator Line */}
                  <div className="w-20 sm:w-28 landscape-mobile:w-16 h-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 shadow-xs shadow-amber-500/40" />
                </div>

                <span className="text-xs sm:text-sm font-bold font-mono text-slate-400">
                  03
                </span>
              </div>

              {/* Heading Title (Crisp Slate with Amber Accent) */}
              <h2
                key={`title-${currentStep}`}
                className="text-xl sm:text-2xl landscape-mobile:text-base font-black text-slate-900 tracking-tight uppercase mb-2 landscape-mobile:mb-1 leading-snug animate-in fade-in duration-200"
              >
                <span>{currentSlide.titlePrefix} </span>
                <span className="text-amber-500">{currentSlide.titleHighlight}</span>
              </h2>

              {/* Description Body */}
              <p
                key={`desc-${currentStep}`}
                className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-600 leading-relaxed font-normal mb-5 sm:mb-6 landscape-mobile:mb-2 line-clamp-3 sm:line-clamp-none animate-in fade-in duration-200"
              >
                {currentSlide.desc}
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
                  className="relative w-full py-3.5 sm:py-4 landscape-mobile:py-2.5 px-6 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:translate-x-1 active:translate-y-1 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2 transition-transform duration-75 cursor-pointer shadow-md"
                >
                  <span>{currentSlide.buttonText}</span>
                  <span className="text-lg leading-none font-black">›</span>
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
