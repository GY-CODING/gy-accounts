// components/AnimatedAlert.tsx
import { ESeverity } from '@/utils/constants/ESeverity';
import { border, radius, shadow, surface, text } from '@/utils/theme/gy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import React from 'react';

type AnimatedAlertProps = {
  open: boolean;
  severity?: ESeverity;
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number; // duración en milisegundos
};

// Aviso tipo toast con la receta de popover de la suite (§6.8):
// cristal + borde + barra y punto de color según la severidad.
export default function AnimatedAlert({
  open,
  severity = ESeverity.INFO,
  title,
  message,
  onClose,
  duration = 5000,
}: AnimatedAlertProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // ESeverity coincide con las claves de la paleta (error/warning/info/success)
  const accent = theme.palette[severity].main;

  // Se cierra solo pasado `duration`
  useEffect(() => {
    if (open && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role={severity === ESeverity.ERROR ? 'alert' : 'status'}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            right: 24,
            zIndex: 1300,
            display: 'flex',
            justifyContent: 'flex-start',
            pointerEvents: 'none', // la franja vacía no bloquea clics
          }}
        >
          <Box
            sx={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              maxWidth: 420,
              pl: 2,
              pr: 1,
              py: 1.25,
              borderRadius: `${radius.md}px`,
              background: surface(isDark).popover,
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: `1px solid ${border(isDark).default}`,
              borderLeft: `3px solid ${accent}`,
              boxShadow: shadow.popover(isDark),
            }}
          >
            {/* Punto luminoso del color de la severidad */}
            <Box
              sx={{
                width: 8,
                height: 8,
                flexShrink: 0,
                borderRadius: '50%',
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {title}
                </Typography>
              )}
              <Typography
                sx={{ fontSize: '0.9rem', color: text(isDark).secondary }}
              >
                {message}
              </Typography>
            </Box>
            {onClose && (
              <IconButton
                size="small"
                aria-label="Close"
                onClick={onClose}
                sx={{ color: text(isDark).tertiary }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
