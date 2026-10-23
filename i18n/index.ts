import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import { DEFAULT_LANGUAGE } from "./settings";

// Se inicializa de forma síncrona al importar el módulo para que
// changeLanguage nunca se ejecute sobre una instancia sin inicializar.
if (!i18n.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",

    initAsync: false,

    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,

    resources: {
      en: { translation: en },
      es: { translation: es },
    },

    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
