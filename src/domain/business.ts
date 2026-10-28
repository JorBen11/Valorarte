import type { UnitSystem } from './units';
import { assertValid, isUuid, requiredText, type ValidationIssue } from './validation';

/** docs/DATA-MODEL.md §3. El idioma queda fuera hasta decidir si el negocio sobrescribe la preferencia del dispositivo. */
export const BUSINESS_CATEGORIES = ['food', 'handmade', 'services', 'resale'] as const;
export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export type PreferredUnitSystem = Exclude<UnitSystem, 'neutral'>;
export const PREFERRED_UNIT_SYSTEMS: readonly PreferredUnitSystem[] = ['metric', 'imperial'];

export interface Business {
  id: string;
  name: string;
  /** ISO 3166-1 alfa-2. */
  countryCode: string;
  /** ISO 4217 alfabético. */
  currencyCode: string;
  preferredUnitSystem: PreferredUnitSystem;
  businessCategory: BusinessCategory;
  /** ISO 8601 en UTC. */
  createdAt: string;
  updatedAt: string;
}

export interface NewBusinessInput {
  name: string;
  countryCode: string;
  currencyCode: string;
  preferredUnitSystem: string;
  businessCategory: string;
}

// shortcut: solo valida el formato de los códigos, no que existan; usar una lista ISO cuando haya selector de país/moneda.
const COUNTRY_PATTERN = /^[A-Z]{2}$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

const includes = <T extends string>(list: readonly T[], value: string): value is T =>
  (list as readonly string[]).includes(value);

export function createBusiness(input: NewBusinessInput, id: string, now: Date): Business {
  const issues: ValidationIssue[] = [];
  if (!isUuid(id)) issues.push({ field: 'id', code: 'invalid' });
  const name = requiredText(input.name, 'name', issues);
  const countryCode = input.countryCode.trim().toUpperCase();
  const currencyCode = input.currencyCode.trim().toUpperCase();
  if (!COUNTRY_PATTERN.test(countryCode)) issues.push({ field: 'countryCode', code: 'invalid' });
  if (!CURRENCY_PATTERN.test(currencyCode)) issues.push({ field: 'currencyCode', code: 'invalid' });
  const { preferredUnitSystem, businessCategory } = input;
  if (!includes(PREFERRED_UNIT_SYSTEMS, preferredUnitSystem)) issues.push({ field: 'preferredUnitSystem', code: 'invalid' });
  if (!includes(BUSINESS_CATEGORIES, businessCategory)) issues.push({ field: 'businessCategory', code: 'invalid' });
  assertValid(issues);

  const timestamp = now.toISOString();
  return {
    id,
    name,
    countryCode,
    currencyCode,
    preferredUnitSystem: preferredUnitSystem as PreferredUnitSystem,
    businessCategory: businessCategory as BusinessCategory,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
