import { useSettingStore } from "@/store/setting-store";
import { useColorScheme } from "react-native";

export const useThemeMode = () => {
  const systemScheme = useColorScheme();
  const { theme } = useSettingStore().settings;

  let systemTheme: 'dark' | 'light' = 'light';
  if (systemScheme === 'dark') {
    systemTheme = 'dark';
  }

  const resolvedTheme = theme === 'system'
    ? systemTheme
    : theme;

  const isDark = resolvedTheme === 'dark';

  return { theme: resolvedTheme, isDark };
};