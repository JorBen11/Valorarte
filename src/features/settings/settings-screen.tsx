import { useTranslation } from 'react-i18next';

import { OptionGroup } from '@/components/ui/option-group';
import { Screen } from '@/components/ui/screen';
import { LANGUAGE_PREFERENCES } from '@/i18n/languages';
import { THEME_PREFERENCES } from '@/theme/resolve-color-scheme';

import { usePreferencesStore } from './preferences-store';

export function SettingsScreen() {
  const { t } = useTranslation();
  const theme = usePreferencesStore((s) => s.theme);
  const language = usePreferencesStore((s) => s.language);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  return (
    <Screen title={t('settings.title')}>
      <OptionGroup
        title={t('settings.appearance.title')}
        options={THEME_PREFERENCES.map((value) => ({ value, label: t(`settings.appearance.${value}`) }))}
        selected={theme}
        onSelect={setTheme}
      />
      <OptionGroup
        title={t('settings.language.title')}
        options={LANGUAGE_PREFERENCES.map((value) => ({ value, label: t(`settings.language.${value}`) }))}
        selected={language}
        onSelect={setLanguage}
      />
    </Screen>
  );
}
