export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type LanguagePreference = Language | 'system';

export const LANGUAGE_PREFERENCES: readonly LanguagePreference[] = ['system', ...SUPPORTED_LANGUAGES];

/** Idioma usado cuando el del dispositivo no está soportado. */
export const FALLBACK_LANGUAGE: Language = 'en';

export function isSupportedLanguage(code: string | null | undefined): code is Language {
  return SUPPORTED_LANGUAGES.some((lang) => lang === code);
}

/**
 * Resuelve el idioma activo. Con 'system' se usa el primer idioma del
 * dispositivo que esté soportado, en orden de preferencia del usuario.
 */
export function resolveLanguage(
  preference: LanguagePreference,
  deviceLanguageCodes: readonly (string | null | undefined)[],
): Language {
  if (preference !== 'system') return preference;
  return deviceLanguageCodes.find(isSupportedLanguage) ?? FALLBACK_LANGUAGE;
}
