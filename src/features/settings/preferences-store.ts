import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LanguagePreference } from '@/i18n/languages';
import type { ThemePreference } from '@/theme/resolve-color-scheme';

/**
 * Preferencias del dispositivo (no del negocio). Los datos del negocio
 * se persistirán en SQLite a partir de la Fase 1.
 */
interface PreferencesState {
  theme: ThemePreference;
  language: LanguagePreference;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'system',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'device-preferences',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ theme, language }) => ({ theme, language }),
    },
  ),
);
