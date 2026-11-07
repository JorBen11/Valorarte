import type { SqlDatabase } from './database';

/**
 * Migraciones numeradas. Una migración publicada no se modifica nunca: los cambios
 * van en una migración nueva. La versión aplicada se guarda en `PRAGMA user_version`.
 */
export const MIGRATIONS: readonly { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE businesses (
        id TEXT PRIMARY KEY NOT NULL CHECK (length(id) = 36),
        name TEXT NOT NULL CHECK (length(trim(name)) > 0),
        country_code TEXT NOT NULL CHECK (length(country_code) = 2 AND country_code = upper(country_code)),
        currency_code TEXT NOT NULL CHECK (length(currency_code) = 3 AND currency_code = upper(currency_code)),
        preferred_unit_system TEXT NOT NULL CHECK (preferred_unit_system IN ('metric', 'imperial')),
        business_category TEXT NOT NULL CHECK (business_category IN ('food', 'handmade', 'services', 'resale')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;

      CREATE TABLE ingredients (
        id TEXT PRIMARY KEY NOT NULL CHECK (length(id) = 36),
        business_id TEXT NOT NULL REFERENCES businesses (id) ON DELETE RESTRICT,
        name TEXT NOT NULL CHECK (length(trim(name)) > 0),
        category TEXT,
        dimension TEXT NOT NULL CHECK (dimension IN ('mass', 'volume', 'length', 'area', 'count')),
        inventory_unit_code TEXT NOT NULL CHECK (
          CASE dimension
            WHEN 'mass' THEN inventory_unit_code IN ('g', 'mg', 'kg', 'oz', 'lb')
            WHEN 'volume' THEN inventory_unit_code IN ('ml', 'l', 'tsp', 'tbsp', 'fl_oz', 'cup', 'gal')
            WHEN 'length' THEN inventory_unit_code IN ('mm', 'cm', 'm', 'in', 'ft', 'yd')
            WHEN 'area' THEN inventory_unit_code IN ('cm2', 'm2', 'in2', 'ft2')
            WHEN 'count' THEN inventory_unit_code IN ('unit')
          END
        ),
        low_stock_threshold TEXT CHECK (
          low_stock_threshold IS NULL OR low_stock_threshold GLOB '[0-9]*.[0-9][0-9][0-9][0-9][0-9][0-9]'
        ),
        tracks_lots INTEGER NOT NULL CHECK (tracks_lots IN (0, 1)),
        is_active INTEGER NOT NULL CHECK (is_active IN (0, 1)),
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;

      CREATE INDEX ingredients_business_id ON ingredients (business_id);
    `,
  },
  {
    // docs/DATA-MODEL.md §16. Solo ingredientes por ahora: item_id referencia ingredients hasta que existan productos.
    version: 2,
    sql: `
      CREATE TABLE inventory_movements (
        id TEXT PRIMARY KEY NOT NULL CHECK (length(id) = 36),
        business_id TEXT NOT NULL REFERENCES businesses (id) ON DELETE RESTRICT,
        item_type TEXT NOT NULL CHECK (item_type IN ('ingredient')),
        item_id TEXT NOT NULL REFERENCES ingredients (id) ON DELETE RESTRICT,
        movement_type TEXT NOT NULL CHECK (movement_type IN (
          'opening_balance', 'purchase_receipt', 'production_consumption', 'production_output', 'sale',
          'customer_return', 'inventory_adjustment', 'reversal', 'write_off'
        )),
        quantity_delta TEXT NOT NULL CHECK (quantity_delta GLOB '*[0-9].[0-9][0-9][0-9][0-9][0-9][0-9]'),
        unit_code TEXT NOT NULL,
        normalized_quantity_delta TEXT NOT NULL CHECK (
          normalized_quantity_delta GLOB '*[0-9].[0-9][0-9][0-9][0-9][0-9][0-9]'
        ),
        affects_valuation INTEGER NOT NULL CHECK (affects_valuation IN (0, 1)),
        unit_cost_snapshot TEXT,
        total_value_delta INTEGER,
        source_entity_type TEXT,
        source_entity_id TEXT,
        reason TEXT,
        occurred_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        reversal_of_movement_id TEXT REFERENCES inventory_movements (id) ON DELETE RESTRICT,
        CHECK ((affects_valuation = 1) = (total_value_delta IS NOT NULL)),
        CHECK (movement_type <> 'inventory_adjustment' OR length(trim(reason)) > 0)
      ) STRICT;

      CREATE INDEX inventory_movements_item ON inventory_movements (item_id, occurred_at);
      CREATE INDEX inventory_movements_business ON inventory_movements (business_id);

      -- Los movimientos confirmados son historial: se corrigen con nuevos movimientos, nunca editándolos.
      CREATE TRIGGER inventory_movements_no_update BEFORE UPDATE ON inventory_movements
      BEGIN SELECT RAISE(ABORT, 'inventory movements are immutable'); END;
      CREATE TRIGGER inventory_movements_no_delete BEFORE DELETE ON inventory_movements
      BEGIN SELECT RAISE(ABORT, 'inventory movements are immutable'); END;
    `,
  },
];

export const LATEST_SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;

export class SchemaVersionError extends Error {
  constructor(readonly found: number) {
    super(`Database schema version ${found} is newer than this app supports (${LATEST_SCHEMA_VERSION})`);
    this.name = 'SchemaVersionError';
  }
}

/**
 * Activa y verifica las claves foráneas y aplica las migraciones pendientes,
 * cada una en su propia transacción. Devuelve la versión final del esquema.
 */
export async function migrate(db: SqlDatabase): Promise<number> {
  // foreign_keys es por conexión y no puede cambiarse dentro de una transacción.
  await db.execAsync('PRAGMA foreign_keys = ON');
  const fk = await db.getFirstAsync<{ foreign_keys: number }>('PRAGMA foreign_keys', []);
  if (Number(fk?.foreign_keys) !== 1) throw new Error('SQLite foreign key enforcement could not be enabled');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version', []);
  let version = Number(row?.user_version ?? 0);
  if (version > LATEST_SCHEMA_VERSION) throw new SchemaVersionError(version);

  for (const migration of MIGRATIONS) {
    if (migration.version <= version) continue;
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
    version = migration.version;
  }
  return version;
}
