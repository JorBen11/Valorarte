import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-provider';
import { radius, spacing, typography } from '@/theme/tokens';

interface BottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Hoja inferior de marca: velo que cierra al tocar, asa y título. El contenido decide su propio padding. */
export function BottomSheet({ visible, title, onClose, children }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable accessibilityLabel={title} style={[styles.scrim, { backgroundColor: colors.scrim }]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text accessibilityRole="header" style={[typography.sectionTitle, styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1 },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: spacing.md },
  title: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});
