import { BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque';
import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from '@expo-google-fonts/figtree';
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
        {/* El alta, la edición y los ajustes se presentan como hoja modal que entra desde abajo. */}
        <Stack.Screen name="ingredients/new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="ingredients/adjust" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        {/* El detalle es una pantalla de la pila: entra lateralmente y conserva el listado debajo. */}
        <Stack.Screen name="ingredients/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.regular]: Figtree_400Regular,
    [fontFamily.medium]: Figtree_500Medium,
    [fontFamily.semiBold]: Figtree_600SemiBold,
    [fontFamily.bold]: Figtree_700Bold,
    [fontFamily.display]: BricolageGrotesque_600SemiBold,
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
