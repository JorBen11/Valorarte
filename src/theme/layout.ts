import { useWindowDimensions } from 'react-native';

import { spacing } from './tokens';

/** Clases de ventana de docs/DESIGN-SYSTEM.md, sección 18. Es el único lugar con estos valores. */
export type WidthClass = 'compact' | 'medium' | 'expanded' | 'wide';

export const SHORT_HEIGHT = 480;
/** Mínimos de contenido por encima de los cuales una composición sigue siendo legible. */
const LIST_PANE = 360;
const DETAIL_PANE_MIN = 420;
export const FORM_MAX_WIDTH = 600;
export const CONTENT_MAX_WIDTH = 1200;
export const SHEET_MAX_WIDTH = 480;
export const RAIL_WIDTH = 116;
/** A partir de esta escala de letra las filas apilan su dato bajo el nombre y la pestaña activa apila su etiqueta. */
export const LARGE_TEXT_SCALE = 1.5;

export function widthClassOf(width: number): WidthClass {
  if (width < 600) return 'compact';
  if (width < 840) return 'medium';
  if (width < 1200) return 'expanded';
  return 'wide';
}

/**
 * Columnas que caben sin encoger el texto. El ancho se divide por `fontScale`:
 * con letra ampliada una columna necesita más espacio real.
 */
export function columnsFor(available: number, minColumn: number, fontScale: number, max = 2): number {
  const effective = available / Math.max(fontScale, 1);
  return Math.max(1, Math.min(max, Math.floor(effective / minColumn)));
}

export interface WindowLayout {
  width: number;
  height: number;
  fontScale: number;
  widthClass: WidthClass;
  isShort: boolean;
  /** Navegación lateral desde 600 dp, también en ventanas bajas. */
  sideNavigation: boolean;
  /** Lista y detalle simultáneos: espacio, altura y letra lo permiten. */
  panes: boolean;
  gutter: number;
  listPaneWidth: number;
}

export function windowLayoutOf(width: number, height: number, fontScale: number): WindowLayout {
  const widthClass = widthClassOf(width);
  const isShort = height < SHORT_HEIGHT;
  const scale = Math.max(fontScale, 1);
  const panes = (widthClass === 'expanded' || widthClass === 'wide') && !isShort && width / scale >= LIST_PANE + DETAIL_PANE_MIN;
  return {
    width,
    height,
    fontScale,
    widthClass,
    isShort,
    sideNavigation: widthClass !== 'compact',
    panes,
    gutter: widthClass === 'compact' ? spacing.lg : spacing.xxl,
    listPaneWidth: LIST_PANE,
  };
}

export function useWindowLayout(): WindowLayout {
  const { width, height, fontScale } = useWindowDimensions();
  return windowLayoutOf(width, height, fontScale);
}
