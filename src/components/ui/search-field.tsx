import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

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
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  // Android cierra el teclado con «atrás» sin quitar el foco; el campo quedaba resaltado y el borrado lo conservaba.
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidHide', () => input.current?.blur());
    return () => sub.remove();
  }, []);

  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.surface, borderColor: focused ? colors.primaryText : colors.surface },
      ]}>
      <MaterialCommunityIcons name="magnify" size={22} color={colors.textSecondary} />
      <TextInput
        ref={input}
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
        cursorColor={colors.primaryText}
        selectionColor={colors.fieldBorder}
        style={[typography.body, styles.input, { color: colors.textPrimary }]}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
          hitSlop={8}
          onPress={() => {
            onChangeText('');
            // Con el teclado abierto se conserva el foco para escribir otra búsqueda; cerrado, el campo vuelve a reposo.
            if (!Keyboard.isVisible()) input.current?.blur();
          }}
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
    borderRadius: radius.pill,
    borderWidth: 2,
    paddingLeft: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: { flex: 1, paddingVertical: spacing.md },
  clear: { width: minTouchTarget, height: minTouchTarget, alignItems: 'center', justifyContent: 'center' },
});
