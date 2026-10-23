/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { darkTheme, lightTheme } from "@/theme/theme";
import { Platform } from "react-native";

export const Colors = {
  light: {
    text: lightTheme.colors?.onSurface,
    background: lightTheme.colors?.background,
    tint: lightTheme.colors?.primary,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: lightTheme.colors?.primary,
  },
  dark: {
    text: darkTheme.colors?.onSurface,
    background: darkTheme.colors?.background,
    tint: darkTheme.colors?.primary,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: darkTheme.colors?.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
