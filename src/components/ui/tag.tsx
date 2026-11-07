import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { spacing, tagShape, typography } from '@/theme/tokens';

type Icon = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Tone = 'primary' | 'attention' | 'ink';

function useTone(tone: Tone) {
  const { colors } = useTheme();
  if (tone === 'attention') return { fill: colors.attention, on: colors.onAttention };
  if (tone === 'ink') return { fill: colors.ink, on: colors.onInk };
  return { fill: colors.primary, on: colors.onPrimary };
}

interface MainTagProps {
  tone?: Tone;
  /** Color de lo que hay detrás: el ojal lo deja ver. */
  backdrop: string;
  hanging?: boolean;
  children: (onColor: string) => ReactNode;
}

/** Etiqueta principal: máximo una por pantalla. Crece en alto con el contenido; nunca fija el tamaño del texto. */
export function MainTag({ tone = 'primary', backdrop, hanging, children }: MainTagProps) {
  const { colors } = useTheme();
  const { fill, on } = useTone(tone);
  return (
    <View>
      {hanging ? <View style={[styles.string, { backgroundColor: colors.textPrimary }]} /> : null}
      <View style={[styles.main, tagShape.main, { backgroundColor: fill }]}>
        <View style={[styles.mainEyelet, { backgroundColor: backdrop }]} />
        <View style={styles.mainBody}>{children(on)}</View>
      </View>
    </View>
  );
}

/** Etiqueta compacta: solo cantidades que piden atención. El icono y el texto dicen el estado sin depender del color. */
export function CompactTag({ tone, icon, label, backdrop }: { tone: Exclude<Tone, 'primary'>; icon: Icon; label: string; backdrop: string }) {
  const { fill, on } = useTone(tone);
  return (
    <View style={[styles.compact, tagShape.compact, { backgroundColor: fill }]}>
      <View style={[styles.compactEyelet, { backgroundColor: backdrop }]} />
      <MaterialCommunityIcons name={icon} size={14} color={on} />
      <Text style={[typography.quantity, styles.compactText, { color: on }]}>{label}</Text>
    </View>
  );
}

/** Etiqueta en blanco de los estados vacíos. */
export function EmptyTag() {
  const { colors } = useTheme();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.emptyWrap}>
      <View style={[styles.string, styles.emptyString, { backgroundColor: colors.textSecondary }]} />
      <View style={[styles.empty, tagShape.main, { borderColor: colors.textSecondary }]}>
        <View style={[styles.emptyEyelet, { borderColor: colors.textSecondary }]} />
      </View>
    </View>
  );
}

/** Representación predeterminada de un elemento sin imagen: el ojal en contorno. */
export function EyeletPlaceholder({ size = 44 }: { size?: number }) {
  const { colors } = useTheme();
  const eye = Math.round(size * 0.27);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceRaised }]}>
      <View style={{ width: eye, height: eye, borderRadius: eye / 2, borderWidth: 2, borderColor: colors.textSecondary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  string: { width: 2, height: 16, marginLeft: 27 },
  main: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingLeft: spacing.xl, paddingRight: spacing.lg, gap: spacing.lg },
  mainEyelet: { width: 16, height: 16, borderRadius: 8 },
  mainBody: { flex: 1, gap: spacing.xs },
  compact: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, gap: spacing.xs, paddingVertical: 5, paddingLeft: spacing.sm, paddingRight: 10 },
  compactEyelet: { width: 6, height: 6, borderRadius: 3 },
  compactText: { flexShrink: 1 },
  emptyWrap: { alignItems: 'center' },
  emptyString: { marginLeft: 0 },
  empty: { width: 170, height: 88, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', paddingLeft: spacing.xl },
  emptyEyelet: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
});
