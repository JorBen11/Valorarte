# Valorarte — Especificación de pantallas y flujos

## 1. Reglas generales de interfaz

- Mantener cuatro pestañas inferiores: Inicio, Ingredientes, Productos y Ajustes.
- Utilizar formularios cortos y progresivos.
- Mostrar los campos específicos solo cuando correspondan al tipo de entidad.
- Mantener las acciones principales visibles y las secundarias en menús contextuales.
- Confirmar acciones destructivas.
- Mostrar errores cerca del campo que los origina.
- Conservar los datos introducidos si una validación falla.
- Mostrar estados vacíos útiles con una acción para comenzar.
- No usar datos ficticios como métricas reales.
- No permitir que las pantallas modifiquen directamente el inventario sin pasar por las operaciones de dominio.

## 2. Inicio

### Objetivo

Mostrar el estado del negocio y facilitar las acciones frecuentes.

### Prioridades

1. Alertas de stock bajo y vencimientos.
2. Rentabilidad.
3. Ventas.

### Contenido recomendado

- Resumen de ventas del periodo seleccionado.
- Margen bruto del periodo.
- Ganancia estimada, indicando si hay costos incompletos.
- Alertas de stock bajo.
- Alertas de lotes próximos a vencer, si el negocio utiliza lotes con vencimiento.
- Productos con baja rentabilidad o cambios relevantes de costos.
- Accesos rápidos para registrar una venta, una compra y una producción.

### Comportamiento

- Permitir cambiar el periodo de consulta.
- Diferenciar venta registrada de dinero cobrado.
- Diferenciar margen bruto de ganancia estimada.
- No mostrar ganancia definitiva si faltan costos necesarios.
- No generar recomendaciones si no existe información suficiente.
- Explicar brevemente por qué se genera una alerta o recomendación.

## 3. Ingredientes

### Lista

Mostrar:

- Nombre.
- Tipo o categoría.
- Cantidad disponible.
- Unidad de inventario.
- Costo promedio por unidad base.
- Indicador de stock bajo.
- Indicador de vencimiento cuando corresponda.

Incluir:

- Búsqueda.
- Filtros por categoría y estado de stock.
- Ordenamiento por nombre, costo o cantidad.
- Acción para registrar una compra.
- Acción para ajustar inventario con motivo.
- Acceso al historial de compras y movimientos.

### Crear y editar ingrediente

Campos sugeridos:

- Nombre obligatorio.
- Categoría opcional.
- Tipo de medida: masa, volumen, longitud, área, unidad u otra dimensión compatible.
- Unidad de inventario.
- Cantidad inicial opcional.
- Umbral de stock bajo.
- Si utiliza lotes y vencimientos.
- Notas opcionales.

El ingreso inicial de existencias debe registrarse como un movimiento de apertura o ajuste, no cambiar silenciosamente el stock.

### Detalle del ingrediente

Mostrar:

- Existencias actuales.
- Unidad base y unidad de visualización.
- Costo promedio ponderado.
- Precio de la última compra.
- Evolución histórica de precios.
- Compras recientes.
- Movimientos de inventario.
- Productos y recetas que utilizan el ingrediente.

El gráfico histórico debe comparar precios normalizados a una unidad compatible.

### Registrar compra

Campos:

- Fecha.
- Proveedor opcional.
- Cantidad comprada.
- Unidad de compra.
- Importe de la línea.
- Descuentos.
- Transporte y otros gastos directamente atribuibles.
- Impuestos de compra, cuando corresponda y se necesite distinguirlos.
- Lote y vencimiento opcionales.
- Notas opcionales.

Mostrar una vista previa del costo normalizado y del efecto sobre el costo promedio.

La compra confirmada debe actualizar el inventario y el costo mediante una operación de dominio transaccional.

## 4. Productos

### Lista

Mostrar:

- Nombre.
- Tipo: fabricado, reventa o servicio.
- Variante o presentación principal cuando corresponda.
- Precio de venta.
- Costo estimado.
- Margen objetivo o margen estimado.
- Estado de stock para productos que lo controlan.
- Alertas relevantes.

Incluir búsqueda, filtros y ordenamiento.

### Crear producto

Campos comunes:

- Nombre.
- Descripción opcional.
- Categoría.
- Tipo operativo.
- Variantes, si las utiliza.
- Precio sugerido y configuración de precios.
- Impuestos porcentuales configurados para el producto.
- Umbral de stock bajo cuando corresponda.

Los campos deben cambiar según el tipo.

### Producto fabricado

Permitir:

- Definir una receta base.
- Añadir ingredientes y cantidades.
- Elegir unidades compatibles.
- Definir rendimiento esperado de la receta.
- Configurar variantes con receta escalada o receta independiente.
- Consultar costo directo estimado.
- Configurar o consultar costos indirectos asignados.
- Consultar precio sugerido y rentabilidad estimada.

### Producto de reventa

Permitir:

- Registrar el producto comprado.
- Consultar costo promedio ponderado de existencias.
- Controlar stock de mercancía.
- Definir precio de venta y margen objetivo.
- Registrar variantes con precios y stock independientes cuando corresponda.

### Servicio

