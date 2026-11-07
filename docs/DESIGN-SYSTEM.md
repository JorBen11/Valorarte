# Valorarte — Sistema de diseño

## 1. Propósito

Este documento define la identidad visual, los tokens, los patrones de interacción y los criterios compartidos de interfaz de Valorarte.

No es una plantilla que deba aplicarse mecánicamente a todas las pantallas. Define límites y principios comunes; cada pantalla debe tener una composición adecuada a su tarea.

**Dirección oficial: Etiqueta refinada** (aprobada el 2026-11-01). La sección 17 separa lo aprobado, lo pendiente y lo no validado en Android.

**La aplicación implementa esta identidad** en `src/theme/tokens.ts` y `src/theme/layout.ts`. Lo que depende de funciones aún inexistentes (fotografías y emojis, importes, ventas y productos) está definido aquí, pero no tiene pantalla.

## 2. Identidad visual aprobada

### 2.1 Personalidad

Experimental sin ser extravagante, minimalista sin ser fría, cercana, alegre y profesional. Debe sentirse como un producto comercial cuidado, adecuado para negocios de alimentos, artesanía, fabricación, servicios y reventa.

### 2.2 Principios

1. **Todo lo que se vende termina con un precio colgado.** La etiqueta con ojal es el objeto distintivo de la marca.
2. **La etiqueta significa algo.** Aparece donde hay un precio o un estado que atender; no es el molde de toda la interfaz.
3. **Cifras serias, marca alegre.** Los números son sobrios y legibles; la personalidad vive en la forma, el color y los títulos.
4. **Icono cuando se entiende; texto cuando evita dudas.** Se decide viendo la pantalla completa.
5. **El color ocupa el fondo.** La menta y el verde profundo son parte de la identidad, no un acento sobre gris.

### 2.3 Tokens de color

Implementados en `src/theme/tokens.ts`.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `background` | `#CFEEDD` | `#10261C` | Fondo de pantalla: menta o verde profundo |
| `surface` | `#F4FBF7` | `#1A3328` | Grupos, filas, campos y diálogos |
| `surfaceRaised` | `#E2F5EA` | `#234034` | Representación de imagen y capas por tono |
| `textPrimary` | `#10261C` | `#E7F7EE` | Texto principal e iconos activos |
| `textSecondary` | `#35574A` | `#A9CDBD` | Texto de apoyo |
| `border` | `rgba(16,38,28,0.16)` | `rgba(231,247,238,0.16)` | Divisores |
| `fieldBorder` | `#5C7A6E` | `#7E9F92` | Contorno de controles |
| `primary` | `#B80D66` | `#B80D66` | Relleno: rosa mexicano en acción principal y etiqueta principal |
| `onPrimary` | `#FFFFFF` | `#FFFFFF` | Contenido sobre `primary` |
| `primaryText` | `#A00B58` | `#FF8FC2` | Foco y rosa como texto o línea |
| `attention` | `#FFC531` | `#FFC531` | Amarillo sol: stock bajo y margen bajo objetivo |
| `onAttention` | `#10261C` | `#10261C` | Contenido sobre `attention` |
| `ink` | `#10261C` | `#E7F7EE` | Verde tinta: etiqueta de sin existencias |
| `onInk` | `#F4FBF7` | `#10261C` | Contenido sobre `ink` |
| `error` | `#A32A16` | `#FFA08A` | Errores y acciones destructivas |
| `onError` | `#FFFFFF` | `#10261C` | Contenido sobre `error` |
| `scrim` | `rgba(5,18,13,0.6)` | `rgba(5,18,13,0.6)` | Velo de hojas y diálogos |
| `imageEdge` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Contorno de fotografías |

`accentPremium` (oro) y `brandSubtle` no los usa ninguna pantalla migrada. Se conservan en `tokens.ts` solo mientras haya versiones confirmadas de pantallas anteriores que los referencien, y deben eliminarse cuando se confirme ese trabajo. Los tokens de estado están en la sección 2.5.

### 2.4 Reglas del color de error

- Se reserva a errores de validación y operación, y a acciones destructivas. No decora ni aparece en títulos o gráficos.
- **Sin existencias no es un error:** usa `ink`, no `error`.
- `error` y `primary` tienen luminosidad casi igual (1,13:1 en claro). Se distinguen por tono, pero siempre deben llevar además icono o texto, y no deben depender de estar juntos para entenderse.
- Una acción destructiva lleva relleno `error` solo en el paso de confirmación; antes, contorno o texto.

