import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { spacing, typography } from '@/theme/tokens';

import { Button, type ButtonVariant } from './button';
import { Spinner } from './spinner';

interface StateViewProps {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Color del icono; por defecto, texto secundario. */
  iconColor?: string;
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void; variant?: ButtonVariant; icon?: ComponentProps<typeof MaterialCommunityIcons>['name'] };
}

/** Estado vacío, de error o no disponible: explica la situación y ofrece como mucho una acción. */
export function StateView({ icon, iconColor, title, message, action }: StateViewProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWell, { backgroundColor: colors.brandSubtle }]}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={iconColor ?? colors.textSecondary}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <View style={styles.text}>
        <Text accessibilityRole="header" style={[typography.sectionTitle, styles.center, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {message ? (
          <Text style={[typography.body, styles.center, { color: colors.textSecondary }]}>{message}</Text>
        ) : null}
      </View>
      {action ? <Button label={action.label} onPress={action.onPress} variant={action.variant ?? 'primary'} icon={action.icon} /> : null}
    </View>
  );
}

/** Carga inicial de una sección: indicador de marca con texto contextual, no bloquea el resto de la app. */
export function LoadingView({ message }: { message: string }) {
  const { colors } = useTheme();

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={message} style={styles.container}>
      <Spinner color={colors.primary} size={32} />
      <Text style={[typography.body, styles.center, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xl, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg },
  iconWell: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  text: { gap: spacing.sm, maxWidth: 320 },
  center: { textAlign: 'center' },
});
