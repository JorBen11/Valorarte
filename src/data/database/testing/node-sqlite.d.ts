// Tipos mínimos de los módulos de Node usados por las pruebas de persistencia; el proyecto no incluye @types/node.
declare module 'node:fs' {
  export function mkdtempSync(prefix: string): string;
  export function rmSync(path: string, options: { recursive: boolean; force: boolean }): void;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'node:sqlite' {
  type Value = string | number | bigint | null | Uint8Array;

  interface StatementSync {
    run(...params: Value[]): { changes: number | bigint; lastInsertRowid: number | bigint };
    get(...params: Value[]): unknown;
    all(...params: Value[]): unknown[];
  }

  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