### 2.5 Tokens semánticos de operación

Aprobados el 2026-11-01, incluido `errorSurface`. Se muestran con `StatusMessage`.

- Los estados de operación y los de inventario se mantienen separados.
- Todo estado se identifica con texto e icono, nunca solo por color.
- **No se usan para colorear cifras positivas o negativas por motivos decorativos.**

| Token | Texto e icono claro | Superficie clara | Texto e icono oscuro | Superficie oscura |
| --- | --- | --- | --- | --- |
| `success` / `successSurface` | `#0E5F3C` | `#D6F1E1` | `#8BE3B4` | `#1E4A36` |
| `warning` / `warningSurface` | `#6F4A00` | `#FFF0C4` | `#FFD166` | `#47391A` |
| `info` / `infoSurface` | `#0B5573` | `#D8EDF5` | `#93D4EE` | `#1B3F4F` |
| `errorSurface` (con `error` aprobado) | `#A32A16` | `#FBE4DE` | `#FFA08A` | `#4A2A22` |

Contraste calculado del primer plano (sobre `background` · `surface` · su superficie propia). Texto e iconos superan 4.5:1, por encima del 3:1 que necesitan los iconos:

| Token | Claro | Oscuro |
| --- | ---: | ---: |
| `success` | 6.22 · 7.35 · 6.44 | 10.44 · 8.88 · 6.58 |
| `warning` | 6.37 · 7.53 · 6.97 | 11.07 · 9.41 · 7.80 |
| `info` | 6.61 · 7.80 · 6.77 | 9.80 · 8.33 · 6.89 |
| `error` | 5.84 · 6.89 · 5.95 | 8.09 · 6.88 · 6.47 |

Las superficies semánticas apenas se separan de `surface` (1.06 a 1.35:1): son apoyo, no el indicador. El estado lo comunican el icono y el texto.

| Token | Uso permitido | No usar para | Relación con la marca |
| --- | --- | --- | --- |
| `success` | Confirmar que una operación se guardó | Margen o ganancia «buenos», ni existencias suficientes | Verde del mismo mundo que la menta, más profundo |
| `warning` | Cautela sin error: costos incompletos, datos estimados, un descuento que baja el margen del objetivo | Stock bajo, que usa `attention` | Familia del amarillo sol, oscurecida para poder leerse |
| `info` | Ayudas de primer uso y datos neutros | Decorar o destacar | Azul frío, la única tonalidad ajena a la marca; uso escaso |
| `error` | Validación, operación fallida y acción destructiva | Sin existencias | Ladrillo, separado por tono del rosa |

**Advertencia, error e inventario:**

| Situación | Tratamiento | Motivo |
| --- | --- | --- |
| Se puede seguir, pero conviene revisar | `warning`, icono y texto | No hay fallo |
| Algo falló o no se guardó | `error`, icono y mensaje con la salida | Requiere corregir o reintentar |
| Acción destructiva | `error`, con texto visible | Consecuencia importante |
| Stock bajo | Etiqueta compacta `attention` | Estado de un dato, no un fallo del sistema |
| Sin existencias | Etiqueta compacta `ink` | Estado de un dato, el más urgente del inventario |
| Sin registrar | Texto auxiliar sin etiqueta | Falta un dato; no se presenta como 0 |
| Existencias suficientes | Cantidad normal, sin color | Sin ruido |

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

Dos familias, ambas disponibles en Google Fonts: **Bricolage Grotesque** para títulos de pantalla y **Figtree** para cifras, texto y controles. Se eligieron midiendo cifras, moneda, porcentajes y cantidades, no solo palabras.

| Estilo | Familia y peso | Tamaño/línea | Uso |
| --- | --- | ---: | --- |
| Título de pantalla | Bricolage 600 | 26/32 | Un título por pantalla |
| Título de sección | Figtree 600 | 17/24 | Secciones y títulos de diálogo |
| Importe principal | Figtree 600 | 36/44 | Una cifra por pantalla; centavos 17 |
| Importe secundario | Figtree 600 | 20/26 | Margen, ganancia y cifras de apoyo |
| Cantidad | Figtree 600 | 16/22 | Existencias y columnas de importes |
| Nombre de elemento | Figtree 600 | 15/22 | Nombre dominante en filas |
| Cuerpo | Figtree 400 | 15/22 | Texto y valores de campos |
| Etiqueta de dato | Figtree 500 | 13/18 | Etiquetas de campo y de dato |
| Auxiliar | Figtree 400 | 13/18 | Ayudas y metadatos |
| Botón | Figtree 700 | 16/22 | Acciones |

