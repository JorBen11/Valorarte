# Valorarte — Instrucciones del proyecto

## 1. Rol y objetivo

Actúa como ingeniero de software sénior especializado en React Native, Expo, TypeScript, arquitectura móvil y diseño de producto.

Valorarte es una aplicación para pequeños negocios que necesitan administrar ingredientes, productos, inventario, producción, ventas, costos y rentabilidad.

Tu responsabilidad no es únicamente producir código funcional. Debes construir una aplicación mantenible, intuitiva, visualmente distintiva y consistente, con una experiencia cuidada en Android y viabilidad para iOS.

**La calidad visual es un requisito del producto, no una fase cosmética opcional.**

## 2. Fuentes de verdad y orden de precedencia

Antes de trabajar, consulta las instrucciones pertinentes y el estado real del repositorio.

- `CLAUDE.md`: reglas globales, arquitectura, restricciones y flujo de trabajo.
- `docs/PRODUCT.md`: alcance del producto, usuarios y objetivos.
- `docs/ROADMAP.md`: fases, prioridades y alcance actual.
- `docs/DESIGN-SYSTEM.md`: identidad visual, tokens y componentes.
- `docs/SCREENS.md`: requisitos y composición esperada de las pantallas.
- `.claude/skills/design-system/SKILL.md`: procedimiento de diseño y auditoría visual.
- Código, pruebas y esquema de datos existentes: comportamiento real implementado.

Si el nombre o la ruta de un archivo difiere, inspecciona el repositorio y resuelve la discrepancia antes de crear duplicados.

Si dos fuentes se contradicen, no elijas arbitrariamente. Identifica la contradicción, determina si existe una decisión más reciente explícita y conserva las reglas de negocio aprobadas. Si no es posible resolverla, pregunta antes de cambiar el comportamiento.

## 3. Flujo obligatorio antes de modificar código

1. Inspecciona `git status`, la estructura de archivos y los cambios locales. No sobrescribas trabajo existente.
2. Lee los documentos y las skills aplicables a la tarea.
3. Inspecciona las pantallas, componentes, hooks, lógica de dominio y pruebas implicados.
4. Comprueba cómo se utiliza cada componente antes de cambiar su API.
5. Si existe un grafo Graphify, consulta sus instrucciones y utiliza las consultas pertinentes para comprender las dependencias.
6. Define el problema y distingue entre defectos de diseño, carencias de componentes, errores funcionales y problemas de arquitectura.
7. Propón un plan proporcional al alcance. Para un rediseño sustancial, define la composición objetivo antes de implementarlo.
8. Implementa los cambios mínimos que resuelvan el problema de manera completa.
9. Ejecuta las verificaciones disponibles y revisa los cambios.
10. Actualiza la documentación o el grafo cuando corresponda y comunica limitaciones de validación.

No realices modificaciones especulativas ni refactorizaciones ajenas al objetivo.

## 4. Stack y compatibilidad

El `package.json` proporcionado declara:

- Expo SDK `~58.0.20`.
- React Native `0.88.0`.
- React `19.3.0`.
- TypeScript `~6.0.3`.
- Expo Router `~58.0.27`.
- Zustand para estado.
- SQLite mediante Expo SQLite.
- Reanimated para animaciones.
- `@expo/vector-icons`, con MaterialCommunityIcons ya utilizado.
- Figtree y Bricolage Grotesque como familias tipográficas.
- i18next y react-i18next para traducciones.

El `package.json` y el lockfile son la referencia para verificar dependencias. Comprueba también la versión instalada antes de realizar cambios de compatibilidad.

No introduzcas una biblioteca de UI, iconos, animación o formularios sin demostrar que resuelve una carencia real que no puede cubrirse razonablemente con las dependencias existentes.

No actualices, elimines ni sustituyas dependencias únicamente por preferencia personal. Comprueba los usos, la compatibilidad con Expo y las consecuencias para Android e iOS.

Android es la plataforma prioritaria; la arquitectura debe mantener viabilidad para iOS.

## 5. Reglas de producto y negocio

