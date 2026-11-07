import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

import type { SqlDatabase } from '@/data/database/database';
import { migrate } from '@/data/database/migrations';
import { openNodeDatabase } from '@/data/database/testing/node-database';
import { parseDecimal } from '@/domain/rational';
import { DomainValidationError } from '@/domain/validation';
import { formatNormalizedQuantity, formatQuantity, normalizeDecimalInput } from '@/i18n/format-quantity';

import {
  editIngredient,
  IngredientNotFoundError,
  loadIngredientDetail,
  loadIngredientsOverview,
  recordInventoryAdjustment,
  registerBusiness,
  registerIngredient,
} from './ingredient-use-cases';

const uuid = () => crypto.randomUUID();
let dir: string;
let db: SqlDatabase;

beforeEach(async () => {
  dir = mkdtempSync(`${tmpdir()}/valorarte-uc-`);
  db = openNodeDatabase(`${dir}/test.db`);
  await migrate(db);
});

afterEach(async () => {
  await db.closeAsync();
  rmSync(dir, { recursive: true, force: true });
});

describe('casos de uso de ingredientes', () => {
  it('sin negocio, el resumen está vacío', async () => {
    expect(await loadIngredientsOverview(db)).toEqual({ business: null, ingredients: [] });
  });

  it('registra el negocio y sus ingredientes y los devuelve en el resumen', async () => {
    const business = await registerBusiness(
      db,
      { name: 'Taller', countryCode: 'mx', currencyCode: 'mxn', preferredUnitSystem: 'metric', businessCategory: 'handmade' },
      uuid(),
    );
    const ingredient = await registerIngredient(
      db,
      { businessId: business.id, name: 'Cera', dimension: 'mass', inventoryUnitCode: 'kg', lowStockThreshold: '0.5' },
      uuid(),
    );
    expect(await loadIngredientsOverview(db)).toEqual({
      business,
      ingredients: [{ ingredient, stock: null, status: 'unknown', lastActivityAt: ingredient.updatedAt }],
    });
  });

  it('no guarda nada si el dominio rechaza los datos', async () => {
    const business = await registerBusiness(
      db,
      { name: 'Taller', countryCode: 'MX', currencyCode: 'MXN', preferredUnitSystem: 'metric', businessCategory: 'handmade' },
      uuid(),
    );
    await expect(
      registerIngredient(db, { businessId: business.id, name: '', dimension: 'mass', inventoryUnitCode: 'ml' }, uuid()),
    ).rejects.toThrow(DomainValidationError);
    expect((await loadIngredientsOverview(db)).ingredients).toEqual([]);
  });
});

