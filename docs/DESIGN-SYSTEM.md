# Valorarte — Sistema de diseño

## 1. Dirección visual

Valorarte debe transmitir orden, confianza, claridad económica y facilidad de uso.

La interfaz será:

- Profesional.
- Minimalista.
- Cálida, sin parecer infantil.
- Moderna, sin abusar de efectos visuales.
- Clara en pantallas con muchos datos.
- Coherente entre Android y futuras versiones de iOS.

Evitar el aspecto de una plantilla administrativa genérica.

## 2. Principios

1. La jerarquía visual debe indicar la acción principal.
2. Los datos importantes deben ser fáciles de comparar.
3. Los colores semánticos deben tener un significado consistente.
4. La información financiera debe ser legible y precisa.
5. El espacio en blanco debe separar grupos de información.
6. Las tarjetas deben usarse cuando agrupen información relacionada.
7. No convertir cada campo en una tarjeta independiente.
8. Evitar sombras fuertes, gradientes decorativos y exceso de bordes.
9. Las animaciones deben ser breves y funcionales.
10. La interfaz debe funcionar en tema claro y oscuro.

## 3. Paleta de colores

### Tema claro

- Fondo: `#F7F5F0`
- Superficie: `#FFFFFF`
- Superficie secundaria: `#EFEEE8`
- Texto principal: `#242923`
- Texto secundario: `#5D665E`
- Color primario: `#205C46`
- Texto sobre primario: `#FFFFFF`
- Acento: `#C56A4A`
- Borde: `#DCE1D9`
- Éxito: `#237A50`
- Advertencia: `#9A5B13`
- Error: `#B42318`
- Información: `#245FA6`

### Tema oscuro

- Fondo: `#171C19`
- Superficie: `#222A25`
- Superficie secundaria: `#2C352E`
- Texto principal: `#F1F3EF`
- Texto secundario: `#B6C0B8`
- Color primario: `#8CC8A7`
- Texto sobre primario: `#17251D`
- Acento: `#E49A7B`
- Borde: `#3A443D`
- Éxito: `#86D4A3`
- Advertencia: `#F2C078`
- Error: `#FF8A80`
- Información: `#91BBF5`

Estos colores son tokens iniciales. Comprueba contraste real para texto, iconos, botones y estados interactivos. Ajusta los tonos cuando sea necesario para cumplir accesibilidad sin perder la identidad visual.

## 4. Tipografía

Usar una familia sans serif legible y consistente. Inter o una alternativa compatible pueden servir como referencia.

Jerarquía inicial:

- Título principal de pantalla: 26–30.
- Encabezado de sección: 18–22.
- Título de tarjeta: 15–17.
- Texto de cuerpo: 14–16.
- Etiquetas y metadatos: 12–14.
- Valores financieros destacados: 24–32 según contexto.

No reducir el texto para que quepa en diseños demasiado densos.

Los números financieros deben facilitar la comparación y el escaneo visual.

## 5. Espaciado

Usar una escala consistente basada en múltiplos de 4:

- 4: separación mínima.
- 8: separación compacta.
- 12: separación de elementos relacionados.
- 16: padding estándar.
- 20: separación entre grupos.
- 24: separación entre secciones.
- 32: separación de bloques principales.

Evitar valores arbitrarios repetidos por toda la aplicación.

## 6. Bordes y superficies

- Radios de 8–12 para controles.
- Radios de 12–18 para tarjetas.
- Bordes discretos para separar superficies.
- Sombras ligeras solo cuando ayuden a indicar elevación.
- Evitar tarjetas anidadas sin una necesidad clara.

## 7. Botones

### Primario

Para la acción principal de una pantalla o flujo.

### Secundario

Para acciones alternativas importantes.

### Terciario

Para acciones discretas que no deben competir visualmente.

### Destructivo

Para anulaciones, eliminación y operaciones irreversibles.

Los botones deben tener:

- Estados normal, presionado, deshabilitado y cargando.
- Etiquetas claras.
- Área táctil cómoda.
- Contraste suficiente.

No usar únicamente el color para comunicar peligro o éxito.

## 8. Formularios

- Etiquetas visibles y persistentes.
- Unidades mostradas junto al campo de cantidad.
- Teclado adecuado al tipo de dato.
- Separadores decimales coherentes con la configuración regional.
- Validaciones claras.
- Errores junto al campo correspondiente.
- Valores calculados claramente diferenciados de los valores editables.
- Confirmación antes de descartar formularios con cambios.

No usar el placeholder como única etiqueta.

## 9. Datos financieros

Distinguir visualmente:

- Ingresos.
- Costos.
- Impuestos.
- Margen.
- Ganancia estimada.
- Saldo pendiente.

Los colores semánticos no deben sustituir las etiquetas. Una ganancia positiva o negativa debe expresarse también mediante texto y valores.

No colorear todas las cifras financieras como si fueran indicadores de éxito.

Si un cálculo es incompleto, mostrar una etiqueta como "Estimación parcial" y explicar qué información falta.

## 10. Iconografía

Usar una biblioteca de iconos compatible con Expo, consistente en toda la app.

No mezclar estilos de iconos.
No usar emojis como iconos funcionales.
Los iconos decorativos deben tener un propósito claro.
Los botones con icono sin texto deben tener una etiqueta accesible.

## 11. Animaciones

Usar animaciones discretas para:

- Transiciones.
- Apertura de formularios secundarios.
- Confirmación de acciones.
- Cambios de estado.
- Actualizaciones visuales relevantes.

Evitar animaciones largas en tareas repetitivas.

Respetar las preferencias de movimiento reducido cuando sea posible y no bloquear la interacción durante una animación.

## 12. Accesibilidad

- Contraste suficiente.
- Etiquetas accesibles.
- Áreas táctiles cómodas.
- Soporte para texto ampliado.
- No depender únicamente del color.
- Orden de navegación coherente.
- Estados de error comprensibles.
- Formularios utilizables con tecnologías de asistencia.

## 13. Componentes compartidos

Crear componentes reutilizables cuando exista una necesidad consistente, por ejemplo:

- ScreenContainer.
- ScreenHeader.
- SectionHeader.
- PrimaryButton.
- SecondaryButton.
- FormField.
- QuantityInput.
- CurrencyInput.
- MetricCard.
- StatusBadge.
- EmptyState.
- ErrorState.
- LoadingState.
- ConfirmDialog.
- BottomSheet o modal cuando corresponda.
- PriceBreakdown.
- ProfitabilitySummary.

No construir una biblioteca excesivamente abstracta antes de tener casos reales de uso.

## 14. Temas

Todos los colores de la interfaz deben proceder de tokens semánticos.

No escribir colores directamente en cada componente salvo excepciones justificadas.

Los temas claro y oscuro deben cubrir fondos, superficies, textos, bordes, estados, controles y gráficos.

## 15. Calidad visual

Antes de dar una pantalla por terminada, comprobar:

- Jerarquía.
- Espaciado.
- Contraste.
- Estados vacíos.
- Estados de error.
- Campos con valores largos.
- Cantidades y precios grandes.
- Teclado abierto.
- Pantallas pequeñas.
- Tema claro.
- Tema oscuro.