Reglas:

- Bagel Fat One queda descartada: resulta demasiado informal para cifras.
- No todo dato importante es un importe principal. Si dos cifras compiten, una baja de nivel.
- Usa cifras tabulares en columnas, listas y valores que cambian.
- Bricolage Grotesque no se usa en cifras.

### Centavos elevados

Solo en el **importe principal**. Listas, tablas e importes secundarios conservan el formato normal alineado.

- Las partes salen del formato regional de la moneda, no de cortar una cadena por el punto: respeta el separador, la posición del símbolo y los decimales de cada moneda. Una moneda sin decimales no muestra fragmento elevado.
- El lector de pantalla recibe el importe completo como una sola etiqueta.
- **Con texto ampliado prevalece la legibilidad:** si el efecto recorta, desalinea o pierde claridad, el importe se muestra en formato normal.
- **El importe principal respeta el escalado del sistema, sin tope.** La composición cede espacio: el importe puede ocupar el ancho completo o pasar a otra línea.

## 5. Geometría, etiqueta, espaciado y áreas táctiles

### Jerarquía de la etiqueta

| Nivel | Forma | Uso |
| --- | --- | --- |
| Principal | Nariz redonda a la izquierda, ojal e hilo opcional. Radios 40/16/16/40 | Ingreso del periodo, precio en detalle y alerta abierta. **Máximo una por pantalla** |
| Compacta | Mini silueta con ojal. Radios 16/7/7/16 | Solo cantidades con stock bajo o agotadas. Una cantidad suficiente es texto normal |
| Eco de forma | Asimetría sin ojal. Radios 28/12/12/28 y 22/10/10/22 | Botón principal y miniatura de producto |
| Neutro | Radios simétricos de 14 a 24 | Filas, grupos, campos, selectores, hojas y diálogos |
| Circular | Círculo de 48 a 56 | Acciones de solo icono y representación de ingrediente |

El ojal es un círculo con el color de la superficie que hay detrás: requiere fondo uniforme y **no se coloca sobre fotografías**. No aparece en controles.

### Radios

- Campos: 14.
- Grupos de filas: 20.
- Diálogos y hojas: 24.
- Cápsulas y círculos: según su función.

La etiqueta se construye con radios por esquina y Views, sin SVG: `MainTag`, `CompactTag`, `EmptyTag` y `EyeletPlaceholder` en `src/components/ui/tag.tsx`.

### Espaciado

`xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 20, `xxl` 24, `xxxl` 32. El espacio expresa agrupación, jerarquía y relación; no se aplica de forma indiscriminada.

### Superficies

Sin sombras decorativas: el color y el tono separan. Solo el FAB lleva sombra. Las filas van en grupos neutros, sin una tarjeta por elemento.

### Áreas táctiles

Mínimo de 48 dp con el token `minTouchTarget`. No se reducen para acomodar iconos.

## 6. Color y contraste

- El texto normal debe alcanzar 4.5:1. El texto grande y los elementos gráficos esenciales, 3:1.
- No uses el color como único indicador de éxito, error, selección o advertencia.
- Comprueba las combinaciones efectivamente usadas; pertenecer a la misma paleta no garantiza contraste.

Contraste calculado (WCAG 2.x), sin comprobación en dispositivo:

| Par | Claro | Oscuro |
| --- | ---: | ---: |
| `textPrimary` / `background` | 12.86 | 14.39 |
| `textSecondary` / `background` | 6.48 | 9.24 |
| `textSecondary` / `surface` | 7.65 | 7.85 |
| `onPrimary` / `primary` | 6.39 | 6.39 |
| `primaryText` / `surface` | 7.45 | 6.43 |
| `onAttention` / `attention` | 10.09 | 10.09 |
| `onInk` / `ink` | 15.19 | 14.39 |
| `error` / `background` | 5.84 | 8.09 |
| `error` / `surface` | 6.89 | 6.88 |
| `onError` / `error` | 7.24 | 8.09 |
| `fieldBorder` / `surface` | 4.48 | 4.69 |

Limitaciones conocidas:

- `attention` sobre la menta da 1.27:1: la etiqueta compacta va sobre `surface` y siempre con icono y texto oscuro.
- El relleno `primary` sobre el fondo oscuro da 2.50:1. El botón se identifica por su etiqueta, con 6.39:1; no uses `primary` para un control sin contenido.

## 7. Iconografía y acciones

La biblioteca es `@expo/vector-icons` con `MaterialCommunityIcons`. No instales otra para resolver preferencias de estilo. Contorno en reposo y relleno en estado activo.

### Icono o texto

La decisión se toma con la pantalla completa delante: contenido cercano, posición del control y contexto de uso. No existe la regla «todo icono» ni «todo texto».

- **Solo icono:** la acción es inequívoca en ese contexto.
- **Icono y texto:** acción principal, primer uso, o icono que no se explica solo.
- **Solo texto:** el icono no comunicaría la acción, o hay consecuencias importantes.

| Pantalla | Acción | Decisión |
| --- | --- | --- |
| Inicio | Vender | Icono y texto |
| Inicio | Compra | Solo icono |
| Inicio | Producción | **Icono y texto.** Fábrica (`factory`) |
| Listas | Filtrar, ordenar, limpiar búsqueda | Solo icono |
| Ingredientes y Productos | Añadir, con lista | Solo icono (+) |
| Estados vacíos | Añadir | Icono y texto |
| Detalle | Volver, editar | Solo icono |
| Formulario | Cerrar, galería, tipo de imagen | Solo icono |
| Formulario | Guardar | Solo texto |
| Alerta | Comprar | Icono y texto |
| Alerta | Ajustar existencias | Solo texto |
| Diálogo | Anular, Conservar | Solo texto |
| Navegación | Pestañas | Icono; texto en la activa |

Todo control de solo icono necesita etiqueta accesible, área táctil de 48 dp o más y estado comunicado. Si un icono es ambiguo en una pantalla nueva, lleva texto.

### Emojis

**Excepción explícita:** un emoji puede representar un ingrediente porque es contenido del usuario. Sigue prohibido como icono de navegación, acción, estado o categoría del sistema, y en productos.

### Marca

Se permiten SVG originales de Valorarte para elementos de marca. Antes de añadir dependencias SVG, inspecciona las existentes; la etiqueta no las necesita. El logotipo y el icono de la app están pendientes.

## 8. Componentes y semántica

Los componentes existentes están en `src/components/ui/`.

### `Button`

Variantes actuales: `primary`, `tonal`, `text`, `destructive` (relleno, para confirmar) y `destructiveText` (sin relleno, para proponer).

- `primary`: acción principal de la sección o flujo.
- `tonal`: acción secundaria que requiere mayor énfasis.
- `text`: acción terciaria o de menor peso.
- `destructive` y `destructiveText`: acción que puede causar pérdida o eliminación. Usan `error`, con texto visible.

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

Cada opción admite un `icon` que se apila sobre la etiqueta. Úsalo cuando ver las opciones ayuda a elegir (Apariencia: Sistema, Claro y Oscuro). La etiqueta del control también admite un `icon` que identifica la categoría. La opción seleccionada usa relleno `textPrimary` con contenido `background`.

### Fila de preferencia con `OptionSheet`

Para una preferencia de selección única que se cambia rara vez: icono de categoría, nombre, valor actual en texto secundario y `chevron-right`. Al pulsarla abre `OptionSheet`, la misma hoja que usa `SelectField`, con la opción actual marcada con fondo `surfaceRaised` y `check`. Ejemplo: Idioma en Ajustes.

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

### `SearchField` y `BottomSheet`

- `SearchField`: búsqueda de listados, con lupa, placeholder traducido como etiqueta accesible y botón para limpiar.
- `BottomSheet`: contenedor de hoja inferior (velo, asa, título). `OptionSheet` lo usa para selección única; las hojas de filtros lo usan con `ChoiceChips`.
- En listados, búsqueda + botones circulares de filtro y orden van en una sola fila; los botones muestran un punto de marca cuando no están en su valor predeterminado.

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

Esta sección describe la barra de la clase Compacto. La navegación en otras clases está en la sección 18.4.

La navegación principal contiene cuatro secciones: Inicio, Ingredientes, Productos y Ajustes.

El componente `FloatingTabBar` debe:

- Mostrar siempre los cuatro iconos.
- Mostrar la etiqueta únicamente en la pestaña activa.
- Marcar la activa con una cápsula `surface`, sin marco alrededor de la barra.
- Animar el cambio de forma sutil y fluida.
- Mantener áreas táctiles accesibles.
- Respetar safe areas y el comportamiento del teclado.
- Evitar que el contenido o un FAB quede tapado.
- Comunicar correctamente la selección a tecnologías de asistencia.

No cambies rutas ni el orden de las secciones como parte de una mejora puramente visual.

Notas de implementación (verificadas en Android con Expo Go, SDK 58, Fabric, sobre la barra anterior):

- Todas las pestañas usan el mismo estilo flex (`flexGrow: 1`, `flexBasis: 'auto'`); la activa es más ancha solo por su etiqueta. Cambiar `flex` entre renders dejaba anchos obsoletos y pestañas invisibles.
- La píldora usa `collapsable={false}`: sin fondo, Fabric la aplana y al activarse perdía el radio.
- No uses animaciones de layout de Reanimated (`layout`, `entering`) en la barra: provocaron que desaparecieran pestañas. La etiqueta aparece con un fundido `withTiming`.

## 11. Sistema de movimiento

Personalidad: física y amable. Las cosas cuelgan y se asientan, sin rebote en los cierres. La animación comunica estado, continuidad o jerarquía.

| Momento | Movimiento | Duración |
| --- | --- | ---: |
| Pulsación | Escala a 0.97 | 120 ms |
| Interruptor y selección | Desplazamiento o cambio de color | 180 ms |
| Etiqueta de pestaña | Fundido | 200 ms |
| Hoja o diálogo al abrir | Desplazamiento y fundido | 250 ms |
| Hoja o diálogo al cerrar | Más breve | 150 ms |
| Etiqueta principal al entrar en Inicio | Balanceo de -4° a 0° desde el hilo, una vez por sesión | 800 ms |

- Curva de superficies: `(0.22, 1, 0.36, 1)`.
- Implementación con Reanimated, animando `transform` y `opacity`. Evita animar propiedades de layout, sobre todo en listas y en Android de gama baja.
- Una sola animación de marca: el balanceo. No animes filas ni repitas el balanceo en cada visita.
- Cargas: etiquetas en contorno, con opacidad pulsante y sin cifras provisionales.
- Movimiento reducido: sin balanceo, con cambios inmediatos o un fundido breve.
- Ningún estado depende solo del movimiento.
- La respuesta háptica no está aprobada: requiere `expo-haptics`, que no está instalado.

No animes todos los elementos al aparecer ni uses movimiento para compensar una jerarquía deficiente.

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
- Etiquetas y descripciones localizadas.
- Formato regional de números, monedas y cantidades.
- Contenido adaptable a textos largos y diferentes idiomas.
- Estados comunicados sin depender únicamente del color.
- Una fila con emoji o fotografía anuncia el nombre del ingrediente o producto. **El emoji se oculta a los lectores de pantalla**; las imágenes de fila son decorativas.

Comprueba que los roles accesibles correspondan al comportamiento real del control.

### Texto ampliado

La información no se recorta para conservar una forma.

- Ningún importe, cantidad o nombre usa altura fija. Las etiquetas crecen con su contenido y el ojal se mantiene centrado.
- En una fila, si nombre y cantidad no caben, la cantidad pasa debajo del nombre.
- Las acciones con texto pueden ocupar dos líneas o apilarse.
- Las representaciones de imagen conservan tamaño fijo, salvo el emoji, que se dibuja sin recortarse dentro de su círculo.
- Los centavos elevados vuelven al formato normal cuando perjudiquen la lectura.
- El importe principal no tiene tope de escalado; la composición se adapta para darle más espacio.
- La etiqueta de la pestaña activa no debe quitar sitio a los demás iconos.

## 14. Validación visual

La validación visual forma parte de la finalización de una tarea de interfaz.

Comprueba:

- Jerarquía y composición.
- Legibilidad y densidad.
- Iconos y controles apropiados.
- Tema claro y oscuro.
- Navegación y safe areas.
- Teclado y formularios.
- Clases de ventana y orientación (sección 18).
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

## 16. Representación de ingredientes y productos

| | Ingrediente | Producto |
| --- | --- | --- |
| Opciones | Fotografía, emoji o ninguna | Fotografía o ninguna. **Nunca emoji** |
| En listas | Círculo de 44 dp | Miniatura de 72 dp, radios 22/10/10/22 |
| En detalle y formulario | Círculo de 88 dp | Fotografía destacada |
| Sin imagen | Círculo `surfaceRaised` con ojal en contorno | Etiqueta en blanco discontinua |

- La imagen ayuda a reconocer; no compite con nombre, cantidad ni estado.
- Las listas siguen siendo eficientes: nada de una tarjeta grande por ingrediente.
- Las fotografías llevan contorno `imageEdge` para integrarse en ambos temas.
- Los estados vacíos usan la etiqueta en blanco, un título breve y una acción con texto, sin párrafos.
- Se puede volver a seleccionar una foto de la galería para otro registro. Cada registro guarda su propia copia.

### Encuadre

- La imagen guardada es **cuadrada (1:1)**: es la que mejor sirve a la vez para el círculo y la miniatura.
- Al elegirla, el usuario la encuadra y ve una vista previa al tamaño real de la miniatura antes de confirmar.
- En el círculo de ingrediente se pierden las esquinas: el motivo debe quedar en el centro.
- La fotografía de producto se mantiene en proporción 1:1, también en detalle.

### Persistencia

La estrategia general está aprobada para una prueba técnica aislada (`docs/ARCHITECTURE.md`, sección 11.1). No se integra en la aplicación hasta nueva autorización.

### Referencia visual

El prototipo temporal «Etiqueta refinada» refleja estas decisiones. Es una referencia y no sustituye a este documento.

## 17. Estado de las decisiones

### Aprobado

- Etiqueta refinada como dirección oficial, con la paleta de menta, rosa mexicano, amarillo sol y verde tinta.
- Bricolage Grotesque y Figtree con la jerarquía de la sección 4.
- Color semántico de error y acciones destructivas (sección 2.4).
- Jerarquía de la etiqueta (sección 5) y reglas de icono o texto (sección 7).
- Producción con icono de fábrica y texto visible.
- Tokens `success`, `warning`, `info`, `error` y `errorSurface`.
- Fotografía de producto en 1:1.
- Importe principal sin tope de escalado.
- Diseño adaptativo para planificar, sin implementar: breakpoints, alto inferior a 480 dp, barra inferior en Compacto, navegación lateral desde 600 dp, lista y detalle desde 840 dp cuando el flujo lo justifique, columnas según ancho y `fontScale`, y plegables por tamaño de ventana.
- Emojis solo como representación de ingredientes, sin anunciarse a lectores de pantalla.
- Ingredientes con fotografía o emoji; productos solo con fotografía.
- Centavos elevados solo en el importe principal, con prioridad de la legibilidad.
- Encuadre pensado para miniaturas.
- Sin URI temporales de galería ni biblioteca de imágenes añadida por comodidad.

### Pendiente de decisión

2. **Estrategia de imágenes:** autorizar su implementación tras la prueba técnica; 1024 px y JPEG al 75 % son hipótesis.
4. **Etiquetas de la navegación lateral:** todas visibles o solo la activa.
5. **Soporte de bisagra:** fuera del alcance actual; se reevaluará si aparece la necesidad.
6. **Fórmula exacta de `fontScale`:** `ancho / fontScale` es la hipótesis inicial.
7. **Umbral de texto ampliado** en que los centavos elevados vuelven al formato normal. El prototipo usa 1,3 y aún aplica un tope ya descartado.

Aplazados: selector de emojis (hasta implementar el formulario de ingredientes), háptica, cámara, y logotipo con icono de la app.

La migración también tendrá que revisar lo que queda fuera de los tokens, como el color `#FAF7F4` de la pantalla de carga en `app.json`.

