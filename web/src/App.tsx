import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TheoryView } from './components/TheoryView';
import { SimulationView } from './components/SimulationView';
import { StatsView } from './components/StatsView';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeLandingView } from './components/WelcomeLandingView';
import type { LicenseCategory } from './types';
import { StorageService } from './services/storage';

const isPWAMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('source=pwa')
  );
};

const isMobileOrPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    isPWAMode() ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
};

export function App() {
  const isPWA = isPWAMode();
  const isFirstVisit = !StorageService.hasEnteredApp();

  // If running in PWA mode: bypass landing page, show Splash screen on launch then enter app
  const [showLanding, setShowLanding] = useState(!isPWA && isFirstVisit);
  const [showSplash, setShowSplash] = useState(isPWA);
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'stats'>('theory');
  const [currentCategory, setCurrentCategory] = useState<LicenseCategory>(StorageService.getCategory());
  const [wrongCount, setWrongCount] = useState<number>(StorageService.getWrongQuestions().length);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastBackPressRef = useRef<number>(0);

  // Mobile / PWA Double-Back to Exit handler & tab switching
  useEffect(() => {
    if (!isMobileOrPWA() || isStudyActive || showLanding || showSplash) return;

    // Ensure double-entry trap is established
    if (!window.history.state?.appHomeTrap) {
      window.history.replaceState({ appHomeBase: true }, '');
      window.history.pushState({ appHomeTrap: true }, '');
    }

    const handlePopState = (e: PopStateEvent) => {
      // If event was triggered by child views (study/modal), do not handle here
      if (e.state?.component || isStudyActive) return;

      // If user is on 'simulation' or 'stats', return to 'theory' (Home tab) first
      if (activeTab !== 'theory') {
        setActiveTab('theory');
        window.history.pushState({ appHomeTrap: true }, '');
        return;
      }

      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        // Double back pressed within 2s -> allow exit
        setToastMessage(null);
        window.history.back();
      } else {
        // First back press: prompt toast and re-push trap state
        lastBackPressRef.current = now;
        window.history.pushState({ appHomeTrap: true }, '');
        setToastMessage('Nhấn lần nữa để thoát ứng dụng');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isStudyActive, showLanding, showSplash, activeTab]);

  // Auto hide toast after 2s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (isPWA) {
      StorageService.setEnteredApp();
    }
  }, [isPWA]);

  const handleStartExperience = () => {
    StorageService.setEnteredApp();
    setShowLanding(false);
    setShowSplash(true);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleSelectCategory = (cat: LicenseCategory) => {
    setCurrentCategory(cat);
    StorageService.setCategory(cat);
  };

  const handleTabChange = (tab: 'theory' | 'simulation' | 'stats') => {
    setActiveTab(tab);
    setIsStudyActive(false);
  };

  const refreshStats = () => {
    setWrongCount(StorageService.getWrongQuestions().length);
  };

  return (
    <>
      {showLanding && <WelcomeLandingView onStartExperience={handleStartExperience} />}
      {!showLanding && showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!showLanding && (
        <div className={`text-slate-900 flex flex-col font-sans bg-slate-50 w-full max-w-full ${isStudyActive ? 'h-dvh overflow-hidden' : 'min-h-screen'}`}>
          {!isStudyActive && (
            <Navbar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              currentCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
              wrongCount={wrongCount}
            />
          )}

          <main className={`flex-1 flex flex-col min-h-0 w-full max-w-full ${isStudyActive ? 'overflow-hidden' : 'pb-[calc(5.5rem+max(0.75rem,env(safe-area-inset-bottom,0px)))] lg:pb-8 landscape-mobile:pb-16'}`}>
            {activeTab === 'theory' && (
              <TheoryView
                currentCategory={currentCategory}
                onRefreshStats={refreshStats}
                onActiveStateChange={setIsStudyActive}
              />
            )}

            {activeTab === 'simulation' && (
              <SimulationView onActiveStateChange={setIsStudyActive} />
            )}

            {activeTab === 'stats' && (
              <StatsView
                onGoToWrongQuestions={() => handleTabChange('theory')}
                onRefresh={refreshStats}
                onOpenLanding={isPWA ? undefined : () => setShowLanding(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Mobile / PWA Double-Back Toast Indicator */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-white/80 text-slate-800 text-xs sm:text-sm font-medium shadow-lg border border-slate-200/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none whitespace-nowrap">
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default App;
