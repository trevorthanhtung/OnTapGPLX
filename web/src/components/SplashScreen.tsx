import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8s for smooth car drive

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350); // allow fade-out animation
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-white text-slate-900 p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacer for balanced vertical centering */}
      <div aria-hidden="true" className="w-full shrink-0 pt-6" />

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        {/* Logo Container with glowing ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-400 opacity-20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 p-2 shadow-xl shadow-slate-200/60 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.jpg"
              alt="OnTap GPLX Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">OnTap</span>
          <span className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">GPLX</span>
        </div>

        {/* Slogan */}
        <p className="text-sm sm:text-base font-bold text-slate-700 tracking-wide uppercase">
          Ôn Thi Giấy Phép Lái Xe 2026
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
          Dữ liệu chuẩn Cục Đường bộ Việt Nam
        </p>
      </div>

      {/* Bottom Loading Progress Indicator with Driving Car */}
      <div className="w-full max-w-xs flex flex-col items-center pb-8 sm:pb-10">
        {/* Road Track with Driving Car */}
        <div className="relative w-full pt-5">
          {/* Progress Track / Road */}
          <div className="relative w-full h-2 bg-slate-100 rounded-full border border-slate-200/90 shadow-inner">
            {/* Filled Progress Bar (Drives behind the car) */}
            <div
              className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transition-all duration-75 ease-out shadow-xs shadow-amber-500/40"
              style={{ width: `${progress}%` }}
            />

            {/* The Car riding directly on the bar */}
            <div
              className="absolute -top-4 flex items-center pointer-events-none z-10 transition-all duration-75 ease-out"
              style={{
                left: `${progress}%`,
                transform: `translateX(-${progress}%)`
              }}
            >
              <div className="relative flex items-center">
                {/* Mini exhaust smoke puff when moving */}
                {progress > 5 && progress < 98 && (
                  <div className="absolute -left-1.5 bottom-0.5 w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping opacity-60" />
                )}
                {/* The Car Icon */}
                <Car className="w-5 h-5 text-amber-500 fill-amber-100 drop-shadow-xs" />
                {/* Headlight beam */}
                <div className="absolute top-1.5 -right-2 w-2.5 h-1 bg-linear-to-r from-amber-400/80 to-transparent rounded-full blur-[0.5px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between w-full mt-2.5 text-[11px] font-mono text-slate-400 font-medium">
          <span>Khởi tạo tài nguyên...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
