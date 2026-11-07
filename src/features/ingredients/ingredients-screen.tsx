import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ChoiceChips } from '@/components/ui/choice-chips';
import { Fab, FAB_CLEARANCE } from '@/components/ui/fab';
import { OptionSheet } from '@/components/ui/option-sheet';
import { Screen } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { useDatabase } from '@/data/database/database-provider';
import { BusinessSetupForm } from '@/features/business/business-setup-form';
import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, tabularNumbers, typography } from '@/theme/tokens';

import {
  activeFilterCount,
  applyIngredientQuery,
  categoriesOf,
  DEFAULT_QUERY,
  type IngredientListQuery,
  type IngredientSort,
  type StockFilter,
} from './ingredient-list-query';
import { loadIngredientsOverview, type IngredientsOverview, type IngredientWithStock } from './ingredient-use-cases';
import { formatStock, formatThreshold, STOCK_STATUS_STYLE } from './stock-labels';
import { DIMENSION_ICONS } from './unit-labels';

type LoadState = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & IngredientsOverview);
type Icon = ComponentProps<typeof MaterialCommunityIcons>['name'];

const STOCK_FILTERS: StockFilter[] = ['all', 'low', 'out', 'unknown'];
const SORTS: { value: IngredientSort; icon: Icon }[] = [
  { value: 'name', icon: 'sort-alphabetical-ascending' },
  { value: 'quantity', icon: 'sort-numeric-ascending' },
  { value: 'restock', icon: 'alert-outline' },
  { value: 'recent', icon: 'history' },
];
const ALL_CATEGORIES = 'all';

