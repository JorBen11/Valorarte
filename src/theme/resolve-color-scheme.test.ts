import { resolveColorScheme } from './resolve-color-scheme';

describe('resolveColorScheme', () => {
  it('respeta una preferencia explícita aunque el sistema diga otra cosa', () => {
    expect(resolveColorScheme('light', 'dark')).toBe('light');
    expect(resolveColorScheme('dark', 'light')).toBe('dark');
  });

  it('sigue al sistema cuando la preferencia es system', () => {
    expect(resolveColorScheme('system', 'dark')).toBe('dark');
    expect(resolveColorScheme('system', 'light')).toBe('light');
  });

  it('usa claro si el sistema no informa un esquema reconocido', () => {
    expect(resolveColorScheme('system', 'unspecified')).toBe('light');
    expect(resolveColorScheme('system', null)).toBe('light');
    expect(resolveColorScheme('system', undefined)).toBe('light');
  });
});