describe('existencias por movimientos', () => {
  async function setup(threshold: string | null = '0.5') {
    const business = await registerBusiness(
      db,
      { name: 'Taller', countryCode: 'MX', currencyCode: 'MXN', preferredUnitSystem: 'metric', businessCategory: 'food' },
      uuid(),
    );
    const ingredient = await registerIngredient(
      db,
      { businessId: business.id, name: 'Harina', dimension: 'mass', inventoryUnitCode: 'kg', lowStockThreshold: threshold },
      uuid(),
    );
    return ingredient;
  }

  it('suma entradas y salidas en unidades distintas y deriva el estado', async () => {
    const { id } = await setup();
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '2.5', unitCode: 'kg', reason: 'Conteo' }, uuid());
    await recordInventoryAdjustment(db, id, { direction: 'out', quantity: '2100', unitCode: 'g', reason: 'Merma' }, uuid());

    const detail = await loadIngredientDetail(db, id);
    expect(detail?.stock).toEqual(parseDecimal('400'));
    expect(detail?.status).toBe('low');
    expect(detail?.movements.map((m) => m.quantityDelta)).toEqual(['-2100.000000', '2.500000']);
    const [item] = (await loadIngredientsOverview(db)).ingredients;
    expect(item.stock).toEqual(parseDecimal('400'));
  });

  it('rechaza una salida que dejaría stock negativo y no guarda nada', async () => {
    const { id } = await setup();
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());
    await expect(
      recordInventoryAdjustment(db, id, { direction: 'out', quantity: '1.000001', unitCode: 'kg', reason: 'Uso' }, uuid()),
    ).rejects.toThrow(DomainValidationError);
    expect((await loadIngredientDetail(db, id))?.movements).toHaveLength(1);
  });

  it('dos ajustes simultáneos se aplican de uno en uno: el segundo ve el saldo del primero', async () => {
    const { id } = await setup(null);
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());

    const out = { direction: 'out', quantity: '0.6', unitCode: 'kg', reason: 'Uso' } as const;
    const results = await Promise.allSettled([
      recordInventoryAdjustment(db, id, out, uuid()),
      recordInventoryAdjustment(db, id, out, uuid()),
    ]);

    expect(results.map((r) => r.status)).toEqual(['fulfilled', 'rejected']);
    expect((results[1] as PromiseRejectedResult).reason).toBeInstanceOf(DomainValidationError);
    const detail = await loadIngredientDetail(db, id);
    expect(detail?.stock).toEqual(parseDecimal('400'));
    expect(detail?.movements).toHaveLength(2);
  });

  it('las entradas simultáneas se registran todas', async () => {
    const { id } = await setup(null);
    const entry = { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Compra' } as const;
    await Promise.all([1, 2, 3].map(() => recordInventoryAdjustment(db, id, entry, uuid())));
    const detail = await loadIngredientDetail(db, id);
    expect(detail?.stock).toEqual(parseDecimal('3000'));
    expect(detail?.movements).toHaveLength(3);
  });

  it('un fallo dentro de la transacción conserva stock e historial y no bloquea el siguiente ajuste', async () => {
    const { id } = await setup(null);
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());

    let fail = true;
    const failing: SqlDatabase = {
      ...db,
      runAsync: (source, params) =>
        fail && source.includes('INSERT INTO inventory_movements') ? Promise.reject(new Error('disk I/O error')) : db.runAsync(source, params),
    };
    const out = { direction: 'out', quantity: '0.25', unitCode: 'kg', reason: 'Uso' } as const;
    await expect(recordInventoryAdjustment(failing, id, out, uuid())).rejects.toThrow('disk I/O error');

    const after = await loadIngredientDetail(db, id);
    expect(after?.stock).toEqual(parseDecimal('1000'));
    expect(after?.movements).toHaveLength(1);

    fail = false;
    await recordInventoryAdjustment(failing, id, out, uuid());
    expect((await loadIngredientDetail(db, id))?.stock).toEqual(parseDecimal('750'));
  });

  it('queda en cero (sin existencias) tras retirar todo', async () => {
    const { id } = await setup(null);
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());
    await recordInventoryAdjustment(db, id, { direction: 'out', quantity: '1000', unitCode: 'g', reason: 'Uso' }, uuid());
    expect((await loadIngredientDetail(db, id))?.status).toBe('out');
  });

  it('los movimientos no se pueden modificar ni borrar', async () => {
    const { id } = await setup();
    await recordInventoryAdjustment(db, id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());
    await expect(db.execAsync("UPDATE inventory_movements SET reason = 'x'")).rejects.toThrow(/immutable/);
    await expect(db.execAsync('DELETE FROM inventory_movements')).rejects.toThrow(/immutable/);
  });

  it('editar el ingrediente conserva dimensión, alta e historial', async () => {
    const ingredient = await setup();
    await recordInventoryAdjustment(db, ingredient.id, { direction: 'in', quantity: '1', unitCode: 'kg', reason: 'Inicial' }, uuid());
    const edited = await editIngredient(db, ingredient.id, {
      name: 'Harina de trigo',
      inventoryUnitCode: 'g',
      lowStockThreshold: '200',
      category: 'Secos',
    });
    const detail = await loadIngredientDetail(db, ingredient.id);
    expect(detail?.ingredient).toEqual(edited);
    expect(edited).toMatchObject({ dimension: 'mass', createdAt: ingredient.createdAt, lowStockThreshold: '200.000000' });
    expect(detail?.movements).toHaveLength(1);
    expect(detail?.stock).toEqual(parseDecimal('1000'));
  });

  it('editar un ingrediente inexistente falla sin crear nada', async () => {
    await expect(editIngredient(db, uuid(), { name: 'X', inventoryUnitCode: 'g' })).rejects.toThrow(IngredientNotFoundError);
  });
});

describe('formato de cantidades', () => {
  it('muestra hasta 6 decimales sin ceros finales y con el separador regional', () => {
    expect(formatQuantity(parseDecimal('1500.000000'), ',')).toBe('1500');
    expect(formatQuantity(parseDecimal('1.250000'), ',')).toBe('1,25');
    expect(formatQuantity(parseDecimal('100'), '.')).toBe('100');
  });

  it('muestra un umbral normalizado en la unidad de inventario', () => {
    expect(formatNormalizedQuantity(parseDecimal('1500.000000'), 'mass', 'kg', ',')).toBe('1,5');
    expect(formatNormalizedQuantity(parseDecimal('28.349523'), 'mass', 'oz', '.')).toBe('1');
  });

  it('acepta el separador regional al escribir', () => {
    expect(normalizeDecimalInput(' 1,5 ', ',')).toBe('1.5');
    expect(normalizeDecimalInput('1.5', '.')).toBe('1.5');
    // Región con punto pero teclado con coma (visto en un dispositivo real).
    expect(normalizeDecimalInput('2,5', '.')).toBe('2.5');
    expect(normalizeDecimalInput('2.5', ',')).toBe('2.5');
    // Dos separadores sigue siendo inválido para el dominio.
    expect(() => parseDecimal(normalizeDecimalInput('1,2,3', ','))).toThrow();
  });
});
