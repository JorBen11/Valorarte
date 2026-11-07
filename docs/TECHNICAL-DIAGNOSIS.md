# Valorarte — Diagnóstico técnico (Fase 0)

> **Documento histórico.** Registra el estado y las decisiones de la Fase 0 tal como eran entonces, incluidos paleta, tipografía (Plus Jakarta Sans), contraste y versiones. No describe la identidad vigente: la dirección oficial, Etiqueta refinada, está en `docs/DESIGN-SYSTEM.md`. Tampoco actualiza versiones: `package.json` manda.

Fecha: 2026-10-23. Estado previo conservado en la rama `chore/pre-fase-0` (commit `6fe722e`).

## 1. Estado inicial encontrado

- Expo SDK 57 (`expo ~57.0.31`, React Native 0.86.3, React 19.2.3, TypeScript 6.0).
- Plantilla de Expo con dos pestañas (Inicio, Settings) y contenido de ejemplo.
- Tres sistemas de estilo en paralelo: NativeWind/Tailwind, react-native-paper y `StyleSheet`.
- Tres paletas distintas, ninguna la de `docs/DESIGN-SYSTEM.md`.
- Iconos SF Symbols en iOS y Material en Android (estilos distintos).
- i18n con `"system"` incluido entre los idiomas soportados y textos de un flujo de
  "consumo directo de materiales" que contradice `docs/BUSINESS-RULES.md`.
- Sin pruebas ni comando de pruebas.

## 2. Decisiones de la Fase 0

| Tema | Decisión | Motivo |
|---|---|---|
| Navegación | Expo Router, 4 pestañas: `index`, `ingredients`, `products`, `settings` | CLAUDE.md §5 |
| Estilos | `StyleSheet` + tokens en `src/theme/tokens.ts` | Una sola solución (ARCHITECTURE §3) |
| Paleta | Exactamente la de DESIGN-SYSTEM §3 | Documentada |
| Tipografía | Plus Jakarta Sans (una sola familia) | "Inter o alternativa compatible"; ya instalada |
| Iconos | `@expo/vector-icons` MaterialCommunityIcons en todas las plataformas | Un único estilo |
| i18n | i18next 26 + react-i18next 17 + expo-localization; init síncrono | Compatibles con TS 6 |
| Preferencias de tema/idioma | Zustand + AsyncStorage, por dispositivo | Se necesitan antes de que exista un negocio |
| Pruebas | Jest + `jest-expo ~57.0.6` (`pnpm test`) | Preset oficial del SDK |
| Código | `src/` con alias `@/*`; `app/` solo rutas | ARCHITECTURE §4 |

Dependencias retiradas: nativewind, react-native-css-interop, tailwindcss,
prettier-plugin-tailwindcss, react-native-paper, expo-symbols, expo-blur, expo-image,
expo-web-browser, expo-haptics, @expo-google-fonts/epilogue, @expo-google-fonts/syne.

## 3. Persistencia elegida (se implementa en la Fase 1)

`expo-sqlite ~57.0.4` (versión incluida en el SDK 57):

- Relacional, con claves foráneas (`PRAGMA foreign_keys = ON`) y transacciones
  (`withExclusiveTransactionAsync`) para compras, producción, ventas y devoluciones.
- Migraciones numeradas en código; versión en `PRAGMA user_version`; cada migración
  en su propia transacción al arrancar.
- Identificadores UUID y `businessId` en todas las entidades del negocio.
- Respaldos (Fase 7) con `schemaVersion` y validación antes de importar.

## 4. Contraste medido (WCAG 2.x)

Todos los colores de texto superan 4.5:1 sobre fondo, superficie y superficie
secundaria en ambos temas, excepto:

- `accent` en tema claro (`#C56A4A`): 3.3–3.8:1. Solo para iconos o texto ≥ 18 px.
- `border` (1.3–1.5:1): válido como separador decorativo; no basta como único
  límite visible de un control de formulario.

## 5. Verificaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| `pnpm typecheck` (`tsc --noEmit`) | Sin errores |
| `pnpm lint` (`expo lint`) | Sin errores |
| `pnpm test` | 2 suites, 8 pruebas, todas pasan |
| `npx expo-doctor` | 21/21 comprobaciones superadas |
| `expo export --platform android` | Bundle generado |
| Emulador Android (Pixel 7a, API 35) con Expo Go | 4 pestañas, cambio de tema e idioma, persistencia tras reiniciar |

## 6. Pendientes y riesgos

1. ~~**Política de redondeo monetario**~~. Resuelta el 2026-10-25: enteros en la unidad
   mínima, aritmética decimal y `ROUND_HALF_UP` en importes definitivos
   (`BUSINESS-RULES.md` §19). Escala de 6 decimales para costos unitarios, cantidades y
   tasas aprobada el mismo día. Quedan abiertos los detalles y riesgos de §19.4.
   Unidades base, factores de conversión y fuentes de verdad de la valoración aprobados
   también el 2026-10-25 (`BUSINESS-RULES.md` §3 y §5). El modelado del valor acumulado
   queda como propuesta pendiente (`DATA-MODEL.md` §16).
2. **Varios impuestos y precio con impuestos incluidos**: cascada o misma base
   (BUSINESS-RULES §9). Bloquea el cálculo de precios de la Fase 3.
3. **Tratamiento económico de la merma** (BUSINESS-RULES §6). Bloquea la Fase 4.
4. **Tema e idioma**: DATA-MODEL los incluye en `BusinessSettings`; en la Fase 0 son
   preferencias del dispositivo. Falta decidir si el negocio los sobrescribe.
5. **Idioma de respaldo**: se mantiene `en` (decisión previa del repositorio); la
   documentación no lo define.
6. **Barras del sistema en Android**: en Expo Go la franja de la barra de estado se ve
   negra y la de navegación clara, sin importar el tema. Hay que verificarlo en un
   development build (`expo run:android`), donde la app controla su ventana.
7. **TypeScript 6** ya no incluye `@types/*` automáticamente; `tsconfig.json` declara
   `"types": ["jest"]`. Si se añaden otros tipos globales, hay que listarlos.
8. **Persistencia (Fase 1, ingredientes):** decisiones técnicas tomadas sin regla de negocio
   que las fije. Las fechas se guardan en ISO 8601 UTC (texto). Las cantidades de escala 6 se
   guardan como texto decimal canónico (`"1500.000000"`). `lowStockThreshold` se guarda
   normalizado a la unidad base. `Business` no incluye todavía `defaultLanguage`; depende
   del punto 4.
9. **Pruebas de persistencia:** se ejecutan en Node con `node:sqlite` mediante un adaptador
   con la misma forma que expo-sqlite. No validan expo-sqlite en Android.
