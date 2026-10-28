# Valorarte — Reglas de negocio y cálculos

## 1. Principios generales

- Los cálculos deben implementarse en el dominio, no en componentes visuales.
- Las fórmulas deben tener pruebas unitarias.
- Los importes monetarios requieren precisión y reglas explícitas de redondeo (ver §19).
- Las operaciones confirmadas conservan sus valores históricos.
- Los resultados estimados deben identificarse como tales.
- Nunca inventar datos faltantes.
- No confundir precio, ingreso, costo, margen, recargo y ganancia.
- Los impuestos cobrados por cuenta de una autoridad fiscal no se consideran ingreso del negocio en el cálculo de rentabilidad.

## 2. Tipos de negocio y producto

### Fabricado

Se crea mediante una receta y una operación de producción.

### Reventa

Se adquiere como mercancía y se vende sin fabricación propia.

### Servicio

Puede tener costos directos y consumir materiales, pero no tiene stock de productos terminados por defecto.

El modelo de producto debe soportar campos específicos sin forzar procesos innecesarios.

## 3. Unidades de medida

Cada negocio selecciona un sistema preferido: métrico o imperial.

La unidad de visualización puede cambiar sin alterar las cantidades almacenadas.

Cada ingrediente debe tener una dimensión compatible:

- Masa.
- Volumen.
- Longitud.
- Área.
- Conteo.
- Otras dimensiones solo si se implementan explícitamente.

Esta sección es la fuente de detalle sobre unidades, cantidades normalizadas y conversiones. Decisión aprobada (2026-10-25).

### Unidades base del MVP

| Dimensión | Unidad base |
|---|---|
| Masa | gramo (`g`) |
| Volumen | mililitro (`ml`) |
| Longitud | milímetro (`mm`) |
| Área | centímetro cuadrado (código interno `cm2`; etiqueta de presentación `cm²`) |
| Conteo | unidad (`unit`) |

### Cantidad normalizada

- La cantidad normalizada siempre es la cantidad expresada en la unidad base de su dimensión, sea cual sea la unidad usada en la compra, la receta, la producción o la visualización.
- Cambiar la unidad de visualización no altera la cantidad almacenada ni el historial de movimientos.

### Conversiones

- Las conversiones entre unidades de una misma dimensión pueden ser automáticas cuando la equivalencia sea conocida. Ejemplos: kg ↔ g, lb ↔ oz, L ↔ ml, unidades ↔ unidades.
- Los factores de conversión deben ser explícitos y verificables y conservar precisión suficiente para las operaciones del dominio. No se truncan automáticamente a seis decimales antes de convertir. La escala de almacenamiento de §19.1 no se aplica a los factores de conversión.
- Cada conversión parte de la cantidad original y de un factor definido. No encadenar conversiones sucesivas ni convertir a partir de un valor ya convertido.
- No se convierte entre dimensiones distintas (por ejemplo, de masa a volumen) salvo que existan una densidad conocida y una regla explícita que lo permita. La densidad no forma parte del MVP.

### Unidades integradas

- El MVP admite únicamente las unidades integradas y sus conversiones explícitamente definidas y verificables.
- Las unidades personalizadas y los modelos de presentaciones comerciales (cajas, paquetes o bolsas con contenido variable) quedan fuera del MVP.
- No asumir que una unidad de producto representa una cantidad física universal.

## 4. Compras

Una compra debe registrar:

- Fecha.
- Ingrediente o mercancía.
- Cantidad y unidad.
- Importe de compra.
- Descuentos.
- Gastos directamente atribuibles.
- Proveedor opcional.
- Información de lote y vencimiento cuando corresponda.

### Costo de adquisición

El costo de adquisición debe considerar el importe de compra, los descuentos y los gastos directamente atribuibles que el usuario registre.

Los impuestos recuperables no deben incluirse automáticamente como costo. El MVP no debe asumir reglas contables o fiscales que no se hayan configurado.

Los gastos deben asignarse de forma explícita para evitar duplicaciones.

### Historial de precios

