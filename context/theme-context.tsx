import { ColorScheme, Dark, getSemanticMuted, getShadow, Light, Primary, Semantic } from "@/constants/tokens";
import { useSettingStore } from "@/store/setting-store";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

export type ThemeType = typeof Dark | typeof Light;
export type PrimaryType = typeof Primary;
 
interface ThemeContextValue {
  colorScheme: ColorScheme;
  theme: ThemeType;
  primary: PrimaryType;
  semantic: typeof Semantic;
  semanticMuted: ReturnType<typeof getSemanticMuted>;
  shadow: ReturnType<typeof getShadow>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme();
  const systemScheme = scheme === 'light' || scheme === 'dark' ? scheme : 'dark';

  const themePref = useSettingStore(s => s.settings.theme);

  const colorScheme = themePref === 'system' ? systemScheme : themePref;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      theme: colorScheme === 'dark' ? Dark : Light,
      primary: Primary,
      semantic: Semantic,
      semanticMuted: getSemanticMuted(colorScheme),
      shadow: getShadow(colorScheme),
      isDark: colorScheme === 'dark',
    }),
    [colorScheme]
  );
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};