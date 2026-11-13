export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'ontapgplx_theme';

export const ThemeService = {
  getTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'system';
  },

  setTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
    window.dispatchEvent(new CustomEvent('ontapgplx:theme_change', { detail: theme }));
  },

  applyTheme(theme?: ThemeMode): void {
    if (typeof window === 'undefined') return;
    const activeTheme = theme || this.getTheme();
    const isDark =
      activeTheme === 'dark' ||
      (activeTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  },

  init(): void {
    if (typeof window === 'undefined') return;
    this.applyTheme();

    // Listen to OS theme changes if user chose 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.getTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
};

