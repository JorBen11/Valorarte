import { DEFAULT_SETTINGS } from "@/constants/defaults";
import i18n from "@/i18n";
import { resolveLanguage } from "@/i18n/resolveLanguage";
import { SettingActions, SettingStore } from "@/types/setting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSettingStore = create<SettingStore & SettingActions>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) => {
        set((state) => {
          const next = { ...state.settings, ...updates };
          if (updates.language) {
            const resolved = resolveLanguage(updates.language);
            i18n.changeLanguage(resolved);
          }
          return { settings: next };
        });
      },
      setLanguage: (language) => {
        get().updateSettings({ language });
      },
      toggleTheme: () => {
        const current = get().settings.theme;
        const next = current === "light" ? "dark" : "light";
        get().updateSettings({ theme: next });
      },
      setTheme: (theme) => {
        get().updateSettings({ theme });
      },
      resetToDefaults: () => {
        set({ settings: DEFAULT_SETTINGS });
      },
    }),
    { name: "setting-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
