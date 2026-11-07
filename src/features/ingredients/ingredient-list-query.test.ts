import { createIngredient, type NewIngredientInput } from '@/domain/ingredient';
import { stockStatus } from '@/domain/inventory-movement';
import { parseDecimal } from '@/domain/rational';

import { activeFilterCount, applyIngredientQuery, categoriesOf, DEFAULT_QUERY } from './ingredient-list-query';
import type { IngredientWithStock } from './ingredient-use-cases';

const businessId = crypto.randomUUID();

function item(input: Partial<NewIngredientInput> & { name: string }, stock: string | null, activity = '2026-10-01'): IngredientWithStock {
  const ingredient = createIngredient(
    { businessId, dimension: 'mass', inventoryUnitCode: 'g', ...input },
    crypto.randomUUID(),
    new Date('2026-10-01T00:00:00Z'),
  );
  const value = stock === null ? null : parseDecimal(stock);
  return { ingredient, stock: value, status: stockStatus(value, ingredient.lowStockThreshold), lastActivityAt: activity };
}

const items = [
  item({ name: 'Azúcar', category: 'Secos', lowStockThreshold: '500' }, '200', '2026-10-05'),
  item({ name: 'harina', category: 'Secos' }, '0'),
  item({ name: 'Leche', dimension: 'volume', inventoryUnitCode: 'ml', category: 'Lácteos' }, '50', '2026-10-09'),
  item({ name: 'Cera' }, null),
  item({ name: 'Chocolate' }, '3000'),
];
const names = (list: IngredientWithStock[]) => list.map((i) => i.ingredient.name);

describe('consulta del listado de ingredientes', () => {
  it('por defecto ordena por nombre sin distinguir mayúsculas ni acentos', () => {
    expect(names(applyIngredientQuery(items, DEFAULT_QUERY))).toEqual(['Azúcar', 'Cera', 'Chocolate', 'harina', 'Leche']);
  });

  it('busca por nombre o categoría ignorando acentos', () => {
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, search: 'azucar' }))).toEqual(['Azúcar']);
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, search: 'lacteos' }))).toEqual(['Leche']);
    expect(applyIngredientQuery(items, { ...DEFAULT_QUERY, search: 'zzz' })).toEqual([]);
  });

  it('combina filtro de existencias y categoría', () => {
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, stock: 'low' }))).toEqual(['Azúcar']);
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, stock: 'out' }))).toEqual(['harina']);
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, stock: 'unknown' }))).toEqual(['Cera']);
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, stock: 'out', category: 'Secos' }))).toEqual(['harina']);
    expect(applyIngredientQuery(items, { ...DEFAULT_QUERY, stock: 'out', category: 'Lácteos' })).toEqual([]);
    expect(activeFilterCount({ ...DEFAULT_QUERY, stock: 'out', category: 'Secos' })).toBe(2);
  });

  it('ordena por cantidad dentro de cada dimensión, desconocidos al final', () => {
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, sort: 'quantity' }))).toEqual([
      'harina',
      'Azúcar',
      'Chocolate',
      'Leche',
      'Cera',
    ]);
  });

  it('ordena por prioridad de reposición y por actividad reciente', () => {
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, sort: 'restock' }))).toEqual([
      'harina',
      'Azúcar',
      'Cera',
      'Chocolate',
      'Leche',
    ]);
    expect(names(applyIngredientQuery(items, { ...DEFAULT_QUERY, sort: 'recent' })).slice(0, 2)).toEqual(['Leche', 'Azúcar']);
  });

  it('lista categorías únicas ordenadas', () => {
    expect(categoriesOf(items)).toEqual(['Lácteos', 'Secos']);
  });
});
