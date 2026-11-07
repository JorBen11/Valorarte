/**
 * Tokens del sistema de diseño Etiqueta refinada (docs/DESIGN-SYSTEM.md, secciones 2, 4 y 5).
 * Todos los colores de la interfaz deben salir de aquí.
 *
 * `error` y `primary` tienen luminosidad casi igual: siempre van con icono o texto.
 * `attention` sobre `background` no contrasta: la etiqueta compacta va sobre `surface`.
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
  /** Rosa como texto, línea o foco; `primary` es solo relleno. */
  primaryText: string;
  attention: string;
  onAttention: string;
  ink: string;
  onInk: string;
  success: string;
  successSurface: string;
  warning: string;
  warningSurface: string;
  info: string;
  infoSurface: string;
  error: string;
  errorSurface: string;
  onError: string;
  /** Velo detrás de hojas y diálogos. */
  scrim: string;
  imageEdge: string;
  /** Solo para versiones anteriores de pantallas aún sin confirmar; ninguna pantalla migrada los usa. */
  brandSubtle: string;
  accentPremium: string;
}

export const colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#CFEEDD',
    surface: '#F4FBF7',
    surfaceRaised: '#E2F5EA',
    textPrimary: '#10261C',
    textSecondary: '#35574A',
    border: 'rgba(16, 38, 28, 0.16)',
    fieldBorder: '#5C7A6E',
    primary: '#B80D66',
    onPrimary: '#FFFFFF',
    primaryText: '#A00B58',
    attention: '#FFC531',
    onAttention: '#10261C',
    ink: '#10261C',
    onInk: '#F4FBF7',
    success: '#0E5F3C',
    successSurface: '#D6F1E1',
    warning: '#6F4A00',
    warningSurface: '#FFF0C4',
    info: '#0B5573',
    infoSurface: '#D8EDF5',
    error: '#A32A16',
    errorSurface: '#FBE4DE',
    onError: '#FFFFFF',
    scrim: 'rgba(5, 18, 13, 0.6)',
    imageEdge: 'rgba(0, 0, 0, 0.1)',
    brandSubtle: '#E2F5EA',
    accentPremium: '#A00B58',
  },
  dark: {
    background: '#10261C',
    surface: '#1A3328',
    surfaceRaised: '#234034',
    textPrimary: '#E7F7EE',
    textSecondary: '#A9CDBD',
    border: 'rgba(231, 247, 238, 0.16)',
    fieldBorder: '#7E9F92',
    primary: '#B80D66',
    onPrimary: '#FFFFFF',
    primaryText: '#FF8FC2',
    attention: '#FFC531',
    onAttention: '#10261C',
    ink: '#E7F7EE',
    onInk: '#10261C',
    success: '#8BE3B4',
    successSurface: '#1E4A36',
    warning: '#FFD166',
    warningSurface: '#47391A',
    info: '#93D4EE',
    infoSurface: '#1B3F4F',
    error: '#FFA08A',
    errorSurface: '#4A2A22',
    onError: '#10261C',
    scrim: 'rgba(5, 18, 13, 0.6)',
    imageEdge: 'rgba(255, 255, 255, 0.1)',
    brandSubtle: '#234034',
    accentPremium: '#FF8FC2',
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
  control: 14,
  group: 20,
  sheet: 24,
  pill: 999,
} as const;

/** Radios por esquina de la silueta de etiqueta: la nariz queda a la izquierda. */
const tagCorners = (nose: number, end: number) => ({
  borderTopLeftRadius: nose,
  borderBottomLeftRadius: nose,
  borderTopRightRadius: end,
  borderBottomRightRadius: end,
});

export const tagShape = {
  main: tagCorners(40, 16),
  compact: tagCorners(16, 7),
  primaryButton: tagCorners(28, 12),
  thumbnail: tagCorners(22, 10),
} as const;

/** Área táctil mínima recomendada. */
export const minTouchTarget = 48;

export const fontFamily = {
  regular: 'Figtree-Regular',
  medium: 'Figtree-Medium',
  semiBold: 'Figtree-SemiBold',
  bold: 'Figtree-Bold',
  display: 'BricolageGrotesque-SemiBold',
} as const;

export const typography = {
  screenTitle: { fontFamily: fontFamily.display, fontSize: 26, lineHeight: 32 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 24 },
  amountMain: { fontFamily: fontFamily.semiBold, fontSize: 36, lineHeight: 44, fontVariant: ['tabular-nums' as const] },
  amountSecondary: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26, fontVariant: ['tabular-nums' as const] },
  quantity: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22, fontVariant: ['tabular-nums' as const] },
  itemTitle: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 22 },
} as const;

/** Cifras alineadas para cantidades e importes. */
export const tabularNumbers = { fontVariant: ['tabular-nums' as const] };
