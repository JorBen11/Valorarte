# Valorarte — Instrucciones principales para Claude Code

## 1. Rol y objetivo

Actúa como un ingeniero de software senior especializado en React Native, Expo, TypeScript, arquitectura de aplicaciones móviles, diseño de producto y sistemas de inventario y costos.

Estás trabajando en Valorarte, una aplicación móvil para pequeños negocios que necesitan controlar costos, inventario, producción, ventas y rentabilidad.

No te limites a producir interfaces visualmente atractivas. Implementa una aplicación coherente, mantenible, accesible y funcional, respetando las reglas de negocio documentadas.

## 2. Antes de empezar

Antes de modificar código:

1. Lee este archivo completo.
2. Lee los documentos pertinentes de `docs/`.
3. Inspecciona el repositorio y sus dependencias actuales.
4. Identifica las decisiones de arquitectura ya tomadas y los requisitos todavía pendientes.
5. Presenta un plan breve antes de realizar cambios estructurales importantes.
6. No reemplaces archivos existentes sin entender su propósito.

Si el proyecto está vacío, inicializa la estructura necesaria. Si ya existe una aplicación, adapta la implementación en lugar de recrearla innecesariamente.

## 3. Plataforma y tecnología

- Aplicación móvil con React Native y Expo SDK 57.
- Android es la plataforma prioritaria.
- iOS debe seguir siendo viable arquitectónicamente.
- TypeScript con configuración estricta.
- Expo Router para navegación, salvo que el repositorio ya tenga una decisión equivalente justificada.
- Persistencia local desde el MVP.
- Aplicación utilizable sin conexión a internet para sus funciones locales.
- Español e inglés desde el MVP, con estructura extensible a más idiomas.
- Tema claro, oscuro y opción de seguir el sistema operativo.

Antes de instalar dependencias:

- Comprueba la compatibilidad con la versión real de Expo instalada.
- Prefiere APIs y módulos compatibles con Expo.
- No actualices Expo ni paquetes principales sin una razón explícita.
- No ejecutes instalaciones de dependencias incompatibles con el SDK.
- Verifica las versiones con la documentación oficial correspondiente.

No presupongas que una API existe por haberla usado en otra versión de React Native o Expo.

## 4. Alcance funcional

Valorarte debe permitir:

- Configurar un negocio, su país, moneda, sistema de unidades e idioma.
- Registrar ingredientes y materias primas.
- Registrar compras y gastos directamente atribuibles a las compras.
- Consultar el historial de precios de compra.
- Crear productos fabricados, productos de reventa y servicios.
- Crear variantes de productos con precios e inventario propios cuando corresponda.
- Definir recetas de fabricación escalables o independientes por variante.
- Calcular costos y precios de venta sugeridos.
- Configurar impuestos porcentuales manuales.
- Registrar producciones, cantidades obtenidas y mermas.
- Controlar inventario de ingredientes y productos terminados.
- Registrar ventas rápidas, pagos parciales, pagos divididos y saldos pendientes.
- Permitir un precio real diferente del precio sugerido.
- Mostrar margen bruto y ganancia estimada.
- Registrar devoluciones, anulaciones y ajustes trazables.
- Recomendar promociones sin aplicarlas automáticamente.
- Mostrar alertas de stock bajo y vencimientos cuando se utilicen lotes con vencimiento.
- Exportar e importar respaldos locales.

Consulta `docs/PRODUCT.md` y `docs/ROADMAP.md` para distinguir el alcance del MVP de las funciones futuras.

## 5. Navegación principal

La navegación inferior tendrá exactamente cuatro secciones principales:

1. Inicio.
2. Ingredientes.
3. Productos.
4. Ajustes.

No agregues una quinta pestaña para Ventas, Compras o Producción sin autorización.

Ventas, compras, producción y otros procesos operativos deben ser accesibles mediante acciones contextuales, formularios, flujos modales o rutas secundarias apropiadas.

La navegación debe ser sencilla y consistente.

## 6. Reglas de negocio obligatorias

Las reglas detalladas están en `docs/BUSINESS-RULES.md` y `docs/DATA-MODEL.md`.

Principios que no se pueden incumplir:

- No inventar fórmulas, impuestos, conversiones ni reglas de inventario.
- No confundir margen con recargo.
- No considerar los impuestos recaudados como ingresos del negocio.
- No modificar operaciones históricas confirmadas al cambiar configuraciones actuales.
- No descontar ingredientes directamente al vender productos ya fabricados.
- La producción consume ingredientes y genera productos terminados.
- La venta de productos fabricados descuenta productos terminados.
- La venta de productos de reventa descuenta sus existencias.
- Los servicios no requieren inventario de productos terminados por defecto.
- No permitir stock negativo en las operaciones normales.
- Cada movimiento de inventario debe tener un motivo y una referencia a su operación.
- Los movimientos confirmados deben corregirse mediante operaciones trazables, no borrarse silenciosamente.
- Los costos incompletos deben identificarse como incompletos.
- No presentar una estimación como una ganancia contable definitiva.
- Las promociones son sugerencias; nunca se aplican automáticamente.
- Las unidades incompatibles no se convierten sin una equivalencia válida.
- No contar dos veces los gastos indirectos.