Cada compra conserva el costo y la cantidad originales.

Para comparar precios, normalizar a una unidad compatible.

Mostrar, cuando haya datos:

- Precio de la última compra.
- Costo promedio ponderado.
- Evolución histórica de precios.

Estos indicadores no son intercambiables.

## 5. Costo promedio ponderado de inventario

El costo promedio ponderado se calcula a partir del valor y la cantidad de las existencias disponibles antes y después de una entrada válida.

Fórmula conceptual:

Costo promedio nuevo =
(valor de existencias anteriores + costo atribuible de la entrada)
/
(cantidad anterior + cantidad incorporada)

Las cantidades se expresan como cantidades normalizadas en la unidad base de su dimensión (§3).

El costo total de una compra debe incluir los gastos atribuibles según la política definida, sin duplicarlos.

Una salida normal de inventario no debe modificar arbitrariamente el costo unitario promedio de las existencias restantes.

### Fuentes de verdad de la valoración

Decisión aprobada (2026-10-25).

- La cantidad acumulada y el valor acumulado del inventario de cada artículo son las fuentes de verdad para derivar el costo promedio ponderado.
- El costo unitario promedio se calcula a partir del valor acumulado y de la cantidad acumulada correspondientes.
- Un costo unitario almacenado con seis decimales, o un snapshot histórico, no sustituye automáticamente al valor acumulado ni sirve como fuente de verdad para cálculos posteriores.
- La representación de los importes, la precisión de los cálculos y los puntos de redondeo siguen §19.

### Pendiente de definir

El sistema debe definir y probar cómo maneja estos casos. No están decididos:

- Valoración del inventario inicial.
- Valoración de las devoluciones que reingresan al inventario.
- Valoración de los ajustes positivos y negativos.
- Anulación de compras, incluida la de compras cuyo stock ya se consumió.
- Tratamiento económico de la merma (ver también §6).
- Destino de los residuos de redondeo entre el valor acumulado y los importes cuantizados. Se resolverá al implementar cada operación (§19.3).
- Costo promedio cuando la cantidad acumulada es cero.

## 6. Recetas y producción

Una receta define cantidades de ingredientes necesarias para obtener un rendimiento esperado.

Debe soportar:

- Receta base escalable.
- Receta independiente por variante.
- Unidades compatibles.
- Rendimiento esperado.
- Consumos reales.
- Mermas.

No asumir que todas las variantes escalan linealmente.

### Producción

Antes de confirmar una producción:

1. Validar receta.
2. Calcular ingredientes requeridos.
3. Validar existencias suficientes.
4. Calcular costo de los ingredientes consumidos.
5. Registrar cantidades planificadas y obtenidas.
6. Registrar merma.
7. Actualizar inventario de ingredientes.
8. Aumentar inventario de productos terminados.

Los pasos deben formar una única operación consistente.

### Costo de producción

El costo directo de producción se obtiene de los ingredientes realmente consumidos y otros costos directos que se registren explícitamente.

Los costos indirectos se incorporan mediante el método de distribución configurado cuando exista una base válida.

La producción debe conservar un snapshot del costo calculado al confirmarse.

Cambiar posteriormente el precio de un ingrediente o la receta no debe modificar esa producción histórica.

### Merma

La merma debe registrarse de forma explícita.

No asumir que toda diferencia entre cantidad planificada y obtenida tiene el mismo tratamiento económico.

El costo de los materiales consumidos debe quedar reflejado en el costo de la producción obtenida y en las pérdidas registradas de forma coherente.

## 7. Productos terminados

Las existencias de productos terminados utilizan costo promedio ponderado.

Cuando una producción genera unidades con un costo unitario distinto al existente, recalcular el costo promedio de las existencias resultantes.

El costo histórico de cada producción se conserva.

La valoración promedio utilizada para una venta debe guardarse como snapshot de esa venta.

El costo actual de fabricar un producto y el costo de una unidad que ya estaba fabricada pueden ser distintos.

## 8. Precios: margen y recargo

