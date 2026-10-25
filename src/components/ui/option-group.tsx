import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface OptionGroupProps<T extends string> {
  title: string;
  options: readonly Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

/** Grupo de selección única con semántica de radio para lectores de pantalla. */
export function OptionGroup<T extends string>({ title, options, selected, onSelect }: OptionGroupProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel={title}>
      <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {options.map((option, index) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.row,
                index > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
                pressed && { backgroundColor: colors.surfaceSecondary },
              ]}>
              <Text style={[typography.body, styles.label, { color: colors.textPrimary }]}>{option.label}</Text>
              <MaterialCommunityIcons
                name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={isSelected ? colors.primary : colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  list: { borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  row: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { flex: 1 },
});