export function IngredientsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useDatabase();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  // Vive en la pestaña, que sigue montada bajo el detalle: al volver se conservan búsqueda, filtros y orden.
  const [query, setQuery] = useState<IngredientListQuery>(DEFAULT_QUERY);
  const [sheet, setSheet] = useState<'filters' | 'sort' | null>(null);
  const search = useDeferredValue(query.search);

  const load = useCallback(async () => {
    if (database.status !== 'ready') return;
    try {
      setState({ status: 'ready', ...(await loadIngredientsOverview(database.db)) });
    } catch {
      setState({ status: 'error' });
    }
  }, [database]);

  // Recarga al volver del alta, la edición o un ajuste.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const all = useMemo(() => (state.status === 'ready' ? state.ingredients : []), [state]);
  const categories = useMemo(() => categoriesOf(all), [all]);
  // Una categoría que ya no existe (se editó el último ingrediente que la usaba) deja de filtrar.
  const category = query.category && categories.includes(query.category) ? query.category : null;
  const { stock, sort } = query;
  const effective = useMemo(() => ({ search, stock, category, sort }), [search, stock, category, sort]);
  const results = useMemo(() => applyIngredientQuery(all, effective), [all, effective]);

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

  if (all.length === 0) {
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

  const filters = activeFilterCount(effective);
  const narrowed = filters > 0 || search.trim() !== '';
  const update = (changes: Partial<IngredientListQuery>) => setQuery((q) => ({ ...q, ...changes }));
  const clearFilters = () => update({ stock: 'all', category: null });
  const activeLabels = [
    effective.stock !== 'all' ? t(`ingredients.stockFilter.${effective.stock}`) : null,
    effective.category,
  ].filter((label): label is string => label !== null);

  return (
    <Screen
      title={title}
      titleAccessory={
        <View
          accessible
          accessibilityLabel={
            narrowed
              ? t('ingredients.countFilteredA11y', { shown: results.length, total: all.length })
              : t('ingredients.count', { count: all.length })
          }
          style={[styles.countPill, { backgroundColor: colors.brandSubtle }]}>
          <Text style={[typography.label, tabularNumbers, { color: colors.primary }]}>
            {narrowed ? t('ingredients.countFiltered', { shown: results.length, total: all.length }) : all.length}
          </Text>
        </View>
      }
      bottomInset={FAB_CLEARANCE}
      overlay={<Fab icon="plus" accessibilityLabel={t('ingredients.add')} onPress={add} />}>
      <View style={styles.tools}>
        <View style={styles.toolbar}>
          <SearchField
            value={query.search}
            onChangeText={(text) => update({ search: text })}
            placeholder={t('ingredients.search.placeholder')}
            clearLabel={t('ingredients.search.clear')}
          />
          <ToolButton
            icon="filter-variant"
            label={t('ingredients.filters.open', { count: filters })}
            badge={filters}
            onPress={() => setSheet('filters')}
          />
          <ToolButton
            icon={SORTS.find((s) => s.value === query.sort)?.icon ?? 'sort'}
            label={t('ingredients.sort.open', { sort: t(`ingredients.sort.${query.sort}`) })}
            badge={query.sort === DEFAULT_QUERY.sort ? 0 : 1}
            onPress={() => setSheet('sort')}
          />
        </View>
        {activeLabels.length > 0 ? (
          <View style={styles.activeFilters}>
            <MaterialCommunityIcons name="filter-variant" size={16} color={colors.primary} />
            <Text numberOfLines={1} style={[typography.label, styles.activeText, { color: colors.primary }]}>
              {activeLabels.join(' · ')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('ingredients.filters.clear')}
              hitSlop={8}
              onPress={clearFilters}
              style={styles.clearFilters}>
              <Text style={[typography.label, { color: colors.textSecondary }]}>{t('ingredients.filters.clearShort')}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {results.length === 0 ? (
        <StateView
          icon="magnify-close"
          title={t('ingredients.noResultsTitle')}
          message={t('ingredients.noResults')}
          action={{ label: t('ingredients.clearAll'), variant: 'tonal', onPress: () => setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort })) }}
        />
      ) : (
        // shortcut: lista en ScrollView, fluida hasta unos cientos de filas; pasar a FlatList si se superan.
        <View>
          {results.map((item, index) => (
            <IngredientRow key={item.ingredient.id} item={item} divider={index > 0} />
          ))}
        </View>
      )}

      <BottomSheet visible={sheet === 'filters'} title={t('ingredients.filters.title')} onClose={() => setSheet(null)}>
        <ScrollView contentContainerStyle={styles.sheetBody}>
          <ChoiceChips
            label={t('ingredients.filters.stock')}
            options={STOCK_FILTERS.map((value) => ({
              value,
              label: t(`ingredients.stockFilter.${value}`),
              icon: value === 'all' ? undefined : STOCK_STATUS_STYLE[value].icon,
            }))}
            selected={effective.stock}
            onSelect={(stock) => update({ stock })}
          />
          {categories.length > 0 ? (
            <ChoiceChips
              label={t('ingredients.filters.category')}
              options={[
                { value: ALL_CATEGORIES, label: t('ingredients.filters.allCategories') },
                ...categories.map((name, i) => ({ value: `c${i}`, label: name })),
              ]}
              selected={effective.category === null ? ALL_CATEGORIES : `c${categories.indexOf(effective.category)}`}
              onSelect={(value) => update({ category: value === ALL_CATEGORIES ? null : categories[Number(value.slice(1))] })}
            />
          ) : null}
          <View style={styles.sheetActions}>
            <View>
              <Button label={t('ingredients.filters.clear')} variant="text" disabled={filters === 0} onPress={clearFilters} />
            </View>
            <View style={styles.sheetAction}>
              <Button label={t('ingredients.filters.show', { count: results.length })} onPress={() => setSheet(null)} />
            </View>
          </View>
        </ScrollView>
      </BottomSheet>

      <OptionSheet
        visible={sheet === 'sort'}
        title={t('ingredients.sort.title')}
        options={SORTS.map(({ value, icon }) => ({ value, icon, label: t(`ingredients.sort.${value}`) }))}
        selected={query.sort}
        onSelect={(sort) => update({ sort })}
        onClose={() => setSheet(null)}
      />
    </Screen>
  );
}

