import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Award, Check, ShieldAlert } from 'lucide-react';

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
      desc: 'Video 3D thực tế theo quy chế mới. Rèn luyện phản xạ nhấn phím Space chuẩn xác để giành trọn thang điểm 5/5 trong mọi tình huống giao thông.',
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
      className={`fixed inset-0 h-dvh w-full overflow-hidden overscroll-none select-none flex flex-col justify-between pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] ${
        viewMode === 'landing' ? 'bg-slate-50 text-slate-900' : 'bg-[#0f1217] text-slate-100'
      }`}
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
      {/* 2. MÀN 3 BƯỚC ONBOARDING CAROUSEL (01 - 02 - 03) - CHUẨN MÀU ONTAP GPLX    */}
      {/* ========================================================================= */}
      {viewMode === 'walkthrough' && (
        <div className="w-full h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-250">
          {/* Top Bar: Brand with back arrow on the left, "BỎ QUA" on the right */}
          <header className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto px-5 py-3 sm:py-4 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                className="p-1 -ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-6 h-6 rounded-md object-contain border border-slate-700/60"
              />
              <span className="text-xs font-bold tracking-tight text-slate-300">
                OnTap <span className="text-amber-500">GPLX</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-amber-400 active:text-white transition-colors cursor-pointer py-1 px-2"
            >
              BỎ QUA
            </button>
          </header>

          {/* Main Walkthrough Container */}
          <div className="w-full max-w-md landscape-mobile:max-w-2xl mx-auto flex-1 flex flex-col justify-between px-5 landscape-mobile:px-8 overflow-hidden">
            {/* Upper Half: Graphic Area with huge watermark number */}
            <div className="relative flex-1 flex items-center justify-center min-h-[220px] landscape-mobile:min-h-[140px] overflow-hidden">
              {/* Faint Large Watermark Number behind graphic */}
              <div
                key={`watermark-${currentSlide.step}`}
                className="absolute select-none font-black text-[130px] sm:text-[170px] landscape-mobile:text-[100px] text-white/[0.04] pointer-events-none tracking-tighter leading-none animate-in fade-in zoom-in-90 duration-300"
              >
                {currentSlide.step}
              </div>

              {/* Graphic Container (Tailored specifically for Driving Test App) */}
              <div
                key={`graphic-${currentStep}`}
                className="relative z-10 w-64 h-56 sm:w-72 sm:h-60 landscape-mobile:w-48 landscape-mobile:h-36 rounded-2xl border border-slate-800 bg-[#151921] p-3.5 landscape-mobile:p-2.5 shadow-2xl flex items-center justify-center animate-in zoom-in-95 fade-in duration-250"
              >
                {/* ------------------------------------------------------------- */}
                {/* Slide 01 Graphic: Mô phỏng Thẻ câu hỏi Lý thuyết sát hạch thực tế */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 0 && (
                  <div className="w-full h-full rounded-xl bg-[#1a202c] border border-slate-700/60 p-3 landscape-mobile:p-2 flex flex-col justify-between shadow-inner">
                    {/* Header: Category & Critical Warning Badge */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-amber-400 tracking-tight">
                          HẠNG B • 600 CÂU
                        </span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[9px] font-bold flex items-center gap-1">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        <span>60 ĐIỂM LIỆT</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="my-auto py-1 space-y-1.5">
                      <div className="text-[10.5px] sm:text-[11px] font-semibold text-slate-200 leading-snug line-clamp-2">
                        Khi gặp biển nào dưới đây, người lái xe phải nhường đường cho xe trên đường ưu tiên?
                      </div>

                      {/* Options with active correct choice */}
                      <div className="space-y-1">
                        <div className="px-2 py-1 rounded-md bg-[#131720] border border-slate-700/50 flex items-center justify-between text-[9px] text-slate-400">
                          <span>1. Biển đường cùng cấp</span>
                        </div>
                        <div className="px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-between text-[9px] text-emerald-300 font-bold">
                          <span>2. Biển giao nhau với đường ưu tiên</span>
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>

                    {/* Footer Tip */}
                    <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        💡 Kèm mẹo giải nhanh
                      </span>
                      <span className="font-mono text-slate-400">Chuẩn 2026</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 02 Graphic: Giao diện mô phỏng 120 tình huống & Phím Space */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 1 && (
                  <div className="w-full h-full rounded-xl bg-[#1a202c] border border-slate-700/60 p-3 landscape-mobile:p-2 flex flex-col justify-between shadow-inner">
                    {/* Windshield Road Simulation View */}
                    <div className="flex-1 w-full bg-[#0c1017] rounded-lg border border-slate-800 flex flex-col justify-between p-2 relative overflow-hidden mb-2">
                      <div className="w-full flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[9px] font-bold">
                          <span>TÌNH HUỐNG 18/120</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                          +5 ĐIỂM
                        </span>
                      </div>

                      {/* Windshield Lane graphic with braking car */}
                      <div className="w-full flex flex-col items-center justify-center my-auto py-0.5">
                        <div className="w-16 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-between px-1.5 shadow-md relative">
                          <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse" />
                          <span className="text-[7.5px] font-mono font-bold text-slate-300">XE PHANH GẤP</span>
                          <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse" />
                        </div>
                        <div className="w-20 h-1 border-b border-dashed border-amber-400/60 mt-1" />
                      </div>
                    </div>

                    {/* 5-tier Hazard score bar (Green 5, Amber 4-3, Red 2-1) */}
                    <div className="w-full mb-2">
                      <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-0.5 px-0.5">
                        <span className="text-emerald-400 font-bold">5 điểm</span>
                        <span className="text-amber-400">4đ</span>
                        <span className="text-amber-500">3đ</span>
                        <span className="text-orange-500">2đ</span>
                        <span className="text-rose-500">1đ</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full relative flex items-center overflow-hidden">
                        <div className="h-full w-1/5 bg-emerald-500" />
                        <div className="h-full w-2/5 bg-amber-400" />
                        <div className="h-full w-1/5 bg-orange-500" />
                        <div className="h-full w-1/5 bg-rose-500" />
                      </div>
                    </div>

                    {/* Spacebar Key Prompt */}
                    <div className="w-full py-1.5 rounded-md bg-slate-800 border border-slate-700 text-center font-mono font-bold text-[9.5px] text-amber-400 tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
                      <span className="px-1.5 py-0.5 bg-slate-700 rounded text-white text-[8.5px] border border-slate-600">SPACE</span>
                      <span>NHẤN KHI THẤY NGUY HIỂM</span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* Slide 03 Graphic: Chứng nhận Kết quả Sát hạch Thi thử          */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 2 && (
                  <div className="w-full h-full rounded-xl bg-[#1a202c] border border-emerald-600/40 p-3 landscape-mobile:p-2 flex flex-col justify-between shadow-inner">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-300">KẾT QUẢ THI THỬ</span>
                      <span className="text-[9px] font-mono text-amber-400 font-bold">HẠNG B</span>
                    </div>

                    {/* Center Score & Pass Badge */}
                    <div className="my-auto flex flex-col items-center justify-center text-center py-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-1 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="font-black text-sm text-emerald-400 tracking-wider">
                        ĐẠT SÁT HẠCH
                      </div>
                      <div className="text-lg font-black font-mono text-white mt-0.5 tracking-tight">
                        35 <span className="text-slate-400 text-xs font-normal">/ 35 CÂU</span>
                      </div>
                    </div>

                    {/* Sub Metrics */}
                    <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>⏱️ 16:24 / 22:00</span>
                      <span className="text-emerald-400 font-bold">✓ 0 câu liệt sai</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thin Divider Line separating graphics from text */}
            <div className="w-full border-t border-slate-800 my-2 shrink-0" />

            {/* Lower Half: Step Counter, Title, Description, and Layered CTA Button */}
            <div className="w-full pt-1 pb-4 sm:pb-6 landscape-mobile:pb-2 flex flex-col shrink-0">
              {/* Step Counter Row (01 ————— 03) */}
              <div className="flex items-center justify-between mb-3 landscape-mobile:mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl landscape-mobile:text-xl font-black font-mono text-white tracking-tight">
                    {currentSlide.step}
                  </span>
                  {/* Amber Accent Indicator Line */}
                  <div className="w-20 sm:w-28 landscape-mobile:w-16 h-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 shadow-xs shadow-amber-500/50" />
                </div>

                <span className="text-xs sm:text-sm font-bold font-mono text-slate-500">
                  03
                </span>
              </div>

              {/* Heading Title (Crisp White with Amber Accent) */}
              <h2
                key={`title-${currentStep}`}
                className="text-xl sm:text-2xl landscape-mobile:text-base font-black text-white tracking-tight uppercase mb-2 landscape-mobile:mb-1 leading-snug animate-in fade-in duration-200"
              >
                <span>{currentSlide.titlePrefix} </span>
                <span className="text-amber-400">{currentSlide.titleHighlight}</span>
              </h2>

              {/* Description Body */}
              <p
                key={`desc-${currentStep}`}
                className="text-xs sm:text-sm landscape-mobile:text-[11px] text-slate-300 leading-relaxed font-normal mb-5 sm:mb-6 landscape-mobile:mb-2 line-clamp-3 sm:line-clamp-none animate-in fade-in duration-200"
              >
                {currentSlide.desc}
              </p>

              {/* 3D Layered Offset CTA Button in Signature Amber / Orange */}
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

              {/* Secondary Links & Legal Footer */}
              <div className="mt-3.5 landscape-mobile:mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 px-1">
                <button
                  type="button"
                  onClick={() => setShowInstallModal(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer underline underline-offset-2"
                >
                  Cài đặt ứng dụng (PWA)
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPolicyModal('terms')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Điều khoản
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Quyền riêng tư
                  </button>
                </div>
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
