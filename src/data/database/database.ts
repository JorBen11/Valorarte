/**
 * Subconjunto de la API asíncrona de expo-sqlite que usa la capa de datos.
 * `SQLiteDatabase` de expo-sqlite lo cumple tal cual; las pruebas usan un adaptador
 * sobre `node:sqlite` con la misma forma.
 */
export type SqlValue = string | number | null;

export interface SqlDatabase {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, params: SqlValue[]): Promise<unknown>;
  getFirstAsync<T>(source: string, params: SqlValue[]): Promise<T | null>;
  getAllAsync<T>(source: string, params: SqlValue[]): Promise<T[]>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
  closeAsync(): Promise<void>;
}

export class ForeignKeyViolationError extends Error {
  constructor(options: { cause: unknown }) {
    super('Referenced record does not exist', options);
    this.name = 'ForeignKeyViolationError';
  }
}

/** Traduce las violaciones de clave foránea a un error tipado; el resto se propaga sin cambios. */
export function translateSqliteError(error: unknown): unknown {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('FOREIGN KEY constraint failed') ? new ForeignKeyViolationError({ cause: error }) : error;
}
