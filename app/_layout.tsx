import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useInitializeLanguage } from '@/hooks/use-initialize-language';
import { useSystemLanguageListener } from '@/hooks/use-system-language-listener';

import { useFonts } from "expo-font";
 
import {
  Epilogue_400Regular,
  Epilogue_600SemiBold,
  Epilogue_700Bold,
} from "@expo-google-fonts/epilogue";
 
import { ThemeProvider, useTheme } from '@/context/theme-context';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Syne_600SemiBold,
  Syne_800ExtraBold,
} from "@expo-google-fonts/syne";
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootStack = () => {
  const { isDark, theme } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle:        { backgroundColor: theme.background },
          headerStyle:         { backgroundColor: theme.background },
          headerTintColor:     theme.contentPrimary,
          headerTitleStyle:    { fontFamily: "Epilogue-Bold", fontSize: 17, color: theme.contentPrimary },
          headerShadowVisible: false,
          animation:           "slide_from_right",
          headerShown:             false,
        }}
      />
    </>
  );
};

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    // ── Clash Display (local) ──────────────────────────────
    "ClashDisplay-Semibold": Syne_600SemiBold,
    "ClashDisplay-Bold":     Syne_800ExtraBold,
 
    // ── Epilogue (Google Fonts) ────────────────────────────
    "Epilogue-Regular":   Epilogue_400Regular,
    "Epilogue-SemiBold":  Epilogue_600SemiBold,
    "Epilogue-Bold":      Epilogue_700Bold,
 
    // ── Plus Jakarta Sans (Google Fonts) ───────────────────
    "PlusJakartaSans-Regular":  PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium":   PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold":     PlusJakartaSans_700Bold,
  });
  useInitializeLanguage();
  useSystemLanguageListener();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

export default RootLayout;
