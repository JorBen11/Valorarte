import type { TFunction } from 'i18next';

import { DomainValidationError } from '@/domain/validation';

/** Mensaje traducido del primer problema de cada campo de un error de validación del dominio. */
export function fieldErrors(error: DomainValidationError, t: TFunction): Record<string, string> {
  const result: Record<string, string> = {};
  for (const { field, code } of error.issues) {
    result[field] ??= t(`validation.${code}`);
  }
  return result;
}