El usuario configura un margen objetivo predeterminado, con posibilidad de ajustar los valores según las capacidades del producto.

### Margen

Margen = (ingreso sin impuestos - costo) / ingreso sin impuestos

### Recargo o markup

Recargo = (ingreso sin impuestos - costo) / costo

No utilizar estas fórmulas como sinónimos.

Cuando el costo y el margen objetivo sean válidos y el precio no tenga otros componentes dependientes de él:

Ingreso objetivo sin impuestos = costo / (1 - margen objetivo)

El margen objetivo debe ser mayor o igual a 0 y menor que 1.

Si el costo es cero, negativo o incompleto, no aplicar la fórmula sin validación. Explicar el problema.

Si el precio final incluye impuestos, calcular el importe antes de impuestos según las reglas fiscales porcentuales configuradas.

La fórmula debe tener en cuenta los impuestos configurados que se apliquen al producto. No asumir que todas las tasas se pueden sumar sin considerar el método elegido.

Si no se pueden calcular correctamente los impuestos configurados, no mostrar un precio final supuestamente exacto.

### Precio sugerido y precio real

El precio sugerido es una recomendación, no una restricción.

El usuario puede introducir un precio diferente en cada línea de venta.

La rentabilidad de la venta debe calcularse usando el precio real confirmado.

## 9. Impuestos del MVP

El MVP soporta impuestos porcentuales configurados manualmente.

La configuración debe permitir al menos:

- Nombre.
- Tasa porcentual.
- Estado activo o inactivo.
- Asignación a productos.
- Configuración para determinar si el precio final incluye impuestos, según la regla elegida para el negocio.
- Regla simple de cálculo y orden cuando se admitan varios impuestos.

El modelo debe ser extensible, pero no debe simular capacidades fiscales que todavía no se hayan implementado.

El MVP no garantiza cumplimiento tributario de ningún país.

Las tasas y asignaciones vigentes al confirmar una venta deben guardarse como snapshot.

Modificar una tasa no debe recalcular ventas históricas.

Los impuestos cobrados no forman parte del ingreso neto utilizado para calcular el margen.

## 10. Costos indirectos

El MVP soporta tres métodos:

1. Distribución por unidades producidas.
2. Distribución proporcional al costo directo.
3. Asignación manual por producto.

El usuario configura los parámetros del método utilizado.

No contar un mismo gasto dos veces.

Los gastos mensuales pueden registrarse, pero no deben sumarse automáticamente a los costos por producto si ya fueron incorporados mediante otro método.

Si no existe una base válida de distribución:

- Marcar el costo indirecto como incompleto.
- Mostrar el costo directo conocido.
- Mostrar margen bruto cuando pueda calcularse.
- Mostrar una estimación parcial cuando sea útil.
- No presentar una ganancia definitiva.

Los costos indirectos asignados deben distinguirse de los costos directos.

## 11. Rentabilidad

### Ingreso de la venta

Separa:

- Precio de los productos.
- Descuentos.
- Impuestos.
- Total final cobrado o pendiente de cobro.

### Margen bruto estimado

Ingreso sin impuestos, después de los descuentos aplicables, menos el costo directo de los productos vendidos.

Margen bruto porcentual =
ganancia bruta / ingreso sin impuestos

Si el ingreso sin impuestos es cero, no calcular el porcentaje por división entre cero. Mostrar un estado apropiado.

### Ganancia estimada después de indirectos

Ganancia estimada =
ingreso sin impuestos

- costo directo
- costos indirectos asignados
- otros costos contemplados en la estimación

Si faltan datos relevantes, indicar que la estimación es parcial.

No llamarla beneficio neto contable ni resultado definitivo.

Las comisiones, gastos financieros y otros conceptos solo deben incluirse si están soportados y configurados.

## 12. Ventas y stock

### Productos fabricados

La venta reduce el inventario de productos terminados.

No consume ingredientes directamente en la venta normal.

### Productos de reventa

La venta reduce las existencias de mercancía.

### Servicios

No descuentan productos terminados. Los materiales se consumen solo si el servicio tiene esa configuración y existe una regla de consumo implementada.

