import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { SqlDatabase } from './database';
import { openAppDatabase } from './open-database';

export type DatabaseState =
  | { status: 'loading' }
  | { status: 'ready'; db: SqlDatabase }
  | { status: 'error'; error: unknown };

const DatabaseContext = createContext<DatabaseState | null>(null);

/** Abre la base de datos local una sola vez y la comparte con toda la app. */
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DatabaseState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    openAppDatabase().then(
      (db) => {
        if (cancelled) void db.closeAsync();
        else setState({ status: 'ready', db });
      },
      (error: unknown) => {
        if (!cancelled) setState({ status: 'error', error });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return <DatabaseContext.Provider value={state}>{children}</DatabaseContext.Provider>;
}

export function useDatabase(): DatabaseState {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error('useDatabase must be used within a DatabaseProvider');
  return ctx;
}
