import { divide, equals, multiply, parseDecimal, toFixed, type Rational } from './rational';
import {
  areCompatible,
  BASE_UNITS,
  convert,
  getUnit,
  IncompatibleUnitsError,
  isUnitCode,
  toBaseQuantity,
  UnknownUnitError,
  UNITS,
  type UnitCode,
} from './units';

const d = parseDecimal;
const expectExact = (actual: Rational, expected: Rational) => expect(equals(actual, expected)).toBe(true);
const factor = (code: UnitCode) => UNITS[code].baseConversionFactor;

describe('catálogo', () => {
  it('define las unidades base aprobadas con factor 1', () => {
    expect(BASE_UNITS).toEqual({ mass: 'g', volume: 'ml', length: 'mm', area: 'cm2', count: 'unit' });
    for (const [dimension, code] of Object.entries(BASE_UNITS)) {
      expect(UNITS[code].dimension).toBe(dimension);
      expectExact(factor(code), d('1'));
    }
  });

  it('usa cm2 como código interno y cm² solo como etiqueta', () => {
    expect(isUnitCode('cm2')).toBe(true);
    expect(isUnitCode('cm²')).toBe(false);
    expect(UNITS.cm2.label).toBe('cm²');
  });

  it('los factores imperiales son coherentes con sus definiciones exactas', () => {
    expectExact(factor('oz'), divide(factor('lb'), d('16')));
    expectExact(factor('fl_oz'), divide(factor('gal'), d('128')));
    expectExact(factor('cup'), multiply(factor('fl_oz'), d('8')));
    expectExact(factor('tbsp'), divide(factor('fl_oz'), d('2')));
    expectExact(factor('tsp'), divide(factor('tbsp'), d('3')));
    // 1 gal = 231 in³; 1 in³ = 25.4³ mm³ y 1 ml = 1000 mm³.
    const cubicInchMm3 = multiply(factor('in'), multiply(factor('in'), factor('in')));
    expectExact(factor('gal'), divide(multiply(d('231'), cubicInchMm3), d('1000')));
    expectExact(factor('ft'), multiply(factor('in'), d('12')));
    expectExact(factor('yd'), multiply(factor('ft'), d('3')));
    expectExact(factor('in2'), divide(multiply(factor('in'), factor('in')), d('100')));
    expectExact(factor('ft2'), multiply(factor('in2'), d('144')));
  });

  it('conserva factores que no caben en seis decimales', () => {
    expect(toFixed(factor('oz'), 9)).toBe('28.349523125');
    expect(toFixed(factor('tbsp'), 11)).toBe('14.78676478125');
    expect(equals(factor('oz'), d('28.349523'))).toBe(false);
  });

  it('getUnit rechaza códigos desconocidos o personalizados', () => {
    expect(getUnit('kg').dimension).toBe('mass');
    expect(() => getUnit('caja')).toThrow(UnknownUnitError);
    expect(() => getUnit('toString')).toThrow(UnknownUnitError);
  });
});

describe('conversión a la unidad base', () => {
  it('normaliza cada dimensión', () => {
    expectExact(toBaseQuantity(d('1.5'), 'kg'), d('1500'));
    expectExact(toBaseQuantity(d('2'), 'lb'), d('907.18474'));
    expectExact(toBaseQuantity(d('0.75'), 'l'), d('750'));
    expectExact(toBaseQuantity(d('3'), 'tsp'), d('14.78676478125'));
    expectExact(toBaseQuantity(d('1.2'), 'm'), d('1200'));
    expectExact(toBaseQuantity(d('2'), 'ft2'), d('1858.0608'));
    expectExact(toBaseQuantity(d('12'), 'unit'), d('12'));
  });

  it('es exacta para cantidades cercanas al límite de precisión', () => {
    expectExact(toBaseQuantity(d('0.000001'), 'oz'), d('0.000028349523125'));
    expectExact(toBaseQuantity(d('0.0000001'), 'mg'), d('0.0000000001'));
  });
});

describe('conversión entre unidades', () => {
  it('convierte unidades compatibles', () => {
    expectExact(convert(d('1'), 'lb', 'oz'), d('16'));
    expectExact(convert(d('1'), 'gal', 'cup'), d('16'));
    expectExact(convert(d('2500'), 'g', 'kg'), d('2.5'));
    expectExact(convert(d('1'), 'yd', 'in'), d('36'));
    expectExact(convert(d('1'), 'm2', 'ft2'), divide(d('10000'), d('929.0304')));
  });

  it('una ida y vuelta devuelve exactamente la cantidad original', () => {
    const original = d('1');
    const inLb = convert(original, 'g', 'lb');
    expect(toFixed(inLb, 6)).toBe('0.002205');
    expectExact(convert(inLb, 'lb', 'g'), original);
  });

  it('convertir desde el original evita la deriva de un valor ya redondeado', () => {
    const original = d('3');
    const roundedLb = d(toFixed(convert(original, 'g', 'lb'), 6));
    expect(equals(convert(roundedLb, 'lb', 'g'), original)).toBe(false);
    expectExact(convert(original, 'g', 'oz'), divide(d('3'), factor('oz')));
  });

  it('rechaza conversiones entre dimensiones distintas', () => {
    expect(areCompatible('g', 'ml')).toBe(false);
    expect(() => convert(d('1'), 'g', 'ml')).toThrow(IncompatibleUnitsError);
    expect(() => convert(d('1'), 'cup', 'oz')).toThrow(IncompatibleUnitsError);
    expect(() => convert(d('1'), 'unit', 'g')).toThrow(IncompatibleUnitsError);
    expect(() => convert(d('1'), 'mm', 'cm2')).toThrow(IncompatibleUnitsError);
  });

  it('conteo solo convierte a sí mismo', () => {
    expectExact(convert(d('7'), 'unit', 'unit'), d('7'));
  });
});
