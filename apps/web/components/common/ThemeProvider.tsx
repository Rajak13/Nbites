'use client';

import * as React from 'react';
import { useAuthStore } from '@/lib/auth';

type ThemeMode = 'cream' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeMode>('cream');
  const [mounted, setMounted] = React.useState(false);

  const authUser = useAuthStore((state) => state.user);
  const updateAuthTheme = useAuthStore((state) => state.updateThemePreference);
  const syncProfile = useAuthStore((state) => state.syncProfileFromApi);

  // Sync profile on initial client load if token exists
  React.useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  // Read initial preference on mount
  React.useEffect(() => {
    let initial: ThemeMode = 'cream';

    if (authUser?.themePreference) {
      initial = authUser.themePreference;
    } else {
      const stored = localStorage.getItem('nbites_theme') as ThemeMode | null;
      if (stored === 'cream' || stored === 'dark') {
        initial = stored;
      }
    }

    setThemeState(initial);
    applyThemeToDocument(initial);
    setMounted(true);
  }, []);

  // When authUser's theme preference changes from server, update if different
  React.useEffect(() => {
    if (mounted && authUser?.themePreference && authUser.themePreference !== theme) {
      setThemeState(authUser.themePreference);
      applyThemeToDocument(authUser.themePreference);
    }
  }, [authUser?.themePreference, mounted]);

  const applyThemeToDocument = (t: ThemeMode) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = React.useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      applyThemeToDocument(newTheme);
      localStorage.setItem('nbites_theme', newTheme);
      updateAuthTheme(newTheme);
    },
    [updateAuthTheme]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'cream' ? 'dark' : 'cream');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
