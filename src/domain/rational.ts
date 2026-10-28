/**
 * Número racional exacto sobre BigInt (num / den, den > 0, fracción irreducible).
 * Multiplicar y dividir nunca pierden precisión; solo `quantize` redondea,
 * y solo debe llamarse en los puntos definidos por las reglas de negocio
 * (docs/BUSINESS-RULES.md §19).
 */
export interface Rational {
  readonly num: bigint;
  readonly den: bigint;
}

export class InvalidDecimalError extends Error {
  constructor(input: string) {
    super(`Invalid decimal: "${input}"`);
    this.name = 'InvalidDecimalError';
  }
}

const DECIMAL_PATTERN = /^([+-])?(\d+)(?:\.(\d+))?$/;

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

export function rational(num: bigint, den: bigint = 1n): Rational {
  if (den === 0n) throw new RangeError('Division by zero');
  const sign = den < 0n ? -1n : 1n;
  const g = gcd(num, den) || 1n;
  return { num: (sign * num) / g, den: (sign * den) / g };
}

/** Acepta solo texto decimal ("12", "-0.25"); nunca `number`, para no heredar errores binarios. */
export function parseDecimal(input: string): Rational {
  const match = DECIMAL_PATTERN.exec(input.trim());
  if (!match) throw new InvalidDecimalError(input);
  const [, sign, int, frac = ''] = match;
  const num = BigInt(int + frac) * (sign === '-' ? -1n : 1n);
  return rational(num, 10n ** BigInt(frac.length));
}

export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.num * b.num, a.den * b.den);
}

export function divide(a: Rational, b: Rational): Rational {
  if (b.num === 0n) throw new RangeError('Division by zero');
  return rational(a.num * b.den, a.den * b.num);
}

export function equals(a: Rational, b: Rational): boolean {
  return a.num === b.num && a.den === b.den;
}

/** Entero escalado `round(value × 10^scale)` con ROUND_HALF_UP (mitades lejos de cero). */
export function quantize(value: Rational, scale: number): bigint {
  if (!Number.isInteger(scale) || scale < 0) throw new RangeError(`Invalid scale: ${scale}`);
  const scaled = value.num * 10n ** BigInt(scale);
  const abs = scaled < 0n ? -scaled : scaled;
  const rounded = (2n * abs + value.den) / (2n * value.den);
  return scaled < 0n ? -rounded : rounded;
}

/** Representación decimal cuantizada con `scale` decimales (ROUND_HALF_UP). */
export function toFixed(value: Rational, scale: number): string {
  const q = quantize(value, scale);
  const abs = (q < 0n ? -q : q).toString().padStart(scale + 1, '0');
  const sign = q < 0n ? '-' : '';
  if (scale === 0) return sign + abs;
  return `${sign}${abs.slice(0, -scale)}.${abs.slice(-scale)}`;
}
