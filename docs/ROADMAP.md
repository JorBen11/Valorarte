# Valorarte — Roadmap del MVP

## Principio

Construir en incrementos funcionales y verificables. No implementar todas las pantallas visuales con datos ficticios y dejar la lógica de negocio para el final.

Cada fase debe producir una aplicación que compile y tenga un alcance comprobable.

## Fase 0 — Inspección y base técnica

- Revisar repositorio.
- Verificar versión de Expo y compatibilidad de dependencias.
- Definir navegación.
- Configurar TypeScript.
- Configurar tema.
- Configurar internacionalización.
- Elegir persistencia local.
- Definir pruebas.
- Crear estructura de carpetas.
- Validar Android.

Criterio de salida:

- Proyecto ejecutable.
- Navegación inferior con cuatro secciones.
- Tema claro y oscuro.
- Español e inglés.
- Diagnóstico técnico documentado.

## Fase 1 — Modelo de dominio y persistencia

- Definir entidades y tipos.
- Crear esquema local.
- Crear migraciones iniciales.
- Implementar repositorios.
- Implementar unidades y conversiones.
- Implementar pruebas de dominio.
- Implementar configuración del negocio.

Criterio de salida:

- Datos persistidos entre reinicios.
- Validación de relaciones.
- Pruebas básicas de unidades y persistencia.

## Fase 2 — Ingredientes y compras

- CRUD de ingredientes.
- Unidades de inventario.
- Umbrales de stock bajo.
- Registro de compras.
- Registro de gastos atribuibles.
- Costo promedio ponderado.
- Movimientos de inventario.
- Historial de compras.
- Historial y gráfico de precios.

Criterio de salida:

- Las compras actualizan existencias y costos de manera consistente.
- Los precios históricos pueden compararse en unidades compatibles.
- Los ajustes requieren motivo.

## Fase 3 — Productos y costos

- Catálogo unificado.
- Tipos fabricado, reventa y servicio.
- Variantes.
- Recetas base y específicas.
- Cálculo de costos directos.
- Configuración de impuestos porcentuales.
- Cálculo de precios sugeridos.
- Margen y recargo.
- Costos indirectos configurables.
- Identificación de costos incompletos.

Criterio de salida:

- Los cálculos están centralizados y probados.
- Los productos muestran su información económica sin inventar valores faltantes.

## Fase 4 — Producción e inventario terminado

- Registrar producción.
- Calcular consumos.
- Registrar mermas.
- Actualizar inventario de ingredientes.
- Registrar productos terminados.
- Costo histórico por producción.
- Costo promedio ponderado de productos terminados.
- Lotes y vencimientos opcionales.
- Alertas de stock.

Criterio de salida:

- Producción consistente.
- No se permiten consumos normales superiores al stock.
- Las correcciones son trazables.

## Fase 5 — Ventas y cobros

- Venta rápida.
- Selección de productos y variantes.
- Precio editable por línea.
- Descuentos.
- Impuestos.
- Pagos divididos.
- Pagos parciales.
- Saldos pendientes.
- Rentabilidad de la venta.
- Anulaciones.
- Devoluciones.

Criterio de salida:

- Las ventas utilizan el precio real confirmado.
- Los productos fabricados descuentan stock terminado.
- Las ventas de reventa descuentan mercancía.
- Cobros y saldos se distinguen.
- Los snapshots históricos son coherentes.

## Fase 6 — Inicio, alertas y promociones

- Resumen de ventas.
- Margen bruto.
- Ganancia estimada.
- Estado de integridad de costos.
- Alertas de stock.
- Alertas de vencimiento.
- Cambios de costos.
- Recomendaciones de promoción.
- Explicación de recomendaciones.

Criterio de salida:

- Los indicadores derivan de datos reales persistidos.
- Las recomendaciones no se aplican automáticamente.
- Las métricas incompletas se identifican.

## Fase 7 — Ajustes, respaldos y calidad

- Ajustes del negocio.
- Preferencias de unidades.
- Preferencias de idioma y tema.
- Configuración de costos.
- Exportación de respaldo.
- Importación validada.
- Pruebas de regresión.
- Revisión de accesibilidad.
- Revisión visual en Android.
- Diagnóstico de Expo.
- Documentación de limitaciones conocidas.

Criterio de salida:

- Flujo local completo.
- Respaldo probado.
- Operaciones críticas cubiertas por pruebas.
- Sin errores críticos conocidos.

## Fuera del MVP

No iniciar hasta aprobación:

- Backend.
- Autenticación.
- Sincronización en la nube.
- Multiusuario funcional.
- Facturación electrónica.
- Determinación fiscal automática.
- Integración bancaria.
- Cobros reales de suscripciones.

## Reglas de ejecución

- No saltar fases porque una pantalla sea visualmente fácil.
- No usar datos mock como sustituto permanente de operaciones reales.
- Los datos demo solo deben usarse explícitamente en desarrollo.
- Mantener el proyecto ejecutable en cada fase.
- No implementar una fase posterior si faltan decisiones críticas en la anterior.
- Informar de riesgos técnicos y cambios de alcance antes de continuar.
