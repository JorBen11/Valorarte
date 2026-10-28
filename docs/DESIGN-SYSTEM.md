# Valorarte — Sistema de diseño

## 1. Propósito

Este documento define la identidad visual, los tokens, los patrones de interacción y los criterios compartidos de interfaz de Valorarte.

No es una plantilla que deba aplicarse mecánicamente a todas las pantallas. Define límites y principios comunes; cada pantalla debe tener una composición adecuada a su tarea.

La personalidad de la marca es **premium, elegante, cálida, clara y práctica**.

El resultado debe sentirse diseñado para administrar un negocio real, no como una colección genérica de componentes.

## 2. Identidad visual aprobada

### 2.1 Tema claro

| Token           | Valor     |
| --------------- | --------- |
| `background`    | `#FAF7F4` |
| `surface`       | `#FFFFFF` |
| `surfaceRaised` | `#F1EBF2` |
| `textPrimary`   | `#252128` |
| `textSecondary` | `#655F68` |
| `border`        | `#E5DDE6` |
| `fieldBorder`   | `#867D8A` |
| `primary`       | `#603B68` |
| `onPrimary`     | `#FFFFFF` |
| `brandSubtle`   | `#EDE3F0` |
| `accentPremium` | `#B18A50` |

### 2.2 Tema oscuro

| Token           | Valor     |
| --------------- | --------- |
| `background`    | `#17141A` |
| `surface`       | `#211D24` |
| `surfaceRaised` | `#2C2530` |
| `textPrimary`   | `#F5F0F6` |
| `textSecondary` | `#C5BBC8` |
| `border`        | `#403743` |
| `fieldBorder`   | `#837887` |
| `primary`       | `#D0A9D8` |
| `onPrimary`     | `#251B28` |
| `brandSubtle`   | `#3A2D3E` |
| `accentPremium` | `#B18A50` |

### 2.3 Colores semánticos

| Token     | Claro     | Oscuro    |
| --------- | --------- | --------- |
| `success` | `#28745A` | `#6EC6A1` |
| `warning` | `#8B5D12` | `#E8B65D` |
| `error`   | `#B42335` | `#FF7D89` |
| `info`    | `#286A77` | `#7BCAD4` |

Los valores de la tabla son la referencia visual aprobada. Comprueba los tokens reales del proyecto antes de modificarlos.

No alteres la paleta por preferencia estética. Si se identifica un problema de contraste o legibilidad, propón la corrección mínima y comprueba el resultado en ambos temas.

El color dorado es un acento decorativo y no debe usarse para texto pequeño ni controles que necesiten un contraste que no alcanza.

## 3. Principios de composición

### 3.1 Jerarquía antes que decoración

Cada pantalla debe dejar claro:

1. Dónde está el usuario.
2. Qué información es más importante.
3. Qué acción puede realizar.
4. Qué información secundaria necesita consultar.

Usa tamaño, peso tipográfico, posición, espacio, contraste e iconografía para establecer jerarquía.

No conviertas todos los elementos en elementos destacados. Si todo compite por atención, nada destaca.

### 3.2 Variedad con coherencia

La coherencia no exige que todas las pantallas tengan el mismo diseño.

- Las listas de inventario deben facilitar exploración y comparación.
- Los formularios deben reducir errores y esfuerzo de entrada.
- Los indicadores financieros deben facilitar lectura y comparación.
- Los flujos de producción deben comunicar cantidades, consumos y consecuencias.
- Los ajustes deben permitir localizar y cambiar preferencias con claridad.

Reutiliza patrones cuando resuelvan problemas equivalentes. No reutilices una composición solo porque ya existe un componente con ese aspecto.

### 3.2.1 Composición por tipo de pantalla

Criterios de partida, no plantillas obligatorias:

| Tipo | Prioridad de la composición |
| --- | --- |
| Inicio | Lo que necesita atención (alertas, stock bajo), ventas y rentabilidad recientes y acciones frecuentes. Cifras destacadas antes que texto. |
| Listados | Reconocer y comparar elementos: identificador visual, nombre dominante, dato principal alineado y estados con icono. Sin una tarjeta por elemento. |
| Formularios | Secciones por propósito (`FormSection`), controles semánticos, opcionales agrupados y acción principal siempre accesible. |
| Ajustes | Controles compactos con el valor actual visible y acceso directo. Selector gráfico cuando conviene comparar las opciones; fila con valor y hoja de selección cuando la preferencia se cambia rara vez. |
| Detalles | Información principal destacada, secundaria agrupada, estados visibles y acciones contextuales. |
| Compras, producción y ventas | Cantidades, importes y decisiones críticas visibles como datos, no dentro de párrafos. |

