import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, spacing, typography } from '@/theme/tokens';

import { BottomSheet } from './bottom-sheet';
import type { Choice } from './choice-chips';

interface OptionSheetProps<T extends string> {
  visible: boolean;
  title: string;
  options: readonly Choice<T>[];
  selected: T;
  onSelect: (value: T) => void;
  onClose: () => void;
}

/** Hoja inferior de selección única; elegir una opción la aplica y cierra la hoja. */
export function OptionSheet<T extends string>({ visible, title, options, selected, onSelect, onClose }: OptionSheetProps<T>) {
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <ScrollView accessibilityRole="radiogroup">
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              android_ripple={{ color: colors.brandSubtle }}
              style={[styles.option, isSelected && { backgroundColor: colors.brandSubtle }]}>
              {option.icon ? (
                <MaterialCommunityIcons
                  name={option.icon}
                  size={20}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
              ) : null}
              <Text
                style={[
                  isSelected ? typography.itemTitle : typography.body,
                  styles.label,
                  { color: isSelected ? colors.primary : colors.textPrimary },
                ]}>
                {option.label}
              </Text>
              {isSelected ? <MaterialCommunityIcons name="check" size={22} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: minTouchTarget + 4,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { flex: 1 },
});