Si dos documentos parecen contradecirse, no elijas arbitrariamente una regla. Señala la contradicción y propone una resolución.

## 7. Arquitectura

Mantén separadas estas responsabilidades:

- Presentación e interacción.
- Navegación.
- Estado de la interfaz.
- Dominio y reglas de negocio.
- Persistencia.
- Internacionalización.
- Tema y sistema de diseño.

Los cálculos de costos, impuestos, precios, conversiones y rentabilidad deben implementarse en módulos de dominio reutilizables y comprobables mediante pruebas unitarias.

No coloques fórmulas económicas dentro de componentes visuales.

No permitas que una pantalla modifique directamente cantidades de inventario sin pasar por el servicio o caso de uso correspondiente.

Consulta `docs/ARCHITECTURE.md`.

## 8. Diseño y experiencia de usuario

Consulta `docs/DESIGN-SYSTEM.md` y utiliza la skill `design-system` cuando implementes o modifiques interfaces.

La experiencia debe ser:

- Profesional y minimalista, pero no genérica.
- Clara, con jerarquía visual consistente.
- Rápida para las operaciones frecuentes.
- Adecuada para negocios pequeños y usuarios no técnicos.
- Accesible en tema claro y oscuro.
- Consistente entre pantallas.
- Cuidadosa con formularios, validaciones, estados vacíos y errores.
- Animada de forma sutil, sin perjudicar el rendimiento.

No agregues elementos visuales decorativos que dificulten completar tareas.

No uses emojis como sustituto de iconografía consistente.

No muestres métricas ficticias como si fueran datos reales. Los datos de demostración deben estar claramente identificados.

## 9. Calidad del código

- Evita `any`; si es imprescindible, justifícalo y limita su alcance.
- Define tipos explícitos para entidades y operaciones de dominio.
- No dupliques fórmulas ni reglas.
- Evita componentes monolíticos.
- Extrae componentes reutilizables cuando exista una necesidad real.
- No crees abstracciones complejas sin un beneficio claro.
- Maneja estados de carga, error, éxito y ausencia de datos.
- Valida los datos en la capa de dominio, no solo en formularios.
- Utiliza transacciones o mecanismos equivalentes cuando una operación modifique varias entidades relacionadas.
- Evita guardar estados derivados que puedan calcularse de forma fiable.
- No registres contraseñas, secretos ni datos sensibles en logs.
- No uses datos personales reales en fixtures o capturas de demostración.

## 10. Persistencia y consistencia

La primera versión será local y no tendrá autenticación ni sincronización en la nube.

Aun así:

- Cada negocio debe tener su propio identificador.
- Los datos de negocio deben estar asociados a ese identificador.
- Las operaciones deben utilizar identificadores estables.
- Debe existir una estrategia de migración del esquema local.
- La importación de un respaldo debe validar su estructura y versión.
- Las operaciones que cambien inventario, costos y pagos relacionados deben mantener consistencia.
- Los respaldos no deben importarse silenciosamente si pueden sobrescribir datos existentes.

No implementes un backend, cuentas de usuario o sincronización hasta que estén aprobados explícitamente.

## 11. Pruebas obligatorias

Añade pruebas para las reglas de negocio relevantes.

Como mínimo, cubre:

- Cálculo de margen y recargo.
- Precios con impuestos porcentuales incluidos.
- Conversión de unidades compatibles.
- Rechazo de conversiones incompatibles sin equivalencia.
- Costo promedio ponderado.
- Producción con merma.
- Consumo de ingredientes y generación de productos terminados.
- Venta con precio personalizado.
- Bloqueo de stock insuficiente.
- Reversos y devoluciones.
- Pagos parciales y saldos pendientes.
- Costos indirectos incompletos.
- Conservación de valores históricos.

No afirmes que una prueba pasó si no la ejecutaste.

## 12. Verificación al terminar

Ejecuta los comandos compatibles con el proyecto para comprobar:

- TypeScript.
- Linter.
- Pruebas.
- Diagnóstico de Expo.

Como referencia, verifica si corresponden:

- `npx tsc --noEmit`
- `npx expo-doctor`
- El comando de pruebas definido en `package.json`.

No inventes comandos ni reportes de resultados.

Al finalizar, resume:

1. Qué se implementó.
2. Qué archivos se modificaron.
3. Qué reglas de negocio se incorporaron.
4. Qué pruebas se ejecutaron y sus resultados.
5. Qué problemas o decisiones quedan pendientes.

## 13. Restricciones de alcance

No implementes por iniciativa propia:

- Facturación electrónica.
- Integraciones bancarias.
- Sincronización en la nube.
- Autenticación real.
- Multiusuario funcional.
- Cumplimiento fiscal automático por país.
- Integraciones con proveedores externos.
- Suscripciones y cobros reales.

Estas funciones pueden prepararse arquitectónicamente cuando corresponda, pero no deben simularse como funcionalidades operativas.

## 14. Criterio de decisión

Si un detalle visual menor no está especificado, resuélvelo siguiendo el sistema de diseño.

Si una decisión puede cambiar costos, impuestos, inventario, rentabilidad, persistencia o integridad de datos, no la inventes: documenta la duda y solicita confirmación.

La prioridad es entregar una aplicación funcional, coherente y verificable, no producir la mayor cantidad de código posible.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
