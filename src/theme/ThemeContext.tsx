import React from 'react';

import { Theme, ThemeMode, darkTheme, getTheme, lightTheme } from './tokens';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  initialMode?: ThemeMode;
};

export function ThemeProvider({ children, initialMode = 'light' }: ProviderProps) {
  const [mode, setMode] = React.useState<ThemeMode>(initialMode);

  const toggleTheme = React.useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = React.useMemo<ThemeContextValue>(() => ({
    theme: getTheme(mode),
    mode,
    toggleTheme,
    setMode,
  }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = React.useContext(ThemeContext);
  if (ctx == null) {
    // Safe fallback so components remain usable if used outside a provider
    return lightTheme;
  }
  return ctx.theme;
}

export function useThemeControls() {
  const ctx = React.useContext(ThemeContext);
  if (ctx == null) {
    return {
      theme: lightTheme,
      mode: 'light' as ThemeMode,
      toggleTheme: () => {},
      setMode: (_: ThemeMode) => {},
    };
  }
  return ctx;
}

// Re-export so callers can import from a single place when convenient
export { darkTheme, lightTheme };
