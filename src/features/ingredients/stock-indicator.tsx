import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { CompactTag } from '@/components/ui/tag';
import { useTheme } from '@/theme/theme-provider';
import { typography } from '@/theme/tokens';

import type { IngredientWithStock } from './ingredient-use-cases';
import { formatStock } from './stock-labels';

/** Cantidad según su estado: normal si basta, etiqueta si pide atención y texto auxiliar si no hay registro. */
export function StockIndicator({ item }: { item: Pick<IngredientWithStock, 'ingredient' | 'stock' | 'status'> }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { ingredient, stock, status } = item;
  if (stock === null) {
    return <Text numberOfLines={1} style={[typography.caption, styles.value, { color: colors.textSecondary }]}>{t('ingredients.stock.notRecorded')}</Text>;
  }
  const quantity = formatStock(stock, ingredient, t);
  if (status === 'out') return <CompactTag tone="ink" icon="close-octagon" label={quantity} backdrop={colors.surface} />;
  if (status === 'low') return <CompactTag tone="attention" icon="alert" label={quantity} backdrop={colors.surface} />;
  return <Text numberOfLines={1} style={[typography.quantity, styles.value, { color: colors.textPrimary }]}>{quantity}</Text>;
}

// No encoge: el nombre es quien cede espacio, para que el dato nunca se recorte.
// numberOfLines={1}: a densidad 1x Android dibuja el texto unas fracciones de píxel más estrecho de lo que midió
// y partía la segunda palabra a una línea que la altura medida ocultaba («Sin» en vez de «Sin registrar»).
const styles = StyleSheet.create({ value: { flexShrink: 0 } });
