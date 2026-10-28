/**
 * Tokens del sistema de diseño (docs/DESIGN-SYSTEM.md).
 * Todos los colores de la interfaz deben salir de aquí.
 *
 * Contraste medido (WCAG 2.x): textos ≥ 5.2:1 sobre fondo y superficies en ambos temas.
 * `accentPremium` (oro) da 2.97:1 sobre el fondo claro: solo decorativo, nunca texto.
 * `border` (≈1.2–1.6:1) es para divisores; los controles usan `fieldBorder` (≥ 3.3:1).
 */

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  fieldBorder: string;
  primary: string;
  onPrimary: string;
  brandSubtle: string;
  accentPremium: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  /** Velo detrás de hojas y diálogos. */
  scrim: string;
}

export const colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#FAF7F4',
    surface: '#FFFFFF',
    surfaceRaised: '#F1EBF2',
    textPrimary: '#252128',
    textSecondary: '#655F68',
    border: '#E5DDE6',
    fieldBorder: '#867D8A',
    primary: '#603B68',
    onPrimary: '#FFFFFF',
    brandSubtle: '#EDE3F0',
    accentPremium: '#B18A50',
    success: '#28745A',
    warning: '#8B5D12',
    error: '#B42335',
    info: '#286A77',
    scrim: 'rgba(37, 33, 40, 0.45)',
  },
  dark: {
    background: '#17141A',
    surface: '#211D24',
    surfaceRaised: '#2C2530',
    textPrimary: '#F5F0F6',
    textSecondary: '#C5BBC8',
    border: '#403743',
    fieldBorder: '#837887',
    primary: '#D0A9D8',
    onPrimary: '#251B28',
    brandSubtle: '#3A2D3E',
    accentPremium: '#B18A50',
    success: '#6EC6A1',
    warning: '#E8B65D',
    error: '#FF7D89',
    info: '#7BCAD4',
    scrim: 'rgba(0, 0, 0, 0.6)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  control: 12,
  sheet: 20,
  pill: 999,
} as const;

/** Área táctil mínima recomendada. */
export const minTouchTarget = 48;

export const fontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;

export const typography = {
  screenTitle: { fontFamily: fontFamily.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 19, lineHeight: 26, letterSpacing: -0.2 },
  itemTitle: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 20 },
} as const;

/** Cifras alineadas para cantidades e importes. */
export const tabularNumbers = { fontVariant: ['tabular-nums' as const] };
