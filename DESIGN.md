---
name: Valorarte
description: Gestión de costos, precios e inventario para pequeños negocios, con la etiqueta de precio como objeto de marca.
colors:
  background: "#CFEEDD"
  surface: "#F4FBF7"
  surface-raised: "#E2F5EA"
  text-primary: "#10261C"
  text-secondary: "#35574A"
  border: "rgba(16, 38, 28, 0.16)"
  field-border: "#5C7A6E"
  primary: "#B80D66"
  on-primary: "#FFFFFF"
  primary-text: "#A00B58"
  attention: "#FFC531"
  on-attention: "#10261C"
  ink: "#10261C"
  on-ink: "#F4FBF7"
  error: "#A32A16"
  on-error: "#FFFFFF"
  scrim: "rgba(5, 18, 13, 0.6)"
  success: "#0E5F3C"
  success-surface: "#D6F1E1"
  warning: "#6F4A00"
  warning-surface: "#FFF0C4"
  info: "#0B5573"
  info-surface: "#D8EDF5"
  error-surface: "#FBE4DE"
  dark-background: "#10261C"
  dark-surface: "#1A3328"
  dark-surface-raised: "#234034"
  dark-text-primary: "#E7F7EE"
  dark-text-secondary: "#A9CDBD"
  dark-border: "rgba(231, 247, 238, 0.16)"
  dark-field-border: "#7E9F92"
  dark-primary: "#B80D66"
  dark-on-primary: "#FFFFFF"
  dark-primary-text: "#FF8FC2"
  dark-attention: "#FFC531"
  dark-on-attention: "#10261C"
  dark-ink: "#E7F7EE"
  dark-on-ink: "#10261C"
  dark-error: "#FFA08A"
  dark-on-error: "#10261C"
  dark-scrim: "rgba(5, 18, 13, 0.6)"
  dark-success: "#8BE3B4"
  dark-success-surface: "#1E4A36"
  dark-warning: "#FFD166"
  dark-warning-surface: "#47391A"
  dark-info: "#93D4EE"
  dark-info-surface: "#1B3F4F"
  dark-error-surface: "#4A2A22"
typography:
  screen-title:
    fontFamily: "Bricolage Grotesque"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: "32px"
  section-title:
    fontFamily: "Figtree"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "24px"
  amount-main:
    fontFamily: "Figtree"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: "44px"
  amount-secondary:
    fontFamily: "Figtree"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "26px"
  quantity:
    fontFamily: "Figtree"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  item-name:
    fontFamily: "Figtree"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "Figtree"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22px"
  label:
    fontFamily: "Figtree"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "18px"
  caption:
    fontFamily: "Figtree"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  button:
    fontFamily: "Figtree"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "22px"
rounded:
  field: "14px"
  group: "20px"
  sheet: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  xxxl: "32px"
---

# Design System: Valorarte

> Resumen de la identidad implementada. Si hay conflicto, manda `docs/DESIGN-SYSTEM.md`. Los valores reales viven en `src/theme/tokens.ts` y `src/theme/layout.ts`.

## Overview

**Creative North Star: "Etiqueta refinada"**

Todo lo que un negocio vende termina con un precio colgado. La etiqueta con ojal es el objeto distintivo de Valorarte, y se reserva para lo que importa. La interfaz es cercana, alegre y profesional: experimental sin extravagancia y minimalista sin frialdad.

Las cifras son sobrias y legibles. La personalidad vive en la forma, el color de fondo y los títulos.

**Key Characteristics:**
- Fondo de menta en claro y de verde profundo en oscuro.
- Una etiqueta principal por pantalla como máximo.
- Cifras en Figtree y títulos en Bricolage Grotesque.
- Iconos solos cuando se entienden; texto cuando evita dudas.

## Colors

- **Menta / Verde profundo** (`background`): el color ocupa la pantalla.
- **Rosa mexicano** (`primary`): acción principal y etiqueta principal. Igual en ambos temas; `primary-text` lo adapta para texto y foco.
- **Amarillo sol** (`attention`): stock bajo y margen bajo objetivo, con texto oscuro e icono.
- **Verde tinta** (`ink`): sin existencias.
- **Rojo ladrillo** (`error`): solo errores y acciones destructivas. Tiene casi la misma luminosidad que el rosa, así que siempre lleva icono o texto.

## Typography

Importe principal, 36/44, con centavos elevados de 17 solo en esa cifra; con texto ampliado prevalece la legibilidad. Listas y tablas usan cifras tabulares alineadas. Bricolage Grotesque no se usa en cifras.

## Layout

En ventanas compactas, una columna con margen de 16 y escala de espaciado de 4 a 32. La composición cambia según el espacio disponible (`docs/DESIGN-SYSTEM.md`, sección 18). Las filas se agrupan en superficies neutras, sin una tarjeta por elemento. Con texto ampliado, la cantidad pasa bajo el nombre y las acciones se apilan.

## Elevation & Depth

Plano por defecto: el color y el tono separan las capas. Solo el FAB lleva sombra.

## Shapes

- **Etiqueta principal:** nariz redonda, ojal e hilo opcional.
- **Etiqueta compacta:** cantidades que piden atención.
- **Eco de forma:** botón principal y miniatura de producto, sin ojal.
- **Neutro:** filas, grupos, campos y diálogos, con radios simétricos.
- **Circular:** acciones de solo icono e imagen de ingrediente.

El ojal no se coloca sobre fotografías ni en controles.

## Components

- **Acciones:** decididas por contexto según `docs/DESIGN-SYSTEM.md`, sección 7. Producción lleva siempre icono y texto.
- **Navegación:** cuatro iconos visibles, con cápsula y etiqueta solo en la activa. Barra inferior en ventanas compactas.
- **Ingredientes:** fotografía, emoji o estado predeterminado en un círculo. El lector de pantalla anuncia el nombre, no el emoji.
- **Productos:** fotografía o etiqueta en blanco. Nunca emoji.
- **Movimiento:** físico y amable. Un solo gesto de marca: la etiqueta principal se balancea una vez por sesión al entrar en Inicio. Sin rebote en los cierres y con respeto al movimiento reducido.
- **Imágenes:** encuadre 1:1 pensado para miniaturas. Almacenamiento pendiente de aprobación (`docs/ARCHITECTURE.md`, sección 11.1).

## Do's and Don'ts

### Do:
- **Do** consultar en `docs/DESIGN-SYSTEM.md`, sección 17, qué está aprobado, pendiente o sin validar en Android.
- **Do** usar `MaterialCommunityIcons`, con etiqueta accesible en los controles de solo icono.
- **Do** comprobar ambos temas y el texto ampliado.

### Don't:
- **Don't** convertir todos los elementos en etiquetas.
- **Don't** usar emojis como iconos de acción, navegación o estado, ni en productos.
- **Don't** guardar URI de la galería.
- **Don't** usar `error` como color de marca ni para sin existencias.
- **Don't** presentar datos financieros incompletos con estilo de valor definitivo.
