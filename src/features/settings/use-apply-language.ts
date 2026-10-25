import { getLocales } from 'expo-localization';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import i18n from '@/i18n';
import { resolveLanguage } from '@/i18n/languages';

import { usePreferencesStore } from './preferences-store';

function applyLanguage(preference: Parameters<typeof resolveLanguage>[0]) {
  const resolved = resolveLanguage(
    preference,
    getLocales().map((locale) => locale.languageCode),
  );
  if (i18n.language !== resolved) i18n.changeLanguage(resolved);
}

/**
 * Único punto que sincroniza i18n con la preferencia guardada. Si se sigue el
 * idioma del sistema, se vuelve a resolver al regresar la app a primer plano.
 */
export function useApplyLanguage() {
  const preference = usePreferencesStore((s) => s.language);

  useEffect(() => {
    applyLanguage(preference);
    if (preference !== 'system') return;

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') applyLanguage(preference);
    });
    return () => sub.remove();
  }, [preference]);
}
