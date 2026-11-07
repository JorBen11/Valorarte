import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LARGE_TEXT_SCALE, RAIL_WIDTH, useWindowLayout } from '@/theme/layout';
import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export interface TabIcons {
  icon: IconName;
  activeIcon: IconName;
}

/**
 * Navegación principal: cuatro iconos siempre visibles y etiqueta solo en la sección activa.
 * Barra inferior en ventanas compactas; carril lateral desde 600 dp.
 */
export function FloatingTabBar({ state, descriptors, emitter, navigateToTab, icons }: TabBarProps & { icons: Record<string, TabIcons> }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { sideNavigation: rail, fontScale } = useWindowLayout();
  const stackLabel = rail || fontScale >= LARGE_TEXT_SCALE;
  const keyboardOpen = useKeyboardOpen();

  // En Android el teclado empuja la ventana: se oculta la barra para dejar sitio al campo activo.
  if (!rail && keyboardOpen && Platform.OS === 'android') return null;

  const outer = rail
    ? { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg, paddingLeft: insets.left + spacing.sm, paddingRight: spacing.sm, width: RAIL_WIDTH + insets.left }
    : { paddingLeft: insets.left + spacing.md, paddingRight: insets.right + spacing.md, paddingTop: spacing.xs, paddingBottom: Math.max(insets.bottom, spacing.md) };

  return (
    <View accessibilityRole="tablist" style={[rail ? styles.rail : styles.bar, { backgroundColor: colors.background }, outer]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === 'string' ? options.title : route.name;
        const tabIcons = icons[route.name];
        const color = focused ? colors.textPrimary : colors.textSecondary;

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
            style={rail ? styles.railSlot : styles.slot}>
            {/* collapsable={false}: sin fondo, Fabric aplana la píldora y al activarse pierde forma y hermanos. */}
            <View
              collapsable={false}
              style={[stackLabel ? styles.railPill : styles.pill, focused && { backgroundColor: colors.surface }]}>
              {tabIcons ? (
                <MaterialCommunityIcons name={focused ? tabIcons.activeIcon : tabIcons.icon} size={24} color={color} />
              ) : null}
              {focused ? <TabLabel label={label} color={color} centered={stackLabel} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Etiqueta de la pestaña activa: aparece con un fundido breve al montarse. */
function TabLabel({ label, color, centered }: { label: string; color: string; centered: boolean }) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    // withTiming respeta por defecto la preferencia de movimiento reducido del sistema.
    opacity.value = withTiming(1, { duration: 200 });
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text style={[typography.label, styles.label, centered && styles.centered, { color }, animated]}>
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
  bar: { flexDirection: 'row', gap: 2 },
  rail: { gap: spacing.sm },
  // Mismo estilo para todas (cambiar flex entre renders deja anchos obsoletos en Fabric):
  // cada una parte del ancho de su contenido y el espacio sobrante se reparte por igual.
  // flexShrink con mínimo: con letra grande la etiqueta activa cede espacio y ningún icono sale de pantalla.
  slot: { flexGrow: 1, flexShrink: 1, flexBasis: 'auto', minWidth: minTouchTarget, minHeight: minTouchTarget + spacing.xs, alignItems: 'center', justifyContent: 'center' },
  railSlot: { minHeight: minTouchTarget, alignItems: 'stretch', justifyContent: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: minTouchTarget,
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  railPill: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs, minHeight: minTouchTarget, padding: spacing.sm, borderRadius: radius.group },
  label: { flexShrink: 1 },
  centered: { textAlign: 'center' },
});
