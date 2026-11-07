import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { SHEET_MAX_WIDTH } from '@/theme/layout';
import { radius, spacing, typography } from '@/theme/tokens';

import { Button, type ButtonVariant } from './button';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
}

interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  /** De la secundaria a la principal; la última queda a la derecha (o abajo si no caben). */
  actions: readonly DialogAction[];
  /** Botón Atrás de Android o toque en el velo; equivale a la acción segura. */
  onDismiss: () => void;
}

/** Diálogo propio de la marca para confirmaciones, avisos y errores; sustituye a Alert.alert. */
export function Dialog({ visible, title, message, actions, onDismiss }: DialogProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={onDismiss}>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actions[0]?.label}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
          onPress={onDismiss}
        />
        <View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[styles.card, { backgroundColor: colors.surface }]}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
            <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
              {title}
            </Text>
            {message ? <Text style={[typography.body, { color: colors.textSecondary }]}>{message}</Text> : null}
          </ScrollView>
          <View style={styles.actions}>
            {actions.map((action) => (
              <Button key={action.label} label={action.label} onPress={action.onPress} variant={action.variant ?? 'text'} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
    flexShrink: 1,
    borderRadius: radius.sheet,
    padding: spacing.xxl,
    gap: spacing.md,
  },
  scroll: { flexGrow: 0 },
  body: { gap: spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
});
