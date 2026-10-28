---
name: design-system
description: Diseña, implementa y audita interfaces de Valorarte. Utiliza esta skill siempre que una tarea afecte pantallas, componentes, formularios, navegación, temas, iconografía o interacción visual.
---

# Skill de diseño de Valorarte

## 1. Objetivo

Crear interfaces de calidad de producto, reconocibles como Valorarte y diseñadas para las tareas reales de pequeños negocios.

Esta skill no consiste en aplicar colores y radios a componentes genéricos. Su objetivo es conseguir una composición visual deliberada, una jerarquía clara, controles correctos y una experiencia consistente.

**No confundas consistencia con uniformidad ni reutilización con repetición visual.**

## 2. Lectura obligatoria

Antes de diseñar o modificar interfaces, consulta:

1. `CLAUDE.md`.
2. `docs/DESIGN-SYSTEM.md`.
3. `docs/SCREENS.md`.
4. La pantalla, componentes y flujos relacionados.
5. Los tokens y el proveedor de tema existentes.
6. Las dependencias e implementaciones de iconos y animaciones.

Si esta skill contradice una decisión aprobada más reciente, identifica la contradicción y resuélvela antes de modificar el comportamiento.

No crees un segundo sistema de diseño ni sustituyas la identidad aprobada por una nueva propuesta sin autorización.

## 3. Dirección de arte obligatoria

Valorarte debe sentirse premium, elegante, cálida, clara y práctica.

No debe parecer una plantilla genérica de React Native, Expo, Material Design ni una interfaz generada automáticamente.

### Evita la composición genérica

No recurras automáticamente a:

- Una pantalla compuesta exclusivamente por título, subtítulo y filas de texto.
- Una cuadrícula de tarjetas para todas las métricas.
- Tarjetas idénticas para información de distinta importancia.
- Formularios largos sin agrupación ni progresión.
- Botones toggle como sustitutos universales de radios, casillas, chips o segmentos.
- Iconos decorativos junto a cada elemento.
- Bordes, sombras y superficies anidadas sin función.
- Textos que repiten lo que ya expresa el título, el control o el estado.
- Gráficos que no ayudan a comprender ni comparar información.
- Colores y animaciones que intentan compensar una jerarquía deficiente.

Estos patrones no están prohibidos de forma absoluta. Deben utilizarse cuando resuelvan un problema concreto, no por costumbre.

### Diseña una composición específica

Antes de escribir JSX, define:

- Qué debe destacar al abrir la pantalla.
- Qué necesita comprender el usuario sin leer demasiado.
- Qué información debe compararse.
- Qué puede quedar en segundo plano.
- Qué acciones son principales, secundarias y contextuales.
- Qué representación visual es más adecuada para cada dato.
- Qué elementos pueden eliminarse sin perder información ni funcionalidad.

Una pantalla de inventario, una de rentabilidad y una de configuración no deberían parecer variaciones de la misma plantilla.

## 4. Procedimiento obligatorio para tareas de UI/UX

Esta sección es la fuente única del procedimiento de diseño. `CLAUDE.md` y la skill `implement-screen` remiten aquí; no la dupliques en otros archivos.

Cada paso produce algo comprobable. Si un paso no produce su resultado, no pases al siguiente.

### Paso 1: inspeccionar

Lee la pantalla actual, sus componentes compartidos y sus consumidores, los datos que muestra, las acciones y los estados que ya existen. Revisa los cambios locales antes de tocar nada.

**Resultado:** una lista de los datos, acciones y estados reales de la pantalla. No modifiques un componente basándote solo en su nombre.

### Paso 2: identificar la tarea y lo que debe destacar

Responde, en una o dos frases cada una:

- ¿Qué viene a hacer el usuario a esta pantalla?
- ¿Qué debe reconocer en menos de dos segundos al abrirla?
- ¿Qué necesita comparar o vigilar?

**Resultado:** las tres respuestas, incluidas en tu plan.

### Paso 3: elegir la composición

Elige según el tipo de pantalla (ver «Composición por tipo de pantalla» en `docs/DESIGN-SYSTEM.md`) y escribe un esquema breve: qué bloques hay, en qué orden y qué recurso visual representa cada dato (cifra destacada, indicador, icono semántico, selector gráfico, barra de progreso, fila con valor o texto).

Si dudas entre dos composiciones realmente distintas, compara sus ventajas. No cuentan como alternativas las variantes que solo cambian colores, sombras o radios.

**Resultado:** el esquema de bloques, antes de escribir JSX.

### Paso 4: elegir cada control por su semántica

Para cada interacción, nombra el control y justifícalo con la tabla de la sección 6. Si el componente existente no encaja, amplíalo, crea una variante semántica o un componente específico; no fuerces el diseño para adaptarlo a un componente inadecuado.

Reutilizar un componente no obliga a reutilizar su composición: dos preferencias distintas pueden necesitar controles distintos aunque ambas sean de selección única.

**Resultado:** una línea por control: «interacción → control → motivo».

### Paso 5: prueba de pantalla textual

Antes de implementar, revisa el esquema con estas preguntas. Cada «sí» exige una corrección o una justificación funcional explícita:

