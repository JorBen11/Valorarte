import { AppLanguage } from "@/i18n/settings";

export type ThemePreference = "light" | "dark" | "system";

export interface AppSettings {
  language: AppLanguage;
  theme: ThemePreference;
}

export interface SettingStore {
  settings: AppSettings;
}

export interface SettingActions {
  updateSettings: (updates: Partial<AppSettings>) => void;
  setLanguage: (language: AppLanguage) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
  resetToDefaults: () => void;
}
