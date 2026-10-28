# Valorarte — Modelo de datos

## 1. Objetivo

Definir un modelo coherente para compras, ingredientes, recetas, productos, producción, inventario, ventas, impuestos y rentabilidad.

El modelo es conceptual. Los nombres exactos de tablas y columnas pueden adaptarse a la base de datos elegida, siempre que se conserven las reglas y relaciones.

## 2. Convenciones

- Todas las entidades persistentes deben tener identificadores estables.
- Las entidades pertenecientes a un negocio deben relacionarse con `businessId`.
- Usar fechas con una representación consistente y documentada.
- Almacenar los importes monetarios como enteros en la unidad mínima de la moneda configurada (`BUSINESS-RULES.md` §19). Todo campo de importe (`subtotal`, `discountTotal`, `taxTotal`, `grandTotal`, `amount`, `refundAmount`, etc.) sigue esta representación.
- Excepción: `InventoryMovement.totalValueDelta` es un valor interno de valoración, no un importe definitivo, y usa la escala de §16.
- Todo importe debe poder interpretarse junto a su moneda: el `currencyCode` de la operación o, cuando la entidad no lo tenga, el del negocio.
- Almacenar con escala decimal fija de 6 posiciones (`BUSINESS-RULES.md` §19.1), independiente de la precisión monetaria:
  - Cantidades físicas: `quantity`, `normalizedQuantity`, `quantityDelta`, `normalizedQuantityDelta`, `expectedYield`, `plannedQuantity`, `actualQuantity`, `wasteQuantity`, `restockQuantity` y umbrales de stock.
  - Costos unitarios normalizados: `unitCostNormalized`, `unitCostSnapshot`, `directUnitCostSnapshot`.
  - Tasas y márgenes: `rate`, `defaultTargetMargin`, `targetMargin`, `estimatedMargin`.
- Los campos `normalizedQuantity` y `normalizedQuantityDelta` se expresan siempre en la unidad base de su dimensión (`BUSINESS-RULES.md` §3).
- Los factores de conversión (`baseConversionFactor`) no siguen la escala de 6 decimales (§5 de este documento).
- La unidad (principal o mínima) en que se expresan los costos unitarios, el formato de las tasas y la representación física de los decimales de escala 6 están pendientes de definir (`BUSINESS-RULES.md` §19.4).
- No depender del formato visual de cantidades o monedas para almacenarlas.
- No borrar operaciones históricas confirmadas.
- Usar estados explícitos cuando una operación pueda estar pendiente, confirmada, anulada o revertida.
- Las relaciones deben validarse en la capa de dominio y en la persistencia cuando sea posible.

## 3. Business

Representa el negocio.

Campos conceptuales:

- `id`
- `name`
- `countryCode`
- `currencyCode`
- `preferredUnitSystem`
- `defaultLanguage`
- `businessCategory`
- `createdAt`
- `updatedAt`

Categorías iniciales:

- `food`
- `handmade`
- `services`
- `resale`

El negocio no representa una cuenta de usuario. La relación con usuarios se implementará en el futuro.

## 4. BusinessSettings

Configuraciones operativas del negocio.

Campos posibles:

- `businessId`
- `defaultTargetMargin`
- `overheadAllocationMethod`
- `lowStockDefaultThreshold`
- `themePreference`
- `languagePreference`
- `regionalFormattingPreference`
- `createdAt`
- `updatedAt`

Evitar duplicar ajustes que deban tener una única fuente de verdad.

## 5. UnitDefinition

Catálogo de unidades conocidas.

Campos conceptuales:

- `id`
- `code`
- `name`
- `dimension`
- `system`
- `baseConversionFactor`
- `isBuiltIn`

Ejemplos de dimensiones:

- `mass`
- `volume`
- `length`
- `area`
- `count`

Las unidades base, las reglas de conversión y el alcance del catálogo se definen en `BUSINESS-RULES.md` §3. Consecuencias para esta entidad:

- `baseConversionFactor` es el factor que convierte una cantidad de esta unidad a la unidad base de su `dimension`. Vale 1 para la propia unidad base.
- `baseConversionFactor` no sigue la escala de 6 decimales: debe conservar la precisión del factor definido.
- En el MVP solo existen unidades integradas (`isBuiltIn = true`). Las unidades personalizadas y las presentaciones comerciales quedan fuera del MVP.
- La representación persistida exacta de `baseConversionFactor` está pendiente de definir.

## 6. Ingredient

Representa un ingrediente o materia prima.

Campos:

- `id`
- `businessId`
- `name`
- `category`
- `dimension`
- `inventoryUnitCode`
- `lowStockThreshold`
- `tracksLots`
- `isActive`
- `notes`
- `createdAt`
- `updatedAt`

