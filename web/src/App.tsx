import { useState, useEffect, useRef } from 'react';
import { Navbar, type SubHeaderConfig } from './components/Navbar';
import { TheoryView } from './components/TheoryView';
import { SimulationView } from './components/SimulationView';
import { StatsView } from './components/StatsView';
import { MoreView } from './components/MoreView';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeLandingView } from './components/WelcomeLandingView';
import type { LicenseCategory } from './types';
import { StorageService, type ExamHistoryItem, type SimulationExamHistoryItem } from './services/storage';
import { ThemeService } from './services/theme';

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
  const isFirstVisit = !StorageService.hasEnteredApp(isPWA);

  // Initialize theme on app boot
  useEffect(() => {
    ThemeService.init();
  }, []);

  // Onboarding (OB) chỉ xuất hiện lần đầu tiên vào app; các lần sau vào thẳng app
  const [showLanding, setShowLanding] = useState(isFirstVisit);
  const [showSplash, setShowSplash] = useState(!isFirstVisit && isPWA);
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'stats' | 'more'>('theory');
  const [currentCategory, setCurrentCategory] = useState<LicenseCategory>(StorageService.getCategory());
  const [wrongCount, setWrongCount] = useState<number>(StorageService.getWrongQuestions().length);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [isMoreSubView, setIsMoreSubView] = useState(false);
  const [moreSubHeader, setMoreSubHeader] = useState<SubHeaderConfig | null>(null);
  const [reviewExamItem, setReviewExamItem] = useState<ExamHistoryItem | null>(null);
  const [reviewSimExamItem, setReviewSimExamItem] = useState<SimulationExamHistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastBackPressRef = useRef<number>(0);
  const isMoreSubViewRef = useRef(false);
  const lastSubViewExitTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isMoreSubViewRef.current && !isMoreSubView) {
      lastSubViewExitTimeRef.current = Date.now();
    }
    isMoreSubViewRef.current = isMoreSubView;
  }, [isMoreSubView]);

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

      // If user was inside a subview of 'More' or just exited it within 500ms, ignore this popstate
      if (isMoreSubViewRef.current || Date.now() - lastSubViewExitTimeRef.current < 500) {
        return;
      }

      // If user is on 'simulation' or 'stats' or 'more', return to 'theory' (Home tab) first
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

  const handleStartExperience = () => {
    StorageService.setEnteredApp(isPWA);
    setCurrentCategory(StorageService.getCategory());
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

  const handleTabChange = (tab: 'theory' | 'simulation' | 'stats' | 'more') => {
    setActiveTab(tab);
    setIsStudyActive(false);
    setReviewExamItem(null);
    setReviewSimExamItem(null);
    if (tab !== 'more') {
      setIsMoreSubView(false);
      setMoreSubHeader(null);
    }
  };

  const refreshStats = () => {
    setWrongCount(StorageService.getWrongQuestions().length);
  };

  return (
    <>
      {showLanding && <WelcomeLandingView onStartExperience={handleStartExperience} />}
      {!showLanding && showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!showLanding && (
        <div className={`text-slate-900 dark:text-slate-100 flex flex-col font-sans bg-slate-50 dark:bg-slate-950 w-full max-w-full transition-colors duration-200 ${isStudyActive ? 'h-dvh overflow-hidden' : 'min-h-screen'}`}>
          {!isStudyActive && (
            <Navbar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              currentCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
              wrongCount={wrongCount}
              hideBottomNav={(isMoreSubView || Boolean(moreSubHeader)) && activeTab === 'more'}
              subHeader={activeTab === 'more' ? moreSubHeader : null}
            />
          )}

          <main className={`flex-1 flex flex-col min-h-0 w-full max-w-full ${isStudyActive ? 'overflow-hidden' : ((isMoreSubView || Boolean(moreSubHeader)) && activeTab === 'more') ? 'pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]' : 'pb-[calc(5.5rem+max(0.75rem,env(safe-area-inset-bottom,0px)))] lg:pb-8 landscape-mobile:pb-16'}`}>
            {activeTab === 'theory' && (
              <TheoryView
                currentCategory={reviewExamItem?.category || currentCategory}
                onRefreshStats={refreshStats}
                onActiveStateChange={setIsStudyActive}
                reviewExam={reviewExamItem}
                onExitReview={() => {
                  handleTabChange('stats');
                }}
              />
            )}

            {activeTab === 'simulation' && (
              <SimulationView
                currentCategory={currentCategory}
                onActiveStateChange={setIsStudyActive}
                reviewExam={reviewSimExamItem}
                onExitReview={() => {
                  setReviewSimExamItem(null);
                  handleTabChange('stats');
                }}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView
                onGoToWrongQuestions={() => handleTabChange('theory')}
                onRefresh={refreshStats}
                onReviewExam={(item) => {
                  setReviewExamItem(item);
                  setActiveTab('theory');
                }}
                onReviewSimExam={(item) => {
                  setReviewSimExamItem(item);
                  setActiveTab('simulation');
                }}
              />
            )}

            {activeTab === 'more' && (
              <MoreView
                onGoToTab={handleTabChange}
                onOpenLanding={isPWA ? undefined : () => setShowLanding(true)}
                onSubViewChange={setIsMoreSubView}
                onSubHeaderChange={setMoreSubHeader}
              />
            )}
          </main>
        </div>
      )}

      {/* Mobile / PWA Double-Back Toast Indicator */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium shadow-lg border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none whitespace-nowrap">
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default App;
