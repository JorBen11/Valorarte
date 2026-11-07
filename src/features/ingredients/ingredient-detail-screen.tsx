import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState, type ComponentProps, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { useDatabase } from '@/data/database/database-provider';
import type { InventoryMovement } from '@/domain/inventory-movement';
import { parseDecimal } from '@/domain/rational';
import { BASE_UNITS } from '@/domain/units';
import { formatQuantity } from '@/i18n/format-quantity';
import { useTheme } from '@/theme/theme-provider';
import { fontFamily, minTouchTarget, radius, spacing, tabularNumbers, typography } from '@/theme/tokens';

import { loadIngredientDetail, type IngredientDetail } from './ingredient-use-cases';
import { decimalSeparator, formatDateTime, formatStock, formatThreshold, STOCK_STATUS_STYLE } from './stock-labels';
import { DIMENSION_ICONS, dimensionLabel, unitLabel, unitName } from './unit-labels';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'missing' } | { status: 'ready'; detail: IngredientDetail };

export function IngredientDetailScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const { id = '' } = useLocalSearchParams<{ id?: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const load = useCallback(async () => {
    if (database.status !== 'ready') return;
    try {
      const detail = await loadIngredientDetail(database.db, id);
      setState(detail ? { status: 'ready', detail } : { status: 'missing' });
    } catch {
      setState({ status: 'error' });
    }
  }, [database, id]);

  // Recarga al volver de la edición o de un ajuste.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const ready = state.status === 'ready' ? state.detail : null;
  const header = (
    <Stack.Screen
      options={{
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: fontFamily.semiBold, fontSize: 18 },
        headerRight: ready
          ? () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('ingredients.detail.edit')}
                hitSlop={8}
                onPress={() => router.push({ pathname: '/ingredients/new', params: { ingredientId: id } })}
                style={styles.headerButton}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.textPrimary} />
              </Pressable>
            )
          : undefined,
      }}
    />
  );

  if (database.status === 'error' || state.status === 'error' || state.status === 'missing') {
    const missing = state.status === 'missing';
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {header}
        <StateView
          icon={missing ? 'basket-remove-outline' : 'cloud-alert-outline'}
          iconColor={colors.error}
          title={t(missing ? 'ingredients.detail.notFoundTitle' : 'common.loadErrorTitle')}
          message={t(missing ? 'ingredients.detail.notFound' : 'common.loadError')}
          action={
            missing
              ? { label: t('ingredients.detail.backToList'), onPress: () => router.back(), variant: 'tonal' }
              : database.status === 'ready'
                ? { label: t('common.retry'), onPress: load, variant: 'tonal' }
                : undefined
          }
        />
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {header}
        <LoadingView message={t('ingredients.detail.loading')} />
      </View>
    );
  }

  const { ingredient, stock, status, movements } = ready;
  const statusStyle = STOCK_STATUS_STYLE[status];
  const statusColor = colors[statusStyle.color];
  const threshold = formatThreshold(ingredient, t);
  const adjust = () => router.push({ pathname: '/ingredients/adjust', params: { ingredientId: ingredient.id } });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {header}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}>
        {/* A. Identidad y estado */}
        <View style={styles.identity}>
          <Text accessibilityRole="header" style={[typography.screenTitle, { color: colors.textPrimary }]}>
            {ingredient.name}
          </Text>
          {ingredient.category ? (
            <Text style={[typography.body, { color: colors.textSecondary }]}>{ingredient.category}</Text>
          ) : null}
        </View>

        {/* B. Resumen del inventario: la cantidad es la cifra dominante. */}
        <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Columna: la cifra usa todo el ancho y nunca se parte por compartir fila con el estado. */}
          <View style={styles.summaryTop}>
            <Text style={[typography.label, { color: colors.textSecondary }]}>{t('ingredients.detail.available')}</Text>
            {stock ? (
              <>
                <Text style={[styles.bigNumber, tabularNumbers, { color: colors.textPrimary }]}>
                  {formatStock(stock, ingredient, t)}
                </Text>
                <View style={[styles.statusPill, { borderColor: statusColor }]}>
                  <MaterialCommunityIcons name={statusStyle.icon} size={16} color={statusColor} />
                  <Text style={[typography.label, { color: statusColor }]}>{t(`ingredients.stock.status.${status}`)}</Text>
                </View>
              </>
            ) : (
              // Sin movimientos no hay cifra: un texto de estado, no un número grande.
              <View style={styles.unknownRow}>
                <MaterialCommunityIcons name={statusStyle.icon} size={22} color={statusColor} />
                <Text style={[typography.sectionTitle, { color: colors.textSecondary }]}>
                  {t('ingredients.stock.status.unknown')}
                </Text>
              </View>
            )}
          </View>
          {stock === null ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('ingredients.detail.unknownStockHint')}</Text>
          ) : null}
          <View style={[styles.stats, { borderTopColor: colors.border }]}>
            <Stat label={t('ingredients.detail.threshold')} value={threshold ?? t('ingredients.detail.noThreshold')} muted={!threshold} />
            <Stat
              label={t('ingredients.detail.averageCost')}
              value={t('ingredients.detail.costUnavailable')}
              hint={t('ingredients.detail.costUnavailableHint')}
              muted
            />
          </View>
          <Button label={t('ingredients.adjust.title')} icon="swap-vertical" variant="tonal" onPress={adjust} />
        </View>

        {/* C. Información */}
        <Section title={t('ingredients.detail.section.info')}>
          <InfoRow
            icon={DIMENSION_ICONS[ingredient.dimension]}
            label={t('ingredients.detail.field.measure')}
            value={t('ingredients.detail.measureValue', {
              dimension: dimensionLabel(ingredient.dimension, t),
              unit: unitName(ingredient.inventoryUnitCode, t),
            })}
            hint={
              ingredient.inventoryUnitCode === BASE_UNITS[ingredient.dimension]
                ? undefined
                : t('ingredients.detail.baseUnit', { unit: unitLabel(BASE_UNITS[ingredient.dimension], t) })
            }
          />
          <InfoRow
            icon="layers-outline"
            label={t('ingredients.new.tracksLots')}
            value={t(ingredient.tracksLots ? 'ingredients.detail.on' : 'ingredients.detail.off')}
          />
          {ingredient.notes ? <InfoRow icon="note-text-outline" label={t('ingredients.new.notes')} value={ingredient.notes} /> : null}
          <InfoRow
            icon="calendar-blank-outline"
            label={t('ingredients.detail.field.updated')}
            value={formatDateTime(ingredient.updatedAt, i18n.language)}
            hint={t('ingredients.detail.created', { date: formatDateTime(ingredient.createdAt, i18n.language) })}
          />
        </Section>

        {/* D. Historial */}
        <Section title={t('ingredients.detail.section.movements')} count={movements.length}>
          {movements.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialCommunityIcons name="timeline-outline" size={24} color={colors.textSecondary} />
              <Text style={[typography.body, styles.flex, { color: colors.textSecondary }]}>
                {t('ingredients.detail.noMovements')}
              </Text>
            </View>
          ) : (
            movements.map((movement, index) => <MovementRow key={movement.id} movement={movement} divider={index > 0} />)
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text accessibilityRole="header" style={[typography.sectionTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {count ? <Text style={[typography.label, tabularNumbers, { color: colors.textSecondary }]}>{count}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function Stat({ label, value, hint, muted }: { label: string; value: string; hint?: string; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <View accessible style={styles.stat}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.itemTitle, tabularNumbers, { color: muted ? colors.textSecondary : colors.textPrimary }]}>{value}</Text>
      {hint ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{hint}</Text> : null}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  hint?: string;
}) {
  const { colors } = useTheme();
  return (
    <View accessible style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} style={styles.infoIcon} />
      <View style={styles.flex}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[typography.body, { color: colors.textPrimary }]}>{value}</Text>
        {hint ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{hint}</Text> : null}
      </View>
    </View>
  );
}

