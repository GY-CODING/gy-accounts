/* eslint-disable react/react-in-jsx-scope */
'use client';

import { product, radius } from '@/utils/theme/gy';
import { Box, Skeleton, useTheme } from '@mui/material';
import GlassCard from '../atoms/GlassCard';

// Esqueleto de carga con la misma forma que el dashboard real
// (tarjeta de identidad + 2 tarjetas de datos) para que nada salte al cargar.
export function ProfileSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Tinte violeta en lugar del gris por defecto de MUI
  const tint = { bgcolor: `${product.primary}${isDark ? '1f' : '14'}` };

  // Atajo para bloques redondeados
  const block = (width: number | string, height: number, r = radius.sm) => (
    <Skeleton
      variant="rounded"
      animation="wave"
      width={width}
      height={height}
      sx={{ ...tint, borderRadius: `${r}px` }}
    />
  );

  return (
    <Box
      aria-busy
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
        gap: { xs: 2, md: 3 },
        alignItems: 'start',
      }}
    >
      {/* Columna izquierda: identidad */}
      <GlassCard>
        {/* Banner */}
        <Box
          sx={{
            mx: { xs: -3, sm: -4 },
            mt: { xs: -3, sm: -4 },
            height: { xs: 112, sm: 128 },
            borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
            background: isDark ? product.pageDark : product.pageLight,
            opacity: 0.8,
          }}
        />
        {/* Avatar, nombre, email y roles */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.25,
            mt: { xs: '-52px', sm: '-60px' },
          }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            width={118}
            height={118}
            sx={tint}
          />
          {block('55%', 26)}
          {block('70%', 16)}
          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
            {block(72, 26, radius.xs)}
            {block(88, 26, radius.xs)}
          </Box>
        </Box>
        {/* Botones */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4 }}>
          {block('100%', 48, radius.md)}
          {block('100%', 48, radius.md)}
        </Box>
      </GlassCard>

      {/* Columna derecha: datos + API key */}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}
      >
        <GlassCard delay={0.1}>
          {block(80, 12)}
          <Box sx={{ mt: 1.5, mb: 3 }}>{block('45%', 24)}</Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            {block('100%', 66, radius.md)}
            {block('100%', 66, radius.md)}
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              {block('100%', 66, radius.md)}
            </Box>
          </Box>
        </GlassCard>
        <GlassCard delay={0.2}>
          {block(90, 12)}
          <Box sx={{ mt: 1.5, mb: 3 }}>{block('35%', 24)}</Box>
          {block('100%', 56, radius.md)}
        </GlassCard>
      </Box>
    </Box>
  );
}
