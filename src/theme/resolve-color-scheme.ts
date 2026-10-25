import type { ColorScheme } from './tokens';

export type ThemePreference = ColorScheme | 'system';

export const THEME_PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

/**
 * Resuelve el esquema activo. El sistema puede devolver valores distintos de
 * 'light' | 'dark' (por ejemplo 'unspecified' o null); en ese caso se usa claro.
 */
export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ColorScheme {
  if (preference !== 'system') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
}
