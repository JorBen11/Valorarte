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
