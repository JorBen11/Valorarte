import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography, type ThemeColors } from '@/theme/tokens';

import { Spinner } from './spinner';

export type ButtonVariant = 'primary' | 'tonal' | 'text' | 'destructive';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  /** Icono que acompaña al texto; el texto sigue siendo visible. */
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
}

function variantColors(variant: ButtonVariant, c: ThemeColors) {
  switch (variant) {
    case 'primary':
      return { background: c.primary, text: c.onPrimary, ripple: c.brandSubtle };
    case 'tonal':
      return { background: c.brandSubtle, text: c.primary, ripple: c.surfaceRaised };
    case 'text':
      return { background: 'transparent', text: c.primary, ripple: c.brandSubtle };
    case 'destructive':
      return { background: 'transparent', text: c.error, ripple: c.surfaceRaised };
  }
}

/** Jerarquía: primaria (una por pantalla), tonal (secundaria), texto (terciaria) y destructiva. */
export function Button({ label, onPress, variant = 'primary', loading = false, disabled = false, icon }: ButtonProps) {
  const { colors } = useTheme();
  const v = variantColors(variant, colors);
  const inactive = disabled || loading;
  const filled = variant === 'primary' || variant === 'tonal';
  // Deshabilitado no comparte aspecto con presionado: pierde el color de marca.
  const background = disabled && filled ? colors.surfaceRaised : v.background;
  const textColor = disabled ? colors.textSecondary : v.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      android_ripple={{ color: v.ripple }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background },
        pressed && Platform.OS === 'ios' && styles.pressed,
      ]}>
      {loading ? (
        <Spinner color={v.text} />
      ) : (
        <>
          {icon ? <MaterialCommunityIcons name={icon} size={20} color={textColor} /> : null}
          <Text style={[typography.button, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.control,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.8 },
});
