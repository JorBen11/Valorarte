import { randomUUID } from 'expo-crypto';

/** Identificador estable para entidades persistidas (UUID v4). */
export function newId(): string {
  return randomUUID();
}