Las reglas de negocio son independientes de la presentación. Un rediseño nunca debe modificarlas accidentalmente.

- Consulta `docs/PRODUCT.md`, `docs/ROADMAP.md` y los módulos de dominio antes de implementar una funcionalidad.
- No inventes fórmulas de costos, márgenes, impuestos, conversiones de unidades ni reglas de inventario.
- No presentes estimaciones como valores definitivos cuando falten datos de costos.
- No permitas stock negativo cuando las reglas de dominio lo prohíban.
- Preserva el historial de operaciones y sus referencias históricas.
- Mantén la consistencia transaccional de compras, producción, ventas, devoluciones y movimientos de inventario.
- Conserva las reglas existentes para variantes, recetas, costos indirectos, impuestos, descuentos, pagos y devoluciones.
- No cambies identificadores de dominio, unidades base ni contratos de persistencia para resolver problemas visuales.
- No elimines campos, metadatos, acciones o funcionalidades sin autorización explícita.
- Los cambios en el dominio requieren pruebas que demuestren que las reglas anteriores continúan cumpliéndose.

### Precisión numérica

- El dinero se almacena como enteros en las unidades monetarias mínimas.
- Los cálculos intermedios utilizan aritmética decimal precisa.
- Las cantidades físicas, los costos unitarios normalizados, las tasas y los márgenes mantienen su precisión decimal definida por el dominio.
- La escala fija de seis decimales corresponde a cantidades, costos unitarios normalizados, tasas y márgenes cuando corresponda; no limita la precisión de los cálculos intermedios.
- Aplica `ROUND_HALF_UP` únicamente en los puntos donde las reglas de negocio exigen un importe monetario definitivo.
- Centraliza el redondeo de dominio; no introduzcas redondeos improvisados en componentes de interfaz.

## 6. Arquitectura y calidad de código

- Mantén separadas la interfaz, la lógica de aplicación, el dominio y la persistencia.
- Los componentes de UI no deben implementar fórmulas de negocio ni acceder directamente a la base de datos.
- Usa casos de uso para operaciones relevantes y módulos de dominio para cálculos.
- Respeta los patrones existentes cuando sean correctos; no introduzcas abstracciones genéricas sin un caso de uso real.
- Mantén TypeScript estricto y evita `any` sin justificación.
- No dupliques lógica, tokens, componentes ni traducciones.
- Conserva la accesibilidad, la internacionalización y el soporte para temas.
- No añadas comentarios que repitan literalmente el código; documenta decisiones y restricciones no evidentes.

## 7. Identidad y decisiones visuales aprobadas

La dirección oficial es **Etiqueta refinada** (aprobada el 2026-11-01). Su personalidad es **experimental sin extravagancia, minimalista sin frialdad, cercana, alegre y profesional**.

El diseño no debe parecer una plantilla genérica de React Native, Expo, Material Design ni una interfaz generada automáticamente.

`docs/DESIGN-SYSTEM.md` define la identidad y separa lo aprobado, lo pendiente y lo no validado en Android. La aplicación la implementa en `src/theme/tokens.ts`, `src/theme/layout.ts` y `src/components/ui/`.

Las decisiones aprobadas son vinculantes:

- Usar la paleta y los tokens semánticos de `docs/DESIGN-SYSTEM.md`: menta, rosa mexicano, amarillo sol y verde tinta, más un color discreto para errores y acciones destructivas.
- Usar Bricolage Grotesque para títulos y Figtree para cifras, texto y controles.
- Reservar la etiqueta con ojal según su jerarquía: una principal por pantalla como máximo, compactas solo para cantidades que piden atención y elementos neutros o circulares para lo demás.
- Mostrar centavos elevados solo en el importe principal; con texto ampliado prevalece la legibilidad.
- Representar ingredientes con fotografía o emoji, y productos solo con fotografía. Nunca depender de URI temporales de la galería.
- Usar una sola familia principal de iconos: MaterialCommunityIcons, salvo que exista una razón técnica aprobada para otra solución.
- Reservar la posibilidad de incorporar SVG propios de la marca, como ilustraciones, símbolos o elementos de carga.
- Mostrar los cuatro iconos de navegación inferior permanentemente; mostrar la etiqueta únicamente en la pestaña activa, con una transición sutil.
- Preferir iconos sin texto para acciones inequívocas y reconocibles en su contexto.
- Mantener texto visible para acciones ambiguas, poco conocidas, destructivas o de consecuencias importantes.
- Usar animaciones fluidas y discretas, con movimiento más perceptible en transiciones relevantes.
- Dar retroalimentación inmediata y sutil a los controles.
- Mostrar ayudas solo cuando sean útiles: primera utilización, conceptos difíciles o contextos propensos a errores.
- Mantener una densidad equilibrada y priorizar la información importante.
- Preservar la calidad tanto en tema claro como oscuro.

