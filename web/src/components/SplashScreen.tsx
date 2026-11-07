import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

// Custom Toyota Vios Sedan SVG Icon (Xe tập lái / sát hạch quốc dân)
const ViosSedan: React.FC = () => (
  <svg
    viewBox="0 0 54 22"
    className="w-12 h-6 select-none pointer-events-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Vios warm pearl-orange metallic gradient */}
      <linearGradient id="viosBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="35%" stopColor="#f97316" />
        <stop offset="85%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>

      {/* Modern tinted glass */}
      <linearGradient id="viosGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.85" />
      </linearGradient>
    </defs>

    {/* Main Sedan Body (Toyota Vios silhouette: 3-box sedan shape with clear trunk deck) */}
    <path
      d="M 2 15
         C 1.5 15 1 14.2 1 13
         C 1 11.2 2 10.4 3.5 10.2
         L 9.5 10.2
         C 10.8 10.2 14.5 4.5 17 3.8
         C 19 3.2 31.5 3.2 34 4
         C 36 4.6 41.5 9 43.5 10
         L 50 11
         C 51.5 11.3 53 12 53 13.2
         C 53 14.4 52 15 50.5 15
         L 44.8 15
         C 44.3 12.8 42.4 11.4 40 11.4
         C 37.6 11.4 35.7 12.8 35.2 15
         L 17.8 15
         C 17.3 12.8 15.4 11.4 13 11.4
         C 10.6 11.4 8.7 12.8 8.2 15
         Z"
      fill="url(#viosBodyGrad)"
      stroke="#c2410c"
      strokeWidth="0.75"
      strokeLinejoin="round"
    />

    {/* Dynamic character crease line */}
    <path
      d="M 9.5 11.2 L 48 11.8"
      stroke="#ffedd5"
      strokeWidth="0.65"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Rear Passenger Window */}
    <path
      d="M 11 9.5 L 16.8 4.8 L 24 4.8 L 24 9.5 Z"
      fill="url(#viosGlassGrad)"
      stroke="#9a3412"
      strokeWidth="0.5"
    />

    {/* Front Driver Window */}
    <path
      d="M 25.5 4.8 L 33 4.8 L 40.5 9.5 L 25.5 9.5 Z"
      fill="url(#viosGlassGrad)"
      stroke="#9a3412"
      strokeWidth="0.5"
    />

    {/* B-Pillar divider */}
    <rect x="24" y="4.5" width="1.5" height="5.2" fill="#7c2d12" />

    {/* Side mirror */}
    <ellipse cx="27" cy="9.2" rx="1.2" ry="0.8" fill="#9a3412" />

    {/* Taillight (Wrap-around sedan light) */}
    <path
      d="M 1.5 10.5 L 4 10.5 L 3.5 12 L 1.5 11.6 Z"
      fill="#ef4444"
      stroke="#991b1b"
      strokeWidth="0.4"
    />

    {/* Vios Sharp Projector Headlight */}
    <path
      d="M 48.5 11 L 52.5 11.8 L 49 12.8 Z"
      fill="#fef08a"
      stroke="#ca8a04"
      strokeWidth="0.4"
    />

    {/* Rear Wheel (Alloy rim + dark tire) */}
    <g>
      <circle cx="13" cy="15.5" r="3.6" fill="#1e293b" />
      <circle cx="13" cy="15.5" r="2.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
      <circle cx="13" cy="15.5" r="0.8" fill="#0f172a" />
      <line x1="13" y1="13.7" x2="13" y2="17.3" stroke="#64748b" strokeWidth="0.5" />
      <line x1="11.2" y1="15.5" x2="14.8" y2="15.5" stroke="#64748b" strokeWidth="0.5" />
    </g>

    {/* Front Wheel (Alloy rim + dark tire) */}
    <g>
      <circle cx="40" cy="15.5" r="3.6" fill="#1e293b" />
      <circle cx="40" cy="15.5" r="2.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
      <circle cx="40" cy="15.5" r="0.8" fill="#0f172a" />
      <line x1="40" y1="13.7" x2="40" y2="17.3" stroke="#64748b" strokeWidth="0.5" />
      <line x1="38.2" y1="15.5" x2="41.8" y2="15.5" stroke="#64748b" strokeWidth="0.5" />
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
          {/* Progress Track / Road Lane */}
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full border border-slate-200/90 shadow-inner overflow-hidden">
            {/* Filled Highway Track (Follows right behind the Vios) */}
            <div
              className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transition-all duration-75 ease-out shadow-xs shadow-orange-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Scrolling Dashed Highway Lane (Moving left to create speed illusion) */}
          <div
            className="w-full h-1 mt-1 rounded-full opacity-50 overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 10px, transparent 10px, transparent 20px)',
              animation: 'roadDashScroll 0.55s linear infinite',
            }}
          />

          {/* Standalone Toyota Vios Sedan positioned right at the head of the progress track */}
          <div
            className={`absolute top-0.5 z-10 pointer-events-none transition-all duration-75 ease-out ${
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