### 3.3 Superficies y contenedores

Usa fondos, superficies, bordes y elevación con moderación.

- La superficie principal establece el contexto.
- Las superficies elevadas separan contenido cuando existe una razón funcional.
- Los bordes delimitan controles o grupos cuando ayudan a reconocerlos.
- Los divisores separan elementos relacionados en listas.
- Las sombras expresan elevación real, no decoración.

Evita encerrar cada fila, dato o sección en una tarjeta. Una lista bien espaciada puede comunicar mejor que una cuadrícula de tarjetas.

### 3.4 Densidad

La densidad debe corresponder a la tarea.

No reduzcas el tamaño del texto para hacer caber más información. No añadas grandes espacios vacíos para compensar una jerarquía deficiente.

Prioriza que la información clave se pueda reconocer rápidamente y que los detalles estén disponibles sin sobrecargar la vista inicial.

## 4. Tipografía

La familia tipográfica de la aplicación es **Plus Jakarta Sans**.

Escala de referencia:

| Estilo             | Tamaño | Altura de línea |
| ------------------ | -----: | --------------: |
| Título de pantalla |     30 |              36 |
| Título de sección  |     19 |              26 |
| Título de elemento |     16 |              22 |
| Texto principal    |     15 |              22 |
| Etiqueta           |     14 |              20 |
| Nota               |     13 |              18 |

Utiliza los tokens tipográficos existentes en `src/theme/tokens.ts`.

Reglas:

- No introduzcas nuevas familias tipográficas para una sola pantalla.
- No reduzcas arbitrariamente la tipografía para resolver problemas de espacio.
- Utiliza cifras tabulares cuando ayuden a comparar importes o cantidades.
- Reserva la jerarquía más alta para el contenido que realmente la merece.
- Evita repetir el título de una sección en varios niveles sin necesidad.

## 5. Espaciado, radios y áreas táctiles

Escala de espaciado:

- `xs`: 4
- `sm`: 8
- `md`: 12
- `lg`: 16
- `xl`: 20
- `xxl`: 24
- `xxxl`: 32

Radios aprobados:

- Controles: 12.
- Hojas y superficies de diálogo: 20.
- Elementos circulares y cápsulas: según su función.

Área táctil mínima de referencia: 48 dp, utilizando el token existente `minTouchTarget`. No reduzcas áreas táctiles para acomodar iconos.

El espacio debe expresar agrupación, jerarquía y relación entre elementos. Evita aplicar el mismo espaciado indiscriminadamente.

## 6. Color y contraste

- El texto normal debe alcanzar una relación de contraste mínima de 4.5:1.
- El texto grande y los elementos gráficos esenciales deben alcanzar al menos 3:1 cuando corresponda.
- Los bordes de controles interactivos deben distinguirse del fondo.
- `fieldBorder` se utiliza para delimitar campos y controles.
- `border` se reserva para divisores y límites decorativos.
- No uses el color como único indicador de éxito, error, selección o advertencia.
- Verifica los colores reales en ambos temas, especialmente los estados seleccionados, deshabilitados y de error.

Las proporciones de contraste deben comprobarse con las combinaciones efectivamente utilizadas. No asumas que dos colores contrastan lo suficiente porque pertenecen a la misma paleta.

## 7. Iconografía

La biblioteca existente es `@expo/vector-icons`, utilizando `MaterialCommunityIcons`.

No instales una segunda biblioteca de iconos para resolver preferencias de estilo.

### Cuándo usar iconos

Úsalos cuando mejoren el reconocimiento de:

- Navegación.
- Acciones frecuentes y reconocibles.
- Categorías de elementos.
- Existencias y alertas.
- Ventas, compras, producción y gastos.
- Precios, costos, márgenes y rentabilidad.
- Configuración y estados del sistema.

No añadas un icono a cada etiqueta, título o fila automáticamente.

### Acciones icon-only

Son apropiadas si el icono resulta inequívoco en su contexto.

- Proporciona siempre una etiqueta accesible.
- Mantén un área táctil adecuada.
- Utiliza iconos reconocibles y coherentes.
- En acciones ambiguas, destructivas o de consecuencias importantes, conserva texto visible.

### Iconos y marca

No uses emojis ni caracteres Unicode como sustitutos de iconos funcionales.

Se permite incorporar SVG originales de Valorarte para elementos de marca, ilustraciones o animaciones específicas cuando aporten valor. Antes de añadir dependencias SVG, inspecciona las dependencias y la configuración existentes.

