import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

// Modern Fastback Sedan Silhouette SVG (Matching reference vector style)
const ViosSedan: React.FC = () => (
  <svg
    viewBox="0 0 100 35"
    className="w-14 h-5 select-none pointer-events-none overflow-visible"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Solid Sedan Silhouette Body */}
    <path
      d="M 12 18
         C 11.5 20 12 23.5 16 26.5
         H 17.5
         C 17.8 22.8 20.6 20 24 20
         C 27.4 20 30.2 22.8 30.5 26.5
         H 67.5
         C 67.8 22.8 70.6 20 74 20
         C 77.4 20 80.2 22.8 80.5 26.5
         H 83.5
         C 87 25 89 23 89 21.5
         C 89 20 87.5 19 86 18.5
         L 79 16.5
         L 67 14.2
         C 64 12 59 9.2 56 9
         C 52 8.8 42 8.5 35 9.5
         C 28 10.5 20 14 15 16.5
         L 12 18 Z"
      fill="#0f172a"
    />

    {/* Rear Passenger Window (White Cutout with B-pillar) */}
    <path
      d="M 27 15.5 C 29 13.5 34 11.5 43.5 10.5 L 43.5 15.5 Z"
      fill="#ffffff"
    />
    <line x1="31.5" y1="13.2" x2="31.5" y2="15.5" stroke="#0f172a" strokeWidth="1" />

    {/* Front Driver Window (White Cutout) */}
    <path
      d="M 45.5 10.5 L 56 10.5 C 59 11.5 62 13 64 14.8 L 45.5 15.5 Z"
      fill="#ffffff"
    />

    {/* Side mirror silhouette */}
    <path d="M 58 15.8 C 58 14.8 60.5 14.8 61 15.8 Z" fill="#0f172a" />

    {/* Sharp Modern Headlight (White Cutout) */}
    <path
      d="M 78.5 17.5 L 87 19.5 C 84.5 21 81.5 21 78.5 19.5 Z"
      fill="#ffffff"
    />

    {/* Sleek Taillight (White Cutout) */}
    <path
      d="M 12.5 17.5 L 18 18 C 16.5 19.5 13.5 19.5 12.5 19 Z"
      fill="#ffffff"
    />

    {/* Front lower bumper air scoop (White Cutout) */}
    <path
      d="M 83 23.5 L 86.5 24.5 L 84 26 Z"
      fill="#ffffff"
    />

    {/* Rear Wheel (Black tire + Bold white ring rim + Black hub) */}
    <g>
      <circle cx="24" cy="26.5" r="6.2" fill="#0f172a" />
      <circle cx="24" cy="26.5" r="4.2" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="24" cy="26.5" r="2.2" fill="#0f172a" />
    </g>

    {/* Front Wheel (Black tire + Bold white ring rim + Black hub) */}
    <g>
      <circle cx="74" cy="26.5" r="6.2" fill="#0f172a" />
      <circle cx="74" cy="26.5" r="4.2" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="74" cy="26.5" r="2.2" fill="#0f172a" />
    </g>
  </svg>
);

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

        {/* Secondary Subtitle */}
        <p
          className={`text-xs text-slate-500 mt-0.5 max-w-xs font-medium transition-opacity duration-250 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ animation: 'splashFadeUp 0.5s ease-out 0.48s both' }}
        >
          Dữ liệu chuẩn Cục Đường bộ Việt Nam
        </p>
      </div>

      {/* Bottom Progress Section (Highway Theme with Standalone Vios Sedan leading the track) */}
      <div
        className={`w-full max-w-sm flex flex-col items-center pb-8 sm:pb-12 px-2 transition-all duration-300 ${
          isLaunching ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ animation: 'splashFadeUp 0.6s ease-out 0.75s both' }}
      >
        {/* Road Track with Driving Vios */}
        <div className="relative w-full pt-6">
          {/* Progress Bar Container with standalone Vios riding directly on it */}
          <div className="relative w-full">
            {/* Standalone Toyota Vios Sedan positioned directly on top of the progress track */}
            <div
              className={`absolute -top-[18px] z-10 pointer-events-none transition-all duration-75 ease-out ${
                isLaunching ? 'animate-[carTurboLaunch_0.45s_cubic-bezier(0.7,0,0.84,0)_forwards]' : ''
              }`}
              style={{
                left: `${progress}%`,
                transform: isLaunching ? undefined : 'translateX(-65%)',
              }}
            >
              <div
                className="relative flex items-center"
                style={{
                  animation: !isLaunching ? 'carRumble 0.12s infinite alternate ease-in-out' : undefined,
                }}
              >
                {/* Clean Standalone Vios Sedan (No card, no light beams!) */}
                <ViosSedan />
              </div>
            </div>

            {/* Progress Track / Road Lane */}
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full border border-slate-200/90 shadow-inner overflow-hidden">
              {/* Filled Highway Track (Follows right behind the Vios) */}
              <div
                className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transition-all duration-75 ease-out shadow-xs shadow-orange-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Scrolling Dashed Highway Lane (Moving left to create speed illusion) */}
          <div
            className="w-full h-1 mt-1 rounded-full opacity-50 overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 10px, transparent 10px, transparent 20px)',
              animation: 'roadDashScroll 0.55s linear infinite',
            }}
          />
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
