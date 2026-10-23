import i18n from "@/i18n";
import { resolveLanguage } from "@/i18n/resolveLanguage";
import { useSettingStore } from "@/store/setting-store";
import { useEffect } from "react";
import { AppState } from "react-native";

export const useSystemLanguageListener = () => {
  const language = useSettingStore((s) => s.settings.language);

  useEffect(() => {
    if (language !== "system") return;

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const resolved = resolveLanguage(language);
        i18n.changeLanguage(resolved);
      }
    });

    return () => sub.remove();
  }, [language]);
};
