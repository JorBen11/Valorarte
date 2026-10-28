import { openDatabaseAsync } from 'expo-sqlite';

import type { SqlDatabase } from './database';
import { migrate } from './migrations';

const DATABASE_NAME = 'valorarte.db';

/** Abre la base de datos local de la app y la deja migrada y con claves foráneas activas. */
export async function openAppDatabase(): Promise<SqlDatabase> {
  const db = await openDatabaseAsync(DATABASE_NAME);
  try {
    await migrate(db);
  } catch (error) {
    await db.closeAsync();
    throw error;
  }
  return db;
}