1. ¿Más de la mitad de la superficie visible es texto corrido o son filas con la misma prominencia?
2. ¿Algún estado (seleccionado, alerta, incompleto, error) solo se distingue leyendo una palabra?
3. ¿Hay descripciones que repiten lo que ya dicen el título, el control o el valor?
4. ¿Hay una cantidad, importe o estado importante con el mismo peso visual que un metadato?
5. ¿Hay opciones que el usuario compararía mejor viéndolas (iconos, vistas previas) y que solo aparecen como palabras?
6. ¿Todas las secciones usan la misma combinación de título + texto + control?

Una pantalla puede seguir siendo mayoritariamente textual si su función lo exige (por ejemplo, un texto legal). En ese caso, escribe el motivo.

**Resultado:** las respuestas a las seis preguntas y las correcciones derivadas.

### Paso 6: implementar

- Usa los tokens y componentes existentes; amplíalos cuando haga falta y migra sus usos si cambia la API.
- Mantén la lógica de negocio fuera de los componentes visuales.
- Todo texto visible debe estar localizado.
- No añadas dependencias sin justificar la necesidad y comprobar la compatibilidad.

### Paso 7: verificar estados

Recorre los estados que correspondan a la pantalla: normal, seleccionado, vacío, carga, error, validación, deshabilitado y operación en curso.

### Paso 8: revisar temas, accesibilidad y tamaños

Tema claro y oscuro, contraste, áreas táctiles de al menos 48 dp, etiquetas accesibles en controles icon-only, textos largos en ambos idiomas y pantallas estrechas.

### Paso 9: ejecutar comprobaciones e inspección visual

Ejecuta typecheck, lint y pruebas. Abre la pantalla en un emulador o dispositivo si está disponible y recorre los flujos afectados.

Informa por separado de lo comprobado con herramientas y de lo observado en pantalla. Si no pudiste abrir la aplicación, dilo; no presentes una revisión de código como validación visual.

## 5. Iconografía

Utiliza MaterialCommunityIcons, ya disponible en el proyecto.

### Criterios

- El icono debe mejorar el reconocimiento, la navegación o la comprensión.
- Mantén una familia visual coherente.
- Utiliza nombres de iconos adecuados al significado de la acción.
- Conserva una escala y alineación consistentes.
- Evita añadir un icono a cada texto por defecto.
- No uses emojis como iconos funcionales.
- No uses banderas nacionales para representar idiomas: un idioma no equivale a un país. Usa un icono de idioma o traducción y el nombre del idioma.
- No añadas un icono que repita exactamente lo que ya dice el texto contiguo.
- No uses iconos ambiguos para acciones que requieren explicación.

Los iconos pueden ser el único contenido visible de un botón cuando la acción sea reconocible en su contexto. Es obligatorio proporcionar una etiqueta accesible.

Para acciones desconocidas, destructivas o de consecuencias importantes, conserva texto visible.

Los SVG originales de Valorarte pueden utilizarse para elementos de marca, ilustraciones y animaciones propias si aportan valor. Antes de incorporar una solución técnica, inspecciona las dependencias existentes.

## 6. Semántica de controles

Nunca elijas un control solo por su apariencia.

| Necesidad                                                   | Control adecuado                              |
| ----------------------------------------------------------- | --------------------------------------------- |
| Ejecutar una acción                                         | Button                                        |
| Activar o desactivar inmediatamente una preferencia binaria | Switch                                        |
| Seleccionar varias opciones independientes                  | Checkbox                                      |
| Elegir una alternativa entre pocas opciones excluyentes     | Radio o `SegmentedControl`, según el contexto |
| Filtrar o seleccionar opciones breves y visibles            | `ChoiceChips`                                 |
| Elegir entre muchas opciones                                | `SelectField` u otro selector apropiado       |
| Ajustar un rango continuo                                   | Slider, si ofrece precisión suficiente        |
| Ejecutar la acción principal contextual                     | FAB, cuando sea apropiado                     |

Un interruptor comunica un cambio inmediato de estado. No debe representar la selección de una categoría, un modo que requiere confirmación o la ejecución de una acción.

Los chips y los segmentos no son equivalentes: elige según la cantidad de opciones, el espacio disponible y la frecuencia de interacción.

Si falta un patrón necesario, analiza primero si un componente existente puede ampliarse sin perjudicar los demás usos.

## 7. Componentes compartidos

Antes de crear componentes, inspecciona `src/components/ui/`.

Los componentes deben facilitar coherencia y mantenimiento sin obligar a que todas las pantallas compartan la misma composición.

Comprueba los usos existentes antes de cambiar sus interfaces públicas.

### Botones

- Una acción principal claramente identificable por contexto.
- Jerarquía diferenciada entre acciones principales y secundarias.
- Estado de carga y deshabilitado comprensible.
- Iconos cuando mejoren el reconocimiento.
- Texto visible cuando sea necesario explicar la acción.

### Campos

- Etiquetas visibles y claras.
- Errores junto al campo.
- Ayuda contextual solo cuando sea necesaria.
- Foco reconocible.
- Soporte para unidades y formatos regionales.
- Adaptación a textos largos y ampliación de fuente.

