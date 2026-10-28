import { InvalidDecimalError, parseDecimal, toFixed } from './rational';
import { isDimension, isUnitCode, toBaseQuantity, UNITS, type Dimension, type UnitCode } from './units';
import { assertValid, isUuid, optionalText, requiredText, type ValidationIssue } from './validation';

/** Escala de almacenamiento de cantidades físicas (docs/BUSINESS-RULES.md §19.1). */
export const QUANTITY_SCALE = 6;

/** docs/DATA-MODEL.md §6. Existencias y costo promedio no son campos: salen de los movimientos. */
export interface Ingredient {
  id: string;
  businessId: string;
  name: string;
  category: string | null;
  dimension: Dimension;
  /** Unidad preferida para introducir y mostrar cantidades. No cambia la unidad base ni la valoración. */
  inventoryUnitCode: UnitCode;
  /** Cantidad normalizada (unidad base de `dimension`) con 6 decimales, o `null` si no hay umbral. */
  lowStockThreshold: string | null;
  tracksLots: boolean;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewIngredientInput {
  businessId: string;
  name: string;
  category?: string | null;
  dimension: string;
  inventoryUnitCode: string;
  /** Umbral expresado en `inventoryUnitCode`, como texto decimal. */
  lowStockThreshold?: string | null;
  tracksLots?: boolean;
  notes?: string | null;
}

export function createIngredient(input: NewIngredientInput, id: string, now: Date): Ingredient {
  const issues: ValidationIssue[] = [];
  if (!isUuid(id)) issues.push({ field: 'id', code: 'invalid' });
  if (!isUuid(input.businessId)) issues.push({ field: 'businessId', code: 'invalid' });
  const name = requiredText(input.name, 'name', issues);

  const { dimension, inventoryUnitCode: unitCode } = input;
  const validDimension = isDimension(dimension);
  if (!validDimension) issues.push({ field: 'dimension', code: 'invalid' });
  const validUnit = isUnitCode(unitCode);
  if (!validUnit) issues.push({ field: 'inventoryUnitCode', code: 'unknownUnit' });
  else if (validDimension && UNITS[unitCode].dimension !== dimension) {
    issues.push({ field: 'inventoryUnitCode', code: 'dimensionMismatch' });
  }

  let lowStockThreshold: string | null = null;
  const rawThreshold = optionalText(input.lowStockThreshold);
  if (rawThreshold !== null && validUnit) {
    try {
      const value = parseDecimal(rawThreshold);
      if (value.num < 0n) issues.push({ field: 'lowStockThreshold', code: 'negative' });
      // Punto de cuantización definido: la cantidad normalizada se persiste con escala 6.
      else lowStockThreshold = toFixed(toBaseQuantity(value, unitCode), QUANTITY_SCALE);
    } catch (error) {
      if (!(error instanceof InvalidDecimalError)) throw error;
      issues.push({ field: 'lowStockThreshold', code: 'invalidNumber' });
    }
  }
  assertValid(issues);

  const timestamp = now.toISOString();
  return {
    id,
    businessId: input.businessId,
    name,
    category: optionalText(input.category),
    dimension: dimension as Dimension,
    inventoryUnitCode: unitCode as UnitCode,
    lowStockThreshold,
    tracksLots: input.tracksLots ?? false,
    isActive: true,
    notes: optionalText(input.notes),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
