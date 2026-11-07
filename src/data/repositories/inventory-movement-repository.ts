import type { InventoryMovement, MovementType } from '@/domain/inventory-movement';
import type { UnitCode } from '@/domain/units';

import { translateSqliteError, type SqlDatabase } from '../database/database';

interface MovementRow {
  id: string;
  business_id: string;
  item_id: string;
  movement_type: MovementType;
  quantity_delta: string;
  unit_code: UnitCode;
  normalized_quantity_delta: string;
  reason: string | null;
  occurred_at: string;
  created_at: string;
}

const toMovement = (row: MovementRow): InventoryMovement => ({
  id: row.id,
  businessId: row.business_id,
  itemType: 'ingredient',
  itemId: row.item_id,
  movementType: row.movement_type,
  quantityDelta: row.quantity_delta,
  unitCode: row.unit_code,
  normalizedQuantityDelta: row.normalized_quantity_delta,
  affectsValuation: false,
  reason: row.reason ?? '',
  occurredAt: row.occurred_at,
  createdAt: row.created_at,
});

export interface ItemActivity {
  /** Deltas normalizados del artículo; se suman con aritmética exacta en el dominio, no en SQL (REAL). */
  deltas: string[];
  lastOccurredAt: string;
}

export class SqliteInventoryMovementRepository {
  constructor(private readonly db: SqlDatabase) {}

  /** Solo inserta: la tabla rechaza UPDATE y DELETE. */
  async create(m: InventoryMovement): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO inventory_movements (id, business_id, item_type, item_id, movement_type, quantity_delta, unit_code,
           normalized_quantity_delta, affects_valuation, reason, occurred_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          m.id,
          m.businessId,
          m.itemType,
          m.itemId,
          m.movementType,
          m.quantityDelta,
          m.unitCode,
          m.normalizedQuantityDelta,
          m.affectsValuation ? 1 : 0,
          m.reason,
          m.occurredAt,
          m.createdAt,
        ],
      );
    } catch (error) {
      throw translateSqliteError(error);
    }
  }

  /** Más reciente primero. */
  async listByItem(itemId: string): Promise<InventoryMovement[]> {
    const rows = await this.db.getAllAsync<MovementRow>(
      'SELECT * FROM inventory_movements WHERE item_id = ? ORDER BY occurred_at DESC, created_at DESC, id DESC',
      [itemId],
    );
    return rows.map(toMovement);
  }

  // shortcut: lee todos los deltas del negocio en cada carga; pasar a una proyección reconciliable si crece a miles de movimientos.
  async activityByBusiness(businessId: string): Promise<Map<string, ItemActivity>> {
    const rows = await this.db.getAllAsync<{ item_id: string; normalized_quantity_delta: string; occurred_at: string }>(
      'SELECT item_id, normalized_quantity_delta, occurred_at FROM inventory_movements WHERE business_id = ?',
      [businessId],
    );
    const result = new Map<string, ItemActivity>();
    for (const row of rows) {
      const entry = result.get(row.item_id) ?? { deltas: [], lastOccurredAt: row.occurred_at };
      entry.deltas.push(row.normalized_quantity_delta);
      if (row.occurred_at > entry.lastOccurredAt) entry.lastOccurredAt = row.occurred_at;
      result.set(row.item_id, entry);
    }
    return result;
  }
}
