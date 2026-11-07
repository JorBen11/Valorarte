import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

import type { Choice } from './choice-chips';
import { OptionSheet } from './option-sheet';

interface SelectFieldProps<T extends string> {
  label: string;
  options: readonly Choice<T>[];
  selected: T;
  onSelect: (value: T) => void;
  hint?: string;
}

/** Selector desplegable: muestra solo el valor elegido y abre una hoja con todas las opciones. */
export function SelectField<T extends string>({ label, options, selected, onSelect, hint }: SelectFieldProps<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === selected)?.label ?? '';
  const disabled = options.length < 2;

  return (
    <View style={styles.container}>
      <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current}`}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        android_ripple={{ color: colors.surfaceRaised }}
        style={[
          styles.field,
          { backgroundColor: disabled ? colors.surfaceRaised : colors.surface, borderColor: colors.fieldBorder },
        ]}>
        <Text style={[typography.body, styles.value, { color: colors.textPrimary }]}>{current}</Text>
        {disabled ? null : <MaterialCommunityIcons name="chevron-down" size={22} color={colors.textSecondary} />}
      </Pressable>
      {hint ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{hint}</Text> : null}
      <OptionSheet
        visible={open}
        title={label}
        options={options}
        selected={selected}
        onSelect={onSelect}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  field: {
    minHeight: minTouchTarget,
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  value: { flex: 1 },
});
