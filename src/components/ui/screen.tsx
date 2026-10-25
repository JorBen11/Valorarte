import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { spacing, typography } from '@/theme/tokens';

interface ScreenProps {
  title: string;
  children?: ReactNode;
}

/** Contenedor de pantalla de pestaña: área segura, título y contenido desplazable. */
export function Screen({ title, children }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={[typography.screenTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.xxl },
});