Permitir:

- Definir precio de venta.
- Registrar costos directos.
- Registrar consumo opcional de materiales.
- Configurar costos indirectos compatibles.
- Calcular rentabilidad estimada.

No exigir inventario de productos terminados a los servicios.

### Variantes

Una variante puede representar tamaño, presentación u otra opción comercial.

Cada variante debe poder tener:

- Identificador propio.
- Nombre o atributos.
- Código opcional.
- Precio sugerido.
- Precio de venta predeterminado.
- Impuestos aplicables.
- Inventario propio cuando corresponda.
- Receta escalada o receta independiente para productos fabricados.

No asumir que toda variante es una multiplicación lineal de la receta base.

### Detalle del producto

Mostrar:

- Precio sugerido.
- Precio configurado.
- Costo estimado.
- Margen bruto estimado.
- Ganancia estimada después de indirectos cuando sea calculable.
- Componentes del costo.
- Historial de precios.
- Variantes.
- Recetas.
- Producciones y ventas relacionadas.
- Alertas y recomendaciones de promoción.

## 5. Registrar producción

El flujo debe permitir seleccionar:

- Producto fabricado.
- Variante.
- Receta aplicable.
- Cantidad planificada.
- Cantidad realmente obtenida.
- Cantidad perdida o merma.
- Fecha.
- Lote opcional.
- Vencimiento opcional.
- Notas.

Antes de confirmar, mostrar:

- Ingredientes que se consumirán.
- Cantidades normalizadas.
- Stock disponible.
- Costo calculado de los ingredientes.
- Costo estimado de la producción.

Bloquear la confirmación si no hay ingredientes suficientes.

La confirmación debe consumir ingredientes y generar productos terminados como una única operación consistente.

Una producción confirmada conserva sus datos históricos. Para corregirla, utilizar una operación de reverso o ajuste trazable.

## 6. Registrar venta

El flujo predeterminado es venta rápida.

Permitir:

- Buscar y añadir productos o variantes.
- Cambiar cantidades.
- Modificar el precio por línea.
- Aplicar descuentos.
- Ver impuestos y total final.
- Seleccionar método de pago.
- Registrar pagos divididos o parciales.
- Registrar saldo pendiente.
- Añadir un cliente opcional si esa capacidad está implementada.
- Confirmar la venta.

Antes de confirmar, mostrar:

- Subtotal.
- Descuentos.
- Impuestos configurados.
- Total a cobrar.
- Importe recibido.
- Saldo pendiente.
- Costo estimado de los productos vendidos.
- Margen bruto estimado.
- Ganancia estimada después de indirectos, si se puede calcular.

La venta debe recalcular la rentabilidad con el precio real elegido, no con el precio sugerido.

Al confirmar:

- Descontar productos terminados para productos fabricados.
- Descontar mercancía para productos de reventa.
- Aplicar el consumo de materiales de servicios solo si está definido en su configuración.
- Registrar los cobros y saldos pendientes.
- Guardar los valores históricos de la operación.

## 7. Devoluciones y anulaciones

Permitir localizar la operación original y registrar la corrección.

Una devolución debe distinguir:

- Cantidad devuelta.
- Importe que corresponde reembolsar.
- Estado del producto devuelto.
- Si puede reingresar al stock.
- Ajustes económicos asociados.

No reingresar automáticamente productos dañados o no vendibles.

Una anulación debe revertir los efectos pertinentes sobre inventario, cobros y saldos pendientes, sin borrar la operación original.

Evitar duplicar reversos o reembolsos.

## 8. Ajustes

Agrupar los ajustes en secciones claras:

### Negocio

- Nombre del negocio.
- País.
- Moneda.
- Categoría.
- Preferencias regionales.

### Apariencia

- Tema claro.
- Tema oscuro.
- Seguir sistema.

### Idioma

- Español.
- Inglés.

### Unidades

- Sistema métrico o imperial preferido.
- Preferencias de visualización.
- Unidades permitidas según la dimensión del ingrediente o producto.

### Precios y costos

- Margen objetivo predeterminado.
- Método de distribución de indirectos.
- Parámetros de distribución.
- Preferencias de redondeo y presentación.

### Impuestos

- Crear, editar y desactivar impuestos porcentuales.
- Asignar impuestos a productos.
- Definir si el precio final incluye los impuestos.
- Ver una vista previa del cálculo.

Los cambios en la configuración no deben reescribir operaciones históricas confirmadas.

### Inventario

- Umbrales predeterminados de stock bajo.
- Preferencias de lotes y vencimientos.
- Reglas de alerta.

### Datos y respaldo

- Exportar respaldo.
- Importar respaldo.
- Validar versión y contenido.
- Mostrar confirmación y advertencias antes de sobrescribir datos.

## 9. Estados vacíos y errores

Cada pantalla debe contemplar:

- Sin datos.
- Carga en curso.
- Error recuperable.
- Formulario inválido.
- Operación confirmada.
- Stock insuficiente.
- Datos de costos incompletos.
- Conversión de unidades no disponible.
- Respaldo incompatible o inválido.

Los mensajes deben explicar el problema y ofrecer una acción útil cuando sea posible.
