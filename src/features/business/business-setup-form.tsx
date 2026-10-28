import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ChoiceChips } from '@/components/ui/choice-chips';
import { FormSection } from '@/components/ui/form-section';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import type { SqlDatabase } from '@/data/database/database';
import {
  BUSINESS_CATEGORIES,
  PREFERRED_UNIT_SYSTEMS,
  type BusinessCategory,
  type PreferredUnitSystem,
} from '@/domain/business';
import { DomainValidationError } from '@/domain/validation';
import { registerBusiness } from '@/features/ingredients/ingredient-use-cases';
import { fieldErrors } from '@/features/validation-messages';
import { useTheme } from '@/theme/theme-provider';
import { spacing, typography } from '@/theme/tokens';

const CATEGORY_ICONS: Record<BusinessCategory, ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  food: 'silverware-fork-knife',
  handmade: 'palette-outline',
  services: 'briefcase-outline',
  resale: 'tag-outline',
};

interface BusinessSetupFormProps {
  db: SqlDatabase;
  onCreated: () => void;
}

/** Alta del negocio del dispositivo, necesaria antes de registrar ingredientes. */
export function BusinessSetupForm({ db, onCreated }: BusinessSetupFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [unitSystem, setUnitSystem] = useState<PreferredUnitSystem>('metric');
  const [category, setCategory] = useState<BusinessCategory>('food');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setFormError(null);
    try {
      await registerBusiness(db, {
        name,
        countryCode,
        currencyCode,
        preferredUnitSystem: unitSystem,
        businessCategory: category,
      });
      onCreated();
    } catch (error) {
      if (error instanceof DomainValidationError) setErrors(fieldErrors(error, t));
      else setFormError(t('common.saveError'));
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <View style={styles.intro}>
        <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
          {t('business.setup.title')}
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>{t('business.setup.description')}</Text>
      </View>
      <TextField label={t('business.setup.name')} value={name} onChangeText={setName} error={errors.name} />
      <FormSection title={t('business.setup.section.region')}>
        <View style={styles.codes}>
          <View style={styles.code}>
            <TextField
              label={t('business.setup.countryCode')}
              hint={t('business.setup.countryHint')}
              value={countryCode}
              onChangeText={setCountryCode}
              autoCapitalize="characters"
              maxLength={2}
              error={errors.countryCode}
            />
          </View>
          <View style={styles.code}>
            <TextField
              label={t('business.setup.currencyCode')}
              hint={t('business.setup.currencyHint')}
              value={currencyCode}
              onChangeText={setCurrencyCode}
              autoCapitalize="characters"
              maxLength={3}
              error={errors.currencyCode}
            />
          </View>
        </View>
      </FormSection>
      <FormSection title={t('business.setup.section.operation')}>
        <SegmentedControl
          label={t('business.setup.unitSystem')}
          options={PREFERRED_UNIT_SYSTEMS.map((value) => ({
            value,
            label: t(`business.unitSystem.${value}`),
          }))}
          selected={unitSystem}
          onSelect={setUnitSystem}
        />
        <ChoiceChips
          label={t('business.setup.category')}
          options={BUSINESS_CATEGORIES.map((value) => ({
            value,
            label: t(`business.category.${value}`),
            icon: CATEGORY_ICONS[value],
          }))}
          selected={category}
          onSelect={setCategory}
        />
      </FormSection>
      {formError ? <Text style={[typography.caption, { color: colors.error }]}>{formError}</Text> : null}
      <Button label={t('business.setup.submit')} onPress={submit} loading={saving} icon="check" />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.xxxl },
  intro: { gap: spacing.sm },
  codes: { flexDirection: 'row', gap: spacing.md },
  code: { flex: 1 },
});
