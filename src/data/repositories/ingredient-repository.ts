import type { Ingredient } from '@/domain/ingredient';
import type { Dimension, UnitCode } from '@/domain/units';

import { translateSqliteError, type SqlDatabase } from '../database/database';

export interface IngredientRepository {
  create(ingredient: Ingredient): Promise<void>;
  findById(id: string): Promise<Ingredient | null>;
  listByBusiness(businessId: string): Promise<Ingredient[]>;
}

interface IngredientRow {
  id: string;
  business_id: string;
  name: string;
  category: string | null;
  dimension: Dimension;
  inventory_unit_code: UnitCode;
  low_stock_threshold: string | null;
  tracks_lots: number;
  is_active: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const toIngredient = (row: IngredientRow): Ingredient => ({
  id: row.id,
  businessId: row.business_id,
  name: row.name,
  category: row.category,
  dimension: row.dimension,
  inventoryUnitCode: row.inventory_unit_code,
  lowStockThreshold: row.low_stock_threshold,
  tracksLots: Number(row.tracks_lots) === 1,
  isActive: Number(row.is_active) === 1,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class SqliteIngredientRepository implements IngredientRepository {
  constructor(private readonly db: SqlDatabase) {}

  async create(i: Ingredient): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO ingredients (id, business_id, name, category, dimension, inventory_unit_code,
           low_stock_threshold, tracks_lots, is_active, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          i.id,
          i.businessId,
          i.name,
          i.category,
          i.dimension,
          i.inventoryUnitCode,
          i.lowStockThreshold,
          i.tracksLots ? 1 : 0,
          i.isActive ? 1 : 0,
          i.notes,
          i.createdAt,
          i.updatedAt,
        ],
      );
    } catch (error) {
      throw translateSqliteError(error);
    }
  }

  async findById(id: string): Promise<Ingredient | null> {
    const row = await this.db.getFirstAsync<IngredientRow>('SELECT * FROM ingredients WHERE id = ?', [id]);
    return row ? toIngredient(row) : null;
  }

  async listByBusiness(businessId: string): Promise<Ingredient[]> {
    const rows = await this.db.getAllAsync<IngredientRow>(
      'SELECT * FROM ingredients WHERE business_id = ? ORDER BY name COLLATE NOCASE, id',
      [businessId],
    );
    return rows.map(toIngredient);
  }
}