## 8. Componentes y semántica

Los componentes existentes están en `src/components/ui/`.

### `Button`

Variantes actuales: `primary`, `tonal`, `text` y `destructive`.

- `primary`: acción principal de la sección o flujo.
- `tonal`: acción secundaria que requiere mayor énfasis.
- `text`: acción terciaria o de menor peso.
- `destructive`: acción que puede causar pérdida o eliminación.

No muestres varias acciones primarias con el mismo peso en un mismo contexto. No uses botones para representar estados seleccionados de manera permanente.

La prop opcional `icon` añade un icono antes del texto, que sigue visible (por ejemplo, `plus` en «Añadir ingrediente»). No crees botones icon-only improvisados de forma inconsistente.

### `ChoiceChips`

Adecuados para filtros y selecciones breves que conviene mantener visibles.

No son un sustituto universal de radios, casillas, selectores o segmentos.

Cada opción admite un `icon` opcional cuando ayuda a reconocerla (tipos de medida, tipos de negocio). Los iconos de tipo de medida están centralizados en `DIMENSION_ICONS` y se reutilizan en la lista de ingredientes.

### `FormSection`

Agrupa campos relacionados bajo un encabezado breve con una línea de separación. Si una sección es enteramente opcional, su título lo indica y los campos no repiten «(opcional)».

### `SegmentedControl`

Adecuado para pocas opciones mutuamente excluyentes que deben cambiarse rápidamente.

No lo uses para listas largas ni para acciones que ejecutan operaciones.

### Selector gráfico (`SegmentedControl` con iconos)

Cada opción admite un `icon` que se apila sobre la etiqueta. Úsalo cuando ver las opciones ayuda a elegir (Apariencia: Sistema, Claro y Oscuro). La etiqueta del control también admite un `icon` que identifica la categoría. La opción seleccionada usa el relleno `primary` con icono y texto `onPrimary`.

### Fila de preferencia con `OptionSheet`

Para una preferencia de selección única que se cambia rara vez: icono de categoría, nombre, valor actual en texto secundario y `chevron-right`. Al pulsarla abre `OptionSheet`, la misma hoja que usa `SelectField`, con la opción actual marcada con fondo `brandSubtle` y `check`. Ejemplo: Idioma en Ajustes.

### `SwitchRow`

Adecuado para preferencias binarias que se aplican inmediatamente.

No lo uses para representar selección entre categorías, modos que requieren confirmación o acciones de ejecución.

### `SelectField`

Adecuado para conjuntos de opciones más extensos o valores que no necesitan estar siempre visibles.

La hoja de selección debe mantener legibilidad, estado seleccionado reconocible, desplazamiento y comportamiento accesible.

Cuando las opciones incluyan información adicional importante, considera una representación más rica que una lista de textos idénticos.

### `TextField`

Debe mantener etiqueta visible, valor, foco, error y ayuda contextual cuando corresponda.

Los mensajes de error deben estar junto al campo afectado. Las unidades deben mostrarse de manera clara y no depender únicamente de abreviaturas poco conocidas.

### `Fab`

Úsalo cuando exista una acción principal contextual, como añadir un ingrediente a la lista.

No lo añadas automáticamente a todas las pantallas. Comprueba que no cubra contenido, acciones o navegación.

### `Dialog`, `StateView` y `Spinner`

- Los diálogos deben priorizar una decisión clara y presentar acciones con jerarquía adecuada.
- Los estados vacíos deben explicar qué falta y, cuando sea útil, cómo continuar.
- Los errores deben permitir recuperarse cuando exista una acción razonable.
- Los indicadores de carga deben comunicar el estado de forma contextual cuando la operación lo requiera.

No uses un estado vacío genérico para sustituir una pantalla funcional que aún no se ha implementado.

## 9. Formularios

Los formularios deben reducir errores y esfuerzo, no limitarse a apilar campos.

- Agrupa los campos según su propósito.
- Ordena las preguntas de lo esencial a lo secundario.
- Muestra ayudas junto al campo que las necesita.
- Explica los conceptos difíciles cuando esa explicación ayude a tomar una decisión.
- No añadas explicaciones redundantes a campos evidentes.
- Mantén las opciones visibles cuando compararlas ayude al usuario.
- Usa selectores para conjuntos extensos.
- Muestra errores junto al campo y conserva los datos introducidos.
- Mantén visible la acción principal sin cubrir el teclado ni el contenido.
- Solicita confirmación al descartar únicamente cuando existan cambios sin guardar.

