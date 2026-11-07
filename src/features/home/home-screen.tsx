import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { Divider, StatusMessage, Surface } from '@/components/ui/surface';
import { EyeletPlaceholder } from '@/components/ui/tag';
import { useDatabase } from '@/data/database/database-provider';
import { loadIngredientsOverview, type IngredientsOverview, type IngredientWithStock } from '@/features/ingredients/ingredient-use-cases';
import { StockIndicator } from '@/features/ingredients/stock-indicator';
import { formatThreshold } from '@/features/ingredients/stock-labels';
import { columnsFor, CONTENT_MAX_WIDTH, LARGE_TEXT_SCALE, RAIL_WIDTH, useWindowLayout } from '@/theme/layout';
import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, spacing, typography } from '@/theme/tokens';

type LoadState = { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & IngredientsOverview);

const MIN_COLUMN = 320;

/** Inicio: solo datos reales. Hoy son los del inventario; ventas y rentabilidad aún no existen y se dice así. */
export function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useDatabase();
  const layout = useWindowLayout();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const load = useCallback(async () => {
    if (database.status !== 'ready') return;
    try {
      setState({ status: 'ready', ...(await loadIngredientsOverview(database.db)) });
    } catch {
      setState({ status: 'error' });
    }
  }, [database]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const title = t('home.title');

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
        <LoadingView message={t('common.loading')} />
      </Screen>
    );
  }

  const openIngredients = () => router.navigate('/ingredients');
  const count = (status: IngredientWithStock['status']) => state.ingredients.filter((i) => i.status === status).length;
  const alerts = state.ingredients
    .filter((i) => i.status === 'out' || i.status === 'low')
    .sort((a, b) => Number(b.status === 'out') - Number(a.status === 'out') || a.ingredient.name.localeCompare(b.ingredient.name));

  const available = Math.min(layout.width - (layout.sideNavigation ? RAIL_WIDTH : 0), CONTENT_MAX_WIDTH) - layout.gutter * 2;
  const columns = layout.isShort ? 1 : columnsFor(available, MIN_COLUMN, layout.fontScale);

  if (state.ingredients.length === 0) {
    return (
      <Screen title={title}>
        <StateView
          title={t('home.noIngredients')}
          message={t('home.noIngredientsHint')}
          action={{ label: t('home.goIngredients'), onPress: openIngredients }}
        />
        <StatusMessage kind="info" message={`${t('home.pendingTitle')}. ${t('home.pending')}`} />
      </Screen>
    );
  }

  const attention = (
    <View style={styles.block}>
      <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
        {t('home.attention')}
      </Text>
      {alerts.length === 0 ? (
        <Text style={[typography.body, { color: colors.textSecondary }]}>{t('home.allGood')}</Text>
      ) : (
        <Surface>
          {alerts.map((item, index) => (
            <View key={item.ingredient.id}>
              {index > 0 ? <Divider /> : null}
              <AlertRow item={item} />
            </View>
          ))}
        </Surface>
      )}
    </View>
  );

  const summary = (
    <View style={styles.block}>
      <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
        {t('home.summary')}
      </Text>
      <View style={styles.figures}>
        <Figure label={t('home.tracked')} value={state.ingredients.length} />
        <Figure label={t('home.low')} value={count('low')} />
        <Figure label={t('home.out')} value={count('out')} />
        <Figure label={t('home.unknown')} value={count('unknown')} />
      </View>
      <Button label={t('home.goIngredients')} variant="tonal" onPress={openIngredients} />
      <StatusMessage kind="info" message={`${t('home.pendingTitle')}. ${t('home.pending')}`} />
    </View>
  );

  return (
    <Screen title={title}>
      <View style={[styles.layout, columns > 1 && styles.twoColumns]}>
        <View style={columns > 1 ? styles.column : undefined}>{attention}</View>
        <View style={columns > 1 ? styles.column : undefined}>{summary}</View>
      </View>
    </Screen>
  );
}

function AlertRow({ item }: { item: IngredientWithStock }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { fontScale } = useWindowLayout();
  const { ingredient } = item;
  const threshold = formatThreshold(ingredient, t);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${ingredient.name}, ${t(`ingredients.stock.status.${item.status}`)}`}
      accessibilityHint={t('ingredients.openDetail')}
      onPress={() => router.push({ pathname: '/ingredients/[id]', params: { id: ingredient.id } })}
      android_ripple={{ color: colors.surfaceRaised }}
      style={styles.row}>
      <EyeletPlaceholder />
      <View style={styles.rowText}>
        <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{ingredient.name}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {item.status === 'low' && threshold ? t('ingredients.stock.lowAt', { threshold }) : t(`ingredients.stock.status.${item.status}`)}
        </Text>
        {fontScale >= LARGE_TEXT_SCALE ? <StockIndicator item={item} /> : null}
      </View>
      {fontScale >= LARGE_TEXT_SCALE ? null : <StockIndicator item={item} />}
    </Pressable>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  const { colors } = useTheme();
  return (
    <View accessible style={styles.figure}>
      <Text style={[typography.amountSecondary, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[typography.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: { gap: spacing.xxl },
  twoColumns: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { flex: 1, minWidth: 0 },
  block: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: minTouchTarget + spacing.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  rowText: { flex: 1, gap: 2, alignItems: 'flex-start' },
  figures: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  figure: { flexBasis: '50%', flexGrow: 1 },
});
