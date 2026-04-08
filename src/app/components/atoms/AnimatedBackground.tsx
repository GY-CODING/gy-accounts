/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component={motion.div}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: isDark ? '#121212' : '#f5f5f5',
      }}
    >
      {/* Orbes y efectos comentados para prueba de rendimiento */}
      {/* {[...Array(3)].map(...)} */}
    </Box>
  );
}
