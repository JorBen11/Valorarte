import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getLocales } from 'expo-localization';
import type { TFunction } from 'i18next';
import type { ComponentProps } from 'react';

import type { Ingredient } from '@/domain/ingredient';
import type { StockStatus } from '@/domain/inventory-movement';
import { parseDecimal, type Rational } from '@/domain/rational';
import { formatNormalizedQuantity } from '@/i18n/format-quantity';
import type { ThemeColors } from '@/theme/tokens';

import { unitLabel } from './unit-labels';

export const decimalSeparator = () => getLocales()[0]?.decimalSeparator ?? '.';

/** Cantidad normalizada en la unidad de inventario, con unidad: «2,5 kg». Hasta 6 decimales, sin redondeo visible. */
export function formatStock(normalized: Rational, ingredient: Ingredient, t: TFunction): string {
  const quantity = formatNormalizedQuantity(normalized, ingredient.dimension, ingredient.inventoryUnitCode, decimalSeparator());
  return t('ingredients.stock.quantity', { quantity, unit: unitLabel(ingredient.inventoryUnitCode, t) });
}

export const formatThreshold = (ingredient: Ingredient, t: TFunction) =>
  ingredient.lowStockThreshold === null ? null : formatStock(parseDecimal(ingredient.lowStockThreshold), ingredient, t);

/** Icono y color de cada estado; el texto (`ingredients.stock.status.*`) siempre acompaña al color. */
export const STOCK_STATUS_STYLE: Record<
  StockStatus,
  { icon: ComponentProps<typeof MaterialCommunityIcons>['name']; color: keyof ThemeColors }
> = {
  out: { icon: 'close-octagon', color: 'textPrimary' },
  low: { icon: 'alert', color: 'textPrimary' },
  unknown: { icon: 'help-circle-outline', color: 'textSecondary' },
  ok: { icon: 'check-circle-outline', color: 'textPrimary' },
};

export function formatDateTime(iso: string, language: string): string {
  return new Date(iso).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' });
}
