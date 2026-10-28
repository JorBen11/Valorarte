import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { spacing, typography } from '@/theme/tokens';

interface ScreenProps {
  title: string;
  /** Dato breve junto al título (por ejemplo, un recuento). */
  titleAccessory?: ReactNode;
  children?: ReactNode;
  /** Elemento flotante sobre el contenido (por ejemplo, un FAB). */
  overlay?: ReactNode;
  /** Espacio extra al final del scroll para que el contenido no quede bajo el overlay. */
  bottomInset?: number;
}

/** Contenedor de pantalla de pestaña: área segura, título grande y contenido desplazable. */
export function Screen({ title, titleAccessory, children, overlay, bottomInset = 0 }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxxl + bottomInset }]}>
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={[typography.screenTitle, styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {titleAccessory}
        </View>
        {children}
      </ScrollView>
      {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, gap: spacing.xxl },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  title: { flexShrink: 1 },
});
