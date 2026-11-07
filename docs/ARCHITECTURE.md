# Valorarte — Arquitectura técnica

## 1. Objetivo

Mantener una arquitectura modular, fácil de probar y adecuada para una aplicación local-first.

El MVP no tendrá backend, autenticación real ni sincronización en la nube. La arquitectura debe permitir incorporar esas capacidades posteriormente sin acoplar la interfaz a la base de datos.

## 2. Principios

- TypeScript estricto.
- Separación entre interfaz y dominio.
- Persistencia detrás de interfaces o repositorios.
- Operaciones de negocio explícitas.
- Transacciones para operaciones que cambien varias entidades relacionadas.
- Cálculos centralizados.
- Pruebas unitarias de reglas económicas.
- Migraciones versionadas de la base de datos.
- Internacionalización desde el principio.
- Evitar abstracciones prematuras.

## 3. Stack

- React Native.
- Expo SDK 57.
- Expo Router.
- TypeScript.
- Una base de datos local adecuada para datos relacionales y transacciones.
- Una solución de internacionalización compatible con Expo.
- Un mecanismo de tema claro/oscuro centralizado.
- Herramientas de pruebas compatibles con el stack elegido.

La selección exacta de la base de datos y de las bibliotecas debe validarse contra la versión real de Expo y los requisitos de persistencia.

No añadir varias bibliotecas que resuelvan el mismo problema.

## 4. Organización propuesta

```text
app/
├── _layout.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── ingredients.tsx
│   ├── products.tsx
│   └── settings.tsx
├── ingredients/
│   ├── new.tsx
│   ├── [id].tsx
│   ├── [id]/
│   │   └── history.tsx
│   └── purchase/
│       └── new.tsx
├── products/
│   ├── new.tsx
│   └── [id].tsx
├── production/
│   └── new.tsx
├── sales/
│   ├── new.tsx
│   └── [id].tsx
├── returns/
│   └── new.tsx
└── backup/
    └── index.tsx

src/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── feedback/
│   └── financial/
├── features/
│   ├── dashboard/
│   ├── ingredients/
│   ├── purchases/
│   ├── products/
│   ├── production/
│   ├── sales/
│   ├── inventory/
│   ├── pricing/
│   ├── taxes/
│   ├── expenses/
│   ├── promotions/
│   ├── settings/
│   └── backup/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── calculations/
│   ├── policies/
│   └── errors/
├── data/
│   ├── database/
│   │   ├── migrations/
│   │   └── schema/
│   ├── repositories/
│   └── mappers/
├── i18n/
├── theme/
├── hooks/
├── lib/
├── constants/
└── types/
```

Esta estructura es una guía, no una obligación de crear todos los archivos vacíos. Añadir módulos cuando exista funcionalidad real que los necesite.

## 5. Responsabilidades

### app/

Define rutas, layouts y navegación. No debe contener fórmulas económicas ni lógica de persistencia compleja.

### components/

Contiene componentes visuales reutilizables. No debe consultar directamente tablas ni modificar inventario.

### features/

Agrupa las funciones específicas de cada área: pantallas, formularios, hooks y coordinación de casos de uso.

### domain/

Contiene:

- Entidades.
- Tipos y unidades.
- Reglas de negocio.
- Cálculos de precios y costos.
- Políticas de inventario.
- Validaciones.
- Errores de dominio.

El dominio no debe depender de React Native ni de componentes visuales.

### data/

Contiene:

- Esquema local.
- Migraciones.
- Implementaciones de repositorios.
- Persistencia.
- Mapeos entre registros persistidos y entidades.

### i18n/

Contiene traducciones y configuración regional.

### theme/

Contiene tokens, temas y mecanismos para resolver el tema activo.

## 6. Flujos de dominio

### Compra

Validar compra → normalizar unidades → calcular costo atribuible → registrar compra → actualizar existencias → recalcular costo promedio → guardar movimientos e historial.

Todo debe ejecutarse como una operación consistente.

### Producción

Validar receta y existencias → calcular consumos → calcular costo → registrar producción → descontar ingredientes → añadir productos terminados → guardar rendimiento y merma.

