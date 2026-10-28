import { createBusiness, type NewBusinessInput } from './business';
import { createIngredient, type NewIngredientInput } from './ingredient';
import { DomainValidationError, type ValidationIssue } from './validation';

const ID = '3f1c2a9e-8b7d-4c6e-9f10-2a3b4c5d6e7f';
const BUSINESS_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456789';
const NOW = new Date('2026-10-25T12:00:00.000Z');

function issuesOf(fn: () => unknown): ValidationIssue[] {
  try {
    fn();
  } catch (error) {
    if (error instanceof DomainValidationError) return [...error.issues];
    throw error;
  }
  throw new Error('expected a DomainValidationError');
}

const flour: NewIngredientInput = { businessId: BUSINESS_ID, name: 'Harina', dimension: 'mass', inventoryUnitCode: 'kg' };

describe('createIngredient', () => {
  it('crea un ingrediente válido con valores por defecto', () => {
    expect(createIngredient({ ...flour, name: '  Harina  ', category: ' ', notes: '' }, ID, NOW)).toEqual({
      id: ID,
      businessId: BUSINESS_ID,
      name: 'Harina',
      category: null,
      dimension: 'mass',
      inventoryUnitCode: 'kg',
      lowStockThreshold: null,
      tracksLots: false,
      isActive: true,
      notes: null,
      createdAt: '2026-10-25T12:00:00.000Z',
      updatedAt: '2026-10-25T12:00:00.000Z',
    });
  });

  it('exige el nombre', () => {
    expect(issuesOf(() => createIngredient({ ...flour, name: '   ' }, ID, NOW))).toEqual([{ field: 'name', code: 'required' }]);
  });

  it('rechaza unidades desconocidas, incluidas las personalizadas', () => {
    expect(issuesOf(() => createIngredient({ ...flour, inventoryUnitCode: 'caja' }, ID, NOW))).toEqual([
      { field: 'inventoryUnitCode', code: 'unknownUnit' },
    ]);
    expect(issuesOf(() => createIngredient({ ...flour, inventoryUnitCode: 'cm²', dimension: 'area' }, ID, NOW))).toEqual([
      { field: 'inventoryUnitCode', code: 'unknownUnit' },
    ]);
  });

  it('rechaza una unidad de otra dimensión', () => {
    expect(issuesOf(() => createIngredient({ ...flour, inventoryUnitCode: 'ml' }, ID, NOW))).toEqual([
      { field: 'inventoryUnitCode', code: 'dimensionMismatch' },
    ]);
  });

  it('rechaza dimensiones desconocidas', () => {
    expect(issuesOf(() => createIngredient({ ...flour, dimension: 'density' }, ID, NOW))).toEqual([
      { field: 'dimension', code: 'invalid' },
    ]);
  });

  it('guarda el umbral normalizado a la unidad base con 6 decimales', () => {
    expect(createIngredient({ ...flour, lowStockThreshold: '1.5' }, ID, NOW).lowStockThreshold).toBe('1500.000000');
    const sugar = createIngredient({ ...flour, inventoryUnitCode: 'oz', lowStockThreshold: '1' }, ID, NOW);
    expect(sugar.lowStockThreshold).toBe('28.349523');
  });

  it('rechaza umbrales negativos o no numéricos', () => {
    expect(issuesOf(() => createIngredient({ ...flour, lowStockThreshold: '-1' }, ID, NOW))).toEqual([
      { field: 'lowStockThreshold', code: 'negative' },
    ]);
    expect(issuesOf(() => createIngredient({ ...flour, lowStockThreshold: 'abc' }, ID, NOW))).toEqual([
      { field: 'lowStockThreshold', code: 'invalidNumber' },
    ]);
  });

  it('exige identificadores UUID', () => {
    expect(issuesOf(() => createIngredient({ ...flour, businessId: '1' }, 'x', NOW))).toEqual([
      { field: 'id', code: 'invalid' },
      { field: 'businessId', code: 'invalid' },
    ]);
  });
});

describe('createBusiness', () => {
  const input: NewBusinessInput = {
    name: 'Panadería Demo',
    countryCode: 'co',
    currencyCode: 'cop',
    preferredUnitSystem: 'metric',
    businessCategory: 'food',
  };

  it('normaliza los códigos de país y moneda', () => {
    const business = createBusiness(input, BUSINESS_ID, NOW);
    expect(business.countryCode).toBe('CO');
    expect(business.currencyCode).toBe('COP');
  });

  it('valida los campos obligatorios y los valores permitidos', () => {
    expect(
      issuesOf(() =>
        createBusiness(
          { name: '', countryCode: 'COL', currencyCode: '$', preferredUnitSystem: 'neutral', businessCategory: 'retail' },
          BUSINESS_ID,
          NOW,
        ),
      ),
    ).toEqual([
      { field: 'name', code: 'required' },
      { field: 'countryCode', code: 'invalid' },
      { field: 'currencyCode', code: 'invalid' },
      { field: 'preferredUnitSystem', code: 'invalid' },
      { field: 'businessCategory', code: 'invalid' },
    ]);
  });
});
