---
name: implement-screen
description: Implement a Valorarte mobile screen using the product specification, design system, domain services, and existing project architecture.
---

# Skill: Implementar una pantalla de Valorarte

## Cuándo utilizarla

Utiliza esta skill al crear o modificar una pantalla, formulario, detalle, lista o flujo de navegación.

## Lectura previa

Lee:

- `CLAUDE.md`
- `docs/SCREENS.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/ARCHITECTURE.md`
- Las reglas de `docs/BUSINESS-RULES.md` relacionadas con la pantalla.

Para la composición visual, la elección de controles y la validación visual, sigue el procedimiento de la sección 4 de la skill `design-system`. Esta skill cubre el flujo funcional y no lo sustituye.

## Paso 1: inspeccionar

Antes de escribir código:

- Inspecciona la ruta existente.
- Identifica componentes reutilizables.
- Identifica hooks, casos de uso y repositorios disponibles.
- Comprueba cómo se resuelven tema e idioma.
- Comprueba si existen pruebas relacionadas.

No reemplaces una pantalla completa sin entender sus dependencias.

## Paso 2: definir el flujo

Determina:

- Qué objetivo cumple la pantalla.
- Qué datos necesita.
- Qué acciones puede ejecutar.
- Qué validaciones requiere.
- Qué estados debe mostrar.
- Qué ocurre si una operación falla.

Si el flujo implica inventario, costos, pagos o impuestos, utiliza las operaciones de dominio existentes.

## Paso 3: implementar

- Mantén la pantalla centrada en presentación y coordinación.
- Extrae componentes cuando sean reutilizables.
- Mantén fórmulas fuera de la interfaz.
- Evita acceso directo a tablas desde componentes.
- Utiliza los tipos de dominio existentes.
- Mantén consistentes las etiquetas y los mensajes.
- Usa traducciones para todos los textos visibles.
- Conserva los datos del formulario ante errores recuperables.

## Paso 4: estados obligatorios

Implementa los estados pertinentes:

- Cargando.
- Sin datos.
- Datos disponibles.
- Error.
- Validación fallida.
- Operación exitosa.
- Datos incompletos.
- Operación no permitida.

No muestres un resultado económico como definitivo si sus datos son incompletos.

## Paso 5: verificar

- Ejecuta las pruebas pertinentes.
- Ejecuta las comprobaciones de tipos disponibles.
- Revisa tema claro y oscuro.
- Revisa navegación y retroceso.
- Revisa teclado y desplazamiento.
- Comprueba textos largos.
- Comprueba accesibilidad básica.

## Restricciones

- No inventar datos de negocio.
- No duplicar lógica de dominio.
- No modificar inventario directamente.
- No cambiar la navegación principal de cuatro pestañas sin autorización.
- No añadir dependencias sin comprobar compatibilidad.
- No marcar como terminado algo que no se haya verificado.

## Entrega

Resume:

- Archivos modificados.
- Componentes reutilizados o creados.
- Estados implementados.
- Pruebas ejecutadas.
- Problemas conocidos.