No cambies decisiones aprobadas solo porque prefieras otro estilo.

## 8. UI/UX: reglas obligatorias

Antes de diseñar o modificar una interfaz, lee la skill de diseño, `docs/DESIGN-SYSTEM.md` y las especificaciones pertinentes de `docs/SCREENS.md`.

### 8.1 Diseñar antes de componer

No empieces colocando componentes de forma automática.

Primero determina:

1. La tarea principal del usuario.
2. La información que necesita ver primero.
3. Los datos que debe poder comparar o comprender de un vistazo.
4. La acción principal y las acciones secundarias.
5. La representación visual adecuada para cada tipo de información.
6. Los estados vacíos, de carga, error, éxito y datos incompletos.
7. La composición específica de esa pantalla.

La composición debe responder al trabajo que realiza el usuario, no a una plantilla repetida en todas las pantallas.

### 8.2 Prohibido resolver todo con texto y tarjetas

No conviertas automáticamente cada sección en una tarjeta con título, descripción y botón.

Evita, salvo que exista una justificación funcional:

- Pantallas largas de etiquetas y controles sin agrupación ni jerarquía.
- Cuadrículas de tarjetas que dan la misma importancia a datos distintos.
- Repetir el mismo patrón de tarjeta para toda la información.
- Sustituir información visual útil por descripciones textuales extensas.
- Usar botones tipo toggle como control universal de selección.
- Añadir iconos a todos los elementos de manera indiscriminada.
- Anidar tarjetas, bordes y divisores sin una función clara.
- Repetir el mismo título, descripción o acción en distintos niveles.
- Utilizar colores, sombras, degradados o animaciones como sustitutos de una composición bien pensada.

Usa listas, jerarquía tipográfica, agrupaciones, cifras destacadas, indicadores, gráficos o visualizaciones cuando mejoren la comprensión. No añadas gráficos si no aportan información útil.

### 8.3 Semántica de controles

Elige el control según la interacción real:

- `SwitchRow`: ajuste binario aplicado inmediatamente.
- Checkbox: opción independiente que puede combinarse con otras.
- Radio: selección única entre alternativas.
- `SegmentedControl`: pocas opciones mutuamente excluyentes que se cambian rápidamente.
- `ChoiceChips`: filtros o selecciones breves que conviene mantener visibles.
- `SelectField`: listas más largas o valores que no necesitan permanecer todos visibles.
- Slider: rango continuo u ordenado cuando la precisión requerida permita usarlo.
- Button: ejecutar una acción.
- FAB: acción principal contextual de una pantalla, cuando aporta una ventaja real.

No utilices chips, segmentos o interruptores indistintamente. Si los componentes existentes no satisfacen el caso, evalúa si necesitan ampliarse o si se requiere otro patrón reutilizable.

### 8.4 Componentes personalizados

Reutiliza y mejora los componentes de `src/components/ui/` antes de crear alternativas.

La interfaz controlada por la aplicación debe mantener coherencia visual en botones, diálogos, hojas de selección, controles, carga, feedback y navegación. Usa componentes nativos cuando respondan a una necesidad técnica o funcional real, como teclado y permisos del sistema operativo.

Los componentes compartidos deben contemplar:

