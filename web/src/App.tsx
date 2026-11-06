import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TheoryView } from './components/TheoryView';
import { SimulationView } from './components/SimulationView';
import { StatsView } from './components/StatsView';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeLandingView } from './components/WelcomeLandingView';
import type { LicenseCategory } from './types';
import { StorageService } from './services/storage';

export function App() {
  const isFirstVisit = !StorageService.hasEnteredApp();
  const [showLanding, setShowLanding] = useState(isFirstVisit);
  const [showSplash, setShowSplash] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'stats'>('theory');
  const [currentCategory, setCurrentCategory] = useState<LicenseCategory>(StorageService.getCategory());
  const [wrongCount, setWrongCount] = useState<number>(StorageService.getWrongQuestions().length);
  const [isStudyActive, setIsStudyActive] = useState(false);

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
        <div className={`text-slate-900 flex flex-col font-sans bg-slate-50 w-full max-w-full overflow-x-clip ${isStudyActive ? 'h-dvh overflow-hidden' : 'min-h-screen'}`}>
          {!isStudyActive && !showSplash && (
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
                onOpenLanding={() => setShowLanding(true)}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