### Selectores

- Estado elegido fácil de reconocer.
- Opciones legibles.
- Descripciones o iconos solo cuando aporten información.
- Desplazamiento y safe areas correctos.
- Comportamiento accesible y cierre coherente.

### Diálogos y hojas

- Jerarquía clara entre título, explicación y acciones.
- Confirmación para operaciones relevantes o destructivas.
- Cierre accesible.
- Comportamiento correcto con el botón atrás y el sistema operativo.
- No uses diálogos para sustituir pantallas completas cuando el flujo necesita espacio y contexto.

### Carga, feedback y estados

- Mensajes contextualizados a la operación.
- Sin falsos mensajes de éxito.
- Errores recuperables cuando sea posible.
- Estados vacíos que orienten al siguiente paso.
- No bloquees toda la interfaz cuando la operación no lo requiera.

## 8. Navegación y animaciones

La barra inferior debe mostrar siempre los cuatro iconos principales y únicamente la etiqueta de la pestaña activa.

Mantén la cápsula de fondo sólido, sin glassmorphism, y una transición discreta.

Comprueba:

- Cambio de pestaña.
- Etiqueta activa.
- Safe areas.
- Teclado.
- Desplazamiento.
- Superposición con FAB.
- Áreas táctiles.
- Semántica accesible.

Usa Reanimated cuando aporte continuidad o feedback útil. No añadas animaciones por defecto a todos los elementos.

Respeta la preferencia de movimiento reducido cuando sea compatible con la implementación.

## 9. Formularios y entradas de datos

Un formulario no debe ser una secuencia indiferenciada de etiquetas y campos.

- Ordena las preguntas según la tarea.
- Agrupa los campos relacionados.
- Distingue datos esenciales de opcionales.
- Mantén las opciones visibles si su comparación es importante.
- Utiliza selectores para listas extensas.
- Evita explicaciones repetitivas.
- Explica conceptos difíciles donde el usuario deba tomar una decisión.
- Mantén la acción principal accesible.
- Evita que el teclado o los elementos flotantes cubran campos o acciones.
- Conserva los datos introducidos ante errores de validación.
- Confirma el descarte solo si hay cambios sin guardar.

No cambies las reglas de validación o dominio para hacer el formulario visualmente más sencillo.

## 10. Presentación de datos

Elige la representación en función de la pregunta que debe responder el usuario.

- Las cantidades requieren unidades claras.
- Los importes deben distinguirse de porcentajes y cantidades físicas.
- Las comparaciones deben permitir reconocer diferencias rápidamente.
- Los estados importantes deben reconocerse sin depender solo del color.
- Las métricas principales deben destacar sobre los metadatos.
- Los gráficos solo deben aparecer cuando los datos disponibles permitan una interpretación útil.
- Los datos incompletos deben identificarse como tales.
- No inventes métricas ni resultados para rellenar espacios.

No muestres el mismo formato para precio de venta, costo, margen, markup y beneficio si eso puede confundirlos.

## 11. Temas, traducciones y accesibilidad

Comprueba ambos temas y usa los tokens del sistema existente.

No introduzcas colores arbitrarios en componentes que puedan usar tokens semánticos.

Revisa:

- Contraste.
- Texto ampliado.
- Textos largos.
- Traducciones.
- Formato regional.
- Áreas táctiles.
- Etiquetas accesibles.
- Roles y estados.
- Navegación con tecnologías de asistencia.
- Mensajes de error y carga.

No uses el color como única señal de selección, error o éxito.

## 12. Criterios de aceptación

Una tarea de UI no está terminada solo porque compila o reutiliza componentes compartidos. Comprueba criterios observables:

1. **Reconocimiento:** al abrir la pantalla, lo que debía destacar (paso 2) es el elemento de mayor peso visual.
2. **Estados visibles:** cada estado seleccionado, de alerta, incompleto o de error se distingue sin leer, mediante superficie, borde, icono o indicador, además del texto.
3. **Semántica:** cada control coincide con su línea «interacción → control → motivo» del paso 4.
4. **Sin texto redundante:** ninguna descripción repite el título, el control o el valor.
5. **Composición específica:** la pantalla no es una variación de la plantilla «título + descripción + filas + botón», salvo justificación escrita.
6. **Iconos con función:** cada icono identifica una categoría, acción o estado; quitarlo empeoraría el reconocimiento.
7. **Temas y accesibilidad:** observado en claro y oscuro; áreas táctiles de al menos 48 dp; etiquetas accesibles.
8. **Idiomas:** sin textos cortados ni claves sin traducir en español e inglés.
9. **Dominio intacto:** no se modificaron reglas de negocio, datos ni persistencia.
10. **Honestidad:** el informe separa las comprobaciones automáticas de la inspección visual y enumera lo que quedó sin verificar.

### Revisión final

Si la interfaz sigue pareciendo genérica, no intentes resolverlo añadiendo sombras, iconos o colores. Vuelve a revisar la composición, la jerarquía y la representación de los datos.

La calidad visual debe surgir de una buena solución al problema del usuario, no de la acumulación de decoración.
