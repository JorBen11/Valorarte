import { divide, equals, InvalidDecimalError, multiply, parseDecimal, quantize, rational, toFixed } from './rational';

const d = parseDecimal;

describe('parseDecimal', () => {
  it('representa exactamente decimales que el punto flotante binario no puede', () => {
    expect(equals(d('0.1'), rational(1n, 10n))).toBe(true);
    expect(equals(d('-0.25'), rational(-1n, 4n))).toBe(true);
    expect(equals(d('+3'), rational(3n))).toBe(true);
  });

  it('rechaza texto que no es un decimal', () => {
    for (const bad of ['', '1e3', '1,5', '.5', '5.', 'NaN', '1.2.3']) {
      expect(() => d(bad)).toThrow(InvalidDecimalError);
    }
  });
});

describe('aritmética exacta', () => {
  it('0.1 × 3 = 0.3 exacto (en number da 0.30000000000000004)', () => {
    expect(equals(multiply(d('0.1'), d('3')), d('0.3'))).toBe(true);
  });

  it('dividir y volver a multiplicar recupera el valor original', () => {
    const third = divide(d('1'), d('3'));
    expect(equals(multiply(third, d('3')), d('1'))).toBe(true);
  });

  it('rechaza la división entre cero', () => {
    expect(() => divide(d('1'), d('0'))).toThrow(RangeError);
    expect(() => rational(1n, 0n)).toThrow(RangeError);
  });

  it('opera más allá del entero exacto de number (2^53)', () => {
    const big = d('9007199254740993');
    expect(multiply(big, d('2')).num).toBe(18014398509481986n);
  });
});

describe('quantize / toFixed (ROUND_HALF_UP)', () => {
  it('redondea las mitades lejos de cero', () => {
    expect(toFixed(d('0.0000005'), 6)).toBe('0.000001');
    expect(toFixed(d('-0.0000005'), 6)).toBe('-0.000001');
    expect(toFixed(d('0.00000049'), 6)).toBe('0.000000');
    expect(quantize(d('2.5'), 0)).toBe(3n);
    expect(quantize(d('-2.5'), 0)).toBe(-3n);
  });

  it('redondea solo cuando se pide y conserva la fracción exacta', () => {
    expect(toFixed(divide(d('1'), d('3')), 6)).toBe('0.333333');
    expect(toFixed(divide(d('2'), d('3')), 6)).toBe('0.666667');
    expect(toFixed(d('12'), 0)).toBe('12');
  });

  it('rechaza escalas inválidas', () => {
    expect(() => quantize(d('1'), -1)).toThrow(RangeError);
    expect(() => quantize(d('1'), 1.5)).toThrow(RangeError);
  });
});
