import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getLocales } from 'expo-localization';
import { router, Stack, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IconButton, StatusMessage } from '@/components/ui/surface';
import { ChoiceChips } from '@/components/ui/choice-chips';
import { FormSection } from '@/components/ui/form-section';
import { SelectField } from '@/components/ui/select-field';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { SwitchRow } from '@/components/ui/switch-row';
import { TextField } from '@/components/ui/text-field';
import { ForeignKeyViolationError } from '@/data/database/database';
import { useDatabase } from '@/data/database/database-provider';
import type { Ingredient } from '@/domain/ingredient';
import { parseDecimal } from '@/domain/rational';
import { BASE_UNITS, type Dimension, type UnitCode } from '@/domain/units';
import { DomainValidationError } from '@/domain/validation';
import { fieldErrors } from '@/features/validation-messages';
import { formatNormalizedQuantity, normalizeDecimalInput } from '@/i18n/format-quantity';
import { columnsFor, FORM_MAX_WIDTH, useWindowLayout } from '@/theme/layout';
import { useTheme } from '@/theme/theme-provider';
import { fontFamily, spacing, typography } from '@/theme/tokens';

import { editIngredient, IngredientNotFoundError, loadIngredientDetail, registerIngredient } from './ingredient-use-cases';
import { DIMENSION_ICONS, dimensionLabel, unitLabel, unitName, unitsOfDimension } from './unit-labels';

const DIMENSIONS = Object.keys(BASE_UNITS) as Dimension[];
const MIN_FORM_COLUMN = 340;

/** Alta (`businessId`) o edición (`ingredientId`) con el mismo formulario. */
export function NewIngredientScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useDatabase();
  const { businessId = '', ingredientId } = useLocalSearchParams<{ businessId?: string; ingredientId?: string }>();
  const [existing, setExisting] = useState<Ingredient | null | 'loading' | 'error'>('loading');

  useEffect(() => {
    if (!ingredientId || database.status !== 'ready') return;
    loadIngredientDetail(database.db, ingredientId).then((d) => setExisting(d?.ingredient ?? null), () => setExisting('error'));
  }, [database, ingredientId]);

  if (!ingredientId) return <IngredientForm businessId={businessId} />;
  if (existing !== 'loading' && existing !== 'error' && existing !== null) return <IngredientForm existing={existing} businessId={existing.businessId} />;
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: true, title: t('ingredients.edit.title'), headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.textPrimary, headerTitleStyle: { fontFamily: fontFamily.display, fontSize: 20 } }} />
      {existing === 'loading' ? (
        <LoadingView message={t('common.loading')} />
      ) : (
        <StateView
          icon="cloud-alert-outline"
          iconColor={colors.error}
          title={t(existing === null ? 'ingredients.detail.notFoundTitle' : 'common.loadErrorTitle')}
          message={t(existing === null ? 'ingredients.detail.notFound' : 'common.loadError')}
          action={{ label: t('ingredients.detail.backToList'), onPress: () => router.back(), variant: 'tonal' }}
        />
      )}
    </View>
  );
}

function thresholdText(ingredient: Ingredient): string {
  if (ingredient.lowStockThreshold === null) return '';
  return formatNormalizedQuantity(
    parseDecimal(ingredient.lowStockThreshold),
    ingredient.dimension,
    ingredient.inventoryUnitCode,
    getLocales()[0]?.decimalSeparator ?? '.',
  );
}

