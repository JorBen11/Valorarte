import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FloatingTabBar, type TabIcons } from '@/components/ui/tab-bar';
import { useTheme } from '@/theme/theme-provider';

// Exactamente cuatro secciones principales (CLAUDE.md §5). Icono relleno = pestaña activa.
const TABS: ({ name: string; titleKey: string } & TabIcons)[] = [
  { name: 'index', titleKey: 'tabs.home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'ingredients', titleKey: 'tabs.ingredients', icon: 'basket-outline', activeIcon: 'basket' },
  { name: 'products', titleKey: 'tabs.products', icon: 'cube-outline', activeIcon: 'cube' },
  { name: 'settings', titleKey: 'tabs.settings', icon: 'cog-outline', activeIcon: 'cog' },
];

const ICONS = Object.fromEntries(TABS.map(({ name, icon, activeIcon }) => [name, { icon, activeIcon }]));

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} icons={ICONS} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}>
      {TABS.map(({ name, titleKey }) => (
        <Tabs.Screen key={name} name={name} options={{ title: t(titleKey) }} />
      ))}
    </Tabs>
  );
}
