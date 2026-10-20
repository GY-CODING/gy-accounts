// Tokens de la suite GYCODING (guía local en frontend/STYLES.md) con la paleta de GY Accounts.
// Regla de la guía: donde gy-web usa el gradiente índigo → rosa, Accounts usa `product.gradient`.

// --- Paleta del producto (gy-web/app/products/data/products.ts → 'gy-accounts') ---
export const product = {
  primary: '#8C54FF',
  secondary: '#6d28d9',
  accent: '#a855f7',
  // Gradiente de marca de Accounts: CTAs, anillos, puntos activos.
  gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
  // Variante larga para titulares animados (background-size 200%).
  headline:
    'linear-gradient(90deg, #a855f7 0%, #6366f1 35%, #8C54FF 70%, #a855f7 100%)',
  // Línea de 1px que separa el footer.
  hairline:
    'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.6) 30%, rgba(99,102,241,0.6) 70%, transparent 100%)',
  // Fondos de página (iguales que el hero de producto en gy-web).
  pageDark: 'linear-gradient(160deg, #0a0020 0%, #1a0045 40%, #050010 100%)',
  pageLight: 'linear-gradient(160deg, #ffffff 0%, #f8f4ff 50%, #ede7ff 100%)',
  // Brillo radial superior; en claro va más intenso para que se note.
  glow: (dark: boolean) =>
    `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(140,84,255,${dark ? 0.25 : 0.4}) 0%, transparent 70%)`,
};

// Colores de los blobs de la aurora: [primary, accent, secondary].
export const auroraColors: [string, string, string] = [
  product.primary,
  product.accent,
  product.secondary,
];

// --- Superficies de cristal (§2.5 de la guía) ---
export const surface = (dark: boolean) => ({
  card: dark ? 'rgba(17,17,17,0.8)' : 'rgba(255,255,255,0.9)',
  glass: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
  overlay: dark ? 'rgba(10,10,14,0.7)' : 'rgba(255,255,255,0.75)',
  popover: dark ? 'rgba(14,14,20,0.88)' : 'rgba(255,255,255,0.92)',
  subtle: dark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.04)',
  hover: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  hoverBrand: dark ? 'rgba(140,84,255,0.10)' : 'rgba(140,84,255,0.06)',
});

// --- Bordes, siempre de 1px (§2.6) ---
export const border = (dark: boolean) => ({
  default: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  subtle: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
  strong: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
  hover: 'rgba(140,84,255,0.5)',
});

// --- Texto (§2.4) ---
export const text = (dark: boolean) => ({
  primary: dark ? '#ffffff' : '#000000',
  secondary: dark ? '#e0e0e0' : '#616161',
  tertiary: dark ? '#bdbdbd' : '#757575',
  muted: dark ? '#9e9e9e' : '#757575',
});

// --- Sombras (§2.7); las de color se tiñen con el primary del producto ---
export const shadow = {
  card: (dark: boolean) =>
    dark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.08)',
  header: (dark: boolean) =>
    dark
      ? '0 10px 30px -15px rgba(0,0,0,0.6)'
      : '0 10px 30px -15px rgba(0,0,0,0.12)',
  popover: (dark: boolean) =>
    dark
      ? '0 30px 80px -20px rgba(0,0,0,0.7)'
      : '0 30px 80px -20px rgba(0,0,0,0.2)',
  cta: `0 10px 30px -8px ${product.primary}99`,
};

// --- Radios (§4): botones 14, tarjetas 24 ---
export const radius = { xs: 8, sm: 12, md: 14, lg: 20, xl: 24, xxl: 28 };

// Curva ease-out-expo usada en todas las entradas.
export const easeOut = [0.16, 1, 0.3, 1] as const;

// Entrada estándar de la suite: aparece y sube 24px, una sola vez.
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: easeOut },
});

// Label "overline" en mayúsculas que abre cada tarjeta.
export const overlineSx = (dark: boolean) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: text(dark).muted,
});

// Botón cuadrado de cristal 40×40 (toggle de tema, hamburguesa…), igual que gy-web.
export const glassIconButtonSx = (dark: boolean) => ({
  width: 40,
  height: 40,
  borderRadius: `${radius.sm}px`,
  border: `1px solid ${border(dark).default}`,
  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(10px)',
  color: dark ? 'grey.200' : 'grey.800',
  transition: 'background 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
    borderColor: border(dark).hover,
  },
});
