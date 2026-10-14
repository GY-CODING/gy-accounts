'use client';

import {
  border,
  product,
  radius,
  shadow,
  surface,
  text,
} from '@/utils/theme/gy';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

// Variantes de botón de la guía (§6.6)
type Tone = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  children: React.ReactNode;
  tone?: Tone;
}

const Button: React.FC<ButtonProps> = ({ tone = 'primary', sx, ...props }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const danger = theme.palette.error.main;

  // Base común: radio 14, padding 12×32, sin mayúsculas
  const base = {
    borderRadius: `${radius.md}px`,
    px: 4,
    py: 1.5,
    fontSize: { xs: '0.9rem', sm: '0.95rem' },
    fontWeight: 600,
    textTransform: 'none' as const,
    transition:
      'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
    '&.Mui-disabled': {
      background: surface(isDark).hover,
      color: text(isDark).muted,
      boxShadow: 'none',
      border: `1.5px solid ${border(isDark).subtle}`,
    },
  };

  const tones = {
    // Primario: gradiente de Accounts + sombra de color
    primary: {
      background: product.gradient,
      color: '#fff',
      border: 'none',
      boxShadow: shadow.cta,
      '&:hover': {
        background: product.gradient,
        boxShadow: `0 14px 34px -8px ${product.primary}aa`,
      },
    },
    // Secundario: cristal + borde 1.5px
    secondary: {
      background: surface(isDark).glass,
      backdropFilter: 'blur(10px)',
      color: text(isDark).primary,
      border: `1.5px solid ${border(isDark).strong}`,
      '&:hover': {
        background: surface(isDark).hoverBrand,
        borderColor: border(isDark).hover,
      },
    },
    // Peligro (logout): cristal + borde rojo al 40%, se rellena suave al hover
    danger: {
      background: surface(isDark).glass,
      backdropFilter: 'blur(10px)',
      color: danger,
      border: `1.5px solid ${danger}66`,
      '&:hover': {
        background: `${danger}21`,
        borderColor: danger,
      },
    },
  };

  return (
    <MuiButton
      // Si lleva href se renderiza como enlace, si no como botón
      component={props.href ? motion.a : motion.button}
      // Hover: sube 2px; tap: escala 0.97
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      disableElevation
      sx={[base, tones[tone], ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
};

export default Button;