Los campos opcionales deben identificarse de forma coherente, sin repetir aclaraciones innecesarias en toda la pantalla.

## 10. Navegación inferior

La navegación principal contiene cuatro secciones: Inicio, Ingredientes, Productos y Ajustes.

El componente `FloatingTabBar` debe:

- Mostrar siempre los cuatro iconos.
- Mostrar la etiqueta únicamente en la pestaña activa.
- Animar el cambio de forma sutil y fluida.
- Mantener un fondo sólido, sin glassmorphism.
- Mantener áreas táctiles accesibles.
- Respetar safe areas y el comportamiento del teclado.
- Evitar que el contenido o un FAB quede tapado.
- Comunicar correctamente la selección a tecnologías de asistencia.

No cambies rutas ni el orden de las secciones como parte de una mejora puramente visual.

Notas de implementación (verificadas en Android con Expo Go, SDK 58, Fabric):

- Todas las pestañas usan el mismo estilo flex (`flexGrow: 1`, `flexBasis: 'auto'`); la activa es más ancha solo por su etiqueta. Cambiar `flex` entre renders dejaba anchos obsoletos y pestañas invisibles.
- La píldora usa `collapsable={false}`: sin fondo, Fabric la aplana y al activarse perdía el radio.
- No uses animaciones de layout de Reanimated (`layout`, `entering`) en la barra: provocaron que desaparecieran pestañas. La etiqueta aparece con un fundido `withTiming`.

## 11. Animación y respuesta a la interacción

La animación debe comunicar estado, continuidad o jerarquía.

- Respuesta táctil: inmediata y discreta.
- Cambios de selección: transición breve y clara.
- Transiciones importantes: perceptibles, pero sin retrasar la tarea.
- Cargas: proporcionadas a la operación y sin bloquear innecesariamente la interfaz.
- Errores: visibles y comprensibles.
- Movimiento reducido: respeta la preferencia del sistema cuando la solución lo permita.

No animes todos los elementos al aparecer. No utilices movimiento para compensar una jerarquía visual deficiente.

## 12. Estados visuales

Diseña los estados pertinentes de cada componente y pantalla:

- Normal.
- Seleccionado.
- Presionado.
- Enfocado.
- Deshabilitado.
- Cargando.
- Error.
- Vacío.
- Datos incompletos.
- Éxito.

No todos los componentes necesitan todos los estados. Implementa los que correspondan a su comportamiento real.

Los datos financieros incompletos deben seguir identificándose como estimados o incompletos. El estilo no puede hacer que parezcan definitivos.

## 13. Accesibilidad e internacionalización

- Etiquetas accesibles en todos los controles sin texto visible.
- Contraste suficiente en ambos temas.
- Áreas táctiles adecuadas.
- Compatibilidad con ampliación de texto.
- Etiquetas y descripciones localizadas.
- Formato regional de números y cantidades.
- Contenido adaptable a textos largos y diferentes idiomas.
- Estados comunicados sin depender únicamente del color.

Comprueba que los roles accesibles correspondan al comportamiento real del control.

## 14. Validación visual

La validación visual forma parte de la finalización de una tarea de interfaz.

Comprueba:

- Jerarquía y composición.
- Legibilidad y densidad.
- Iconos y controles apropiados.
- Tema claro y oscuro.
- Navegación y safe areas.
- Teclado y formularios.
- Estados vacíos, carga, error y datos disponibles.
- Textos largos y escalado de fuente.
- Contenido no oculto por elementos flotantes.
- Consistencia con las decisiones aprobadas.

Distingue entre validación estática, pruebas automatizadas y revisión en dispositivo o emulador.

No afirmes haber inspeccionado visualmente una pantalla si no se ejecutó.

## 15. Criterio final

Antes de aceptar una pantalla, pregúntate:

- ¿Se reconoce una identidad de Valorarte más allá del color?
- ¿La composición responde a la tarea concreta?
- ¿La información importante destaca sin competir con todo lo demás?
- ¿Los iconos ayudan a reconocer acciones o información?
- ¿Los controles representan correctamente la interacción?
- ¿Hay tarjetas, textos, bordes o acciones redundantes?
- ¿Se puede comprender la pantalla rápidamente?
- ¿Se mantiene la calidad en ambos temas y con textos largos?
- ¿Se han verificado los estados y las interacciones relevantes?

Si la pantalla parece una plantilla genérica, revisa la composición antes de modificar detalles decorativos.

No cambies las reglas de negocio ni la identidad aprobada para satisfacer estos criterios.
