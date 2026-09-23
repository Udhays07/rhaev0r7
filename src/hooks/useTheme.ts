import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    setThemeState(next);
  }, []);

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem('theme');
      } catch {
        /* ignore */
      }
      if (stored) return;
      const next: Theme = e.matches ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