### No validado en Android

Todo lo anterior se ha visto solo en prototipos HTML renderizados en un navegador de escritorio.

- Carga de las familias y pesos con `@expo-google-fonts`, incluida la variante óptica de Bricolage Grotesque.
- Cifras tabulares con `fontVariant` en esas fuentes. Solo se midieron en navegador.
- Centavos elevados con texto ampliado y distintas monedas y regiones.
- Etiquetas, ojal y radios por esquina en Fabric, y su comportamiento con texto ampliado.
- Barra inferior con la nueva cápsula.
- Balanceo y rendimiento en gama baja.
- Aspecto de los emojis según el fabricante.
- Fotografías en miniatura, encuadre nativo y comportamiento del lector de pantalla.
- Contraste percibido en dispositivo y con mala luz.
- Toda la sección 18: clases de ventana, paneles, navegación lateral y plegables.

## 18. Diseño adaptativo

Decisiones aprobadas e implementadas. La matriz por pantalla está en `docs/SCREENS.md`, sección 13.

**Implementado:** clases de ventana (`src/theme/layout.ts`), navegación inferior y lateral, ancho máximo en `Screen`, lista y detalle simultáneos en Ingredientes, formularios en dos columnas y hojas que pasan a diálogo. El estado de la validación está en la sección 17.

