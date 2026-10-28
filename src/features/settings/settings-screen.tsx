import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionSheet } from '@/components/ui/option-sheet';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { LANGUAGE_PREFERENCES } from '@/i18n/languages';
import { THEME_PREFERENCES, type ThemePreference } from '@/theme/resolve-color-scheme';
import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, spacing, typography } from '@/theme/tokens';

import { usePreferencesStore } from './preferences-store';

const THEME_ICONS: Record<ThemePreference, 'theme-light-dark' | 'white-balance-sunny' | 'weather-night'> = {
  system: 'theme-light-dark',
  light: 'white-balance-sunny',
  dark: 'weather-night',
};

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const theme = usePreferencesStore((s) => s.theme);
  const language = usePreferencesStore((s) => s.language);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const [languageOpen, setLanguageOpen] = useState(false);

  const languageTitle = t('settings.language.title');
  const languageOptions = LANGUAGE_PREFERENCES.map((value) => ({ value, label: t(`settings.language.${value}`) }));
  const languageValue = t(`settings.language.${language}`);

  return (
    <Screen title={t('settings.title')}>
      <View>
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
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {/* El idioma se cambia rara vez: basta con ver el valor actual y abrir la lista al pulsar. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${languageTitle}: ${languageValue}`}
          accessibilityState={{ expanded: languageOpen }}
          onPress={() => setLanguageOpen(true)}
          android_ripple={{ color: colors.brandSubtle }}
          style={styles.row}>
          <MaterialCommunityIcons name="translate" size={20} color={colors.textSecondary} />
          <Text style={[typography.label, styles.rowLabel, { color: colors.textPrimary }]}>{languageTitle}</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>{languageValue}</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </Pressable>
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

const styles = StyleSheet.create({
  divider: { height: 1, marginTop: spacing.xl, marginBottom: spacing.xs },
  row: { minHeight: minTouchTarget + spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowLabel: { flex: 1 },
});
