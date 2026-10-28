# Valorarte — Especificación de pantallas

## 1. Propósito

Este documento define qué debe resolver cada pantalla y qué información debe priorizar.

No prescribe una plantilla visual idéntica para toda la aplicación. Las composiciones deben responder a la tarea, los datos disponibles y las acciones reales.

Todas las pantallas deben respetar `CLAUDE.md` y `docs/DESIGN-SYSTEM.md`.

No inventes métricas, datos de ejemplo que puedan confundirse con datos reales ni funcionalidades que no estén implementadas.

## 2. Navegación principal

La aplicación tiene cuatro secciones:

1. **Inicio:** visión general del negocio y prioridades.
2. **Ingredientes:** materias primas, existencias, compras y movimientos.
3. **Productos:** productos fabricados, productos para reventa y servicios.
4. **Ajustes:** preferencias y configuración del negocio.

La navegación inferior mantiene los cuatro iconos visibles y muestra la etiqueta solo para la sección activa.

Los formularios o flujos secundarios pueden usar una cabecera propia, con título claro, acción de cierre o regreso accesible y comportamiento correcto al descartar cambios.

## 3. Inicio

### Objetivo

Permitir que el usuario entienda rápidamente qué necesita atención y cómo está funcionando el negocio.

### Prioridades de información

1. Alertas que requieren atención.
2. Ventas del periodo seleccionado.
3. Margen bruto y beneficio estimado, diferenciados claramente.
4. Estado del inventario y productos con baja rentabilidad.
5. Acciones frecuentes para continuar el trabajo.

### Contenido previsto

- Resumen de ventas del periodo.
- Margen bruto.
- Beneficio estimado, con indicación de costos incompletos cuando corresponda.
- Alertas de existencias bajas.
- Alertas de vencimiento, cuando se controlen lotes y caducidad.
- Cambios relevantes en costos.
- Productos con rentabilidad reducida.
- Accesos rápidos a venta, compra y producción cuando estén disponibles.

### Criterios de composición

- No des el mismo peso a todas las métricas.
- Prioriza alertas accionables y resultados relevantes.
- Usa cifras destacadas, comparaciones o visualizaciones cuando faciliten comprender los resultados.
- No conviertas automáticamente cada métrica en una tarjeta independiente.
- Evita gráficos decorativos sin información útil.
- Diferencia ventas de dinero cobrado.
- Diferencia margen bruto de beneficio estimado.
- No muestres un beneficio definitivo cuando faltan datos necesarios para calcularlo.
- Explica por qué una cifra es estimada o incompleta.
- Permite identificar el periodo al que corresponden las cifras.

### Estado sin datos

Explica qué información falta y cómo empezar. No muestres cifras ficticias ni un panel de métricas vacío como si el negocio ya tuviera actividad.

## 4. Ingredientes

### Objetivo

Facilitar la consulta y gestión de materias primas, cantidades disponibles, costos y alertas.

### Lista

Debe permitir reconocer rápidamente:

- Nombre.
- Categoría, cuando exista.
- Cantidad y unidad de inventario.
- Indicador de existencias bajas, cuando corresponda.
- Indicador de seguimiento por lotes, cuando corresponda.
- Acciones disponibles según el estado de la implementación.

Debe incluir búsqueda, filtros y ordenación cuando estén implementados en el alcance vigente.

### Criterios de composición

- Prioriza el nombre y la información de inventario.
- Utiliza iconos para alertas o metadatos solo cuando ayuden a reconocerlos.
- No conviertas cada ingrediente en una tarjeta con borde y sombra por defecto.
- Usa una lista legible con separaciones consistentes.
- Mantén visibles las señales importantes sin saturar todas las filas.
- El botón flotante de añadir debe ser accesible y no tapar contenido.
- El contador del título debe representar el número real de elementos.

### Estado vacío

Explica que todavía no hay ingredientes y ofrece una acción para registrar el primero.

### Alta y edición

Campos previstos según las reglas de dominio:

- Nombre.
- Dimensión física.
- Unidad de inventario compatible con esa dimensión.
- Umbral de existencias bajas, opcional.
- Categoría, opcional.
- Seguimiento por lotes, según el alcance.
- Notas, opcionales.

### Criterios de composición del formulario

- Agrupa los campos por propósito.
- Presenta la dimensión como selección única breve si conviene comparar las alternativas.
- Presenta la unidad con un selector apropiado.
- Muestra la unidad junto al umbral de existencias.
- Explica la unidad base o normalización solo cuando sea necesario para comprender el comportamiento.
- No presentes un interruptor para una selección de categorías.
- Mantén la acción principal accesible al desplazarse y con el teclado abierto.
- Muestra errores junto al campo correspondiente.
- Conserva los valores introducidos si la validación falla.
- Confirma el descarte solo si hay cambios sin guardar.

