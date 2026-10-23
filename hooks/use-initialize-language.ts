import i18n from "@/i18n";
import { resolveLanguage } from "@/i18n/resolveLanguage";
import { useSettingStore } from "@/store/setting-store";
import { useEffect } from "react";

export const useInitializeLanguage = () => {
  const language = useSettingStore((s) => s.settings.language);
  const hydrated = useSettingStore.persist.hasHydrated();

  useEffect(() => {
    if (!hydrated) return;

    const resolved = resolveLanguage(language);
    i18n.changeLanguage(resolved);
  }, [language, hydrated]);
};
