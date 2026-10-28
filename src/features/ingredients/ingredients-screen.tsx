import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getLocales } from 'expo-localization';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Fab, FAB_CLEARANCE } from '@/components/ui/fab';
import { Screen } from '@/components/ui/screen';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { useDatabase } from '@/data/database/database-provider';
import type { Ingredient } from '@/domain/ingredient';
import { parseDecimal } from '@/domain/rational';
import { BusinessSetupForm } from '@/features/business/business-setup-form';
import { formatNormalizedQuantity } from '@/i18n/format-quantity';
import { useTheme } from '@/theme/theme-provider';
import { radius, spacing, tabularNumbers, typography } from '@/theme/tokens';

import { loadIngredientsOverview, type IngredientsOverview } from './ingredient-use-cases';
import { DIMENSION_ICONS, unitLabel } from './unit-labels';

type LoadState = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & IngredientsOverview);

export function IngredientsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useDatabase();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const load = useCallback(async () => {
    if (database.status !== 'ready') return;
    try {
      setState({ status: 'ready', ...(await loadIngredientsOverview(database.db)) });
    } catch {
      setState({ status: 'error' });
    }
  }, [database]);

  // Recarga al volver del formulario de alta.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const title = t('ingredients.title');

  if (database.status === 'error' || state.status === 'error') {
    return (
      <Screen title={title}>
        <StateView
          icon="cloud-alert-outline"
          iconColor={colors.error}
          title={t('common.loadErrorTitle')}
          message={t('common.loadError')}
          action={database.status === 'ready' ? { label: t('common.retry'), onPress: load, variant: 'tonal' } : undefined}
        />
      </Screen>
    );
  }

  if (database.status === 'loading' || state.status === 'loading') {
    return (
      <Screen title={title}>
        <LoadingView message={t('ingredients.loading')} />
      </Screen>
    );
  }

  if (!state.business) {
    return (
      <Screen title={title}>
        <BusinessSetupForm db={database.db} onCreated={load} />
      </Screen>
    );
  }

  const businessId = state.business.id;
  const add = () => router.push({ pathname: '/ingredients/new', params: { businessId } });

  if (state.ingredients.length === 0) {
    return (
      <Screen title={title}>
        <StateView
          icon="basket-outline"
          iconColor={colors.accentPremium}
          title={t('ingredients.emptyTitle')}
          message={t('ingredients.empty')}
          action={{ label: t('ingredients.add'), onPress: add, icon: 'plus' }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      title={title}
      titleAccessory={
        <Text
          accessibilityLabel={t('ingredients.count', { count: state.ingredients.length })}
          style={[typography.sectionTitle, { color: colors.textSecondary }]}>
          {state.ingredients.length}
        </Text>
      }
      bottomInset={FAB_CLEARANCE}
      overlay={<Fab icon="plus" accessibilityLabel={t('ingredients.add')} onPress={add} />}>
      <View>
        {state.ingredients.map((ingredient, index) => (
          <IngredientRow key={ingredient.id} ingredient={ingredient} divider={index > 0} />
        ))}
      </View>
    </Screen>
  );
}

function IngredientRow({ ingredient, divider }: { ingredient: Ingredient; divider: boolean }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const unit = unitLabel(ingredient.inventoryUnitCode, t);
  const threshold =
    ingredient.lowStockThreshold === null
      ? null
      : formatNormalizedQuantity(
          parseDecimal(ingredient.lowStockThreshold),
          ingredient.dimension,
          ingredient.inventoryUnitCode,
          getLocales()[0]?.decimalSeparator ?? '.',
        );
  const lowStock = threshold === null ? null : t('ingredients.lowStockAt', { quantity: threshold, unit });
  const lots = ingredient.tracksLots ? t('ingredients.tracksLotsBadge') : null;
  const a11yLabel = [ingredient.name, ingredient.category, unit, lowStock, lots].filter(Boolean).join(', ');

  return (
    <View
      accessible
      accessibilityLabel={a11yLabel}
      style={styles.row}>
      <View style={[styles.dimension, { backgroundColor: colors.surfaceRaised }]}>
        <MaterialCommunityIcons name={DIMENSION_ICONS[ingredient.dimension]} size={22} color={colors.textSecondary} />
      </View>
      {/* El divisor empieza en el texto, no bajo el icono, para que la columna de iconos se lea como una sola. */}
      <View style={[styles.body, divider && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
        <View style={styles.rowHeader}>
          <View style={styles.rowTitle}>
            <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{ingredient.name}</Text>
            {ingredient.category ? (
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{ingredient.category}</Text>
            ) : null}
          </View>
          <View style={[styles.unit, { backgroundColor: colors.brandSubtle }]}>
            <Text style={[typography.label, { color: colors.primary }]}>{unit}</Text>
          </View>
        </View>
        {lowStock || lots ? (
          <View style={styles.meta}>
            {lowStock ? <MetaItem icon="bell-outline" text={lowStock} /> : null}
            {lots ? <MetaItem icon="layers-outline" text={lots} /> : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function MetaItem({ icon, text }: { icon: ComponentProps<typeof MaterialCommunityIcons>['name']; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.textSecondary} />
      <Text style={[typography.caption, tabularNumbers, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  dimension: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  body: { flex: 1, paddingVertical: spacing.lg, gap: spacing.sm },
  rowHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  unit: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  rowTitle: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, rowGap: spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