Si algún paso falla, no debe quedar solo una parte de la operación aplicada.

### Venta

Validar líneas y precios → calcular descuentos e impuestos → validar inventario → calcular costos y rentabilidad → registrar venta → descontar existencias → registrar pagos y saldo.

Las reglas fiscales deben limitarse a las capacidades implementadas y configuradas.

### Devolución

Consultar venta original → validar cantidades y devoluciones previas → calcular importes correspondientes → registrar reverso económico → reingresar inventario solo si es vendible → conservar trazabilidad.

### Ajuste de inventario

Solicitar cantidad o conteo físico → validar motivo → calcular diferencia → registrar movimiento de ajuste → actualizar existencias.

## 7. Persistencia y transacciones

Las operaciones de negocio deben utilizar repositorios y casos de uso.

No permitir que dos pantallas actualicen independientemente el mismo stock.

Una operación que modifica varias tablas debe utilizar una transacción cuando la tecnología seleccionada lo permita.

Si ocurre un error, revertir la operación completa.

Precisión numérica (detalle en `BUSINESS-RULES.md` §19):

- Almacenamiento: importes monetarios definitivos como enteros en la unidad mínima de la moneda. Costos unitarios normalizados, cantidades físicas y tasas con escala decimal fija de 6 posiciones.
- Cálculo: aritmética decimal precisa, sin punto flotante binario y sin limitar los resultados intermedios a la escala de almacenamiento.
- Redondeo: `ROUND_HALF_UP` solo cuando una regla de negocio cuantiza un resultado o produce un importe definitivo.

El redondeo debe implementarse en un único módulo de dominio, no en componentes ni repositorios.

## 8. Datos derivados

Los valores calculados deben tener una fuente de verdad clara.

Ejemplos:

- Stock actual: movimientos registrados o una proyección consistente de ellos.
- Costo promedio: derivado del valor acumulado y la cantidad acumulada del inventario (`BUSINESS-RULES.md` §5). Un costo unitario guardado es solo un snapshot.
- Margen: cálculo a partir de ingresos sin impuestos y costos.
- Saldo pendiente: total adeudado menos pagos y ajustes válidos.

Se pueden guardar snapshots históricos necesarios para preservar el contexto de una operación.

No mantener múltiples valores derivados independientes que puedan divergir sin mecanismos de reconciliación.

## 9. Identificadores y futuro multiusuario

Cada negocio tendrá un identificador estable.

Las entidades del negocio deben relacionarse con ese identificador cuando corresponda.

No implementar todavía autenticación ni permisos, pero evitar modelos que dependan de un único usuario global o de identificadores secuenciales que no puedan migrarse.

Preparar el diseño para futuras migraciones y sincronización. No construir sincronización anticipadamente.

## 10. Internacionalización

- No escribir textos visibles directamente en componentes cuando deban traducirse.
- Usar claves de traducción.
- Mantener traducciones en español e inglés.
- Formatear moneda, números y fechas según la configuración regional.
- No confundir idioma con país.
- No asumir que el sistema métrico o la moneda están determinados por el idioma.

## 11. Seguridad y respaldos

El respaldo debe:

- Incluir versión de esquema.
- Validar formato y contenido.
- Verificar referencias entre entidades.
- Evitar importar archivos inválidos.
- Advertir sobre conflictos o sobrescrituras.
- Proteger la consistencia de los datos existentes.

El respaldo puede contener información comercial sensible. No compartirlo automáticamente con servicios externos.

### 11.1 Almacenamiento de imágenes (aprobada para prueba técnica aislada, sin integrar)

Objetivo: que una imagen sobreviva al cierre de la aplicación, a restaurar un respaldo y a cambiar de dispositivo, sin depender de URI de la galería y sin añadir una biblioteca de imágenes. Versiones comprobadas contra `expo@58.0.20` y su `bundledNativeModules.json`.

**Selección**

