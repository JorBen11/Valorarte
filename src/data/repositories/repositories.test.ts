import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

import { createBusiness, type Business } from '@/domain/business';
import { createIngredient } from '@/domain/ingredient';
import { UNITS, type UnitCode } from '@/domain/units';

import { ForeignKeyViolationError, type SqlDatabase } from '../database/database';
import { LATEST_SCHEMA_VERSION, migrate, SchemaVersionError } from '../database/migrations';
import { openNodeDatabase } from '../database/testing/node-database';
import { SqliteBusinessRepository } from './business-repository';
import { SqliteIngredientRepository } from './ingredient-repository';

const NOW = new Date('2026-10-25T12:00:00.000Z');
const uuid = () => crypto.randomUUID();

let dir: string;
let path: string;
let db: SqlDatabase;

async function open(): Promise<SqlDatabase> {
  const conn = openNodeDatabase(path);
  await migrate(conn);
  return conn;
}

function newBusiness(): Business {
  return createBusiness(
    { name: 'Panadería Demo', countryCode: 'CO', currencyCode: 'COP', preferredUnitSystem: 'metric', businessCategory: 'food' },
    uuid(),
    NOW,
  );
}

beforeEach(async () => {
  dir = mkdtempSync(`${tmpdir()}/valorarte-db-`);
  path = `${dir}/test.db`;
  db = await open();
});

afterEach(async () => {
  await db.closeAsync();
  rmSync(dir, { recursive: true, force: true });
});

describe('migraciones', () => {
  it('aplican el esquema, registran la versión y activan las claves foráneas', async () => {
    expect(await db.getFirstAsync('PRAGMA user_version', [])).toEqual({ user_version: LATEST_SCHEMA_VERSION });
    expect(await db.getFirstAsync('PRAGMA foreign_keys', [])).toEqual({ foreign_keys: 1 });
  });

  it('son idempotentes al reabrir', async () => {
    await db.closeAsync();
    db = await open();
    expect(await migrate(db)).toBe(LATEST_SCHEMA_VERSION);
  });

  it('rechazan una base de datos de una versión más nueva', async () => {
    await db.execAsync(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION + 1}`);
    await expect(migrate(db)).rejects.toThrow(SchemaVersionError);
  });

  it('una migración que falla no deja cambios a medias', async () => {
    await db.closeAsync();
    rmSync(path, { recursive: true, force: true });
    db = openNodeDatabase(path);
    await db.execAsync('CREATE TABLE ingredients (id TEXT)');
    await expect(migrate(db)).rejects.toThrow();
    expect(await db.getFirstAsync('PRAGMA user_version', [])).toEqual({ user_version: 0 });
    expect(await db.getFirstAsync("SELECT name FROM sqlite_master WHERE name = 'businesses'", [])).toBeNull();
  });
});

describe('repositorios', () => {
  it('crean y consultan negocios e ingredientes', async () => {
    const businesses = new SqliteBusinessRepository(db);
    const ingredients = new SqliteIngredientRepository(db);
    const business = newBusiness();
    await businesses.create(business);
    expect(await businesses.findById(business.id)).toEqual(business);
    expect(await businesses.findById(uuid())).toBeNull();

    const sugar = createIngredient(
      { businessId: business.id, name: 'azúcar', dimension: 'mass', inventoryUnitCode: 'lb', lowStockThreshold: '2', tracksLots: true, notes: 'Refinada' },
      uuid(),
      NOW,
    );
    const flour = createIngredient({ businessId: business.id, name: 'Harina', dimension: 'mass', inventoryUnitCode: 'kg' }, uuid(), NOW);
    await ingredients.create(flour);
    await ingredients.create(sugar);

    expect(await ingredients.findById(sugar.id)).toEqual(sugar);
    expect((await ingredients.listByBusiness(business.id)).map((i) => i.name)).toEqual(['azúcar', 'Harina']);
    expect(await ingredients.listByBusiness(uuid())).toEqual([]);
  });

  it('no asocian un ingrediente a un negocio inexistente', async () => {
    const ingredients = new SqliteIngredientRepository(db);
    const orphan = createIngredient({ businessId: uuid(), name: 'Sal', dimension: 'mass', inventoryUnitCode: 'g' }, uuid(), NOW);
    await expect(ingredients.create(orphan)).rejects.toThrow(ForeignKeyViolationError);
    expect(await ingredients.findById(orphan.id)).toBeNull();
  });

  it('impiden borrar un negocio con ingredientes', async () => {
    const business = newBusiness();
    await new SqliteBusinessRepository(db).create(business);
    await new SqliteIngredientRepository(db).create(
      createIngredient({ businessId: business.id, name: 'Sal', dimension: 'mass', inventoryUnitCode: 'g' }, uuid(), NOW),
    );
    await expect(db.runAsync('DELETE FROM businesses WHERE id = ?', [business.id])).rejects.toThrow(/FOREIGN KEY/);
  });

  it('propagan los errores que no son de clave foránea', async () => {
    const businesses = new SqliteBusinessRepository(db);
    const business = newBusiness();
    await businesses.create(business);
    await expect(businesses.create(business)).rejects.toThrow(/UNIQUE/);
  });

  it('las restricciones SQL rechazan una unidad de otra dimensión aunque se salte el dominio', async () => {
    const business = newBusiness();
    await new SqliteBusinessRepository(db).create(business);
    const valid = createIngredient({ businessId: business.id, name: 'Leche', dimension: 'volume', inventoryUnitCode: 'ml' }, uuid(), NOW);
    await expect(
      new SqliteIngredientRepository(db).create({ ...valid, inventoryUnitCode: 'g' }),
    ).rejects.toThrow(/CHECK/);
  });

  it('el esquema acepta exactamente las unidades del catálogo en su dimensión', async () => {
    const business = newBusiness();
    await new SqliteBusinessRepository(db).create(business);
    const repo = new SqliteIngredientRepository(db);
    for (const unit of Object.values(UNITS)) {
      await repo.create(
        createIngredient({ businessId: business.id, name: unit.code, dimension: unit.dimension, inventoryUnitCode: unit.code }, uuid(), NOW),
      );
    }
    expect((await repo.listByBusiness(business.id)).map((i) => i.inventoryUnitCode).sort()).toEqual(
      (Object.keys(UNITS) as UnitCode[]).sort(),
    );
  });

  it('los datos persisten al cerrar y reabrir la conexión', async () => {
    const business = newBusiness();
    const ingredient = createIngredient({ businessId: business.id, name: 'Huevos', dimension: 'count', inventoryUnitCode: 'unit' }, uuid(), NOW);
    await new SqliteBusinessRepository(db).create(business);
    await new SqliteIngredientRepository(db).create(ingredient);

    await db.closeAsync();
    db = await open();
    expect(await new SqliteBusinessRepository(db).findById(business.id)).toEqual(business);
    expect(await new SqliteIngredientRepository(db).findById(ingredient.id)).toEqual(ingredient);
  });
});
