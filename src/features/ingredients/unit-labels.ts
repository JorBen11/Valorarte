import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { TFunction } from 'i18next';
import type { ComponentProps } from 'react';

import { UNITS, type Dimension, type UnitCode } from '@/domain/units';

/** Etiqueta de presentación de una unidad; el código interno nunca se muestra (cm2 → cm²). */
export function unitLabel(code: UnitCode, t: TFunction): string {
  return t(`units.label.${code}`, { defaultValue: UNITS[code].label });
}

/** Nombre legible para elegir la unidad: «Gramos (g)». */
export function unitName(code: UnitCode, t: TFunction): string {
  return t('units.name', { name: t(`units.fullName.${code}`), abbr: unitLabel(code, t) });
}

export function dimensionLabel(dimension: Dimension, t: TFunction): string {
  return t(`units.dimension.${dimension}`);
}

/** Icono que identifica cada tipo de medida en chips y filas de la lista. */
export const DIMENSION_ICONS: Record<Dimension, ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  mass: 'scale',
  volume: 'cup-water',
  length: 'ruler',
  area: 'vector-square',
  count: 'numeric',
};

export function unitsOfDimension(dimension: Dimension): UnitCode[] {
  return (Object.keys(UNITS) as UnitCode[]).filter((code) => UNITS[code].dimension === dimension);
}
