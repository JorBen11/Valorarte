/**
 * Craftly Design Tokens — Light & Dark
 * ─────────────────────────────────────────────────────────────
 * PRINCIPIO: Los colores de marca (Primary, Semantic) son
 * IDÉNTICOS en ambos modos. Solo cambian superficies y textos.
 *
 * La paleta light deriva del mismo tono oliva-cálido del dark,
 * desaturado hacia crema/hueso — mantiene la armonía cromática.
 * ─────────────────────────────────────────────────────────────
 */

// ── Brand / Primary — NUNCA CAMBIA ──────────────────────────────
export const Primary = {
  default: "#C8F135", // Lima brillante — identidad de marca
  pressed: "#B0D42A", // Estado pressed
  muted: "#D4F56A", // Variante suave
} as const;

// ── Semánticos — NUNCA CAMBIAN ───────────────────────────────────
export const Semantic = {
  success: "#00C48C",
  successMutedDark: "#0A2E22",
  successMutedLight: "#DCFBEE",
  successText: "#00E6A5",

  warning: "#FFB800",
  warningMutedDark: "#2E2200",
  warningMutedLight: "#FFF5D6",
  warningText: "#FFD54F",

  error: "#FF4D4F",
  errorMutedDark: "#2E0A0A",
  errorMutedLight: "#FEE8E8",
  errorText: "#FF6B5B",

  destructive: "#CC2200",
  destructivePressed: "#AA1A00",
} as const;

// ── Tema DARK (paleta original) ──────────────────────────────────
export const Dark = {
  background: "#1A1A14",
  elevated: "#222219",
  surface: "#2A2A22",
  tabbar: "#141410",

  contentPrimary: "#F2F2E8",
  contentSecondary: "#8A8A78",
  contentDisabled: "#4A4A3E",
  contentInverse: "#141410",
  contentAccent: "#C8F135",

  borderDefault: "#2E2E24",
  borderStrong: "#3A3A2E",
  borderFocus: "#C8F135",
  borderError: "#FF4D4F",

  primarySubtle: "#1E2408",
} as const;

// ── Tema LIGHT ───────────────────────────────────────────────────
// Derivado del tono oliva oscuro → desaturado a crema/hueso.
// Misma temperatura cálida, contraste invertido.
export const Light = {
  background: "#F5F4EF",
  elevated: "#FFFFFF",
  surface: "#EEEDE7",
  tabbar: "#E8E7E0",

  contentPrimary: "#1A1A10",
  contentSecondary: "#6B6B60",
  contentDisabled: "#B8B8A8",
  contentInverse: "#141410", // sobre botones lima — igual que dark
  contentAccent: "#3A6010", // lima dark → verde legible en claro

  borderDefault: "#D4D2C8",
  borderStrong: "#B8B6AC",
  borderFocus: "#C8F135", // siempre lima
  borderError: "#FF4D4F", // siempre rojo

  primarySubtle: "#E8F4B0",
} as const;

// ── Helper ───────────────────────────────────────────────────────
export type ColorScheme = "dark" | "light";

export function getTheme(scheme: ColorScheme) {
  return scheme === "dark" ? Dark : Light;
}

export function getSemanticMuted(scheme: ColorScheme) {
  return {
    success:
      scheme === "dark"
        ? Semantic.successMutedDark
        : Semantic.successMutedLight,
    warning:
      scheme === "dark"
        ? Semantic.warningMutedDark
        : Semantic.warningMutedLight,
    error:
      scheme === "dark" ? Semantic.errorMutedDark : Semantic.errorMutedLight,
  };
}

export function getShadow(scheme: ColorScheme) {
  return {
    card: {
      shadowColor: scheme === "dark" ? "#000000" : "#2A2A1A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: scheme === "dark" ? 0.4 : 0.08,
      shadowRadius: 8,
      elevation: scheme === "dark" ? 4 : 2,
    },
    modal: {
      shadowColor: scheme === "dark" ? "#000000" : "#1A1A10",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: scheme === "dark" ? 0.7 : 0.12,
      shadowRadius: 40,
      elevation: scheme === "dark" ? 20 : 8,
    },
    fab: {
      shadowColor: "#C8F135",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: scheme === "dark" ? 0.3 : 0.4,
      shadowRadius: 20,
      elevation: scheme === "dark" ? 10 : 8,
    },
  };
}

// ── Tokens sin modo ──────────────────────────────────────────────
export const Radius = {
  card: 16,
  btn: 12,
  chip: 24,
  input: 12,
  badge: 6,
  full: 9999,
} as const;

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
} as const;

export const Height = {
  btnSm: 36,
  btnMd: 48,
  btnLg: 56,
  input: 52,
  chip: 32,
  tabbar: 64,
} as const;

export const FontFamily = {
  display: "ClashDisplay-Bold",
  displayMd: "ClashDisplay-Semibold",
  heading: "Epilogue-Bold",
  headingMd: "Epilogue-SemiBold",
  headingRg: "Epilogue-Regular",
  sans: "PlusJakartaSans-Regular",
  sansMd: "PlusJakartaSans-Medium",
  sansSemi: "PlusJakartaSans-SemiBold",
  sansBold: "PlusJakartaSans-Bold",
} as const;

export const FontSize = {
  display: 48,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  label: 13,
  caption: 11,
  overline: 10,
} as const;

export const LineHeight = {
  display: 52,
  h1: 32,
  h2: 28,
  h3: 24,
  body: 22,
  label: 18,
  caption: 16,
  overline: 14,
} as const;

export const tokens = {
  primary: Primary,
  semantic: Semantic,
  dark: Dark,
  light: Light,
  getTheme,
  getSemanticMuted,
  getShadow,
  radius: Radius,
  spacing: Spacing,
  height: Height,
  font: {
    family: FontFamily,
    size: FontSize,
    lineHeight: LineHeight,
  },
} as const;

export default tokens;
