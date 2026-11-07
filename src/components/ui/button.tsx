import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, tagShape, typography, type ThemeColors } from '@/theme/tokens';

import { Spinner } from './spinner';

/** `destructive` confirma la acción con relleno; `destructiveText` la propone antes de confirmar. */
export type ButtonVariant = 'primary' | 'tonal' | 'text' | 'destructive' | 'destructiveText';

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
      return { background: c.primary, text: c.onPrimary };
    case 'tonal':
      return { background: c.surface, text: c.textPrimary };
    case 'text':
      return { background: 'transparent', text: c.textPrimary };
    case 'destructive':
      return { background: c.error, text: c.onError };
    case 'destructiveText':
      return { background: 'transparent', text: c.error };
  }
}

/** Jerarquía: primaria (una por pantalla, con eco de etiqueta), tonal (secundaria), texto (terciaria) y destructivas. */
export function Button({ label, onPress, variant = 'primary', loading = false, disabled = false, icon }: ButtonProps) {
  const { colors } = useTheme();
  const v = variantColors(variant, colors);
  const inactive = disabled || loading;
  const filled = variant !== 'text' && variant !== 'destructiveText';
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
      android_ripple={{ color: variant === 'primary' || variant === 'destructive' ? colors.border : colors.surfaceRaised }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.rounded,
        { backgroundColor: background },
        pressed && Platform.OS === 'ios' && styles.pressed,
      ]}>
      {loading ? (
        <Spinner color={v.text} />
      ) : (
        <>
          {icon ? <MaterialCommunityIcons name={icon} size={20} color={textColor} /> : null}
          <Text style={[typography.button, styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primary: { minHeight: 56, ...tagShape.primaryButton },
  rounded: { borderRadius: radius.pill },
  label: { flexShrink: 1, textAlign: 'center' },
  pressed: { opacity: 0.8 },
});
