import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export interface TabIcons {
  icon: IconName;
  activeIcon: IconName;
}

/**
 * Barra inferior flotante propia: cuatro iconos siempre visibles; solo la pestaña activa
 * se ensancha en una píldora con su etiqueta. Va en el flujo del layout, no superpuesta.
 */
export function FloatingTabBar({ state, descriptors, emitter, navigateToTab, icons }: TabBarProps & { icons: Record<string, TabIcons> }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardOpen = useKeyboardOpen();

  // En Android el teclado empuja la ventana: se oculta la barra para dejar sitio al campo activo.
  if (keyboardOpen && Platform.OS === 'android') return null;

  return (
    <View style={[styles.outer, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View
        accessibilityRole="tablist"
        style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.scrim }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const tabIcons = icons[route.name];
          const color = focused ? colors.primary : colors.textSecondary;

          function onPress() {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.slot}>
              {/* collapsable={false}: sin fondo, Fabric aplana la píldora y al activarse pierde forma y hermanos. */}
              <View
                collapsable={false}
                style={[styles.pill, focused && { backgroundColor: colors.brandSubtle, paddingHorizontal: spacing.lg }]}>
                {tabIcons ? (
                  <MaterialCommunityIcons name={focused ? tabIcons.activeIcon : tabIcons.icon} size={24} color={color} />
                ) : null}
                {focused ? (
                  <TabLabel label={label} color={color} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Etiqueta de la pestaña activa: aparece con un fundido breve al montarse. */
function TabLabel({ label, color }: { label: string; color: string }) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    // withTiming respeta por defecto la preferencia de movimiento reducido del sistema.
    opacity.value = withTiming(1, { duration: 200 });
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text numberOfLines={1} style={[typography.label, styles.label, { color }, animated]}>
      {label}
    </Animated.Text>
  );
}

function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return open;
}

const styles = StyleSheet.create({
  outer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  bar: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  // Mismo estilo para todas (cambiar flex entre renders deja anchos obsoletos en Fabric):
  // cada una parte del ancho de su contenido y el espacio sobrante se reparte por igual.
  slot: { flexGrow: 1, flexBasis: 'auto', minHeight: minTouchTarget + spacing.sm, alignItems: 'center', justifyContent: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  label: { flexShrink: 1 },
});
