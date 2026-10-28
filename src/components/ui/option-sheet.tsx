import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

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
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable accessibilityLabel={title} style={[styles.scrim, { backgroundColor: colors.scrim }]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text accessibilityRole="header" style={[typography.sectionTitle, styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1 },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: spacing.md },
  title: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  option: {
    minHeight: minTouchTarget + 4,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: { flex: 1 },
});
