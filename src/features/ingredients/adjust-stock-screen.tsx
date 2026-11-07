import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Stack, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SelectField } from '@/components/ui/select-field';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { useDatabase } from '@/data/database/database-provider';
import { previewStockAfter, type AdjustmentDirection } from '@/domain/inventory-movement';
import { compare, ZERO } from '@/domain/rational';
import type { UnitCode } from '@/domain/units';
import { DomainValidationError } from '@/domain/validation';
import { fieldErrors } from '@/features/validation-messages';
import { normalizeDecimalInput } from '@/i18n/format-quantity';
import { useTheme } from '@/theme/theme-provider';
import { fontFamily, minTouchTarget, radius, spacing, tabularNumbers, typography } from '@/theme/tokens';

import { IngredientNotFoundError, loadIngredientDetail, recordInventoryAdjustment, type IngredientDetail } from './ingredient-use-cases';
import { decimalSeparator, formatStock } from './stock-labels';
import { unitName, unitsOfDimension } from './unit-labels';

export function AdjustStockScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const { ingredientId = '' } = useLocalSearchParams<{ ingredientId?: string }>();

  const [detail, setDetail] = useState<IngredientDetail | null | 'loading' | 'error'>('loading');
  const [direction, setDirection] = useState<AdjustmentDirection>('in');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<UnitCode | null>(null);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (database.status !== 'ready') return;
    loadIngredientDetail(database.db, ingredientId).then(
      (loaded) => {
        setDetail(loaded);
        if (loaded) setUnit(loaded.ingredient.inventoryUnitCode);
      },
      () => setDetail('error'),
    );
  }, [database, ingredientId]);

  const dirty = quantity.trim() !== '' || reason.trim() !== '';
  const disablePrevention = usePreventRemove(dirty, ({ repeat }) => setPendingLeave(() => repeat));

  const header = (
    <Stack.Screen
      options={{
        headerShown: true,
        title: t('ingredients.adjust.title'),
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
  );

  if (detail === 'loading' || detail === 'error' || detail === null || unit === null) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {header}
        {detail === 'loading' ? (
          <LoadingView message={t('common.loading')} />
        ) : (
          <StateView
            icon="cloud-alert-outline"
            iconColor={colors.error}
            title={t(detail === null ? 'ingredients.detail.notFoundTitle' : 'common.loadErrorTitle')}
            message={t(detail === null ? 'ingredients.detail.notFound' : 'common.loadError')}
            action={{ label: t('ingredients.detail.backToList'), onPress: () => router.back(), variant: 'tonal' }}
          />
        )}
      </View>
    );
  }

  const { ingredient, stock } = detail;
  const input = { direction, quantity: normalizeDecimalInput(quantity, decimalSeparator()), unitCode: unit, reason };
  const after = previewStockAfter(stock, input);
  const negative = after !== null && compare(after, ZERO) < 0;

  async function save() {
    if (database.status !== 'ready' || saving) return;
    setSaving(true);
    setFormError(null);
    try {
      await recordInventoryAdjustment(database.db, ingredientId, input);
      disablePrevention();
      router.back();
    } catch (error) {
      if (error instanceof DomainValidationError) setErrors(fieldErrors(error, t));
      else setFormError(t(error instanceof IngredientNotFoundError ? 'ingredients.detail.notFound' : 'common.saveError'));
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior="padding">
      {header}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
        <Text style={[typography.sectionTitle, { color: colors.textPrimary }]}>{ingredient.name}</Text>
        <SegmentedControl
          label={t('ingredients.adjust.direction')}
          options={[
            { value: 'in', label: t('ingredients.movement.in'), icon: 'arrow-bottom-left' },
            { value: 'out', label: t('ingredients.movement.out'), icon: 'arrow-top-right' },
          ]}
          selected={direction}
          onSelect={setDirection}
        />
        <View style={styles.quantityRow}>
          <View style={styles.flex}>
            <TextField
              label={t('ingredients.adjust.quantity')}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              error={errors.quantity}
            />
          </View>
          <View style={styles.unitColumn}>
            <SelectField
              label={t('ingredients.new.unit')}
              options={unitsOfDimension(ingredient.dimension).map((value) => ({ value, label: unitName(value, t) }))}
              selected={unit}
              onSelect={setUnit}
            />
          </View>
        </View>

        {/* Antes → después: el efecto del ajuste se ve como datos, no como frase. */}
        <View style={[styles.preview, { backgroundColor: colors.surface, borderColor: negative ? colors.error : colors.border }]}>
          <PreviewValue label={t('ingredients.adjust.current')} value={stock ? formatStock(stock, ingredient, t) : t('ingredients.stock.notRecorded')} />
          <MaterialCommunityIcons name="arrow-right" size={20} color={colors.textSecondary} />
          <PreviewValue
            label={t('ingredients.adjust.after')}
            value={after ? (negative ? t('ingredients.adjust.insufficient') : formatStock(after, ingredient, t)) : '—'}
            color={negative ? colors.error : undefined}
          />
        </View>

        <TextField
          label={t('ingredients.adjust.reason')}
          hint={t('ingredients.adjust.reasonHint')}
          value={reason}
          onChangeText={setReason}
          error={errors.reason}
        />
        <View style={styles.note}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.textSecondary} />
          <Text style={[typography.caption, styles.flex, { color: colors.textSecondary }]}>{t('ingredients.adjust.valuationNote')}</Text>
        </View>
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
        <Button label={t('ingredients.adjust.save')} onPress={save} loading={saving} disabled={negative} />
      </View>
      <Dialog
        visible={pendingLeave !== null}
        title={t('ingredients.adjust.discardTitle')}
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

function PreviewValue({ label, value, color }: { label: string; value: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <View accessible style={styles.flex}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.itemTitle, tabularNumbers, { color: color ?? colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  form: { padding: spacing.xl, gap: spacing.xxl },
  // El selector de unidad junto al campo ya muestra la unidad: el campo no repite el sufijo.
  quantityRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  unitColumn: { flex: 1.4 },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.control,
    borderWidth: 1,
  },
  note: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  close: { minWidth: minTouchTarget, minHeight: minTouchTarget, justifyContent: 'center' },
});