### 18.1 Principio

La composición depende del **espacio disponible en dp, no del tipo de dispositivo**. No existen reglas `isTablet` ni `isFoldable`. El tamaño de la ventana puede cambiar en cualquier momento: al girar, plegar, desplegar o redimensionar en multiventana. Ninguna pantalla puede perder estado de formulario, búsqueda o selección al cambiar de clase.

### 18.2 Clases de ventana

| Clase de ancho | Rango | Composición base |
| --- | --- | --- |
| Compacto | < 600 dp | Una columna, navegación inferior |
| Medio | 600–839 dp | Una columna ancha o dos columnas de contenido, navegación lateral |
| Expandido | 840–1199 dp | Paneles simultáneos, navegación lateral |
| Amplio | ≥ 1200 dp | Como expandido, con ancho de contenido limitado |

Los tres primeros coinciden con las clases de ventana de Android. Android separa además 1200–1599 y ≥ 1600 dp; se agrupan porque ninguna pantalla prevista necesita más composiciones.

| Clase de alto | Rango | Regla |
| --- | --- | --- |
| Baja | < 480 dp | **Puede impedir paneles simultáneos** y obliga a reducir lo que no sea contenido, sea cual sea el ancho. Es el caso de un teléfono en horizontal |
| Normal | ≥ 480 dp | Sin restricción |

