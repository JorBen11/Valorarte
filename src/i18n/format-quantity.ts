import { toFixed, type Rational } from '@/domain/rational';
import { BASE_UNITS, convert, type Dimension, type UnitCode } from '@/domain/units';

/**
 * Texto de una cantidad para mostrar: hasta 6 decimales, sin ceros finales y con el
 * separador decimal de la región del dispositivo. Solo afecta a la presentación.
 */
export function formatQuantity(value: Rational, decimalSeparator: string): string {
  const fixed = toFixed(value, 6).replace(/\.?0+$/, '');
  return fixed.replace('.', decimalSeparator);
}

/** Cantidad normalizada (unidad base) expresada en la unidad de visualización. */
export function formatNormalizedQuantity(
  normalized: Rational,
  dimension: Dimension,
  displayUnit: UnitCode,
  decimalSeparator: string,
): string {
  return formatQuantity(convert(normalized, BASE_UNITS[dimension], displayUnit), decimalSeparator);
}

/** Convierte lo que escribe el usuario ("1,5") en texto decimal del dominio ("1.5"). */
export function normalizeDecimalInput(text: string, decimalSeparator: string): string {
  const trimmed = text.trim();
  return decimalSeparator === '.' ? trimmed : trimmed.replace(decimalSeparator, '.');
}
