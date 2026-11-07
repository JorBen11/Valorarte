import { compare } from '@/domain/rational';
import type { StockStatus } from '@/domain/inventory-movement';

import type { IngredientWithStock } from './ingredient-use-cases';

export type StockFilter = 'all' | 'low' | 'out' | 'unknown';
export type IngredientSort = 'name' | 'quantity' | 'restock' | 'recent';

export interface IngredientListQuery {
  search: string;
  stock: StockFilter;
  /** `null`: todas las categorías. */
  category: string | null;
  sort: IngredientSort;
}

export const DEFAULT_QUERY: IngredientListQuery = { search: '', stock: 'all', category: null, sort: 'name' };

/** Más urgente primero: sin existencias, bajo, desconocido, suficiente. */
const RESTOCK_PRIORITY: Record<StockStatus, number> = { out: 0, low: 1, unknown: 2, ok: 3 };

// Insensible a mayúsculas y acentos: «azucar» encuentra «Azúcar».
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();

const byName = (a: IngredientWithStock, b: IngredientWithStock) =>
  a.ingredient.name.localeCompare(b.ingredient.name, undefined, { sensitivity: 'base' }) ||
  a.ingredient.id.localeCompare(b.ingredient.id);

const COMPARATORS: Record<IngredientSort, (a: IngredientWithStock, b: IngredientWithStock) => number> = {
  name: byName,
  // Kilos y litros no se comparan entre sí: se agrupa por dimensión y, dentro, lo que menos queda primero.
  // Los desconocidos van al final.
  quantity: (a, b) => {
    if (a.stock === null || b.stock === null) return Number(a.stock === null) - Number(b.stock === null) || byName(a, b);
    return (
      a.ingredient.dimension.localeCompare(b.ingredient.dimension) || compare(a.stock, b.stock) || byName(a, b)
    );
  },
  restock: (a, b) => RESTOCK_PRIORITY[a.status] - RESTOCK_PRIORITY[b.status] || byName(a, b),
  recent: (a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt) || byName(a, b),
};

export function applyIngredientQuery(items: readonly IngredientWithStock[], query: IngredientListQuery): IngredientWithStock[] {
  const needle = fold(query.search.trim());
  return items
    .filter(
      ({ ingredient, status }) =>
        (query.stock === 'all' || status === query.stock) &&
        (query.category === null || ingredient.category === query.category) &&
        (needle === '' ||
          fold(ingredient.name).includes(needle) ||
          (ingredient.category !== null && fold(ingredient.category).includes(needle))),
    )
    .sort(COMPARATORS[query.sort]);
}

export function categoriesOf(items: readonly IngredientWithStock[]): string[] {
  const unique = new Set(items.flatMap(({ ingredient }) => (ingredient.category ? [ingredient.category] : [])));
  return [...unique].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export const activeFilterCount = (q: IngredientListQuery) => (q.stock !== 'all' ? 1 : 0) + (q.category !== null ? 1 : 0);
