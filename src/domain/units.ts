import { divide, multiply, parseDecimal, type Rational } from './rational';

/** Unidades base y alcance: docs/BUSINESS-RULES.md §3. */
export type Dimension = 'mass' | 'volume' | 'length' | 'area' | 'count';
export type UnitSystem = 'metric' | 'imperial' | 'neutral';

export interface UnitDefinition {
  code: UnitCode;
  dimension: Dimension;
  system: UnitSystem;
  /** Etiqueta de presentación; puede diferir del código interno (cm2 → cm²). */
  label: string;
  /** Factor exacto hacia la unidad base de la dimensión. No se trunca a seis decimales. */
  baseConversionFactor: Rational;
}

/**
 * Factores exactos por definición (NIST Handbook 44, Apéndice C):
 * 1 lb = 453.59237 g; 1 in = 25.4 mm; 1 gal EE. UU. = 231 in³ = 3785.411784 ml.
 * El volumen "imperial" usa las medidas de EE. UU. (no el galón británico de 4546.09 ml),
 * y la taza es la taza de EE. UU. (8 fl oz), no la taza métrica de 240 ml.
 */
const CATALOG = {
  g: ['mass', 'metric', 'g', '1'],
  mg: ['mass', 'metric', 'mg', '0.001'],
  kg: ['mass', 'metric', 'kg', '1000'],
  oz: ['mass', 'imperial', 'oz', '28.349523125'],
  lb: ['mass', 'imperial', 'lb', '453.59237'],
  ml: ['volume', 'metric', 'ml', '1'],
  l: ['volume', 'metric', 'L', '1000'],
  tsp: ['volume', 'imperial', 'tsp', '4.92892159375'],
  tbsp: ['volume', 'imperial', 'tbsp', '14.78676478125'],
  fl_oz: ['volume', 'imperial', 'fl oz', '29.5735295625'],
  cup: ['volume', 'imperial', 'cup', '236.5882365'],
  gal: ['volume', 'imperial', 'gal', '3785.411784'],
  mm: ['length', 'metric', 'mm', '1'],
  cm: ['length', 'metric', 'cm', '10'],
  m: ['length', 'metric', 'm', '1000'],
  in: ['length', 'imperial', 'in', '25.4'],
  ft: ['length', 'imperial', 'ft', '304.8'],
  yd: ['length', 'imperial', 'yd', '914.4'],
  cm2: ['area', 'metric', 'cm²', '1'],
  m2: ['area', 'metric', 'm²', '10000'],
  in2: ['area', 'imperial', 'in²', '6.4516'],
  ft2: ['area', 'imperial', 'ft²', '929.0304'],
  unit: ['count', 'neutral', 'unit', '1'],
} as const satisfies Record<string, readonly [Dimension, UnitSystem, string, string]>;

export type UnitCode = keyof typeof CATALOG;

export const BASE_UNITS: Record<Dimension, UnitCode> = {
  mass: 'g',
  volume: 'ml',
  length: 'mm',
  area: 'cm2',
  count: 'unit',
};

export const UNITS: Readonly<Record<UnitCode, UnitDefinition>> = Object.fromEntries(
  Object.entries(CATALOG).map(([code, [dimension, system, label, factor]]) => [
    code,
    { code: code as UnitCode, dimension, system, label, baseConversionFactor: parseDecimal(factor) },
  ]),
) as Record<UnitCode, UnitDefinition>;

export class UnknownUnitError extends Error {
  constructor(readonly code: string) {
    super(`Unknown unit: "${code}"`);
    this.name = 'UnknownUnitError';
  }
}

export class IncompatibleUnitsError extends Error {
  constructor(
    readonly from: UnitCode,
    readonly to: UnitCode,
  ) {
    super(`Cannot convert ${from} (${UNITS[from].dimension}) to ${to} (${UNITS[to].dimension})`);
    this.name = 'IncompatibleUnitsError';
  }
}

export function isDimension(value: string): value is Dimension {
  return Object.prototype.hasOwnProperty.call(BASE_UNITS, value);
}

export function isUnitCode(code: string): code is UnitCode {
  return Object.prototype.hasOwnProperty.call(CATALOG, code);
}

export function getUnit(code: string): UnitDefinition {
  if (!isUnitCode(code)) throw new UnknownUnitError(code);
  return UNITS[code];
}

export function areCompatible(a: UnitCode, b: UnitCode): boolean {
  return UNITS[a].dimension === UNITS[b].dimension;
}

/** Cantidad normalizada: la cantidad original expresada en la unidad base de su dimensión. Exacta. */
export function toBaseQuantity(quantity: Rational, unit: UnitCode): Rational {
  return multiply(quantity, UNITS[unit].baseConversionFactor);
}

/**
 * Convierte desde la cantidad original con un único factor compuesto (from → base → to),
 * sin pasar por valores intermedios redondeados. El resultado es exacto; cuantizarlo
 * para guardar o mostrar es responsabilidad de quien llama.
 */
export function convert(quantity: Rational, from: UnitCode, to: UnitCode): Rational {
  if (!areCompatible(from, to)) throw new IncompatibleUnitsError(from, to);
  return divide(toBaseQuantity(quantity, from), UNITS[to].baseConversionFactor);
}