La cantidad disponible y el costo promedio deben provenir de los movimientos y reglas de valoración, no de ediciones arbitrarias de la entidad.

## 7. Supplier

Proveedor opcional.

Campos:

- `id`
- `businessId`
- `name`
- `contactInfo`
- `notes`
- `createdAt`
- `updatedAt`

No exigir proveedor para registrar una compra.

## 8. Purchase

Cabecera de una compra.

Campos:

- `id`
- `businessId`
- `supplierId` opcional
- `purchaseDate`
- `status`
- `currencyCode`
- `subtotal`
- `discountTotal`
- `attributableExpenseTotal`
- `taxTotal` cuando corresponda
- `grandTotal`
- `notes`
- `createdAt`
- `confirmedAt`

El estado debe permitir distinguir un borrador de una compra confirmada.

## 9. PurchaseLine

Línea de compra.

Campos:

- `id`
- `purchaseId`
- `itemType`
- `ingredientId` o referencia de mercancía
- `quantity`
- `purchaseUnitCode`
- `normalizedQuantity`
- `lineSubtotal`
- `discountAmount`
- `attributableExpenseAmount`
- `taxAmount` cuando corresponda
- `acquisitionCost`
- `unitCostNormalized`

El modelo debe poder representar tanto compras de ingredientes como de productos de reventa.

No usar un campo ambiguo para mezclar cantidad comprada, cantidad normalizada e importe monetario.

## 10. PurchaseExpenseAllocation

Representa cómo se asignan gastos atribuibles a líneas de compra cuando se necesita distribuir un importe compartido.

Campos:

- `id`
- `purchaseId`
- `purchaseLineId`
- `expenseType`
- `amount`
- `allocationMethod`

Evitar asignar el mismo gasto compartido completo a todas las líneas.

## 11. Product

Representa un producto comercial.

Campos:

- `id`
- `businessId`
- `name`
- `description`
- `productType`
- `category`
- `tracksFinishedGoods`
- `defaultTargetMargin`
- `isActive`
- `createdAt`
- `updatedAt`

Tipos:

- `manufactured`
- `resale`
- `service`

El tipo determina qué procesos e información son válidos.

## 12. ProductVariant

Representa una variante comercial.

Campos:

- `id`
- `businessId`
- `productId`
- `name`
- `sku` opcional
- `attributes`
- `salePrice`
- `targetMargin`
- `inventoryUnitCode` cuando corresponda
- `tracksStock`
- `isActive`
- `createdAt`
- `updatedAt`

Una variante puede representar tamaño, presentación u otra característica comercial.

El inventario de productos terminados debe distinguir variantes.

## 13. Recipe y RecipeLine

### Recipe

Campos:

- `id`
- `businessId`
- `productId`
- `variantId` opcional
- `name`
- `recipeMode`
- `expectedYield`
- `yieldUnitCode`
- `isActive`
- `createdAt`
- `updatedAt`

Modos:

- `base_scaled`
- `variant_specific`

### RecipeLine

Campos:

- `id`
- `recipeId`
- `ingredientId`
- `quantity`
- `unitCode`
- `normalizedQuantity`

Cada línea representa el consumo previsto de un ingrediente.

La receta debe validar compatibilidad de unidades.

## 14. Production

Cabecera de una producción.

Campos:

- `id`
- `businessId`
- `productId`
- `variantId`
- `recipeId`
- `plannedQuantity`
- `actualQuantity`
- `wasteQuantity`
- `yieldUnitCode`
- `status`
- `productionDate`
- `lotCode` opcional
- `expiryDate` opcional
- `directCostTotal`
- `overheadCostTotal` cuando se pueda determinar
- `totalCost`
- `costCompleteness`
- `notes`
- `createdAt`
- `confirmedAt`

Al confirmar, conservar snapshots de cantidades, costos y receta aplicada necesarios para reproducir la operación histórica.

Una modificación posterior de la receta no debe alterar la producción confirmada.

## 15. ProductionConsumption

Registra los consumos reales de una producción.

Campos:

- `id`
- `productionId`
- `ingredientId`
- `quantity`
- `unitCode`
- `normalizedQuantity`
- `unitCostSnapshot`
- `totalCostSnapshot`

Permite conservar el consumo y costo utilizado por cada ingrediente.

## 16. InventoryMovement

Registro trazable de movimientos de inventario.

Campos:

- `id`
- `businessId`
- `itemType`
- `itemId`
- `variantId` opcional
- `lotId` opcional
- `movementType`
- `quantityDelta`
- `unitCode`
- `normalizedQuantityDelta`
- `unitCostSnapshot` cuando corresponda
- `totalValueDelta` cuando corresponda (ver "Valor acumulado")
- `sourceEntityType`
- `sourceEntityId`
- `reason`
- `occurredAt`
- `createdAt`
- `reversalOfMovementId` opcional