### Stock insuficiente

Bloquear la operación normal cuando no exista stock suficiente.

Mostrar la cantidad disponible y la cantidad faltante.

No permitir stock negativo como consecuencia de una venta confirmada normal.

## 13. Pagos

Separar:

- Total de la venta.
- Pagos recibidos.
- Saldo pendiente.

Una venta puede tener varios pagos y varios métodos de pago.

El saldo pendiente no debe considerarse dinero cobrado.

Las anulaciones y devoluciones deben actualizar los saldos de manera trazable y evitar duplicaciones.

## 14. Devoluciones y anulaciones

No borrar una venta confirmada para corregirla.

Registrar una operación correctiva vinculada a la original.

Una devolución puede:

- Reembolsar dinero.
- Reducir una cuenta por cobrar.
- Reingresar productos al inventario si están en condiciones de venta.
- Ajustar el resultado económico.

No todos los productos devueltos deben volver al stock.

Una anulación debe impedir efectos duplicados si se intenta repetir.

Las correcciones deben conservar la historia original.

## 15. Promociones

Las recomendaciones deben combinar:

- Rentabilidad.
- Stock disponible.
- Evolución de ventas.
- Vencimientos cuando se utilicen lotes con vencimiento.

Cada sugerencia debe explicar:

- Motivo.
- Precio o descuento propuesto.
- Margen estimado resultante.
- Limitaciones o datos incompletos.

Las promociones nunca se aplican automáticamente.

Si un descuento reduce el margen por debajo del objetivo configurado, mostrar una advertencia.

No recomendar promociones cuando los datos sean insuficientes para estimar su impacto de forma razonable.

## 16. Alertas

El MVP debe soportar:

- Stock bajo.
- Vencimiento próximo cuando se registren lotes con vencimiento.
- Costos de compra que hayan variado de forma relevante cuando exista historial suficiente.
- Rentabilidad insuficiente cuando los datos sean adecuados.

Los umbrales deben ser configurables.

Evitar alertas duplicadas y mensajes que no indiquen una acción útil.

## 17. Datos incompletos

Cada cálculo debe poder indicar si es:

- Completo según los datos configurados.
- Parcial.
- No calculable.

No reemplazar valores desconocidos por cero sin indicarlo.

No ocultar errores de conversión, costos faltantes o tasas no configuradas.

## 18. Historial

Las operaciones confirmadas deben conservar snapshots de:

- Precios.
- Cantidades y unidades.
- Costos utilizados.
- Impuestos aplicados.
- Descuentos.
- Pagos.
- Resultados calculados relevantes.

Las modificaciones de configuración futura no deben alterar el significado de una operación histórica.

## 19. Representación monetaria y redondeo

Decisiones aprobadas: representación monetaria (2026-10-25) y escala decimal fija (2026-10-25).

Se distinguen tres niveles: cómo se almacena un valor, con qué precisión se calcula y cuándo se redondea.

### 19.1 Escala de almacenamiento

| Tipo de valor | Representación almacenada |
|---|---|
| Importe monetario definitivo (totales, subtotales, descuentos, impuestos, pagos, reembolsos) | Entero en la unidad mínima de la moneda correspondiente (por ejemplo, centavos para USD) |
| Costo unitario normalizado (por ejemplo, costo por gramo o por mililitro) | Decimal con escala fija de 6 posiciones |
| Cantidad física (ingredientes, inventario, rendimiento, merma) | Decimal con escala fija de 6 posiciones |
| Tasa de impuesto y margen | Decimal con escala fija de 6 posiciones |
| Valor de un movimiento de inventario (`totalValueDelta`) | Entero con 10^6 unidades internas por unidad mínima de la moneda (`DATA-MODEL.md` §16). No es un importe definitivo |

- No asumir que todas las monedas tienen dos decimales: la unidad mínima depende de la moneda.
- Un costo unitario normalizado no es un importe monetario definitivo y puede ser inferior a la unidad mínima de la moneda.
- No asumir que las cantidades usan dos decimales ni redondearlas con las reglas monetarias.

