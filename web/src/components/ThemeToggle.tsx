import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeService } from '../services/theme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const [isDark, setIsDark] = useState<boolean>(() => ThemeService.isDark());

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(ThemeService.isDark());
    };

    window.addEventListener('ontapgplx:theme_change', handleThemeChange);

    // Watch for class changes on <html> (system theme switch or external change)
    const observer = new MutationObserver(() => {
      setIsDark(ThemeService.isDark());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('ontapgplx:theme_change', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    ThemeService.toggleTheme();
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all cursor-pointer shrink-0 ${className}`}
      title={isDark ? 'Giao diện tối (Bấm để chuyển sáng)' : 'Giao diện sáng (Bấm để chuyển tối)'}
      aria-label={isDark ? 'Giao diện tối' : 'Giao diện sáng'}
    >
      {isDark ? (
        <Moon className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-amber-300 stroke-[2] transition-transform duration-200`} />
      ) : (
        <Sun className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-amber-500 stroke-[2] transition-transform duration-200`} />
      )}
    </button>
  );
};

