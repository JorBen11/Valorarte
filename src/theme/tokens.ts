/**
 * Tokens del sistema de diseño (docs/DESIGN-SYSTEM.md).
 * Todos los colores de la interfaz deben salir de aquí.
 *
 * Contraste medido (WCAG): todos los colores de texto superan 4.5:1 sobre
 * fondo y superficies, salvo `accent` en tema claro (3.5:1), que solo debe
 * usarse en iconos o texto grande.
 */

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  onPrimary: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#F7F5F0',
    surface: '#FFFFFF',
    surfaceSecondary: '#EFEEE8',
    textPrimary: '#242923',
    textSecondary: '#5D665E',
    primary: '#205C46',
    onPrimary: '#FFFFFF',
    accent: '#C56A4A',
    border: '#DCE1D9',
    success: '#237A50',
    warning: '#9A5B13',
    error: '#B42318',
    info: '#245FA6',
  },
  dark: {
    background: '#171C19',
    surface: '#222A25',
    surfaceSecondary: '#2C352E',
    textPrimary: '#F1F3EF',
    textSecondary: '#B6C0B8',
    primary: '#8CC8A7',
    onPrimary: '#17251D',
    accent: '#E49A7B',
    border: '#3A443D',
    success: '#86D4A3',
    warning: '#F2C078',
    error: '#FF8A80',
    info: '#91BBF5',
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
  control: 10,
  card: 14,
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
  screenTitle: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26 },
  cardTitle: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
} as const;
