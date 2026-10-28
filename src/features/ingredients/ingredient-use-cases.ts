import type { SqlDatabase } from '@/data/database/database';
import { SqliteBusinessRepository } from '@/data/repositories/business-repository';
import { SqliteIngredientRepository } from '@/data/repositories/ingredient-repository';
import { createBusiness, type Business, type NewBusinessInput } from '@/domain/business';
import { createIngredient, type Ingredient, type NewIngredientInput } from '@/domain/ingredient';
import { newId } from '@/lib/id';

export interface IngredientsOverview {
  business: Business | null;
  ingredients: Ingredient[];
}

export async function loadIngredientsOverview(db: SqlDatabase): Promise<IngredientsOverview> {
  const business = await new SqliteBusinessRepository(db).findFirst();
  const ingredients = business ? await new SqliteIngredientRepository(db).listByBusiness(business.id) : [];
  return { business, ingredients };
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
