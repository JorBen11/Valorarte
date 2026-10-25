# Valorarte — Definición del producto

## 1. Visión

Valorarte es una aplicación móvil para pequeños negocios que necesitan entender cuánto les cuesta operar, cuánto deberían cobrar por sus productos y qué rentabilidad obtienen realmente.

El producto combina:

- Costos.
- Inventario.
- Producción.
- Compras.
- Ventas.
- Rentabilidad.
- Recomendaciones comerciales.

La aplicación debe ayudar a tomar mejores decisiones sin exigir conocimientos contables avanzados.

## 2. Usuarios objetivo

Pequeños negocios que fabrican, revenden o venden servicios.

Ejemplos:

- Repostería y alimentos preparados.
- Artesanías y productos hechos a mano.
- Fabricantes de productos físicos.
- Tiendas que compran y revenden mercancía.
- Prestadores de servicios que necesitan calcular sus costos.

Categorías iniciales de negocio:

- `food`
- `handmade`
- `services`
- `resale`

Estas categorías describen la actividad del negocio. No sustituyen los tipos operativos de producto.

## 3. Tipos de producto

### Fabricado

Tiene una receta o lista de materiales, consume ingredientes o materias primas durante la producción y genera productos terminados.

### Reventa

Se compra como mercancía terminada y se vende sin un proceso de fabricación propio.

### Servicio

Se vende una actividad o prestación. Puede consumir materiales o tener costos directos, pero no requiere inventario de productos terminados por defecto.

El catálogo debe ser unificado, pero los campos y procesos deben depender del tipo de producto.

## 4. Problemas que resuelve

- No saber cuánto cuesta fabricar un producto.
- Establecer precios sin conocer el margen real.
- Desconocer cómo cambian los costos de los ingredientes.
- Perder el control de existencias.
- Fabricar cantidades sin conocer el consumo real.
- Aplicar descuentos que reducen demasiado la rentabilidad.
- Confundir ventas, cobros y ganancias.
- No identificar productos con baja rentabilidad.
- Desconocer el efecto de las mermas y los gastos indirectos.

## 5. Objetivos del MVP

El MVP debe permitir que un usuario configure un negocio y pueda:

1. Registrar ingredientes y materias primas.
2. Registrar compras y consultar el historial de precios.
3. Crear productos fabricados, de reventa y servicios.
4. Definir variantes de producto.
5. Crear recetas escalables o específicas por variante.
6. Calcular costos y precios sugeridos.
7. Registrar producciones y mermas.
8. Controlar ingredientes y productos terminados.
9. Registrar ventas y cobros.
10. Cambiar el precio sugerido durante una venta.
11. Consultar margen bruto y ganancia estimada.
12. Configurar impuestos porcentuales manuales.
13. Registrar devoluciones, ajustes y anulaciones trazables.
14. Recibir alertas de inventario y sugerencias de promociones.
15. Exportar e importar un respaldo local.

## 6. Principios del producto

### Claridad económica

Distinguir siempre:

- Venta bruta.
- Impuestos cobrados.
- Ingreso sin impuestos.
- Costo directo.
- Costo indirecto asignado.
- Margen bruto.
- Ganancia estimada.
- Dinero cobrado.
- Saldo pendiente.

### Control del usuario

Los precios sugeridos no son obligatorios. El usuario decide el precio final.

Las promociones recomendadas no se aplican automáticamente.

### Trazabilidad

Las operaciones confirmadas deben conservar su historial. Las correcciones deben ser explícitas y trazables.

### Honestidad de los cálculos

Si faltan datos, la aplicación debe mostrar qué falta y qué resultados pueden calcularse. Nunca debe inventar costos para completar una métrica.

### Facilidad de uso

Las operaciones frecuentes deben requerir pocos pasos. Los detalles avanzados deben aparecer cuando sean necesarios, no bloquear todos los formularios.

## 7. Navegación principal

La navegación inferior contiene cuatro secciones:

- Inicio.
- Ingredientes.
- Productos.
- Ajustes.

Compras, producción y ventas son flujos operativos secundarios accesibles desde acciones contextuales y accesos rápidos.

## 8. Mercado e internacionalización

La aplicación debe admitir negocios de distintos países de Latinoamérica.

Cada negocio configura:

- País.
- Moneda.
- Sistema de unidades preferido.
- Idioma.
- Impuestos porcentuales aplicables.

El MVP no incluye determinación fiscal automática ni garantiza cumplimiento legal de cada país.

Idiomas iniciales:

- Español.
- Inglés.

No codificar tasas de impuestos ni asumir que todos los países usan la misma moneda o formato numérico.

## 9. Modelo comercial

El producto está pensado para un modelo freemium.

La definición exacta de los límites gratuitos, los planes de pago y el sistema de suscripciones queda fuera del primer MVP.

No simular pagos, suscripciones ni restricciones comerciales como si estuvieran conectados a un servicio real.

## 10. Fuera de alcance del MVP

- Facturación electrónica.
- Presentación de declaraciones fiscales.
- Cálculo automático de obligaciones tributarias por país.
- Integración bancaria.
- Sincronización en la nube.
- Gestión multiusuario funcional.
- Múltiples sucursales.
- Gestión avanzada de cuentas contables.
- Integración automática con proveedores.
- Actualización fiscal automática.
- Cobros reales de suscripciones.

## 11. Criterios generales de aceptación

El MVP será aceptable cuando:

- Los flujos principales funcionen con datos persistidos localmente.
- Las reglas de negocio estén cubiertas por pruebas.
- No existan movimientos de inventario sin trazabilidad.
- Los cálculos se comporten de forma consistente entre pantallas.
- El usuario pueda realizar las operaciones básicas sin conexión.
- Los estados vacíos, errores y validaciones estén diseñados.
- El tema claro y oscuro mantengan un contraste legible.
- Los respaldos se puedan exportar e importar con validación.