### Detalle del ingrediente

Cuando esté implementado, debe poder mostrar:

- Existencias actuales.
- Unidad de inventario y unidad base.
- Costo promedio ponderado.
- Último precio de compra.
- Historial de compras.
- Movimientos de inventario.
- Historial de costos o su evolución, cuando existan datos.
- Usos en recetas.
- Lotes y vencimientos, si aplica.

No muestres una gráfica vacía o inventada si no hay suficientes datos.

### Compra de ingrediente

El flujo debe contemplar los campos definidos por el dominio, según corresponda:

- Fecha y proveedor.
- Cantidad y unidad.
- Importe de línea.
- Descuentos.
- Transporte y costos directos.
- Impuestos.
- Lote y vencimiento.
- Notas.

Cuando se disponga de los datos, muestra una vista previa del costo normalizado y del impacto sobre el costo promedio.

No cambies las fórmulas de compra o valoración al rediseñar el flujo.

## 5. Productos

### Objetivo

Permitir identificar productos, variantes, precios, costos, rentabilidad y existencias según el tipo de negocio.

### Lista

Prioriza, según el tipo de producto:

- Nombre.
- Tipo y variante, cuando corresponda.
- Precio de venta.
- Costo estimado.
- Margen.
- Existencias, si aplica.
- Indicadores relevantes de rentabilidad o inventario.

### Criterios de composición

- No presentes todos los datos con la misma prominencia.
- Destaca precio, rentabilidad o existencias según la tarea.
- Diferencia productos fabricados, productos de reventa y servicios.
- No muestres existencias para elementos que no manejan inventario.
- No confundas margen con markup.
- No presentes costos incompletos como definitivos.
- Utiliza filtros y búsqueda cuando formen parte del alcance implementado.

### Creación y edición

Los campos dependen del tipo de producto y de las reglas de negocio.

#### Productos fabricados

Considera:

- Nombre y categoría.
- Variantes.
- Receta e ingredientes.
- Cantidades y unidades compatibles.
- Costos de producción.
- Precio sugerido.
- Promociones cuando estén implementadas.

#### Productos para reventa

Considera:

- Datos básicos.
- Variantes.
- Precio de venta.
- Existencias y compras.
- Costo promedio ponderado de productos terminados, conforme al dominio.

#### Servicios

Considera:

- Datos básicos.
- Precio.
- Costos directos.
- Materiales opcionales, cuando corresponda.

No muestres todos los campos de todos los tipos en un formulario universal. Utiliza secciones condicionales coherentes con la selección del tipo.

### Detalle del producto

Cuando esté disponible, muestra información de precios, costos, margen, variantes, inventario, recetas y movimientos según el tipo.

No fuerces una estructura visual idéntica para entidades que tienen comportamientos diferentes.

## 6. Producción

### Objetivo

Registrar la transformación de ingredientes en productos terminados de forma clara y segura.

### Información prevista

- Producto y variante.
- Receta.
- Cantidad planificada.
- Producción real.
- Desperdicio, si aplica.
- Fecha.
- Lote y vencimiento, cuando corresponda.
- Notas.
- Vista previa del consumo de ingredientes, existencias y costo.

### Criterios de composición

- Presenta el producto que se fabricará y la cantidad como información principal.
- Facilita revisar los ingredientes que se consumirán.
- Destaca cantidades insuficientes antes de confirmar.
- No escondas las consecuencias sobre el inventario.
- Muestra costos estimados y su estado de integridad.
- Evita repetir el mismo dato en varias tarjetas.

### Reglas funcionales

- Bloquea la producción cuando las reglas de inventario lo exijan por falta de existencias.
- Consume ingredientes y crea productos terminados de forma transaccional.
- Conserva la trazabilidad e historial de producción.
- Respeta las reglas de valoración y costos existentes.
- No confirmes visualmente una producción antes de recibir el resultado de la operación.

## 7. Ventas

### Objetivo

Permitir registrar una venta con pocos pasos, sin ocultar importes, descuentos, impuestos ni rentabilidad estimada.

### Flujo previsto

- Añadir productos y variantes.
- Introducir cantidades.
- Mostrar precios por línea.
- Permitir modificar el precio real de una línea cuando la regla de negocio lo autorice.
- Aplicar descuentos e impuestos según el dominio.
- Registrar pagos completos, parciales o divididos.
- Registrar cliente opcional cuando esté disponible.
- Mostrar total y rentabilidad estimada.
- Indicar saldo pendiente cuando corresponda.

### Criterios de composición

