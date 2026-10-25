# Valorarte — Modelo de datos

## 1. Objetivo

Definir un modelo coherente para compras, ingredientes, recetas, productos, producción, inventario, ventas, impuestos y rentabilidad.

El modelo es conceptual. Los nombres exactos de tablas y columnas pueden adaptarse a la base de datos elegida, siempre que se conserven las reglas y relaciones.

## 2. Convenciones

- Todas las entidades persistentes deben tener identificadores estables.
- Las entidades pertenecientes a un negocio deben relacionarse con `businessId`.
- Usar fechas con una representación consistente y documentada.
- Usar importes con precisión decimal adecuada.
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

Las conversiones deben realizarse dentro de una dimensión compatible, usando factores conocidos y validados.

No asumir que todas las unidades personalizadas pueden convertirse automáticamente.

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
- `totalValueDelta` cuando corresponda
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
