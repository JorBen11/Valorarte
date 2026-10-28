import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getLocales } from 'expo-localization';
import { router, Stack, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ChoiceChips } from '@/components/ui/choice-chips';
import { FormSection } from '@/components/ui/form-section';
import { SelectField } from '@/components/ui/select-field';
import { SwitchRow } from '@/components/ui/switch-row';
import { TextField } from '@/components/ui/text-field';
import { ForeignKeyViolationError } from '@/data/database/database';
import { useDatabase } from '@/data/database/database-provider';
import { BASE_UNITS, type Dimension, type UnitCode } from '@/domain/units';
import { DomainValidationError } from '@/domain/validation';
import { fieldErrors } from '@/features/validation-messages';
import { normalizeDecimalInput } from '@/i18n/format-quantity';
import { useTheme } from '@/theme/theme-provider';
import { fontFamily, minTouchTarget, spacing, typography } from '@/theme/tokens';

import { registerIngredient } from './ingredient-use-cases';
import { DIMENSION_ICONS, dimensionLabel, unitLabel, unitName, unitsOfDimension } from './unit-labels';

const DIMENSIONS = Object.keys(BASE_UNITS) as Dimension[];

export function NewIngredientScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const { businessId = '' } = useLocalSearchParams<{ businessId?: string }>();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [dimension, setDimension] = useState<Dimension>('mass');
  const [unit, setUnit] = useState<UnitCode>(BASE_UNITS.mass);
  const [threshold, setThreshold] = useState('');
  const [tracksLots, setTracksLots] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  const dirty =
    name.trim() !== '' ||
    category.trim() !== '' ||
    threshold.trim() !== '' ||
    notes.trim() !== '' ||
    tracksLots ||
    dimension !== 'mass' ||
    unit !== BASE_UNITS.mass;

  // Confirma el descarte solo si hay cambios sin guardar (botón X, gesto o botón atrás).
  const disablePrevention = usePreventRemove(dirty, ({ repeat }) => setPendingLeave(() => repeat));

  function selectDimension(value: Dimension) {
    setDimension(value);
    setUnit(BASE_UNITS[value]);
  }

  async function save() {
    if (database.status !== 'ready' || saving) return;
    setSaving(true);
    setFormError(null);
    try {
      await registerIngredient(database.db, {
        businessId,
        name,
        category,
        dimension,
        inventoryUnitCode: unit,
        lowStockThreshold: normalizeDecimalInput(threshold, getLocales()[0]?.decimalSeparator ?? '.'),
        tracksLots,
        notes,
      });
      disablePrevention();
      router.back();
    } catch (error) {
      if (error instanceof DomainValidationError) setErrors(fieldErrors(error, t));
      else setFormError(t(error instanceof ForeignKeyViolationError ? 'ingredients.new.businessMissing' : 'common.saveError'));
      setSaving(false);
    }
  }

  const unitText = unitLabel(unit, t);
  const optional = (label: string) => t('common.optionalField', { label });

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      // Con edge-to-edge en Android, 'height' no compensa el teclado; 'padding' mantiene visible el pie.
      behavior="padding">
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('ingredients.new.title'),
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: fontFamily.semiBold, fontSize: 18 },
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              hitSlop={8}
              onPress={() => router.back()}
              style={styles.close}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
        <TextField label={t('ingredients.new.name')} value={name} onChangeText={setName} error={errors.name} />
        <FormSection title={t('ingredients.new.section.measure')}>
          <ChoiceChips
            label={t('ingredients.new.dimension')}
            options={DIMENSIONS.map((value) => ({ value, label: dimensionLabel(value, t), icon: DIMENSION_ICONS[value] }))}
            selected={dimension}
            onSelect={selectDimension}
          />
          <SelectField
            label={t('ingredients.new.unit')}
            hint={t('ingredients.new.unitHint')}
            options={unitsOfDimension(dimension).map((value) => ({ value, label: unitName(value, t) }))}
            selected={unit}
            onSelect={setUnit}
          />
          {errors.inventoryUnitCode || errors.dimension ? (
            <Text style={[typography.caption, { color: colors.error }]}>{errors.inventoryUnitCode ?? errors.dimension}</Text>
          ) : null}
        </FormSection>
        <FormSection title={t('ingredients.new.section.inventory')}>
          <TextField
            label={optional(t('ingredients.new.threshold'))}
            hint={t('ingredients.new.thresholdHint')}
            value={threshold}
            onChangeText={setThreshold}
            keyboardType="decimal-pad"
            suffix={unitText}
            error={errors.lowStockThreshold}
          />
          <SwitchRow
            label={t('ingredients.new.tracksLots')}
            hint={t('ingredients.new.tracksLotsHint')}
            value={tracksLots}
            onValueChange={setTracksLots}
          />
        </FormSection>
        {/* El título de la sección ya indica que todo es opcional; los campos no lo repiten. */}
        <FormSection title={t('ingredients.new.section.optional')}>
          <TextField label={t('ingredients.new.category')} value={category} onChangeText={setCategory} />
          <TextField label={t('ingredients.new.notes')} value={notes} onChangeText={setNotes} multiline />
        </FormSection>
      </ScrollView>
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.md },
        ]}>
        {formError ? (
          <Text accessibilityLiveRegion="polite" style={[typography.caption, { color: colors.error }]}>
            {formError}
          </Text>
        ) : null}
        <Button label={t('ingredients.new.save')} onPress={save} loading={saving} disabled={database.status !== 'ready'} />
      </View>
      <Dialog
        visible={pendingLeave !== null}
        title={t('ingredients.new.discardTitle')}
        message={t('ingredients.new.discardMessage')}
        onDismiss={() => setPendingLeave(null)}
        actions={[
          { label: t('ingredients.new.keepEditing'), onPress: () => setPendingLeave(null) },
          {
            label: t('ingredients.new.discard'),
            variant: 'destructive',
            onPress: () => {
              setPendingLeave(null);
              disablePrevention();
              pendingLeave?.();
            },
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { padding: spacing.xl, gap: spacing.xxxl },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  close: { minWidth: minTouchTarget, minHeight: minTouchTarget, justifyContent: 'center' },
});