Tipos de movimiento posibles:

- `opening_balance`
- `purchase_receipt`
- `production_consumption`
- `production_output`
- `sale`
- `customer_return`
- `inventory_adjustment`
- `reversal`
- `write_off`

No todos los tipos se aplican a todos los productos.

Los movimientos confirmados no se borran silenciosamente.

`normalizedQuantityDelta` está expresado en la unidad base de la dimensión del artículo (`BUSINESS-RULES.md` §3). `quantityDelta` y `unitCode` conservan la cantidad y la unidad originales.

### Valor del movimiento y valor acumulado

Decisión aprobada (2026-10-25). Se aplica `BUSINESS-RULES.md` §5.

**Representación de `totalValueDelta`**

- Es un entero con escala fija de 10^6 unidades internas por unidad monetaria mínima de la moneda del negocio. Por ejemplo, en USD, 1 centavo = 1 000 000 unidades internas.
- Es una representación interna de valoración, distinta del importe monetario definitivo. Los importes definitivos (por ejemplo, `Production.totalCost` o `SaleLine.directCostTotalSnapshot`) siguen siendo enteros en la unidad mínima de la moneda (§2).

**Obligatoriedad y signo**

- Todo movimiento que afecta al valor del inventario debe tener un `totalValueDelta` obligatorio.
- Las entradas de valor son positivas y las salidas son negativas.
- Los movimientos que no afectan al valor deben identificarse explícitamente y no llevan `totalValueDelta`.

**Cambio de modelado necesario**

El modelo actual no permite distinguir esos movimientos: `movementType` no determina por sí solo si un movimiento afecta al valor. Se requiere un indicador explícito en `InventoryMovement`, por ejemplo `affectsValuation`. Debe ser obligatorio y coherente con la presencia de `totalValueDelta`. Se incorporará al crear el esquema de la Fase 1.

**Valor acumulado y costo promedio**

- La cantidad acumulada de un artículo es Σ `normalizedQuantityDelta` de sus movimientos.
- El valor acumulado de un artículo es Σ `totalValueDelta` de sus movimientos que afectan a la valoración.
- El costo promedio ponderado es valor acumulado / cantidad acumulada, calculado con aritmética decimal precisa.
- `unitCostSnapshot` y cualquier costo unitario redondeado son snapshots y no son fuente de verdad.
- Una proyección persistida del valor o de la cantidad solo es válida si se puede reconciliar con los movimientos (`ARCHITECTURE.md` §8).

La valoración de los casos pendientes de `BUSINESS-RULES.md` §5 no queda definida por esta representación.

## 17. InventoryLot

Lote opcional para ingredientes y productos que requieren trazabilidad o vencimiento.

Campos:

- `id`
- `businessId`
- `itemType`
- `itemId`
- `variantId` opcional
- `lotCode`
- `receivedAt`
- `expiryDate` opcional
- `createdAt`

El soporte de lotes es opcional. El inventario básico debe funcionar aunque no se registren lotes.

## 18. TaxDefinition

Impuesto porcentual configurable manualmente.

Campos:

- `id`
- `businessId`
- `name`
- `rate`
- `isActive`
- `calculationOrder`
- `createdAt`
- `updatedAt`

El MVP no debe fingir que soporta reglas fiscales avanzadas si no están implementadas.

## 19. ProductTaxAssignment

Relación entre un producto o variante y los impuestos aplicables.

Campos:

- `id`
- `businessId`
- `productId`
- `variantId` opcional
- `taxDefinitionId`
- `isActive`

Definir claramente la precedencia cuando existan asignaciones a nivel de producto y de variante.

## 20. Sale

Cabecera de una venta.

Campos:

- `id`
- `businessId`
- `saleNumber` opcional
- `saleDate`
- `status`
- `currencyCode`
- `subtotal`
- `discountTotal`
- `taxTotal`
- `grandTotal`
- `amountPaid`
- `balanceDue`
- `directCostTotal`
- `grossProfitEstimate`
- `overheadCostEstimate` cuando se pueda determinar
- `profitEstimate`
- `profitabilityStatus`
- `createdAt`
- `confirmedAt`
- `reversalOfSaleId` opcional

La venta debe conservar snapshots de los importes y datos necesarios para mantener su historia.

Los totales deben ser coherentes con sus líneas, descuentos, impuestos, pagos y reversos.

## 21. SaleLine

Línea de venta.

Campos:

- `id`
- `saleId`
- `productId`
- `variantId` opcional
- `quantity`
- `unitCode`
- `suggestedUnitPrice`
- `actualUnitPrice`
- `discountAmount`
- `taxableBase`
- `taxSnapshot`
- `finalLineTotal`
- `directUnitCostSnapshot`
- `directCostTotalSnapshot`
- `grossProfitSnapshot`
- `overheadEstimateSnapshot` cuando se pueda determinar
- `profitEstimateSnapshot`
- `profitabilityStatus`

Guardar el precio sugerido por separado del precio real.

Los impuestos aplicados deben conservar sus nombres, tasas y valores calculados como snapshot, no depender únicamente de las definiciones actuales.

## 22. Payment

Representa un pago asociado a una venta.

Campos:

- `id`
- `businessId`
- `saleId`
- `amount`
- `paymentMethod`
- `paymentDate`
- `status`
- `notes`
- `createdAt`
- `reversalOfPaymentId` opcional

Métodos iniciales:

- Efectivo.
- Transferencia.
- Tarjeta.
- Otros métodos configurables si se implementan.

Una venta puede tener varios pagos.

No considerar un pago pendiente como dinero recibido.

## 23. Return y ReturnLine

Representan devoluciones asociadas a ventas originales.

### Return

Campos:

- `id`
- `businessId`
- `saleId`
- `returnDate`
- `status`
- `refundAmount`
- `notes`
- `createdAt`
- `confirmedAt`

### ReturnLine

Campos:

- `id`
- `returnId`
- `saleLineId`
- `quantity`
- `refundAmount`
- `restockQuantity`
- `restockStatus`
- `reason`

No permitir devolver cantidades superiores a las cantidades vendidas que sigan siendo elegibles para devolución.

## 24. Expense

Gastos generales del negocio.

Campos:

- `id`
- `businessId`
- `name`
- `category`
- `amount`
- `currencyCode`
- `expenseDate`
- `period` cuando corresponda
- `isRecurring`
- `notes`
- `createdAt`
- `updatedAt`

Los gastos directos atribuibles a compras deben registrarse y asignarse mediante el flujo de compras. Evitar duplicarlos como gasto general.

## 25. OverheadAllocation

Representa una distribución de costos indirectos.

Campos:

- `id`
- `businessId`
- `expenseId` o referencia al conjunto de gastos
- `allocationMethod`
- `periodStart`
- `periodEnd`
- `allocationBase`
- `allocatedAmount`
- `productId` opcional
- `variantId` opcional
- `productionId` opcional
- `status`
- `createdAt`

Métodos:

- `per_unit`
- `direct_cost_ratio`
- `manual`

Una distribución incompleta debe quedar identificada como tal.

## 26. PromotionSuggestion

Recomendación de promoción generada por reglas locales.

Campos:

- `id`
- `businessId`
- `productId`
- `variantId` opcional
- `suggestionType`
- `reason`
- `proposedPrice` opcional
- `proposedDiscount` opcional
- `estimatedMargin` opcional
- `estimatedProfit` opcional
- `dataCompleteness`
- `status`
- `createdAt`
- `dismissedAt` opcional

La sugerencia no modifica precios ni ventas hasta que el usuario tome una acción explícita.

## 27. BackupMetadata

Información sobre respaldos.

Campos:

- `id`
- `schemaVersion`
- `createdAt`
- `appVersion`
- `businessId`
- `recordCounts` o información equivalente

El archivo de respaldo debe incluir una versión de esquema y validar sus datos antes de importar.

## 28. Relaciones y restricciones importantes

- Cada compra pertenece a un negocio.
- Cada línea de compra pertenece a una compra.
- Cada receta pertenece a un producto y, opcionalmente, a una variante.
- Cada consumo de producción pertenece a una producción.
- Cada movimiento de inventario debe tener una referencia de origen y motivo cuando corresponda.
- Cada venta pertenece a un negocio.
- Cada línea de venta pertenece a una venta.
- Cada pago pertenece a una venta.
- Cada devolución se relaciona con una venta original.
- Los identificadores de variantes deben corresponder al producto adecuado.
- No permitir relaciones entre entidades de negocios distintos.
- No confirmar operaciones con cantidades o importes inválidos.
- No permitir duplicar reversos.
- Conservar los snapshots históricos de operaciones confirmadas.

## 29. Implementación

Este documento define el significado de los datos, no obliga a usar una base de datos específica.

Antes de implementar:

1. Seleccionar una solución local compatible con Expo.
2. Validar soporte de transacciones y migraciones.
3. Definir restricciones de integridad.
4. Implementar repositorios.
5. Añadir pruebas de consistencia.
6. Documentar cualquier simplificación necesaria para el MVP.