1. La galería se abre con `launchImageLibraryAsync` y `allowsEditing` con `aspect: [1, 1]`. En Android, `aspect` se respeta; en iOS, la documentación indica que el recorte siempre es cuadrado.
2. Al volver, se atiende `getPendingResultAsync()`: Android puede destruir la actividad mientras el selector está abierto, y sin esto se perdería la selección.
3. Se muestra la vista previa al tamaño real de la miniatura para confirmar. La interfaz nativa de recorte no la ofrece.
4. **Cámara: aplazada, fuera de la primera versión.**

**Copia, reducción y compresión**

1. La imagen confirmada se reduce a 1024 px de lado y se comprime en JPEG al 75 %. **Ambos valores son hipótesis por medir.** El selector no ofrece redimensionar, solo `quality`, por lo que este paso necesita `expo-image-manipulator`.
2. El resultado queda en la caché, igual que el URI del selector; ninguna de las dos ubicaciones es permanente. Mientras el formulario no se guarda, la imagen sigue siendo un borrador en caché. Al descartar, no se persiste nada.
3. Al guardar, se copia a `Paths.document/images/<uuid>.jpg`.

**Nombres y referencias**

- Un UUID nuevo por escritura, con el `newId` existente. No se sobrescribe nunca un archivo, lo que evita imágenes antiguas en caché tras una sustitución.
- SQLite guarda solo la ruta relativa, `images/<uuid>.jpg`. Nunca una ruta absoluta, que puede cambiar al restaurar, ni el URI de origen.

**Asociación (se definirá en `docs/DATA-MODEL.md` tras aprobarse)**

- Ingrediente: `image_path` y `emoji`, ambos opcionales y excluyentes por una restricción `CHECK`.
- Producto: `image_path` opcional, sin campo de emoji. Se añade cuando exista la tabla de productos.
- Sin tabla de medios: cada registro tiene como mucho una imagen, y una tabla más no resolvería ningún problema actual.
- Volver a elegir la misma foto crea una copia independiente. No se deduplica en el MVP.
- Guardar imágenes como BLOB en SQLite queda descartado: engordaría la base de datos y sus consultas.

**Sustitución y eliminación**

1. Escribir el archivo nuevo.
2. Actualizar la referencia en una transacción.
3. Borrar el archivo anterior solo tras confirmarse la transacción.

Si falla el paso 1 o 2, se conserva la imagen vigente y se comunica el error. Si falla el 3, queda un archivo huérfano inofensivo. Una limpieza al iniciar borra los archivos de `images/` sin referencia, solo si la base de datos abrió correctamente. Un registro archivado conserva su imagen.

**Imagen no disponible**

Si el archivo falta o no se puede decodificar, se muestra el estado sin imagen de la sección 16 del sistema de diseño. No se bloquea la pantalla ni se borra la referencia. El formulario permite elegir otra.

**Respaldo y restauración**

**Decisión:** ZIP sin compresión con `manifest.json` y SHA-256, según la prueba técnica. El respaldo permite exportar con o sin imágenes e indica qué excluye. La restauración valida datos y archivos antes de reemplazar nada. Sin implementar.

Hipótesis descartada, un único archivo binario propio:

1. Encabezado JSON con versión de esquema, datos y un manifiesto de imágenes (ruta, tamaño y suma de verificación).
2. Los bytes de cada imagen, uno tras otro.

Se escribe y se lee por partes con `FileHandle` (`readBytes` y `writeBytes`, presentes en `expo-file-system` 58.0.12), sin cargarlo en memoria ni pasar por base64.

Restauración:

1. Validar el encabezado, los tamaños y las sumas.
2. Extraer a una carpeta temporal.
3. Aplicar los datos en una transacción.
4. Sustituir `images/` al final.

Un archivo corrupto se rechaza entero y lo existente queda intacto. Una imagen que ya faltaba al exportar queda declarada en el manifiesto, no impide restaurar y usa el estado sin imagen.

El cambio de dispositivo se hace con este archivo; el MVP no incluye nube. Sin respaldo exportado, desinstalar puede perder datos e imágenes. Hay que comprobar la copia automática de Android, que tiene límites propios y no debe presentarse como respaldo.

**Tamaño de los respaldos**

Medido el 2026-11-01 con la imagen más pesada de la muestra (159 KB): 31,1 MB con 200 imágenes y 77,7 MB con 500. El respaldo ligero, sin imágenes y sin datos reales, ocupó entre 2 y 5 KB. Antes de exportar se muestra el tamaño estimado.

