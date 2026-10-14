/* eslint-disable react/react-in-jsx-scope */
'use client';

import { border, radius, reveal, shadow, surface } from '@/utils/theme/gy';
import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  delay?: number; // retraso de la animación de entrada (para escalonar tarjetas)
  sx?: SxProps<Theme>;
}

// Tarjeta de cristal de la suite (§6.4): surface-card + borde 1px + sombra suave + radio 24.
export default function GlassCard({ children, delay = 0, sx }: GlassCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component={motion.section}
      {...reveal(delay)}
      sx={[
        {
          position: 'relative',
          background: surface(isDark).card,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${border(isDark).default}`,
          borderRadius: `${radius.xl}px`,
          boxShadow: shadow.card(isDark),
          p: { xs: 3, sm: 4 }, // 24px móvil / 32px desde sm
          transition: 'border-color 0.3s ease',
          // Hover: el borde se tiñe del violeta del producto
          '&:hover': { borderColor: `${theme.palette.primary.main}44` },
        },
        // Permite sobrescribir estilos desde fuera
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
