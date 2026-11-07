import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

export interface Choice<T extends string> {
  value: T;
  label: string;
  /** Solo lo muestran los chips, cuando el icono ayuda a reconocer la opción. */
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
}

interface ChoiceChipsProps<T extends string> {
  label: string;
  options: readonly Choice<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

/** Selección única con chips: pocas opciones cortas que conviene ver a la vez. */
export function ChoiceChips<T extends string>({ label, options, selected, onSelect }: ChoiceChipsProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              android_ripple={{ color: colors.surfaceRaised }}
              style={[
                styles.chip,
                isSelected
                  ? { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary }
                  : { backgroundColor: colors.surface, borderColor: colors.fieldBorder },
              ]}>
              {option.icon ? (
                <MaterialCommunityIcons
                  name={option.icon}
                  size={18}
                  color={isSelected ? colors.background : colors.textSecondary}
                />
              ) : null}
              <Text style={[typography.label, styles.text, { color: isSelected ? colors.background : colors.textPrimary }]}>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  text: { flexShrink: 1 },
  chip: {
    minHeight: minTouchTarget,
    maxWidth: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
