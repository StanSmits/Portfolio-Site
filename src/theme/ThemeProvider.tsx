import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { getDocumentTheme, readStoredTheme, storeTheme, type Theme } from './theme';

const META_COLORS: Record<Theme, string> = { light: '#F4F0E8', dark: '#141412' };

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 500);
  }
  root.setAttribute('data-theme', theme);
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', META_COLORS[theme]));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getDocumentTheme);
  const explicit = useRef(readStoredTheme() !== null);

  // Follow the system preference until the visitor makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (explicit.current) return;
      const next: Theme = event.matches ? 'dark' : 'light';
      applyTheme(next, true);
      setTheme(next);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      explicit.current = true;
      storeTheme(next);
      applyTheme(next, true);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
