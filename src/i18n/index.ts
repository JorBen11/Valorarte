import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LANGUAGE } from './languages';
import en from './locales/en.json';
import es from './locales/es.json';

// Inicialización síncrona: los recursos van empaquetados, así que i18n queda
// listo antes de que cualquier componente o hook lo use.
if (!i18n.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    initAsync: false,
    lng: FALLBACK_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: { escapeValue: false },
  });
}

export default i18n;
