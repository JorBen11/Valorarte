import type { SqlDatabase } from '@/data/database/database';
import { SqliteBusinessRepository } from '@/data/repositories/business-repository';
import { SqliteIngredientRepository } from '@/data/repositories/ingredient-repository';
import { SqliteInventoryMovementRepository } from '@/data/repositories/inventory-movement-repository';
import { createBusiness, type Business, type NewBusinessInput } from '@/domain/business';
import {
  createIngredient,
  updateIngredient,
  type Ingredient,
  type IngredientChanges,
  type NewIngredientInput,
} from '@/domain/ingredient';
import {
  createInventoryAdjustment,
  stockStatus,
  sumStock,
  type InventoryAdjustmentInput,
  type InventoryMovement,
  type StockStatus,
} from '@/domain/inventory-movement';
import type { Rational } from '@/domain/rational';
import { newId } from '@/lib/id';

export interface IngredientWithStock {
  ingredient: Ingredient;
  /** `null` si nunca hubo movimientos: existencias desconocidas, no cero. */
  stock: Rational | null;
  status: StockStatus;
  /** Lo más reciente entre la edición del ingrediente y su último movimiento. */
  lastActivityAt: string;
}

export interface IngredientsOverview {
  business: Business | null;
  ingredients: IngredientWithStock[];
}

export async function loadIngredientsOverview(db: SqlDatabase): Promise<IngredientsOverview> {
  const business = await new SqliteBusinessRepository(db).findFirst();
  if (!business) return { business, ingredients: [] };
  const [ingredients, activity] = await Promise.all([
    new SqliteIngredientRepository(db).listByBusiness(business.id),
    new SqliteInventoryMovementRepository(db).activityByBusiness(business.id),
  ]);
  return {
    business,
    ingredients: ingredients.map((ingredient) => {
      const entry = activity.get(ingredient.id);
      const stock = sumStock(entry?.deltas ?? []);
      const lastMovement = entry?.lastOccurredAt ?? '';
      return {
        ingredient,
        stock,
        status: stockStatus(stock, ingredient.lowStockThreshold),
        lastActivityAt: lastMovement > ingredient.updatedAt ? lastMovement : ingredient.updatedAt,
      };
    }),
  };
}

export interface IngredientDetail {
  ingredient: Ingredient;
  stock: Rational | null;
  status: StockStatus;
  /** Más reciente primero. */
  movements: InventoryMovement[];
}

export async function loadIngredientDetail(db: SqlDatabase, id: string): Promise<IngredientDetail | null> {
  const ingredient = await new SqliteIngredientRepository(db).findById(id);
  if (!ingredient) return null;
  const movements = await new SqliteInventoryMovementRepository(db).listByItem(id);
  const stock = sumStock(movements.map((m) => m.normalizedQuantityDelta));
  return { ingredient, stock, status: stockStatus(stock, ingredient.lowStockThreshold), movements };
}

/**
 * Inicialización mínima del negocio del dispositivo: la app necesita un `businessId`
 * para guardar ingredientes. No es una gestión de negocios (no hay edición ni selección).
 */
export async function registerBusiness(db: SqlDatabase, input: NewBusinessInput, id: string = newId()): Promise<Business> {
  const business = createBusiness(input, id, new Date());
  await new SqliteBusinessRepository(db).create(business);
  return business;
}

export async function registerIngredient(
  db: SqlDatabase,
  input: NewIngredientInput,
  id: string = newId(),
): Promise<Ingredient> {
  const ingredient = createIngredient(input, id, new Date());
  await new SqliteIngredientRepository(db).create(ingredient);
  return ingredient;
}

export class IngredientNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Ingredient ${id} not found`);
    this.name = 'IngredientNotFoundError';
  }
}

export async function editIngredient(db: SqlDatabase, id: string, changes: IngredientChanges): Promise<Ingredient> {
  const repository = new SqliteIngredientRepository(db);
  const existing = await repository.findById(id);
  if (!existing) throw new IngredientNotFoundError(id);
  const updated = updateIngredient(existing, changes, new Date());
  await repository.update(updated);
  return updated;
}

// `withTransactionAsync` no es exclusiva: otra llamada en la misma conexión se intercala y falla al abrir su
// transacción o lee un saldo obsoleto. `withExclusiveTransactionAsync` abriría una conexión sin
// `foreign_keys` ni `busy_timeout`, así que los ajustes se encolan por base de datos.
const adjustmentQueue = new WeakMap<SqlDatabase, Promise<unknown>>();

function serialized<T>(db: SqlDatabase, task: () => Promise<T>): Promise<T> {
  const run = (adjustmentQueue.get(db) ?? Promise.resolve()).then(task);
  adjustmentQueue.set(db, run.catch(() => undefined));
  return run;
}

/** Lee el stock y escribe el movimiento en la misma transacción, de uno en uno, para no aceptar un ajuste sobre un saldo obsoleto. */
export function recordInventoryAdjustment(
  db: SqlDatabase,
  ingredientId: string,
  input: InventoryAdjustmentInput,
  id: string = newId(),
): Promise<InventoryMovement> {
  return serialized(db, () => adjustInTransaction(db, ingredientId, input, id));
}

async function adjustInTransaction(
  db: SqlDatabase,
  ingredientId: string,
  input: InventoryAdjustmentInput,
  id: string,
): Promise<InventoryMovement> {
  let movement: InventoryMovement | undefined;
  await db.withTransactionAsync(async () => {
    const ingredient = await new SqliteIngredientRepository(db).findById(ingredientId);
    if (!ingredient) throw new IngredientNotFoundError(ingredientId);
    const movements = new SqliteInventoryMovementRepository(db);
    const current = sumStock((await movements.listByItem(ingredientId)).map((m) => m.normalizedQuantityDelta));
    movement = createInventoryAdjustment(ingredient, current, input, id, new Date());
    await movements.create(movement);
  });
  return movement!;
}