- Mantén visibles los artículos añadidos y el total.
- Diferencia subtotal, descuento, impuestos, total, pagos y saldo.
- Evita una sucesión de tarjetas que obligue a recorrer toda la pantalla para entender la venta.
- Usa controles adecuados para cantidades y selección de productos.
- Haz que la acción principal sea evidente.
- Presenta advertencias antes de confirmar operaciones con consecuencias importantes.
- No ocultes que el precio de una línea fue modificado.
- No presentes rentabilidad definitiva si faltan datos de costos.

### Reglas funcionales

Respeta las reglas del dominio para descuentos, impuestos, precios, pagos parciales, devoluciones, cancelaciones e inventario. No dupliques esas fórmulas en la interfaz.

## 8. Devoluciones y cancelaciones

- Explica claramente qué operación se va a devolver o cancelar.
- Identifica sus consecuencias sobre el inventario y los importes.
- Usa confirmación para operaciones destructivas o difíciles de revertir.
- Diferencia la devolución de una venta de la cancelación de una operación.
- Conserva el historial y la trazabilidad.
- No presentes una operación como revertida hasta confirmar el resultado.

## 9. Ajustes

### Objetivo

Agrupar las preferencias y la configuración del negocio para que puedan localizarse rápidamente.

### Secciones previstas

- Negocio.
- Apariencia.
- Idioma.
- Sistema de unidades.
- Precios y costos.
- Impuestos.
- Inventario.
- Copias de seguridad.

La presencia y funcionalidad de cada sección dependen del alcance implementado. No muestres opciones ficticias que parezcan operativas.

### Apariencia e idioma

- Apariencia: claro, oscuro y sistema, conforme a las opciones existentes.
- Idioma: idiomas admitidos por la aplicación.
- Los cambios deben reflejarse de forma coherente en toda la interfaz.
- Usa controles de selección semánticamente adecuados.
- No uses interruptores para elegir entre más de dos modos.

Composición implementada:

- **Apariencia:** selector gráfico horizontal de tres opciones con icono y etiqueta (Sistema `theme-light-dark`, Claro `white-balance-sunny`, Oscuro `weather-night`). Las opciones se comparan a la vista. Sistema sigue el tema del dispositivo; Claro y Oscuro lo fijan.
- **Idioma:** fila compacta con icono `translate`, nombre, idioma actual y `chevron-right`. Abre una hoja de selección con Sistema, Español y English. Sin banderas.
- Las dos preferencias se separan con un divisor, no con tarjetas, y no llevan descripciones redundantes.

### Costos e impuestos

Agrupa las preferencias según su propósito y proporciona contexto cuando una opción afecte los cálculos del negocio.

No cambies las reglas de impuestos ni costos para simplificar su presentación.

### Inventario y copias de seguridad

Presenta las acciones relevantes con nombres claros y confirma operaciones que puedan modificar o eliminar información. Nunca simules una copia de seguridad o una restauración exitosa.

## 10. Configuración inicial del negocio

### Objetivo

Recoger la información mínima necesaria para empezar a utilizar la aplicación.

### Campos previstos

- Nombre del negocio.
- País.
- Moneda.
- Sistema de unidades preferido.
- Categoría del negocio.

Respeta las validaciones y opciones definidas por el dominio.

### Criterios de composición

- Explica brevemente por qué se solicita la información.
- Ordena los campos según su importancia y dependencia.
- Agrupa país y moneda solo si la distribución sigue siendo legible en pantallas estrechas.
- Utiliza selección única para categoría y sistema de unidades.
- Evita que todos los controles tengan el mismo énfasis visual.
- Mantén visible la acción para continuar.
- Muestra los errores junto al campo afectado.

## 11. Estados comunes

Cada pantalla debe definir los estados pertinentes:

- Carga inicial.
- Error recuperable.
- Lista vacía.
- Datos disponibles.
- Guardado en curso.
- Error de validación.
- Error de persistencia.
- Datos incompletos.
- Acción completada.

Los estados vacíos deben facilitar el siguiente paso. Los errores deben indicar qué ocurrió y cómo recuperarse cuando sea posible.

No reutilices el mismo mensaje genérico si la causa requiere una explicación distinta.

## 12. Criterios de aceptación visual

Una pantalla se acepta cuando:

- Resuelve claramente su tarea.
- Tiene jerarquía visual propia y coherente con Valorarte.
- Prioriza la información importante.
- Usa los controles correctos para cada interacción.
- No depende de tarjetas y texto repetitivos como única composición.
- No añade iconos o animaciones sin una función.
- Conserva las reglas de negocio.
- Funciona con tema claro y oscuro.
- Respeta traducciones, accesibilidad y textos largos.
- Contempla los estados relevantes.
- Ha sido verificada con las herramientas disponibles y sus limitaciones están documentadas.

La compilación y las pruebas automatizadas no sustituyen una inspección visual real.