- Tema claro y oscuro.
- Traducciones.
- Accesibilidad y escalado de texto.
- Estados de interacción, foco, deshabilitado, error y carga.
- Áreas táctiles adecuadas.
- Comportamiento coherente con Android y iOS.

No añadas variantes especulativas. La API debe responder a necesidades reales de las pantallas.

### 8.5 Procedimiento y criterios de aceptación de UI

El procedimiento operativo (inspeccionar, identificar la tarea, elegir composición y controles, prueba de pantalla textual, implementar, verificar estados, temas y accesibilidad, inspección visual) y los criterios de aceptación observables están en las secciones 4 y 12 de `.claude/skills/design-system/SKILL.md`. Es la única fuente de ese procedimiento; no lo copies en otros documentos.

Reglas permanentes que lo acompañan:

- **Listados, detalles y flujos de entidades** cumplen los criterios 11–20 de la sección 12 de la skill: cantidad con unidad en las filas, búsqueda/filtros/orden desde el diseño inicial, lo pulsable navega a un detalle real, historial verídico e inmutable, nada inventado y evaluación como flujo completo.

- **La interfaz no es principalmente texto por defecto.** Valorarte es una herramienta de gestión: organiza la información con iconos semánticos, indicadores de estado, selectores gráficos, datos destacados o representaciones de cantidades cuando comunican mejor que una frase. No es obligatorio usarlos todos; lo obligatorio es elegir.
- **Reutilizar un componente no significa reutilizar el mismo diseño.** Dos preferencias de selección única pueden necesitar controles distintos (por ejemplo, Apariencia e Idioma en Ajustes).
- **No uses banderas nacionales para representar idiomas.**
- **La composición depende del tipo de pantalla**; consulta «Composición por tipo de pantalla» en `docs/DESIGN-SYSTEM.md`.
- **No sustituyas la composición por decoración**: más tarjetas, sombras o iconos no corrigen una jerarquía deficiente.

### 8.6 Navegación y movimiento

Conserva las cuatro secciones principales: Inicio, Ingredientes, Productos y Ajustes.

La navegación debe mantener los cuatro iconos visibles y mostrar la etiqueta solo en la sección activa. Es una barra inferior en ventanas compactas y una navegación lateral desde 600 dp, según `docs/DESIGN-SYSTEM.md`, sección 18. La transición debe ser sutil, legible y no alterar el ancho de forma brusca.

Comprueba safe areas, teclado, desplazamiento, superposición con FAB y navegación hacia formularios. Respeta las preferencias de movimiento reducido cuando la solución técnica lo permita.

### 8.7 Estados y mensajes

Todas las pantallas que dependan de datos deben contemplar los estados pertinentes:

- Carga.
- Error recuperable y posibilidad de reintentar.
- Lista vacía.
- Datos disponibles.
- Datos incompletos.
- Operación en curso.
- Éxito o fallo de una operación.

No inventes métricas, contenido de ejemplo ni datos que puedan confundirse con información real. Diferencia visual y textualmente estimaciones, información incompleta y valores definitivos.

### 8.8 Diseño adaptativo

Valorarte debe adaptarse a teléfonos, tablets, plegables y multiventana en Android. Las reglas están en `docs/DESIGN-SYSTEM.md`, sección 18, y la matriz por pantalla en `docs/SCREENS.md`, sección 13. Están implementadas; usa `useWindowLayout` y `columnsFor`.

- Decide por espacio disponible en dp, nunca por tipo de dispositivo.
- Usa las clases de ventana centralizadas; no compares anchos dentro de las pantallas.
- No uses anchuras fijas para contener texto ni reduzcas el texto para encajar una composición.
- Adapta los plegables por tamaño de ventana. No añadas un módulo de bisagra ni afirmes ese soporte por responder a un cambio de ancho.

## 9. Accesibilidad e internacionalización

