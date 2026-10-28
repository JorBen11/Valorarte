import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, tabularNumbers, typography } from '@/theme/tokens';

interface TextFieldProps extends Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'maxLength' | 'multiline'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  hint?: string;
  error?: string;
  /** Texto fijo dentro del campo, a la derecha (por ejemplo, la unidad). */
  suffix?: string;
}

/** Campo con etiqueta visible, foco de marca y error junto al campo. */
export function TextField({ label, value, onChangeText, hint, error, suffix, ...inputProps }: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : focused ? colors.primary : colors.fieldBorder;
  const numeric = inputProps.keyboardType === 'decimal-pad' || inputProps.keyboardType === 'numeric';

  return (
    <View style={styles.container}>
      <Text style={[typography.label, { color: colors.textPrimary }]}>{label}</Text>
      <View
        style={[
          styles.field,
          inputProps.multiline && styles.multiline,
          // El borde crece a 2 px con foco o error; el padding compensa para no desplazar el texto.
          { backgroundColor: colors.surface, borderColor, borderWidth: focused || error ? 2 : 1 },
          { paddingHorizontal: focused || error ? spacing.lg - 1 : spacing.lg },
        ]}>
        <TextInput
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={suffix ? `${label} (${suffix})` : label}
          accessibilityHint={error ?? hint}
          placeholderTextColor={colors.textSecondary}
          cursorColor={colors.primary}
          selectionColor={colors.brandSubtle}
          style={[
            typography.body,
            styles.input,
            numeric && tabularNumbers,
            inputProps.multiline && styles.multilineInput,
            { color: colors.textPrimary },
          ]}
        />
        {suffix ? <Text style={[typography.label, { color: colors.textSecondary }]}>{suffix}</Text> : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={[typography.caption, { color: colors.error }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  field: {
    minHeight: minTouchTarget,
    borderRadius: radius.control,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: { flex: 1, paddingVertical: spacing.md },
  multiline: { minHeight: 104, alignItems: 'flex-start' },
  multilineInput: { textAlignVertical: 'top' },
});
