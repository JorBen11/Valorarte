import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferencesStore } from '@/features/settings/preferences-store';

import { resolveColorScheme } from './resolve-color-scheme';
import { colors, type ColorScheme, type ThemeColors } from './tokens';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = usePreferencesStore((s) => s.theme);
  const scheme = resolveColorScheme(preference, systemScheme);

  const value = useMemo(() => ({ scheme, colors: colors[scheme] }), [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