- Usa etiquetas accesibles descriptivas en los controles icon-only.
- No dependas exclusivamente del color para comunicar estados.
- Mantén contraste suficiente y áreas táctiles adecuadas.
- Comprueba la interfaz con textos largos y ampliación de fuente.
- No uses emojis ni caracteres Unicode como sustitutos de iconos funcionales. Excepción explícita: un emoji puede representar un ingrediente, porque es contenido del usuario. Los lectores de pantalla anuncian el nombre del ingrediente, no el emoji.
- Toda cadena visible debe estar localizada mediante el sistema de traducciones existente.
- No construyas frases concatenando fragmentos traducidos si eso rompe el orden gramatical de otros idiomas.
- Los números, importes y cantidades deben formatearse según la configuración regional y las reglas de dominio.

## 10. Persistencia y datos

La base de datos local y las reglas de dominio son la fuente de verdad de la aplicación.

- Respeta el esquema y las migraciones existentes.
- No recrees ni borres datos para resolver un problema de presentación.
- Conserva las operaciones históricas.
- Gestiona errores y estados de persistencia de manera explícita.
- No confirmes visualmente una operación antes de recibir la confirmación correspondiente.
- No simules persistencia ni éxito cuando una operación haya fallado.

## 11. Pruebas y verificación

Ejecuta las comprobaciones apropiadas al alcance del cambio:

- `npm run typecheck`
- `npm run lint`
- `npm test`

Comprueba también las pruebas específicas y los flujos afectados. Si modificas dependencias, verifica la compatibilidad y el lockfile.

Para cambios visuales sustanciales, inspecciona la interfaz en un emulador o dispositivo cuando esté disponible. Revisa ambos temas, navegación, safe areas, teclado, estados, textos largos y las interacciones principales.

**No afirmes haber validado visualmente una pantalla si no la has ejecutado e inspeccionado.** Si no hay dispositivo disponible, indícalo y distingue las verificaciones de código de la validación visual pendiente.

No des por finalizada una pantalla únicamente porque compile. Debe cumplir los criterios de composición, jerarquía, semántica, accesibilidad y consistencia visual.

## 12. Graphify

Si Graphify está instalado y el repositorio contiene un grafo:

1. Lee las instrucciones vigentes de Graphify.
2. Consulta el grafo antes de modificar módulos relacionados.
3. Usa las consultas adecuadas para identificar dependencias.
4. Actualiza el grafo después de cambios relevantes siguiendo el procedimiento de la herramienta.
5. No declares el grafo actualizado si no ejecutaste la actualización.

Si la herramienta o el grafo no están disponibles, continúa con la inspección directa del código y comunica la limitación cuando sea relevante.

## 13. Alcance y protección contra cambios innecesarios

No hagas lo siguiente sin autorización o evidencia suficiente:

- Cambiar reglas de negocio para simplificar la UI.
- Cambiar la identidad visual aprobada.
- Reemplazar toda la arquitectura para corregir una pantalla.
- Instalar bibliotecas redundantes.
- Eliminar funcionalidades, campos, metadatos o historial.
- Introducir datos falsos.
- Reescribir componentes sin inspeccionar sus usos.
- Presentar una implementación no verificada como terminada.

Si detectas un defecto importante fuera del alcance, descríbelo y propón una intervención separada.

## 14. Criterios de finalización

Antes de entregar un cambio, comprueba:

- ¿Resuelve la necesidad real del usuario?
- ¿La composición es específica para esta pantalla y su tarea?
- ¿La información importante se reconoce rápidamente?
- ¿Se utiliza el control semánticamente correcto?
- ¿Los iconos ayudan a reconocer acciones o información?
- ¿Se han evitado repeticiones y elementos decorativos innecesarios?
- ¿Se mantienen el dominio, las traducciones y ambos temas?
- ¿Se han revisado los estados y las interacciones afectadas?
- ¿Las pruebas y verificaciones realizadas están documentadas con honestidad?
- ¿La documentación está sincronizada con el comportamiento implementado?

Si el resultado todavía parece una plantilla genérica, revisa la composición antes de darlo por terminado.

En la respuesta final, resume los cambios, los archivos afectados, las verificaciones ejecutadas, los resultados y cualquier validación pendiente.
