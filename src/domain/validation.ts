/** Error de validación del dominio. `issues` usa códigos estables para traducirlos en la interfaz. */
export interface ValidationIssue {
  field: string;
  code: string;
}

export class DomainValidationError extends Error {
  constructor(readonly issues: readonly ValidationIssue[]) {
    super(`Invalid data: ${issues.map((i) => `${i.field}:${i.code}`).join(', ')}`);
    this.name = 'DomainValidationError';
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/** Texto obligatorio: devuelve el valor recortado o registra el problema. */
export function requiredText(value: string, field: string, issues: ValidationIssue[]): string {
  const trimmed = value.trim();
  if (!trimmed) issues.push({ field, code: 'required' });
  return trimmed;
}

/** Texto opcional: cadena vacía se guarda como `null`. */
export function optionalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function assertValid(issues: ValidationIssue[]): void {
  if (issues.length > 0) throw new DomainValidationError(issues);
}
