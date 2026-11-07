import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionSheet } from '@/components/ui/option-sheet';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Divider, Surface } from '@/components/ui/surface';
import { useDatabase } from '@/data/database/database-provider';
import type { Business } from '@/domain/business';
import { loadIngredientsOverview } from '@/features/ingredients/ingredient-use-cases';
import { LANGUAGE_PREFERENCES } from '@/i18n/languages';
import { THEME_PREFERENCES, type ThemePreference } from '@/theme/resolve-color-scheme';
import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, spacing, typography } from '@/theme/tokens';

import { usePreferencesStore } from './preferences-store';

type Icon = ComponentProps<typeof MaterialCommunityIcons>['name'];

const THEME_ICONS: Record<ThemePreference, Icon> = {
  system: 'theme-light-dark',
  light: 'white-balance-sunny',
  dark: 'weather-night',
};

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useDatabase();
  const theme = usePreferencesStore((s) => s.theme);
  const language = usePreferencesStore((s) => s.language);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [business, setBusiness] = useState<Business | null | 'error'>(null);

  useFocusEffect(
    useCallback(() => {
      if (database.status !== 'ready') return;
      loadIngredientsOverview(database.db).then((o) => setBusiness(o.business), () => setBusiness('error'));
    }, [database]),
  );

  const languageTitle = t('settings.language.title');
  const languageOptions = LANGUAGE_PREFERENCES.map((value) => ({ value, label: t(`settings.language.${value}`) }));
  const languageValue = t(`settings.language.${language}`);

  return (
    <Screen title={t('settings.title')} width="form">
      {/* Apariencia se compara visualmente: las tres opciones quedan a la vista con su icono. */}
      <SegmentedControl
        label={t('settings.appearance.title')}
        icon="palette-outline"
        options={THEME_PREFERENCES.map((value) => ({
          value,
          label: t(`settings.appearance.${value}`),
          icon: THEME_ICONS[value],
        }))}
        selected={theme}
        onSelect={setTheme}
      />
      {/* El idioma se cambia rara vez: basta con ver el valor actual y abrir la lista al pulsar. */}
      <Surface>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${languageTitle}: ${languageValue}`}
          accessibilityState={{ expanded: languageOpen }}
          onPress={() => setLanguageOpen(true)}
          android_ripple={{ color: colors.surfaceRaised }}
          style={styles.row}>
          <MaterialCommunityIcons name="translate" size={20} color={colors.textSecondary} />
          <Text style={[typography.body, styles.rowLabel, { color: colors.textPrimary }]}>{languageTitle}</Text>
          <Text style={[typography.body, styles.rowValue, { color: colors.textSecondary }]}>{languageValue}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </Pressable>
      </Surface>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
          {t('settings.business.title')}
        </Text>
        {business && business !== 'error' ? (
          <Surface>
            <InfoRow icon="storefront-outline" label={t('settings.business.name')} value={business.name} />
            <Divider />
            <InfoRow icon="cash" label={t('settings.business.currency')} value={business.currencyCode} />
            <Divider />
            <InfoRow icon="scale-balance" label={t('settings.business.units')} value={t(`business.unitSystem.${business.preferredUnitSystem}`)} />
            <Divider />
            <InfoRow icon="shape-outline" label={t('settings.business.category')} value={t(`business.category.${business.businessCategory}`)} />
          </Surface>
        ) : (
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {t(business === 'error' ? 'common.loadError' : 'settings.business.none')}
          </Text>
        )}
      </View>

      <OptionSheet
        visible={languageOpen}
        title={languageTitle}
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
        onClose={() => setLanguageOpen(false)}
      />
    </Screen>
  );
}

function InfoRow({ icon, label, value }: { icon: Icon; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View accessible style={styles.row}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
      <Text style={[typography.body, styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      <Text style={[typography.body, styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  row: { minHeight: minTouchTarget + spacing.sm, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  rowLabel: { flexGrow: 1, flexShrink: 1, flexBasis: 110 },
  rowValue: { flexShrink: 1 },
});
