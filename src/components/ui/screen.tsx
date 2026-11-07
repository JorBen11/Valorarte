import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { CONTENT_MAX_WIDTH, FORM_MAX_WIDTH, useWindowLayout } from '@/theme/layout';
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
  /** `form` limita el ancho de lectura; `content`, el de composiciones con columnas. */
  width?: 'content' | 'form';
}

/** Contenedor de pantalla de pestaña: área segura, título y contenido desplazable con ancho limitado. */
export function Screen({ title, titleAccessory, children, overlay, bottomInset = 0, width = 'content' }: ScreenProps) {
  const { colors } = useTheme();
  const layout = useWindowLayout();
  // La navegación lateral ya protege su borde; en horizontal el otro lado puede tener recorte.
  const edges: Edge[] = layout.sideNavigation ? ['top', 'right'] : ['top', 'left', 'right'];

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.gutter,
            paddingTop: layout.isShort ? spacing.sm : spacing.xl,
            paddingBottom: spacing.xxxl + bottomInset,
            maxWidth: width === 'form' ? FORM_MAX_WIDTH + layout.gutter * 2 : CONTENT_MAX_WIDTH,
          },
        ]}>
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
  content: { width: '100%', alignSelf: 'center', gap: spacing.xxl },
  // Centrado: el accesorio es un elemento con forma (pill), no texto que comparta línea base con el título.
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flexShrink: 1 },
});
