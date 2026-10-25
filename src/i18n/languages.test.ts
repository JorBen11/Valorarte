import { FALLBACK_LANGUAGE, isSupportedLanguage, resolveLanguage } from './languages';
import en from './locales/en.json';
import es from './locales/es.json';

describe('resolveLanguage', () => {
  it('respeta una preferencia explícita', () => {
    expect(resolveLanguage('es', ['en'])).toBe('es');
    expect(resolveLanguage('en', ['es'])).toBe('en');
  });

  it('usa el primer idioma soportado del dispositivo', () => {
    expect(resolveLanguage('system', ['es'])).toBe('es');
    expect(resolveLanguage('system', ['fr', 'es', 'en'])).toBe('es');
  });

  it('usa el idioma de respaldo si ninguno está soportado', () => {
    expect(resolveLanguage('system', ['fr', 'de'])).toBe(FALLBACK_LANGUAGE);
    expect(resolveLanguage('system', [])).toBe(FALLBACK_LANGUAGE);
    expect(resolveLanguage('system', [null, undefined])).toBe(FALLBACK_LANGUAGE);
  });

  it('no trata "system" como un idioma soportado', () => {
    expect(isSupportedLanguage('system')).toBe(false);
    expect(resolveLanguage('system', ['system'])).toBe(FALLBACK_LANGUAGE);
  });
});

function keyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe('traducciones', () => {
  it('español e inglés definen exactamente las mismas claves', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(es).sort());
  });
});
