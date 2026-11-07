import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

import type { Choice } from './choice-chips';

interface SegmentedControlProps<T extends string> {
  label: string;
  /** Icono de la categoría junto a la etiqueta, cuando ayuda a localizarla (por ejemplo, en Ajustes). */
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  options: readonly Choice<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

/**
 * Dos o tres opciones excluyentes que se cambian rápido. Si las opciones traen icono, se apila sobre el texto.
 * Las etiquetas nunca se recortan: con letra grande las opciones pasan a una lista vertical.
 */
export function SegmentedControl<T extends string>({ label, icon, options, selected, onSelect }: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale >= 1.5;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon ? <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} /> : null}
        <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={[styles.track, stacked && styles.stacked, { backgroundColor: colors.surface }]}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          const color = isSelected ? colors.background : colors.textPrimary;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              style={[
                styles.segment,
                !stacked && styles.segmentRow,
                option.icon && !stacked && styles.segmentWithIcon,
                stacked && styles.segmentStacked,
                isSelected && { backgroundColor: colors.textPrimary },
              ]}>
              {option.icon ? (
                <MaterialCommunityIcons name={option.icon} size={22} color={isSelected ? colors.background : colors.textSecondary} />
              ) : null}
              <Text style={[typography.label, styles.text, { color }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  track: { flexDirection: 'row', padding: spacing.xs, gap: spacing.xs, borderRadius: radius.group },
  stacked: { flexDirection: 'column' },
  segment: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.group - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentRow: { flex: 1 },
  segmentWithIcon: { minHeight: minTouchTarget + spacing.md, paddingVertical: spacing.sm, gap: 2 },
  segmentStacked: { flexDirection: 'row', justifyContent: 'flex-start', gap: spacing.md, paddingHorizontal: spacing.lg },
  text: { flexShrink: 1, textAlign: 'center' },
});
