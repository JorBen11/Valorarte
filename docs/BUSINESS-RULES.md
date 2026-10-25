# Valorarte — Reglas de negocio y cálculos

## 1. Principios generales

- Los cálculos deben implementarse en el dominio, no en componentes visuales.
- Las fórmulas deben tener pruebas unitarias.
- Los importes monetarios requieren precisión y reglas explícitas de redondeo.
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

Las conversiones entre unidades de una misma dimensión pueden ser automáticas cuando la equivalencia sea conocida.

Ejemplos:

- kg ↔ g.
- lb ↔ oz.
- L ↔ ml.
- unidades ↔ unidades.

No convertir masa a volumen sin una densidad válida para el ingrediente.

No asumir que una unidad de producto representa una cantidad física universal.

Los factores de conversión deben ser explícitos y verificables.

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

Las cantidades deben expresarse en una unidad compatible.

El costo total de una compra debe incluir los gastos atribuibles según la política definida, sin duplicarlos.

Una salida normal de inventario no debe modificar arbitrariamente el costo unitario promedio de las existencias restantes.

El sistema debe definir y probar cómo maneja inventario inicial, cantidades nulas, redondeo, devoluciones y correcciones.

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

## 19. Redondeo

Definir una estrategia explícita y centralizada para:

- Cantidades físicas.
- Costos unitarios.
- Importes monetarios.
- Impuestos.
- Totales.

Evitar redondear repetidamente valores intermedios cuando pueda alterar los resultados.

Los cálculos internos deben mantener precisión suficiente; el formato visual puede limitar los decimales sin cambiar el valor almacenado.

## 20. Regla de prioridad

Cuando una fórmula, regla fiscal o comportamiento no esté definido:

- No inventarlo.
- Identificar el caso.
- Evitar resultados engañosos.
- Documentar la decisión pendiente.
- Solicitar confirmación si afecta materialmente a los datos o cálculos.
