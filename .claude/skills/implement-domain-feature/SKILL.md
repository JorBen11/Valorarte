---
name: implement-domain-feature
description: Implement or modify Valorarte domain logic for pricing, taxes, inventory, purchasing, production, sales, payments, and profitability.
---

# Skill: Implementar una función de dominio

## Cuándo utilizarla

Utiliza esta skill cuando una tarea afecte:

- Costos.
- Precios.
- Impuestos.
- Unidades.
- Compras.
- Producción.
- Inventario.
- Ventas.
- Pagos.
- Devoluciones.
- Rentabilidad.
- Promociones.
- Persistencia de operaciones.

## Documentación obligatoria

Lee:

- `CLAUDE.md`
- `docs/BUSINESS-RULES.md`
- `docs/DATA-MODEL.md`
- `docs/ARCHITECTURE.md`
- Los documentos de producto relevantes.

## Paso 1: identificar las reglas

Antes de programar:

1. Identifica la entidad y el flujo afectados.
2. Identifica las reglas de negocio aplicables.
3. Identifica las entradas válidas e inválidas.
4. Identifica los efectos secundarios.
5. Identifica los snapshots históricos que deben conservarse.
6. Identifica los casos de error y recuperación.

Si la regla no está definida y puede afectar resultados económicos o inventario, solicita aclaración.

## Paso 2: diseñar la operación

Las operaciones deben tener una intención explícita, por ejemplo:

- `registerPurchase`
- `confirmProduction`
- `confirmSale`
- `registerPayment`
- `registerReturn`
- `reverseSale`
- `adjustInventory`

Los nombres son ejemplos; adapta los nombres al estilo del proyecto.

No permitas que una pantalla actualice directamente cantidades o importes derivados.

## Paso 3: validación

Valida:

- Identificadores.
- Relaciones entre entidades.
- Negocio propietario de los datos.
- Cantidades positivas cuando corresponda.
- Unidades compatibles.
- Disponibilidad de inventario.
- Valores monetarios.
- Estados de las operaciones.
- Duplicación de confirmaciones o reversos.
- Cantidades devueltas frente a las vendidas.
- Configuración necesaria para calcular impuestos y costos.

No confíes exclusivamente en validaciones de formularios.

## Paso 4: consistencia transaccional

Cuando una operación cambie varias entidades relacionadas:

- Usa una transacción de persistencia si está disponible.
- Registra todos los movimientos relacionados.
- Actualiza las existencias y sus valores de forma coherente.
- Revierte la operación completa ante errores.
- Evita estados parcialmente confirmados.

Si la base de datos no ofrece la capacidad necesaria, documenta el riesgo y diseña una estrategia compatible antes de implementar.

## Paso 5: cálculos

- Mantén las fórmulas en módulos puros cuando sea posible.
- Evita duplicar cálculos.
- Define las unidades de entrada y salida.
- Define precisión y redondeo.
- Distingue datos conocidos, estimados e incompletos.
- Evita divisiones por cero.
- Evita conversiones sin equivalencia válida.
- Conserva snapshots históricos.

## Paso 6: pruebas

Añade pruebas para:

- Casos normales.
- Límites.
- Datos inválidos.
- Existencias insuficientes.
- Unidades incompatibles.
- Costos incompletos.
- Redondeo.
- Reintentos de una misma operación.
- Reversos.
- Conservación de datos históricos.

No cambies una prueba para hacerla pasar si contradice una regla acordada. Investiga la causa.

## Paso 7: persistencia y migraciones

Si cambian las entidades:

- Actualiza el esquema.
- Crea una migración cuando corresponda.
- Mantén la compatibilidad de datos existentes.
- Actualiza los repositorios y mapeos.
- Actualiza pruebas de persistencia y respaldos.

No cambies el esquema local de manera incompatible sin una estrategia explícita.

## Restricciones

- No inventar reglas fiscales.
- No inventar costos desconocidos.
- No presentar estimaciones como resultados definitivos.
- No modificar operaciones históricas silenciosamente.
- No borrar movimientos confirmados.
- No descontar ingredientes en una venta normal de productos fabricados.
- No permitir stock negativo en las operaciones normales.
- No contar dos veces costos indirectos.
- No considerar saldos pendientes como dinero cobrado.

## Entrega

Resume:

- Regla implementada.
- Entidades afectadas.
- Cambios de persistencia.
- Casos límite contemplados.
- Pruebas ejecutadas.
- Riesgos o limitaciones pendientes.
