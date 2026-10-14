/* eslint-disable react/react-in-jsx-scope */
'use client';

import { product } from '@/utils/theme/gy';
import { Box, useTheme } from '@mui/material';
import AuroraBackground from '../atoms/AuroraBackground';

// Fondo fijo de toda la app: la misma receta que el hero de producto de gy-web,
// pero fijado al viewport para que acompañe al hacer scroll.
export default function PageBackdrop() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0, // capa de fondo (el contenido va en zIndex 1)
        pointerEvents: 'none',
        // 1) Gradiente base del producto
        background: isDark ? product.pageDark : product.pageLight,
        transition: 'background 0.4s ease',
      }}
    >
      {/* 2) Brillo radial violeta en la parte superior */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: product.glow(isDark),
        }}
      />

      {/* 3) Aurora: blobs difuminados + suelo en perspectiva + spotlight + ruido */}
      <AuroraBackground intensity={0.6} />

      {/* 4) Rejilla plana de 60px que se desvanece hacia los bordes */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${product.primary}18 1px, transparent 1px),
            linear-gradient(90deg, ${product.primary}18 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 100% 80% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 80% at 50% 30%, black 20%, transparent 80%)',
        }}
      />
    </Box>
  );
}
