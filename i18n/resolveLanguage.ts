import * as Localization from "expo-localization";
import { AppLanguage, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./settings";

export const resolveLanguage = (language: AppLanguage): AppLanguage => {
  if (language === "system") {
    const device = Localization.getLocales()[0].languageCode;
    if (!device || !SUPPORTED_LANGUAGES.includes(device)) {
      return DEFAULT_LANGUAGE;
    }

    return device;
  }

  return language;
};