### 19.2 Precisión de los cálculos intermedios

- Los cálculos intermedios utilizan aritmética decimal precisa. No usar aritmética binaria de punto flotante.
- Un resultado intermedio no se limita a la escala de almacenamiento mientras forme parte de un cálculo en curso.
- No redondear cada operación intermedia.

### 19.3 Puntos de redondeo

- Se aplica redondeo comercial `ROUND_HALF_UP` únicamente cuando una regla de negocio determina que un resultado debe cuantizarse a su escala de almacenamiento o convertirse en un importe monetario definitivo.
- El redondeo de importes monetarios definitivos se aplica únicamente en los puntos de negocio definidos para cada operación, nunca de forma general.
- Los residuos de redondeo entre el valor acumulado del inventario y los importes definitivos se resolverán al implementar las operaciones correspondientes. No existe todavía una regla de distribución y no debe inventarse.
- La lógica de redondeo debe estar centralizada en el dominio.
- El formato visual puede limitar los decimales mostrados sin cambiar el valor almacenado ni el calculado.

### 19.4 Pendiente de definir

Estas decisiones no determinan todavía:

- Qué puntos concretos de cada flujo cuantizan o producen un importe definitivo (por ejemplo, si los impuestos se redondean por línea o sobre el total de la venta).
- La fuente de la unidad mínima de cada moneda.
- Si el costo unitario normalizado se expresa en la unidad principal de la moneda (USD por gramo) o en su unidad mínima (centavos por gramo). Con 6 decimales en la unidad principal, el valor más pequeño representable es 0,000001 USD por unidad base.
- Si las tasas se expresan como fracción (`0.190000`) o como porcentaje (`19.000000`).
- La precisión máxima de los cálculos intermedios para divisiones que no terminan (por ejemplo, 1/3 al escalar una receta o al calcular un promedio).


#### Riesgos identificados con la escala de 6 decimales

No modifican la decisión; requieren confirmación antes de implementar las operaciones afectadas.

1. ~~Factores de conversión cuantizados.~~ Resuelto: los factores no se truncan a seis decimales (§3).
2. ~~Cantidades almacenadas en unidades distintas de la base.~~ Resuelto: la cantidad normalizada siempre está en la unidad base y las conversiones parten de la cantidad original (§3). Una conversión a una unidad mayor solo para visualización puede seguir mostrando decimales redondeados, sin afectar a lo almacenado.
3. **Costos unitarios muy pequeños.** Un insumo barato medido por unidad base (por ejemplo, agua por mililitro) puede tener un costo cercano a 0,000001 en la unidad principal de la moneda. En ese rango, almacenar el costo unitario con 6 decimales produce errores relativos grandes o un costo igual a cero. Con el valor acumulado como fuente de verdad (§5), esto afecta a los snapshots y a la visualización, no a la valoración. La unidad en que se expresa el costo unitario sigue pendiente.
4. ~~Deriva del costo promedio ponderado.~~ Resuelto en cuanto a la fuente de verdad: valor y cantidad acumulados (§5). Sigue pendiente el destino de los residuos de redondeo.
5. **Factor de escalado de recetas.** La decisión no menciona el factor de escalado de las recetas base (`base_scaled`). Si se cuantiza a 6 decimales (1/3 → `0.333333`), el consumo escalado deja de ser exacto.
6. **Rango numérico.** Esto depende de la implementación. Si un valor con escala 6 se almacena como entero escalado y se lee como número de JavaScript, el máximo exacto es unos 9 × 10⁹ unidades. Afecta a cantidades muy grandes en unidades base pequeñas y a valores en monedas de valor nominal alto.

No implementar estos puntos sin confirmación (ver §20).

## 20. Regla de prioridad

Cuando una fórmula, regla fiscal o comportamiento no esté definido:

- No inventarlo.
- Identificar el caso.
- Evitar resultados engañosos.
- Documentar la decisión pendiente.
- Solicitar confirmación si afecta materialmente a los datos o cálculos.
