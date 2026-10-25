import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/theme-provider';
import { fontFamily } from '@/theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Exactamente cuatro secciones principales (CLAUDE.md §5).
const TABS: { name: string; titleKey: string; icon: IconName }[] = [
  { name: 'index', titleKey: 'tabs.home', icon: 'home-outline' },
  { name: 'ingredients', titleKey: 'tabs.ingredients', icon: 'basket-outline' },
  { name: 'products', titleKey: 'tabs.products', icon: 'package-variant-closed' },
  { name: 'settings', titleKey: 'tabs.settings', icon: 'cog-outline' },
];

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamily.medium },
      }}>
      {TABS.map(({ name, titleKey, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(titleKey),
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
