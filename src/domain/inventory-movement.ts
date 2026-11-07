import type { Ingredient } from './ingredient';
import { QUANTITY_SCALE } from './ingredient';
import { add, compare, InvalidDecimalError, parseDecimal, toFixed, ZERO, type Rational } from './rational';
import { isUnitCode, toBaseQuantity, UNITS, type UnitCode } from './units';
import { assertValid, isUuid, requiredText, type ValidationIssue } from './validation';

/** docs/DATA-MODEL.md §16. Solo se generan los tipos que la app ya sabe registrar. */
export type MovementType = 'inventory_adjustment';
export type AdjustmentDirection = 'in' | 'out';

/** Movimiento inmutable: la persistencia rechaza UPDATE y DELETE. */
export interface InventoryMovement {
  id: string;
  businessId: string;
  itemType: 'ingredient';
  itemId: string;
  movementType: MovementType;
  /** Cantidad original con signo, en `unitCode`, escala 6. */
  quantityDelta: string;
  unitCode: UnitCode;
  /** Cantidad con signo en la unidad base de la dimensión, escala 6. */
  normalizedQuantityDelta: string;
  /** Los ajustes no se valoran (decisión 2026-10-28, BUSINESS-RULES §5): sin `totalValueDelta`. */
  affectsValuation: false;
  reason: string;
  occurredAt: string;
  createdAt: string;
}

export interface InventoryAdjustmentInput {
  direction: AdjustmentDirection;
  /** Cantidad positiva en `unitCode`, como texto decimal. */
  quantity: string;
  unitCode: string;
  reason: string;
}

/** Existencias = Σ normalizedQuantityDelta. `null` si el artículo nunca tuvo movimientos. */
export function sumStock(deltas: readonly string[]): Rational | null {
  return deltas.length === 0 ? null : deltas.reduce((total, d) => add(total, parseDecimal(d)), ZERO);
}

export type StockStatus = 'unknown' | 'out' | 'low' | 'ok';

/**
 * - `unknown`: sin movimientos; no se sabe cuánto hay, no se trata como cero.
 * - `out`: existencias exactamente cero (el stock negativo no se permite).
 * - `low`: existencias ≤ umbral; coincide con «alerta cuando el stock llegue a esta cantidad».
 */
export function stockStatus(stock: Rational | null, lowStockThreshold: string | null): StockStatus {
  if (stock === null) return 'unknown';
  if (compare(stock, ZERO) <= 0) return 'out';
  if (lowStockThreshold !== null && compare(stock, parseDecimal(lowStockThreshold)) <= 0) return 'low';
  return 'ok';
}

const signed = (direction: AdjustmentDirection, value: string) => (direction === 'out' ? '-' : '') + value;
const normalizedDelta = (direction: AdjustmentDirection, quantity: Rational, unitCode: UnitCode) =>
  signed(direction, toFixed(toBaseQuantity(quantity, unitCode), QUANTITY_SCALE));

/** Existencias resultantes de un ajuste aún sin validar; `null` si la cantidad no es un número positivo. */
export function previewStockAfter(current: Rational | null, input: InventoryAdjustmentInput): Rational | null {
  if (!isUnitCode(input.unitCode)) return null;
  try {
    const quantity = parseDecimal(input.quantity);
    if (compare(quantity, ZERO) <= 0) return null;
    return add(current ?? ZERO, parseDecimal(normalizedDelta(input.direction, quantity, input.unitCode)));
  } catch (error) {
    if (error instanceof InvalidDecimalError) return null;
    throw error;
  }
}

/**
 * Ajuste manual de existencias. Requiere motivo (ROADMAP Fase 2) y nunca deja el stock en negativo.
 * La cantidad normalizada se cuantiza a escala 6 antes de comparar, que es lo que se persiste.
 */
export function createInventoryAdjustment(
  ingredient: Ingredient,
  currentStock: Rational | null,
  input: InventoryAdjustmentInput,
  id: string,
  now: Date,
): InventoryMovement {
  const issues: ValidationIssue[] = [];
  if (!isUuid(id)) issues.push({ field: 'id', code: 'invalid' });
  const reason = requiredText(input.reason, 'reason', issues);
  const { unitCode } = input;
  const validUnit = isUnitCode(unitCode);
  if (!validUnit) issues.push({ field: 'unitCode', code: 'unknownUnit' });
  else if (UNITS[unitCode].dimension !== ingredient.dimension) issues.push({ field: 'unitCode', code: 'dimensionMismatch' });

  let quantityDelta = '';
  let normalizedQuantityDelta = '';
  try {
    const quantity = parseDecimal(input.quantity);
    if (compare(quantity, ZERO) <= 0) issues.push({ field: 'quantity', code: 'notPositive' });
    else if (validUnit) {
      quantityDelta = signed(input.direction, toFixed(quantity, QUANTITY_SCALE));
      normalizedQuantityDelta = normalizedDelta(input.direction, quantity, unitCode);
      if (compare(parseDecimal(normalizedQuantityDelta), ZERO) === 0) issues.push({ field: 'quantity', code: 'notPositive' });
      else if (compare(add(currentStock ?? ZERO, parseDecimal(normalizedQuantityDelta)), ZERO) < 0) {
        issues.push({ field: 'quantity', code: 'insufficientStock' });
      }
    }
  } catch (error) {
    if (!(error instanceof InvalidDecimalError)) throw error;
    issues.push({ field: 'quantity', code: 'invalidNumber' });
  }
  assertValid(issues);

  const timestamp = now.toISOString();
  return {
    id,
    businessId: ingredient.businessId,
    itemType: 'ingredient',
    itemId: ingredient.id,
    movementType: 'inventory_adjustment',
    quantityDelta,
    unitCode: unitCode as UnitCode,
    normalizedQuantityDelta,
    affectsValuation: false,
    reason,
    occurredAt: timestamp,
    createdAt: timestamp,
  };
}
