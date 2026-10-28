// Solo para pruebas en Node: no debe importarse desde el código de la app.
import { DatabaseSync } from 'node:sqlite';

import type { SqlDatabase, SqlValue } from '../database';

/** Adaptador de `node:sqlite` con la misma forma que la API asíncrona de expo-sqlite. */
export function openNodeDatabase(path: string): SqlDatabase {
  const db = new DatabaseSync(path);
  return {
    async execAsync(source) {
      db.exec(source);
    },
    async runAsync(source, params: SqlValue[]) {
      return db.prepare(source).run(...params);
    },
    async getFirstAsync<T>(source: string, params: SqlValue[] = []) {
      return (db.prepare(source).get(...params) ?? null) as T | null;
    },
    async getAllAsync<T>(source: string, params: SqlValue[] = []) {
      return db.prepare(source).all(...params) as T[];
    },
    async withTransactionAsync(task) {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    async closeAsync() {
      db.close();
    },
  };
}
