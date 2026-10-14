/* eslint-disable react/react-in-jsx-scope */
'use client';

import { easeOut, product } from '@/utils/theme/gy';
import { SxProps, Theme, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Titular que entra palabra a palabra (port de AnimatedGradientHeadline de gy-web).
// Por defecto lleva el gradiente animado; con `gradient={null}` es de color sólido
// y el color se pasa por `sx`.
export default function GradientHeadline({
  text,
  sx,
  delayStart = 0.15,
  gradient = product.headline,
}: {
  text: string;
  sx?: SxProps<Theme>;
  delayStart?: number;
  gradient?: string | null;
}) {
  const words = text.split(' ');

  // Estilos de texto en gradiente (solo si hay gradiente)
  const gradientStyle = gradient
    ? {
        backgroundImage: gradient,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : {};

  return (
    <Typography
      variant="h1"
      component="h1"
      sx={[
        { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          // Cada palabra sube desde 60% y aparece, con 0.08s de desfase entre ellas
          initial={{ opacity: 0, y: '60%' }}
          animate={{
            opacity: 1,
            y: '0%',
            // El gradiente se desplaza en bucle lento (7s)
            ...(gradient && {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }),
          }}
          transition={{
            opacity: {
              duration: 0.7,
              delay: delayStart + i * 0.08,
              ease: easeOut,
            },
            y: { duration: 0.7, delay: delayStart + i * 0.08, ease: easeOut },
            backgroundPosition: {
              duration: 7,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{
            display: 'inline-block',
            marginRight: i < words.length - 1 ? '0.3em' : 0,
            ...gradientStyle,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Typography>
  );
}