### 18.3 Reglas de implementación

- Las clases se calculan en un único módulo, con `useWindowDimensions()`. Las pantallas consumen la clase; no comparan números. Ningún archivo repite los valores.
- **Pantalla decide por ventana; componente, por su contenedor.** Un componente dentro de un panel no consulta la ventana: mide su espacio con `onLayout` o recibe la variante de su pantalla.
- **Texto ampliado:** para decidir columnas y paneles de contenido se usa `ancho / fontScale`. Si el texto crece, se reduce el número de columnas. **Nunca se reduce el texto para hacer caber la composición.** Queda por validar.
- **Ancho de lectura:** los textos no superan unos 70 caracteres; formularios y ajustes, 600 dp; el contenido global en Amplio, 1200 dp, centrado.
- Nada usa anchura fija para contener texto. Tamaños fijos solo para iconos, imágenes y áreas táctiles.
- Todo contenido debe poder desplazarse en cualquier clase, también con teclado abierto.
- Se respetan safe areas en los cuatro lados, también en horizontal, cuando la barra del sistema y los recortes quedan a un lado.
- Un cambio de clase no reinicia la navegación. Un detalle abierto a pantalla completa en Compacto pasa a ser panel al ampliar, y viceversa.

### 18.4 Navegación adaptativa

- **Compacto:** barra inferior.
- **Desde 600 dp:** navegación lateral, también en ventanas de alto bajo.
- Ambas conservan los cuatro destinos y sus etiquetas. La barra inferior muestra el texto solo en la sección activa; si la lateral muestra todas las etiquetas está pendiente (sección 17).
- El FAB se mantiene abajo a la derecha de su panel. En Expandido, cuando hay lista y detalle, pertenece a la lista.
- Rutas y orden de secciones no cambian.

### 18.5 Componentes

