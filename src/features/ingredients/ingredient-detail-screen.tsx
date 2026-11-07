import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState, type ComponentProps, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { LoadingView, StateView } from '@/components/ui/state-view';
import { Divider, IconButton, Surface } from '@/components/ui/surface';
import { MainTag } from '@/components/ui/tag';
import { useDatabase } from '@/data/database/database-provider';
import type { InventoryMovement } from '@/domain/inventory-movement';
import { parseDecimal } from '@/domain/rational';
import { BASE_UNITS } from '@/domain/units';
import { formatQuantity } from '@/i18n/format-quantity';
import { FORM_MAX_WIDTH, useWindowLayout } from '@/theme/layout';
import { useTheme } from '@/theme/theme-provider';
import { fontFamily, spacing, tabularNumbers, typography } from '@/theme/tokens';

import { loadIngredientDetail, type IngredientDetail } from './ingredient-use-cases';
import { decimalSeparator, formatDateTime, formatStock, formatThreshold, STOCK_STATUS_STYLE } from './stock-labels';
import { DIMENSION_ICONS, dimensionLabel, unitLabel, unitName } from './unit-labels';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'missing' } | { status: 'ready'; detail: IngredientDetail };

export function IngredientDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id?: string }>();
  return <IngredientDetailView id={id} />;
}

/** Detalle completo: pantalla propia en ventanas estrechas, panel junto a la lista en las amplias. */
export function IngredientDetailView({ id, embedded = false }: { id: string; embedded?: boolean }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const layout = useWindowLayout();
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
  const edit = () => router.push({ pathname: '/ingredients/new', params: { ingredientId: id } });
  const header = embedded ? null : (
    <Stack.Screen
      options={{
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: fontFamily.display, fontSize: 18 },
        headerRight: ready ? () => <IconButton bare icon="pencil-outline" accessibilityLabel={t('ingredients.detail.edit')} onPress={edit} /> : undefined,
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
  const threshold = formatThreshold(ingredient, t);
  const adjust = () => router.push({ pathname: '/ingredients/adjust', params: { ingredientId: ingredient.id } });

  const alert = status === 'out' || status === 'low';
  const stockText = stock ? formatStock(stock, ingredient, t) : null;
  const statusLabel = t(`ingredients.stock.status.${status}`);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {header}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: embedded ? spacing.xxl : layout.gutter,
            paddingTop: embedded ? spacing.xl : spacing.sm,
            paddingBottom: insets.bottom + spacing.xxxl,
            maxWidth: embedded ? undefined : FORM_MAX_WIDTH + layout.gutter * 2,
          },
        ]}>
        {/* A. Identidad y estado */}
        <View style={styles.identity}>
          <View style={styles.flex}>
            <Text accessibilityRole="header" style={[typography.screenTitle, { color: colors.textPrimary }]}>
              {ingredient.name}
            </Text>
            {ingredient.category ? <Text style={[typography.body, { color: colors.textSecondary }]}>{ingredient.category}</Text> : null}
          </View>
          {embedded ? <IconButton icon="pencil-outline" accessibilityLabel={t('ingredients.detail.edit')} onPress={edit} /> : null}
        </View>

        {/* B. Existencias: solo una alerta abierta lleva la etiqueta principal. */}
        {alert && stockText ? (
          <MainTag tone={status === 'out' ? 'ink' : 'attention'} backdrop={colors.background} hanging>
            {(on) => (
              <View accessible style={styles.tagBody}>
                <View style={styles.status}>
                  <MaterialCommunityIcons name={statusStyle.icon} size={18} color={on} />
                  <Text style={[typography.itemTitle, styles.flex, { color: on }]}>{statusLabel}</Text>
                </View>
                <Text style={[typography.amountMain, { color: on }]}>{stockText}</Text>
              </View>
            )}
          </MainTag>
        ) : stockText ? (
          <View accessible style={styles.tagBody}>
            <Text style={[typography.label, { color: colors.textSecondary }]}>{t('ingredients.detail.available')}</Text>
            <Text style={[typography.amountMain, { color: colors.textPrimary }]}>{stockText}</Text>
          </View>
        ) : (
          <View accessible style={styles.tagBody}>
            <View style={styles.status}>
              <MaterialCommunityIcons name={statusStyle.icon} size={20} color={colors.textSecondary} />
              <Text style={[typography.sectionTitle, styles.flex, { color: colors.textSecondary }]}>{statusLabel}</Text>
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('ingredients.detail.unknownStockHint')}</Text>
          </View>
        )}
        <Button label={t('ingredients.adjust.title')} variant="tonal" onPress={adjust} />

        <Surface padded>
          <Stat label={t('ingredients.detail.threshold')} value={threshold ?? t('ingredients.detail.noThreshold')} muted={!threshold} />
          <Divider />
          <Stat
            label={t('ingredients.detail.averageCost')}
            value={t('ingredients.detail.costUnavailable')}
            hint={t('ingredients.detail.costUnavailableHint')}
            muted
          />
        </Surface>

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
              <Text style={[typography.body, styles.flex, { color: colors.textSecondary }]}>{t('ingredients.detail.noMovements')}</Text>
            </View>
          ) : (
            <Surface>
              {movements.map((movement, index) => (
                <MovementRow key={movement.id} movement={movement} divider={index > 0} />
              ))}
            </Surface>
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
  const { fontScale } = useWindowLayout();
  const incoming = !movement.quantityDelta.startsWith('-');
  // Entrada o salida no es éxito ni error: la flecha y el signo lo dicen sin color semántico.
  const color = colors.textPrimary;
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
      <View style={[styles.movementText, { flexBasis: 130 * Math.max(fontScale, 1) }]}>
        <Text style={[typography.itemTitle, { color: colors.textPrimary }]}>{type}</Text>
        {movement.reason ? <Text style={[typography.body, { color: colors.textSecondary }]}>{movement.reason}</Text> : null}
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{when}</Text>
      </View>
      <Text style={[typography.quantity, styles.amount, { color }]}>{`${incoming ? '+' : '−'}${amount}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.xl },
  identity: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  tagBody: { gap: spacing.xs },
  status: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stat: { gap: 2 },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  infoRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  infoIcon: { marginTop: 2 },
  emptyHistory: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', paddingVertical: spacing.md },
  movement: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, padding: spacing.md, alignItems: 'flex-start' },
  movementIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  movementText: { flexGrow: 1, flexShrink: 1 },
  amount: { textAlign: 'right', flexShrink: 1 },
});