function ToolButton({ icon, label, badge, onPress }: { icon: Icon; label: string; badge: number; onPress: () => void }) {
  const { colors } = useTheme();
  const active = badge > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      android_ripple={{ color: colors.brandSubtle, borderless: false }}
      style={[
        styles.toolButton,
        active
          ? { backgroundColor: colors.brandSubtle, borderColor: colors.primary }
          : { backgroundColor: colors.surface, borderColor: colors.fieldBorder },
      ]}>
      <MaterialCommunityIcons name={icon} size={22} color={active ? colors.primary : colors.textSecondary} />
      {active ? <View style={[styles.dot, { backgroundColor: colors.primary, borderColor: colors.background }]} /> : null}
    </Pressable>
  );
}

function IngredientRow({ item, divider }: { item: IngredientWithStock; divider: boolean }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { ingredient, stock, status } = item;
  const statusStyle = STOCK_STATUS_STYLE[status];
  const statusColor = colors[statusStyle.color];
  const quantity = stock === null ? null : formatStock(stock, ingredient, t);
  const threshold = formatThreshold(ingredient, t);
  // Solo los estados que piden atención llevan línea propia; «suficiente» no añade ruido a la fila.
  const statusText =
    status === 'low'
      ? threshold
        ? t('ingredients.stock.lowAt', { threshold })
        : t('ingredients.stock.status.low')
      : status === 'out'
        ? t('ingredients.stock.status.out')
        : null;
  const lots = ingredient.tracksLots ? t('ingredients.tracksLotsBadge') : null;
  const a11yLabel = [
    ingredient.name,
    ingredient.category,
    quantity ? t('ingredients.stock.available', { quantity }) : t('ingredients.stock.status.unknown'),
    statusText,
    lots,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={t('ingredients.openDetail')}
      onPress={() => router.push({ pathname: '/ingredients/[id]', params: { id: ingredient.id } })}
      android_ripple={{ color: colors.brandSubtle }}
      style={styles.row}>
      <View style={[styles.dimension, { backgroundColor: colors.surfaceRaised }]}>
        <MaterialCommunityIcons name={DIMENSION_ICONS[ingredient.dimension]} size={22} color={colors.textSecondary} />
      </View>
      {/* El divisor empieza en el texto, no bajo el icono, para que la columna de iconos se lea como una sola. */}
      <View style={[styles.body, divider && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
        <View style={styles.main}>
          <View style={styles.identity}>
            <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{ingredient.name}</Text>
            {ingredient.category ? (
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{ingredient.category}</Text>
            ) : null}
          </View>
          <View style={styles.quantity}>
            {quantity ? (
              <Text
                style={[
                  typography.itemTitle,
                  tabularNumbers,
                  { color: status === 'ok' ? colors.textPrimary : statusColor },
                ]}>
                {quantity}
              </Text>
            ) : (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name={statusStyle.icon} size={16} color={statusColor} />
                <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('ingredients.stock.notRecorded')}</Text>
              </View>
            )}
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </View>
        {statusText || lots ? (
          <View style={styles.meta}>
            {statusText ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name={statusStyle.icon} size={16} color={statusColor} />
                <Text style={[typography.caption, tabularNumbers, { color: statusColor }]}>{statusText}</Text>
              </View>
            ) : null}
            {lots ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="layers-outline" size={16} color={colors.textSecondary} />
                <Text style={[typography.caption, { color: colors.textSecondary }]}>{lots}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  countPill: { minWidth: 32, paddingHorizontal: spacing.md, paddingVertical: 2, borderRadius: radius.pill, alignItems: 'center' },
  tools: { gap: spacing.md, marginBottom: -spacing.md },
  toolbar: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  toolButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radius.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dot: { position: 'absolute', top: 8, right: 8, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  activeFilters: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  activeText: { flexShrink: 1 },
  clearFilters: { marginLeft: 'auto', minHeight: 32, justifyContent: 'center', paddingLeft: spacing.md },
  sheetBody: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.xxl },
  sheetActions: { flexDirection: 'row', gap: spacing.md },
  // Quitar filtros (texto) toma su ancho natural; la acción principal, el resto, sin partir el texto.
  sheetAction: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.lg },
  dimension: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  body: { flex: 1, paddingVertical: spacing.lg, gap: spacing.sm },
  main: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  identity: { flex: 1, gap: 2 },
  quantity: { alignItems: 'flex-end', maxWidth: '45%' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, rowGap: spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
