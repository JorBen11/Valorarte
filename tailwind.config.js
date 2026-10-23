/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        elevated:   "var(--color-elevated)",
        surface:    "var(--color-surface)",
        tabbar:     "var(--color-tabbar)",
        "primary-subtle": "var(--color-primary-subtle)",
        primary: {
          DEFAULT: "#C8F135",
          pressed: "#B0D42A",   // Estado pressed/hover
          muted:   "#D4F56A",   // Variante más suave para tinted surfaces
        },
        content: {
          primary:   "var(--color-content-primary)",
          secondary: "var(--color-content-secondary)",
          disabled:  "var(--color-content-disabled)",
          inverse:   "#141410",   // fijo — siempre sobre lima
          accent:    "var(--color-content-accent)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          strong:  "var(--color-border-strong)",
          focus:   "#C8F135",    // siempre lima
          error:   "#FF4D4F",    // siempre rojo
        },
        success:{
          DEFAULT: "#00C48C",
          muted:   "var(--color-success-muted)",
          text:    "#00E6A5",
        },
        warning: {
          DEFAULT: "#FFB800",
          muted:   "var(--color-warning-muted)",
          text:    "#FFD54F",
        },
        error: {
          DEFAULT: "#FF4D4F",
          muted:   "var(--color-error-muted)",
          text:    "#FF6B5B",
        },
        destructive: {
          DEFAULT: "#CC2200",
          pressed: "#AA1A00",
        },
        badge: {
          live:      "#00C48C",
          lowstock:  "#CC2200",
          done:      "#3A3A2E",
        },
      },

      fontFamily: {
        // Display: para precios grandes, títulos de pantalla
        display:      ["ClashDisplay-Bold"],
        "display-md": ["ClashDisplay-Semibold"],
 
        // Epilogue — Headers de sección (H2, H3, labels de sección)
        heading:      ["Epilogue-Bold"],
        "heading-md": ["Epilogue-SemiBold"],
        "heading-rg": ["Epilogue-Regular"],
        // Body: para el resto
        sans:         ["PlusJakartaSans-Regular"],
        "sans-md":    ["PlusJakartaSans-Medium"],
        "sans-semi":  ["PlusJakartaSans-SemiBold"],
        "sans-bold":  ["PlusJakartaSans-Bold"],
      },

      fontSize: {
        "display": ["48px", { lineHeight: "52px", letterSpacing: "-1.5px" }],
        "h1":      ["28px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
        "h2":      ["22px", { lineHeight: "28px", letterSpacing: "-0.3px" }],
        "h3":      ["18px", { lineHeight: "24px" }],
        "body":    ["15px", { lineHeight: "22px" }],
        "label":   ["13px", { lineHeight: "18px", letterSpacing: "0.1px" }],
        "caption": ["11px", { lineHeight: "16px", letterSpacing: "0.2px" }],
        // Etiquetas de sección en mayúsculas
        "overline": ["10px", { lineHeight: "14px", letterSpacing: "1px" }],
      },

      borderRadius: {
        // Sistema de radios de Craftly
        "card":   "16px",   // Cards principales
        "btn":    "12px",   // Botones e inputs
        "chip":   "24px",   // Chips full pill (24px = ~full en tamaño chip)
        "input":  "12px",   // Inputs
        "badge":  "6px",    // Status badges pequeños
        "full":   "9999px", // Toggle, avatares
      },

      spacing: {
        // Base 4px grid
        "1":  "4px",
        "2":  "8px",
        "3":  "12px",
        "4":  "16px",   // Margin/padding base
        "5":  "20px",
        "6":  "24px",   // Margin/padding alt
        "7":  "28px",
        "8":  "32px",   // Container spacing
        "10": "40px",
        "12": "48px",
        "14": "56px",   // Altura de botones primarios (FAB)
        "16": "64px",
      },
 
      height: {
        // Alturas estándar de elementos interactivos
        "btn-sm": "36px",
        "btn-md": "48px",
        "btn-lg": "56px",   // Botón primary principal
        "input":  "52px",   // Inputs (extraído del wireframe)
        "chip":   "32px",   // Chips y badges
        "tabbar": "64px",   // Tab bar
      },

      boxShadow: {
        // Sombras sutiles para dark theme
        "card":   "0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.4)",
        "modal":  "0 8px 40px rgba(0,0,0,0.7)",
        "input":  "inset 0 1px 3px rgba(0,0,0,0.3)",
        // Glow lima para FAB y CTAs importantes
        "fab":    "0 4px 20px rgba(200,241,53,0.30)",
        "btn-primary": "0 2px 12px rgba(200,241,53,0.20)",
      },
    },
  },
  plugins: [],
}

