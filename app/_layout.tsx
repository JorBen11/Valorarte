import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { DatabaseProvider } from '@/data/database/database-provider';
import { useApplyLanguage } from '@/features/settings/use-apply-language';
import '@/i18n';
import { ThemeProvider, useTheme } from '@/theme/theme-provider';
import { fontFamily } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Las pestañas siempre quedan debajo: un enlace directo o una recarga en un formulario no lo deja sin "Atrás".
export const unstable_settings = { anchor: '(tabs)' };

function RootStack() {
  const { scheme, colors } = useTheme();
  // Fondo raíz nativo: evita destellos blancos tras modales y transiciones en tema oscuro.
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {/* El alta se presenta como hoja modal que entra desde abajo. */}
        <Stack.Screen name="ingredients/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.regular]: PlusJakartaSans_400Regular,
    [fontFamily.medium]: PlusJakartaSans_500Medium,
    [fontFamily.semiBold]: PlusJakartaSans_600SemiBold,
    [fontFamily.bold]: PlusJakartaSans_700Bold,
  });
  useApplyLanguage();

  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider>
      <DatabaseProvider>
        <RootStack />
      </DatabaseProvider>
    </ThemeProvider>
  );
}
