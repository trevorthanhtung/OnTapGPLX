import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2s for pleasant, rhythmic car drive

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        // Stage 1: Turbo boost launch of the car (0ms)
        setIsLaunching(true);

        // Stage 2: Shared element transition - logo floats up to navbar, others fade out (150ms)
        setTimeout(() => {
          setIsExiting(true);
        }, 150);

        // Stage 3: Complete transition and handover to app (550ms)
        setTimeout(() => {
          onFinish();
        }, 600);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] select-none overflow-hidden transition-colors duration-400 ${
        isExiting ? 'bg-transparent pointer-events-none' : 'bg-white text-slate-900'
      }`}
    >
      {/* Background Traffic Speed Lines (Subtle Highway Velocity Effect) */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className="absolute top-[22%] left-0 w-36 h-[1.5px] bg-linear-to-r from-transparent via-amber-400/30 to-transparent"
          style={{ animation: 'speedLineMove 2.4s linear infinite 0.2s' }}
        />
        <div
          className="absolute top-[40%] left-0 w-56 h-[1px] bg-linear-to-r from-transparent via-slate-300/40 to-transparent"
          style={{ animation: 'speedLineMove 1.9s linear infinite 0.8s' }}
        />
        <div
          className="absolute top-[64%] left-0 w-44 h-[1.5px] bg-linear-to-r from-transparent via-orange-400/25 to-transparent"
          style={{ animation: 'speedLineMove 2.6s linear infinite 0.4s' }}
        />
        <div
          className="absolute top-[82%] left-0 w-32 h-[1px] bg-linear-to-r from-transparent via-slate-300/35 to-transparent"
          style={{ animation: 'speedLineMove 1.7s linear infinite 1.3s' }}
        />
      </div>

      {/* Top spacer for balanced vertical alignment */}
      <div aria-hidden="true" className="w-full shrink-0 pt-6" />

      {/* Center Branding & Logo */}
      <div
        className={`relative z-10 flex flex-col items-center text-center transition-all duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExiting ? '-translate-y-[38vh] sm:-translate-y-[40vh] scale-35' : 'translate-y-0 scale-100'
        }`}
      >
        {/* Logo Container with Breathing Glow & Floating Animation */}
        <div
          className="relative mb-6"
          style={{
            animation: 'splashLogoEntrance 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {/* Gentle Floating Effect */}
          <div style={{ animation: 'logoFloat 2.6s ease-in-out infinite' }}>
            {/* Quầng sáng cam "thở" (Breathing Glow) */}
            <div
              className={`absolute -inset-4 rounded-3xl bg-linear-to-tr from-amber-400 via-orange-500 to-amber-300 blur-2xl pointer-events-none transition-opacity duration-300 ${
                isExiting ? 'opacity-0' : ''
              }`}
              style={{ animation: 'glowBreathe 2.6s ease-in-out infinite' }}
            />

            {/* Main Logo Card */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 p-2.5 shadow-xl shadow-amber-500/10 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.jpg"
                alt="OnTap GPLX Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Brand Name (Sequential Slide Up: OnTap then GPLX) */}
        <div
          className={`flex items-center gap-2 mb-2 transition-opacity duration-250 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
            style={{ animation: 'splashSlideUp 0.5s ease-out 0.18s both' }}
          >
            OnTap
          </span>
          <span
            className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight"
            style={{ animation: 'splashSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.32s both' }}
          >
            GPLX
          </span>
        </div>

        {/* Primary Slogan */}
        <p
          className={`text-sm sm:text-base font-bold text-slate-700 tracking-wide uppercase transition-opacity duration-250 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ animation: 'splashFadeUp 0.5s ease-out 0.48s both' }}
        >
          Ôn Thi Giấy Phép Lái Xe 2026
        </p>

        {/* Secondary Subtitle */}
        <p
          className={`text-xs text-slate-500 mt-1 max-w-xs font-medium transition-opacity duration-250 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ animation: 'splashFadeUp 0.5s ease-out 0.62s both' }}
        >
          Dữ liệu chuẩn Cục Đường bộ Việt Nam
        </p>
      </div>

      {/* Bottom Progress Section (Highway Theme with Driving Car & Tips) */}
      <div
        className={`w-full max-w-sm flex flex-col items-center pb-8 sm:pb-12 px-2 transition-all duration-300 ${
          isLaunching ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ animation: 'splashFadeUp 0.6s ease-out 0.75s both' }}
      >
        {/* Road Track with Driving Car */}
        <div className="relative w-full pt-6">
          {/* Progress Track / Road Lane */}
          <div className="relative w-full h-3 bg-slate-100 rounded-full border border-slate-200/90 shadow-inner overflow-hidden">
            {/* Filled Highway Track (Follows the car) */}
            <div
              className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transition-all duration-75 ease-out shadow-xs shadow-orange-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Scrolling Dashed Highway Lane (Moving left to create speed illusion) */}
          <div
            className="w-full h-1 mt-1.5 rounded-full opacity-60 overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 10px, transparent 10px, transparent 20px)',
              animation: 'roadDashScroll 0.55s linear infinite',
            }}
          />

          {/* The Car riding on the progress highway */}
          <div
            className={`absolute -top-3.5 z-10 pointer-events-none transition-all duration-75 ease-out ${
              isLaunching ? 'animate-[carTurboLaunch_0.45s_cubic-bezier(0.7,0,0.84,0)_forwards]' : ''
            }`}
            style={{
              left: `${progress}%`,
              transform: isLaunching ? undefined : `translateX(-${progress}%)`,
            }}
          >
            <div
              className="relative flex items-center"
              style={{
                animation: !isLaunching ? 'carRumble 0.12s infinite alternate ease-in-out' : undefined,
              }}
            >
              {/* Exhaust Tail Light Trail */}
              <div className="absolute -left-7 bottom-0.5 w-8 h-2 bg-linear-to-l from-orange-500 via-amber-400/50 to-transparent rounded-full blur-[0.8px] pointer-events-none" />

              {/* Turbo Jet Boost Trail at 100% */}
              {isLaunching && (
                <div className="absolute -left-14 bottom-0 w-16 h-3 bg-linear-to-l from-orange-600 via-amber-400 to-transparent rounded-full blur-[1px] animate-pulse" />
              )}

              {/* Smoke Puff Particle when driving */}
              {progress > 5 && progress < 99 && !isLaunching && (
                <div className="absolute -left-2.5 bottom-0 w-2 h-2 rounded-full bg-slate-300/80 animate-ping" />
              )}

              {/* Car Icon with badge styling */}
              <div className="p-1 rounded-full bg-white shadow-md border border-amber-200/90">
                <Car className="w-5 h-5 text-amber-500 fill-amber-100 drop-shadow-xs" />
              </div>

              {/* Headlight beam */}
              <div className="absolute top-2 -right-4 w-5 h-1.5 bg-linear-to-r from-amber-400/90 via-amber-300/40 to-transparent rounded-full blur-[0.6px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status & Progress Percentage */}
        <div className="flex items-center justify-between w-full mt-3 text-xs font-mono font-medium text-slate-500">
          <span className="font-medium text-slate-600">Đang tải...</span>
          <span className="font-bold text-amber-600 shrink-0">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
