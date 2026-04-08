'use client';

import colors from '@/utils/theme/colors';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
  gradient?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  gradient = false,
  sx,
  color,
  ...props
}) => {
  const theme = useTheme();

  const baseStyles = gradient
    ? {
        background: colors.primary.gradient,
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 32px',
        fontWeight: 600,
        textTransform: 'none' as const,
        position: 'relative' as const,
        overflow: 'hidden' as const,
        border: 'none',
        transition: 'all 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute' as const,
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover::before': {
          left: '100%',
        },
        '&:hover': {
          background: colors.primary.gradientHover,
          boxShadow: colors.shadow.button,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&.Mui-disabled': {
          background: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
        },
      }
    : {
        borderRadius: '12px',
        padding: '12px 32px',
        fontWeight: 600,
        textTransform: 'none' as const,
        transition: 'all 0.3s ease',
      };

  return (
    <MuiButton
      component={motion.button}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      color={color}
      sx={{
        ...baseStyles,
        ...sx,
      }}
      {...props}
    />
  );
};

export default Button;
