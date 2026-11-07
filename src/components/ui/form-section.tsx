import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { spacing, typography } from '@/theme/tokens';

/** Agrupa campos relacionados de un formulario bajo un encabezado breve. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <View style={[styles.rule, { backgroundColor: colors.border }]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
});
