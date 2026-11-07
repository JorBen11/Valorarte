import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SHEET_MAX_WIDTH, useWindowLayout } from '@/theme/layout';
import { useTheme } from '@/theme/theme-provider';
import { radius, spacing, typography } from '@/theme/tokens';

interface BottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Hoja inferior en ventanas compactas; diálogo centrado desde 600 dp. El contenido decide su propio padding. */
export function BottomSheet({ visible, title, onClose, children }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { sideNavigation: centered, height, isShort } = useWindowLayout();
  // Limita el alto en dp y deja el contenido desplazable: en ventanas bajas usa casi toda la altura.
  const maxHeight = height * (isShort ? 0.95 : centered ? 0.85 : 0.75) - (isShort ? insets.top : 0);

  return (
    <Modal visible={visible} transparent animationType={centered ? 'fade' : 'slide'} statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <View style={[styles.root, centered && styles.centered]}>
        <Pressable accessibilityLabel={title} style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} onPress={onClose} />
        <View
          style={[
            centered ? styles.dialog : styles.sheet,
            { backgroundColor: colors.surface, maxHeight, paddingBottom: (centered ? 0 : insets.bottom) + spacing.lg, paddingLeft: centered ? 0 : insets.left, paddingRight: centered ? 0 : insets.right },
          ]}>
          {centered ? <View style={styles.dialogTop} /> : <View style={[styles.handle, { backgroundColor: colors.border }]} />}
          <Text accessibilityRole="header" style={[typography.sectionTitle, styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  centered: { justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  sheet: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: spacing.sm },
  dialog: { width: '100%', maxWidth: SHEET_MAX_WIDTH, borderRadius: radius.sheet },
  dialogTop: { height: spacing.lg },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: spacing.md },
  title: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});
