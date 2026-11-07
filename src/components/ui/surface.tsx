import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography, type ThemeColors } from '@/theme/tokens';

type Icon = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Grupo neutro de filas o datos. No es una tarjeta por elemento: agrupa varios. */
export function Surface({ children, padded, style }: { children: ReactNode; padded?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return <View style={[styles.surface, padded && styles.padded, { backgroundColor: colors.surface }, style]}>{children}</View>;
}

export function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

interface IconButtonProps {
  icon: Icon;
  /** Obligatoria: el botón no tiene texto visible. */
  accessibilityLabel: string;
  onPress: () => void;
  bare?: boolean;
  /** Muestra un punto cuando el control no está en su valor predeterminado. */
  marked?: boolean;
}

/** Acción de solo icono en un círculo neutro. */
export function IconButton({ icon, accessibilityLabel, onPress, bare, marked }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceRaised, borderless: bare }}
      style={[styles.iconButton, !bare && { backgroundColor: colors.surface }]}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.textPrimary} />
      {marked ? <View style={[styles.mark, { backgroundColor: colors.primaryText, borderColor: colors.surface }]} /> : null}
    </Pressable>
  );
}

type MessageKind = 'success' | 'warning' | 'info' | 'error';
const MESSAGE_ICONS: Record<MessageKind, Icon> = {
  success: 'check-circle-outline',
  warning: 'alert-outline',
  info: 'information-outline',
  error: 'alert-circle-outline',
};
const MESSAGE_SURFACE: Record<MessageKind, keyof ThemeColors> = {
  success: 'successSurface',
  warning: 'warningSurface',
  info: 'infoSurface',
  error: 'errorSurface',
};

/** Estado de una operación, con icono y texto. No se usa para estados de inventario ni para valorar cifras. */
export function StatusMessage({ kind, message }: { kind: MessageKind; message: string }) {
  const { colors } = useTheme();
  const color = colors[kind];
  return (
    <View accessibilityLiveRegion="polite" style={[styles.message, { backgroundColor: colors[MESSAGE_SURFACE[kind]] }]}>
      <MaterialCommunityIcons name={MESSAGE_ICONS[kind]} size={18} color={color} />
      <Text style={[typography.caption, styles.messageText, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: { borderRadius: radius.group, overflow: 'hidden' },
  padded: { padding: spacing.lg, gap: spacing.md },
  divider: { height: StyleSheet.hairlineWidth },
  iconButton: { width: minTouchTarget, height: minTouchTarget, borderRadius: minTouchTarget / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mark: { position: 'absolute', top: 9, right: 9, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  message: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', padding: spacing.md, borderRadius: radius.control },
  messageText: { flex: 1 },
});
