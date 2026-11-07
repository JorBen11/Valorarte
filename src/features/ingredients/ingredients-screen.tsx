import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ChoiceChips } from '@/components/ui/choice-chips';
import { Fab, FAB_CLEARANCE } from '@/components/ui/fab';
import { OptionSheet } from '@/components/ui/option-sheet';
import { Screen } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { IconButton } from '@/components/ui/surface';
import { EyeletPlaceholder } from '@/components/ui/tag';
import { useDatabase } from '@/data/database/database-provider';
import { BusinessSetupForm } from '@/features/business/business-setup-form';
import { LARGE_TEXT_SCALE, useWindowLayout } from '@/theme/layout';
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
import { IngredientDetailView } from './ingredient-detail-screen';
import { loadIngredientsOverview, type IngredientsOverview, type IngredientWithStock } from './ingredient-use-cases';
import { StockIndicator } from './stock-indicator';
import { formatStock, formatThreshold, STOCK_STATUS_STYLE } from './stock-labels';

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
  // Sobrevive a los cambios de tamaño: al ampliar, el panel muestra lo último elegido.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const layout = useWindowLayout();
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

  const selected = results.find((r) => r.ingredient.id === selectedId) ?? results[0] ?? null;
  const open = (id: string) => {
    setSelectedId(id);
    if (!layout.panes) router.push({ pathname: '/ingredients/[id]', params: { id } });
  };
  const lastIndex = results.length - 1;
  const edges = layout.sideNavigation ? (['top', 'right'] as const) : (['top', 'left', 'right'] as const);

  const list = (
    <View style={layout.panes ? { width: layout.listPaneWidth } : styles.flex}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.ingredient.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: layout.isShort ? spacing.sm : spacing.xl, paddingBottom: spacing.xxxl + FAB_CLEARANCE }}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text accessibilityRole="header" style={[typography.screenTitle, styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
              <Text
                accessibilityLabel={narrowed ? t('ingredients.countFilteredA11y', { shown: results.length, total: all.length }) : t('ingredients.count', { count: all.length })}
                style={[typography.label, tabularNumbers, { color: colors.textSecondary }]}>
                {narrowed ? t('ingredients.countFiltered', { shown: results.length, total: all.length }) : all.length}
              </Text>
            </View>
            <View style={styles.toolbar}>
              <SearchField
                value={query.search}
                onChangeText={(text) => update({ search: text })}
                placeholder={t('ingredients.search.placeholder')}
                clearLabel={t('ingredients.search.clear')}
              />
              <IconButton icon="filter-variant" accessibilityLabel={t('ingredients.filters.open', { count: filters })} marked={filters > 0} onPress={() => setSheet('filters')} />
              <IconButton
                icon={SORTS.find((s) => s.value === query.sort)?.icon ?? 'sort'}
                accessibilityLabel={t('ingredients.sort.open', { sort: t(`ingredients.sort.${query.sort}`) })}
                marked={query.sort !== DEFAULT_QUERY.sort}
                onPress={() => setSheet('sort')}
              />
            </View>
            {activeLabels.length > 0 ? (
              <View style={styles.activeFilters}>
                <MaterialCommunityIcons name="filter-variant" size={16} color={colors.textSecondary} />
                <Text style={[typography.label, styles.activeText, { color: colors.textPrimary }]}>{activeLabels.join(' · ')}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('ingredients.filters.clear')}
                  onPress={clearFilters}
                  style={styles.clearFilters}>
                  <Text style={[typography.label, { color: colors.textSecondary }]}>{t('ingredients.filters.clearShort')}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <StateView
            icon="magnify-close"
            title={t('ingredients.noResultsTitle')}
            message={t('ingredients.noResults')}
            action={{ label: t('ingredients.clearAll'), variant: 'tonal', onPress: () => setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort })) }}
          />
        }
        renderItem={({ item, index }) => (
          <IngredientRow
            item={item}
            first={index === 0}
            last={index === lastIndex}
            active={layout.panes && item === selected}
            onPress={() => open(item.ingredient.id)}
          />
        )}
      />
      <Fab icon="plus" accessibilityLabel={t('ingredients.add')} onPress={add} />
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.flex, styles.row, { backgroundColor: colors.background }]}>
      {list}
      {layout.panes ? (
        <View style={styles.flex}>
          {selected ? (
            <IngredientDetailView key={selected.ingredient.id} id={selected.ingredient.id} embedded />
          ) : (
            <StateView title={t('ingredients.selectHint')} />
          )}
        </View>
      ) : null}

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
    </SafeAreaView>
  );
}

function IngredientRow({ item, first, last, active, onPress }: { item: IngredientWithStock; first: boolean; last: boolean; active: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { fontScale } = useWindowLayout();
  const { ingredient, stock, status } = item;
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
  const secondary = statusText ?? ingredient.category;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={t('ingredients.openDetail')}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceRaised }}
      style={[
        styles.item,
        { backgroundColor: active ? colors.surfaceRaised : colors.surface },
        first && styles.itemFirst,
        last && styles.itemLast,
        !first && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
      ]}>
      <EyeletPlaceholder />
      <View style={styles.identity}>
        <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{ingredient.name}</Text>
        {secondary ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{secondary}</Text> : null}
        {lots ? (
          <View style={styles.lots}>
            <MaterialCommunityIcons name="layers-outline" size={14} color={colors.textSecondary} />
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{lots}</Text>
          </View>
        ) : null}
        {/* Con letra grande la cantidad pasa bajo el nombre, sin partir palabras. */}
        {fontScale >= LARGE_TEXT_SCALE ? <StockIndicator item={item} /> : null}
      </View>
      {fontScale >= LARGE_TEXT_SCALE ? null : <StockIndicator item={item} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flexShrink: 1 },
  toolbar: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  activeFilters: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  activeText: { flexShrink: 1 },
  clearFilters: { marginLeft: 'auto', minHeight: minTouchTarget, justifyContent: 'center', paddingLeft: spacing.md },
  sheetBody: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.xxl },
  sheetActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  // Quitar filtros (texto) toma su ancho natural; la acción principal, el resto, sin partir el texto.
  sheetAction: { flexGrow: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 64 },
  itemFirst: { borderTopLeftRadius: radius.group, borderTopRightRadius: radius.group },
  itemLast: { borderBottomLeftRadius: radius.group, borderBottomRightRadius: radius.group },
  identity: { flex: 1, gap: 2, alignItems: 'flex-start' },
  lots: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
