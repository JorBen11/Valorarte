import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

/** Dos o tres opciones excluyentes que se cambian rápido. Si las opciones traen icono, se apila sobre el texto. */
export function SegmentedControl<T extends string>({ label, icon, options, selected, onSelect }: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon ? <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} /> : null}
        <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={[styles.track, { backgroundColor: colors.surfaceRaised, borderColor: colors.fieldBorder }]}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          const color = isSelected ? colors.onPrimary : colors.textPrimary;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              style={[
                styles.segment,
                option.icon && styles.segmentWithIcon,
                isSelected && { backgroundColor: colors.primary },
              ]}>
              {option.icon ? (
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={isSelected ? colors.onPrimary : colors.textSecondary}
                />
              ) : null}
              <Text numberOfLines={1} style={[typography.label, { color }]}>
                {option.label}
              </Text>
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
  track: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radius.control,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    minHeight: minTouchTarget - 8,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.control - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentWithIcon: { minHeight: minTouchTarget + spacing.md, paddingVertical: spacing.sm, gap: 2 },
});