function MovementRow({ movement, divider }: { movement: InventoryMovement; divider: boolean }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const incoming = !movement.quantityDelta.startsWith('-');
  const color = incoming ? colors.success : colors.error;
  // Cantidad y unidad originales del movimiento (snapshot), no reconvertidas a la unidad actual.
  const amount = t('ingredients.stock.quantity', {
    quantity: formatQuantity(parseDecimal(movement.quantityDelta.replace('-', '')), decimalSeparator()),
    unit: unitLabel(movement.unitCode, t),
  });
  const type = t(`ingredients.movement.${movement.movementType}_${incoming ? 'in' : 'out'}`);
  const when = formatDateTime(movement.occurredAt, i18n.language);

  return (
    <View
      accessible
      accessibilityLabel={[type, `${t(incoming ? 'ingredients.movement.in' : 'ingredients.movement.out')} ${amount}`, movement.reason, when].join(', ')}
      style={[styles.movement, divider && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.movementIcon, { backgroundColor: colors.surfaceRaised }]}>
        <MaterialCommunityIcons name={incoming ? 'arrow-bottom-left' : 'arrow-top-right'} size={20} color={color} />
      </View>
      <View style={styles.flex}>
        <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{type}</Text>
        {movement.reason ? <Text style={[typography.body, { color: colors.textSecondary }]}>{movement.reason}</Text> : null}
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{when}</Text>
      </View>
      <Text style={[typography.itemTitle, tabularNumbers, { color }]}>{`${incoming ? '+' : '−'}${amount}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  headerButton: { minWidth: minTouchTarget, minHeight: minTouchTarget, alignItems: 'flex-end', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.xxl },
  identity: { gap: spacing.xs },
  summary: { borderRadius: radius.sheet, borderWidth: 1, padding: spacing.xl, gap: spacing.lg },
  summaryTop: { alignItems: 'flex-start', gap: spacing.xs },
  unknownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bigNumber: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.6 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  stats: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg },
  stat: { flex: 1, gap: 2 },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  infoRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  infoIcon: { marginTop: 2 },
  emptyHistory: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', paddingVertical: spacing.md },
  movement: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md, alignItems: 'flex-start' },
  movementIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
