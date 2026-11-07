import { createIngredient } from './ingredient';
import { createInventoryAdjustment, previewStockAfter, stockStatus, sumStock } from './inventory-movement';
import { parseDecimal } from './rational';
import { DomainValidationError } from './validation';

const NOW = new Date('2026-10-28T10:00:00.000Z');
const uuid = () => crypto.randomUUID();
const flour = createIngredient(
  { businessId: uuid(), name: 'Harina', dimension: 'mass', inventoryUnitCode: 'kg', lowStockThreshold: '1' },
  uuid(),
  NOW,
);

function issues(fn: () => unknown) {
  try {
    fn();
  } catch (error) {
    if (error instanceof DomainValidationError) return error.issues;
    throw error;
  }
  return [];
}

describe('existencias', () => {
  it('sin movimientos el stock es desconocido, no cero', () => {
    expect(sumStock([])).toBeNull();
    expect(stockStatus(null, '1000.000000')).toBe('unknown');
  });

  it('suma deltas con exactitud decimal', () => {
    expect(sumStock(['0.100000', '0.200000', '-0.300000'])).toEqual(parseDecimal('0'));
  });

  it('clasifica sin existencias, bajo (umbral inclusive) y suficiente', () => {
    expect(stockStatus(parseDecimal('0'), '1000.000000')).toBe('out');
    expect(stockStatus(parseDecimal('1000'), '1000.000000')).toBe('low');
    expect(stockStatus(parseDecimal('1000.000001'), '1000.000000')).toBe('ok');
    expect(stockStatus(parseDecimal('5'), null)).toBe('ok');
  });
});

describe('ajuste de inventario', () => {
  it('normaliza a la unidad base y conserva la cantidad original', () => {
    const m = createInventoryAdjustment(flour, null, { direction: 'in', quantity: '1.5', unitCode: 'lb', reason: ' Conteo ' }, uuid(), NOW);
    expect(m).toMatchObject({
      quantityDelta: '1.500000',
      unitCode: 'lb',
      normalizedQuantityDelta: '680.388555',
      affectsValuation: false,
      reason: 'Conteo',
      movementType: 'inventory_adjustment',
    });
  });

  it('las salidas llevan signo negativo', () => {
    const m = createInventoryAdjustment(flour, parseDecimal('500'), { direction: 'out', quantity: '200', unitCode: 'g', reason: 'Uso' }, uuid(), NOW);
    expect(m.normalizedQuantityDelta).toBe('-200.000000');
  });

  it('exige motivo, cantidad positiva y unidad de la misma dimensión', () => {
    expect(issues(() => createInventoryAdjustment(flour, null, { direction: 'in', quantity: '0', unitCode: 'ml', reason: '' }, uuid(), NOW))).toEqual([
      { field: 'reason', code: 'required' },
      { field: 'unitCode', code: 'dimensionMismatch' },
      { field: 'quantity', code: 'notPositive' },
    ]);
    expect(issues(() => createInventoryAdjustment(flour, null, { direction: 'in', quantity: 'abc', unitCode: 'g', reason: 'x' }, uuid(), NOW))).toEqual([
      { field: 'quantity', code: 'invalidNumber' },
    ]);
  });

  it('no permite stock negativo, tampoco desde existencias desconocidas', () => {
    expect(issues(() => createInventoryAdjustment(flour, parseDecimal('100'), { direction: 'out', quantity: '100.000001', unitCode: 'g', reason: 'x' }, uuid(), NOW))).toEqual([
      { field: 'quantity', code: 'insufficientStock' },
    ]);
    expect(issues(() => createInventoryAdjustment(flour, null, { direction: 'out', quantity: '1', unitCode: 'g', reason: 'x' }, uuid(), NOW))).toEqual([
      { field: 'quantity', code: 'insufficientStock' },
    ]);
  });

  it('la vista previa coincide con lo que se guardaría', () => {
    expect(previewStockAfter(parseDecimal('1000'), { direction: 'out', quantity: '0.25', unitCode: 'kg', reason: '' })).toEqual(parseDecimal('750'));
    expect(previewStockAfter(null, { direction: 'in', quantity: '', unitCode: 'kg', reason: '' })).toBeNull();
  });
});