| Componente | Comportamiento requerido | Situación en el código |
| --- | --- | --- |
| `Screen` | Ancho máximo y margen por clase. Base de los paneles | Margen fijo de 20, sin máximo. Solo protege el borde superior |
| `FloatingTabBar` | Variante lateral; márgenes de safe area laterales | Solo inferior |
| Nuevo: disposición lista-detalle | Compartida entre Ingredientes y Productos; conserva selección | No existe |
| Listados y filas | Fila con más columnas alineadas cuando hay espacio; cantidad bajo el nombre si no cabe | Límite de cantidad al 45 % del ancho, solo en Ingredientes |
| Tarjeta y etiqueta principal | Ancho según contenedor con máximo; crecen en alto | Por crear |
| Etiqueta compacta | Crece en alto; nunca recorta la cantidad | Por crear |
| Importe y cantidad | Pueden pasar a otra línea. Sin recorte ni abreviación automática | Por crear el componente de importe |
| `TextField`, `SelectField`, `SearchField` | Ancho según contenedor; el formulario limita el ancho | Sin ancho fijo; revisar el alto de campos con texto ampliado |
| `Button` y grupos | Fila cuando caben; pila cuando no. Sin ancho fijo | Revisar los grupos en cada pantalla |
| `ChoiceChips` | Ajuste a varias líneas | Revisar |
| `SegmentedControl` | Pasa a selección en lista si las etiquetas no caben | Recorta a una línea: **riesgo de texto cortado** |
| Encabezados | Título en varias líneas; acciones a la derecha | Revisar |
| `Dialog` | Máximo de ancho; alto limitado con desplazamiento | Máximo de 400 ya presente; revisar alto bajo |
| `BottomSheet`, `OptionSheet` | Hoja en Compacto; diálogo centrado de hasta 480 dp desde Medio; alto limitado | Solo hoja |
| `StateView` | Centrado; ilustración reducible en alto bajo | Texto con máximo de 320 |
| Representación de imagen | Tamaño fijo por contexto, sin deformar | Por crear |

Esta tabla es una lectura estática del código, no el resultado de ejecutarlo.

### 18.6 Plegables

**Lo que resuelve `useWindowDimensions()`:** tamaño disponible al plegar, desplegar, girar o redimensionar, siempre que Android lo comunique a la aplicación. Cubre la composición general de un plegable abierto en plano y de su pantalla exterior.

**Lo que no resuelve:** estado del pliegue, postura ni posición de la bisagra. Un cambio de ancho no demuestra que haya un pliegue, y por eso **no se debe inferir un plegable a partir del ancho**.

| Necesidad | Fuente | Disponibilidad |
| --- | --- | --- |
| Clase de ventana | `useWindowDimensions()` | Ya en React Native |
| Ángulo y estado de la bisagra | `expo-hinge` (`~58.0.2` para SDK 58) | No instalado. Su documentación indica usarlo para interacciones y efectos, **no para layout**, y no expone posición ni tamaño. Su estado no es fiable para esto en Android: nunca es `closed` y es `unknown` si la ventana no cruza el pliegue |
| Posición, orientación, oclusión y separación (`FoldingFeature`) | Jetpack WindowManager | **Sin solución en Expo SDK 58 sin código nativo.** Requiere un módulo local de Expo en Kotlin |
| Alternativa comunitaria | `react-native-fold-detection` | Su documentación no confirma los campos, New Architecture ni Expo; no se recomienda sin auditarla |

Estrategia por fases:

**Decisión aprobada:** los plegables se adaptan inicialmente por tamaño de ventana, sin módulo Kotlin específico para bisagras.

1. **Primera fase, sin dependencias:** clases de ventana, sin lógica específica de plegables. Es la parte necesaria en todos los dispositivos.
2. **Validar en emulador plegable** qué se ve con el dispositivo abierto en plano. Android permite informar de `occlusionType` e `isSeparating`; en un pliegue plano sin oclusión no debería hacer falta evitar la zona, pero debe comprobarse.
3. **Fuera del alcance aprobado. Solo si más adelante se decide soportar posturas semiabiertas o pantallas separadas:** un módulo local que exponga `FoldingFeature`. Con él, ningún control interactivo ni texto cae sobre un pliegue con `isSeparating = true`, y la disposición lista-detalle se alinea a la bisagra. Sin él, **Valorarte no declara soporte de bisagra**, solo adaptación al tamaño de ventana.

### 18.7 Accesibilidad y entorno

Las reglas de las secciones 6 y 13 valen en todas las clases. Además:

- Con teclado abierto en alto bajo, el formulario pasa a una columna y la acción principal sigue accesible.
- Las áreas táctiles siguen en 48 dp en todas las clases.
- Las animaciones de cambio de disposición respetan el movimiento reducido y no animan propiedades de layout en listas.
- La orientación no se bloquea en ninguna clase. `orientation: portrait` se quita de `app.json` durante la implementación responsive, tras verificar `targetSdk` y la configuración Android.

### 18.8 Por decidir y validar

Las decisiones pendientes están en la sección 17, y las pruebas en `docs/SCREENS.md`, sección 13.
