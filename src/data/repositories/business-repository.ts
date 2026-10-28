import type { Business, BusinessCategory, PreferredUnitSystem } from '@/domain/business';

import { translateSqliteError, type SqlDatabase } from '../database/database';

export interface BusinessRepository {
  create(business: Business): Promise<void>;
  findById(id: string): Promise<Business | null>;
  /** Negocio más antiguo. En el MVP hay un único negocio por dispositivo. */
  findFirst(): Promise<Business | null>;
}

interface BusinessRow {
  id: string;
  name: string;
  country_code: string;
  currency_code: string;
  preferred_unit_system: PreferredUnitSystem;
  business_category: BusinessCategory;
  created_at: string;
  updated_at: string;
}

const toBusiness = (row: BusinessRow): Business => ({
  id: row.id,
  name: row.name,
  countryCode: row.country_code,
  currencyCode: row.currency_code,
  preferredUnitSystem: row.preferred_unit_system,
  businessCategory: row.business_category,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class SqliteBusinessRepository implements BusinessRepository {
  constructor(private readonly db: SqlDatabase) {}

  async create(b: Business): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO businesses (id, name, country_code, currency_code, preferred_unit_system, business_category, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.id, b.name, b.countryCode, b.currencyCode, b.preferredUnitSystem, b.businessCategory, b.createdAt, b.updatedAt],
      );
    } catch (error) {
      throw translateSqliteError(error);
    }
  }

  async findById(id: string): Promise<Business | null> {
    const row = await this.db.getFirstAsync<BusinessRow>('SELECT * FROM businesses WHERE id = ?', [id]);
    return row ? toBusiness(row) : null;
  }

  async findFirst(): Promise<Business | null> {
    const row = await this.db.getFirstAsync<BusinessRow>('SELECT * FROM businesses ORDER BY created_at, id LIMIT 1', []);
    return row ? toBusiness(row) : null;
  }
}
