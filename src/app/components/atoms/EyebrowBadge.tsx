/* eslint-disable react/react-in-jsx-scope */
'use client';

import { border, product, surface } from '@/utils/theme/gy';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Píldora encima del titular (§6.2), igual que EyebrowBadge de gy-web
// pero con el punto en el gradiente de Accounts.
export default function EyebrowBadge({ children }: { children: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: '999px',
          border: `1px solid ${border(isDark).strong}`,
          background: surface(isDark).glass,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Punto de 6px que "late" */}
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: product.gradient,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: isDark ? 'grey.200' : 'grey.800',
          }}
        >
          {children}
        </Typography>
      </Box>
    </motion.div>
  );
}
