import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { spacing } from '@/theme/tokens';

interface FabProps {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Nombre accesible obligatorio: el botón no tiene texto visible. */
  accessibilityLabel: string;
  onPress: () => void;
}

const SIZE = 56;

/** Acción principal flotante; se coloca sobre el contenido, en la esquina inferior derecha. */
export function Fab({ icon, accessibilityLabel, onPress }: FabProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { shadowColor: colors.scrim }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        android_ripple={{ color: colors.border, borderless: false }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary },
          pressed && Platform.OS === 'ios' && styles.pressed,
        ]}>
        <MaterialCommunityIcons name={icon} size={28} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

export const FAB_CLEARANCE = SIZE + spacing.xl * 2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    borderRadius: SIZE / 2,
    // Recorta el ripple de Android al círculo; la sombra de elevación no se ve afectada.
    overflow: 'hidden',
    elevation: 4,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85 },
});
