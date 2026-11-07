import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  clearLabel: string;
}

/** Búsqueda en un listado: lupa, placeholder como etiqueta y botón para limpiar cuando hay texto. */
export function SearchField({ value, onChangeText, placeholder, clearLabel }: SearchFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.surface, borderColor: focused ? colors.primary : colors.fieldBorder },
      ]}>
      <MaterialCommunityIcons name="magnify" size={22} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        accessibilityRole="search"
        returnKeyType="search"
        autoCorrect={false}
        placeholderTextColor={colors.textSecondary}
        cursorColor={colors.primary}
        selectionColor={colors.brandSubtle}
        style={[typography.body, styles.input, { color: colors.textPrimary }]}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
          hitSlop={8}
          onPress={() => onChangeText('')}
          style={styles.clear}>
          <MaterialCommunityIcons name="close-circle" size={20} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minHeight: minTouchTarget,
    borderRadius: radius.control,
    borderWidth: 1,
    paddingLeft: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: { flex: 1, paddingVertical: spacing.md },
  clear: { width: minTouchTarget - 8, height: minTouchTarget - 8, alignItems: 'center', justifyContent: 'center' },
});