function IngredientForm({ existing, businessId }: { existing?: Ingredient; businessId: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const layout = useWindowLayout();
  // Dos columnas solo con espacio, altura y letra suficientes; nunca se reduce el texto para lograrlas.
  const twoColumns = !layout.isShort && layout.widthClass !== 'compact' && layout.widthClass !== 'medium' && columnsFor(layout.width - layout.gutter * 2, MIN_FORM_COLUMN, layout.fontScale) > 1;
  const formWidth = twoColumns ? { maxWidth: FORM_MAX_WIDTH * 1.4 } : { maxWidth: FORM_MAX_WIDTH };

  const [initial] = useState(() => ({
    name: existing?.name ?? '',
    category: existing?.category ?? '',
    dimension: existing?.dimension ?? ('mass' as Dimension),
    unit: existing?.inventoryUnitCode ?? BASE_UNITS.mass,
    threshold: existing ? thresholdText(existing) : '',
    tracksLots: existing?.tracksLots ?? false,
    notes: existing?.notes ?? '',
  }));
  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState(initial.category);
  const [dimension, setDimension] = useState<Dimension>(initial.dimension);
  const [unit, setUnit] = useState<UnitCode>(initial.unit);
  const [threshold, setThreshold] = useState(initial.threshold);
  const [tracksLots, setTracksLots] = useState(initial.tracksLots);
  const [notes, setNotes] = useState(initial.notes);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  const dirty =
    name.trim() !== initial.name.trim() ||
    category.trim() !== initial.category.trim() ||
    threshold.trim() !== initial.threshold ||
    notes.trim() !== initial.notes.trim() ||
    tracksLots !== initial.tracksLots ||
    dimension !== initial.dimension ||
    unit !== initial.unit;

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
    const changes = {
      name,
      category,
      inventoryUnitCode: unit,
      lowStockThreshold: normalizeDecimalInput(threshold, getLocales()[0]?.decimalSeparator ?? '.'),
      tracksLots,
      notes,
    };
    try {
      if (existing) await editIngredient(database.db, existing.id, changes);
      else await registerIngredient(database.db, { ...changes, businessId, dimension });
      disablePrevention();
      router.back();
    } catch (error) {
      if (error instanceof DomainValidationError) setErrors(fieldErrors(error, t));
      else if (error instanceof IngredientNotFoundError) setFormError(t('ingredients.detail.notFound'));
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
          title: t(existing ? 'ingredients.edit.title' : 'ingredients.new.title'),
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: fontFamily.display, fontSize: 20 },
          headerLeft: () => <IconButton bare icon="close" accessibilityLabel={t('common.close')} onPress={() => router.back()} />,
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.form, formWidth, { paddingHorizontal: layout.gutter }]}>
        <TextField label={t('ingredients.new.name')} value={name} onChangeText={setName} error={errors.name} />
        <View style={twoColumns ? styles.columns : styles.stack}>
        <View style={twoColumns ? styles.column : styles.stack}>
        <FormSection title={t('ingredients.new.section.measure')}>
          {existing ? (
            // Las existencias están normalizadas a la unidad base de esta dimensión: no se puede cambiar.
            <View accessible style={styles.locked}>
              <MaterialCommunityIcons name={DIMENSION_ICONS[dimension]} size={20} color={colors.textSecondary} />
              <View style={styles.lockedText}>
                <Text style={[typography.label, { color: colors.textPrimary }]}>
                  {`${t('ingredients.new.dimension')}: ${dimensionLabel(dimension, t)}`}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('ingredients.edit.dimensionLocked')}</Text>
              </View>
            </View>
          ) : (
            <ChoiceChips
              label={t('ingredients.new.dimension')}
              options={DIMENSIONS.map((value) => ({ value, label: dimensionLabel(value, t), icon: DIMENSION_ICONS[value] }))}
              selected={dimension}
              onSelect={selectDimension}
            />
          )}
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
        </View>
        <View style={twoColumns ? styles.column : styles.stack}>
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
        </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.md, paddingHorizontal: Math.max(layout.gutter, (layout.width - (twoColumns ? FORM_MAX_WIDTH * 1.4 : FORM_MAX_WIDTH)) / 2) },
        ]}>
        {formError ? <StatusMessage kind="error" message={formError} /> : null}
        <Button label={t(existing ? 'ingredients.edit.save' : 'ingredients.new.save')} onPress={save} loading={saving} disabled={database.status !== 'ready'} />
      </View>
      <Dialog
        visible={pendingLeave !== null}
        title={t(existing ? 'ingredients.edit.discardTitle' : 'ingredients.new.discardTitle')}
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
  form: { width: '100%', alignSelf: 'center', paddingVertical: spacing.xl, gap: spacing.xxxl },
  stack: { gap: spacing.xxxl },
  columns: { flexDirection: 'row', gap: spacing.xxxl, alignItems: 'flex-start' },
  column: { flex: 1, minWidth: 0, gap: spacing.xxxl },
  footer: { paddingTop: spacing.md, gap: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  locked: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  lockedText: { flex: 1, gap: 2 },
});
