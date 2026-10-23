import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TabBarBackground from '@/components/ui/tab-bar-background';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        tabBarActiveTintColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabIconDefault,
        headerShown: false,
        tabBarStyle: {...styles.tabBar, backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background},
        tabBarItemStyle: {...styles.tabBarItem, flex: 1},
        tabBarIconStyle: { width: '100%', height: 24 },
        tabBarVisibilityAnimationConfig: {
          show: {
            animation: 'spring',
            config: {
              damping: 20,
              stiffness: 150,
            },
          },
          hide: {
            animation: 'spring',
            config: {
              damping: 20,
              stiffness: 150,
            },
          },
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderWidth: 1,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 16,
    // Mejores sombras por plataforma
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