**Riesgo de memoria.** Decodificar 1024 px para un círculo de 44 dp ocupa unos 4 MB por imagen. Primero se probará `resizeMethod` de `Image` en listas con cientos de filas. Una miniatura separada se añadiría solo si la prueba lo exige.

**Dependencias, evaluadas una a una**

| Paquete | Versión para SDK 58 | Veredicto | Justificación |
| --- | --- | --- | --- |
| `expo-image-picker` | `~58.0.10` | **Necesaria** | Única vía sin escribir código nativo para abrir la galería y recortar |
| `expo-file-system` | `~58.0.12` | **Necesaria, como dependencia directa** | Copia persistente y respaldo por partes. Ya llega de forma transitiva por `expo`, pero con pnpm no conviene importar lo no declarado |
| `expo-image-manipulator` | `~58.0.15` | **Necesaria para reducir** | El selector no redimensiona. Sin ella, los respaldos se multiplican. Prescindible solo si se aceptan esos tamaños |
| `expo-image` | | **No** | `Image` de React Native basta; se revisará solo si la prueba de memoria falla |
| `expo-sharing`, `expo-document-picker` | | **Ahora no** | No son de imágenes: corresponden al respaldo de la Fase 7 y se evaluarán entonces |
| `expo-crypto` | | **No** | La suma de verificación se resolverá con lo que ofrezca `expo-file-system`; hay que confirmarlo al implementar |

Configuración necesaria: `expo-image-picker` añade por defecto el permiso `RECORD_AUDIO` en Android, además de `CAMERA` y de permisos de almacenamiento. Debe configurarse `microphonePermission: false` y, sin cámara, `cameraPermission: false`. Hay que comprobar el manifiesto resultante.

**Prueba técnica (2026-11-01).** Samsung Galaxy S23, Android 16 (API 36). Proyecto aislado `valorarte-image-spike`, con 5 fotos públicas de muestra. No es gama baja.

- **Compatibilidad:** las tres dependencias funcionan con las versiones del lockfile del proyecto. `expo-modules-core` debe coincidir con él: con 58.0.29, que el rango `~58.0.27` permite, `expo-sqlite` 58.0.14 falló al arrancar con `NoSuchMethodError`. Es una asociación observada, sin aislar con una prueba de una sola variable.
- **`copy` y `move` de `expo-file-system` son asíncronos:** siempre con `await`. Sin él, SQLite puede confirmar antes de que exista el archivo.
- **Peso a 1024 px y JPEG al 75 %:** de 30 a 159 KB, media de 86 KB.
- **Cierres forzados:** 11 puntos de guardado, sustitución y eliminación sin referencias rotas; los huérfanos se eliminan con la conciliación al arrancar. La restauración con diario se recuperó en los 6 puntos; sin él quedan referencias rotas.
- **Sustitución:** borrar la imagen anterior no debe fallar si ya no existe.
- **Formato:** con ambos en streaming, binario y ZIP pesan y rinden de forma comparable. Se elige ZIP porque se puede abrir con herramientas estándar. `fflate` no verifica CRC en `unzipSync`; el manifiesto lleva SHA-256, que no protege frente a manipulación intencional.

**Sin concluir:** `getPendingResultAsync` tras la muerte real del proceso, gama baja y corte de alimentación. Una foto elegida también deja copias de hasta 2,5 MB en la caché del selector, que hay que limpiar.

## 12. Pruebas

Mantener pruebas unitarias del dominio separadas de las pruebas de interfaz.

Añadir pruebas de integración para:

- Persistencia.
- Transacciones.
- Compras.
- Producciones.
- Ventas.
- Devoluciones.
- Importación y exportación.

Las fórmulas críticas deben probarse con casos normales, límites y datos inválidos.

## 13. Criterio arquitectónico

Elegir la solución más sencilla que preserve:

- Exactitud.
- Trazabilidad.
- Pruebas.
- Consistencia.
- Posibilidad de evolución.

No introducir microservicios, backend ni sincronización para una aplicación local que todavía no los necesita.
