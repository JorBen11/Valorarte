import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

import type { SqlDatabase } from '@/data/database/database';
import { migrate } from '@/data/database/migrations';
import { openNodeDatabase } from '@/data/database/testing/node-database';
import { parseDecimal } from '@/domain/rational';
import { DomainValidationError } from '@/domain/validation';
import { formatNormalizedQuantity, formatQuantity, normalizeDecimalInput } from '@/i18n/format-quantity';

import { loadIngredientsOverview, registerBusiness, registerIngredient } from './ingredient-use-cases';

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
    expect(await loadIngredientsOverview(db)).toEqual({ business, ingredients: [ingredient] });
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
  });
});
