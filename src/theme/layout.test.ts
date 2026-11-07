import { columnsFor, widthClassOf, windowLayoutOf } from './layout';

describe('clases de ventana', () => {
  it.each([
    [599, 'compact'],
    [600, 'medium'],
    [839, 'medium'],
    [840, 'expanded'],
    [1199, 'expanded'],
    [1200, 'wide'],
  ])('%i dp es %s', (width, expected) => {
    expect(widthClassOf(width)).toBe(expected);
  });

  it('usa navegación lateral desde 600 dp aunque la ventana sea baja', () => {
    expect(windowLayoutOf(599, 800, 1).sideNavigation).toBe(false);
    expect(windowLayoutOf(844, 390, 1).sideNavigation).toBe(true);
  });

  it('no muestra paneles con altura baja ni con letra que no quepa', () => {
    expect(windowLayoutOf(1000, 800, 1).panes).toBe(true);
    expect(windowLayoutOf(1000, 479, 1).panes).toBe(false);
    expect(windowLayoutOf(1000, 800, 2).panes).toBe(false);
    expect(windowLayoutOf(839, 800, 1).panes).toBe(false);
  });
});

describe('columnas', () => {
  it('reduce columnas con la letra ampliada, nunca por debajo de una', () => {
    expect(columnsFor(800, 320, 1)).toBe(2);
    expect(columnsFor(800, 320, 2)).toBe(1);
    expect(columnsFor(200, 320, 1)).toBe(1);
  });
});
