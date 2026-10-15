/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useLiteMotion } from '@/hooks/useLiteMotion';
import { auroraColors } from '@/utils/theme/gy';
import { Box, useTheme } from '@mui/material';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const NOISE_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E';

// Posición, tamaño (vw) y duración del bucle de cada blob
const BLOB_LAYOUT = [
  { size: 55, top: '-15%', left: '-5%', duration: 20 },
  { size: 45, top: '5%', left: '65%', duration: 24 },
  { size: 42, top: '50%', left: '15%', duration: 28 },
];

const SPOTLIGHT_SIZE = 1040; // diámetro del brillo que sigue al cursor (px)

// Aurora de la suite (misma receta visual que gy-web), optimizada para rendimiento:
// - Blobs con radial-gradient en vez de `filter: blur(90px)`: el blur se recalculaba en cada
//   frame (muy caro en Safari/iPhone y en GPUs integradas). Ahora solo se anima `transform`,
//   que lo resuelve la GPU sin repintar.
// - Spotlight: una capa de tamaño fijo que se mueve con `transform` en lugar de reescribir
//   el `background` de toda la pantalla en cada mousemove.
// - Ruido sin `mix-blend-mode` (obligaba a componer todo lo que hay debajo).
// - En modo ligero (móvil, equipo modesto o reduced-motion) todo queda estático.
export default function AuroraBackground({
  colors = auroraColors,
  intensity = 1,
}: {
  colors?: [string, string, string];
  intensity?: number;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const lite = useLiteMotion();
  const [trackPointer, setTrackPointer] = useState(false);

  // Posición del spotlight en px, suavizada con muelle
  const mx = useMotionValue(-SPOTLIGHT_SIZE);
  const my = useMotionValue(-SPOTLIGHT_SIZE);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  // El spotlight solo existe con ratón y fuera del modo ligero
  useEffect(() => {
    if (lite || !window.matchMedia('(pointer: fine)').matches) {
      setTrackPointer(false);
      return;
    }
    setTrackPointer(true);
    const handleMove = (e: MouseEvent) => {
      // El fondo es fijo al viewport, así que basta con las coordenadas del cliente
      mx.set(e.clientX - SPOTLIGHT_SIZE / 2);
      my.set(e.clientY - SPOTLIGHT_SIZE / 2);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [lite, mx, my]);

  const gridLineColor = isDark ? 'rgba(255,255,255,0.07)' : `${colors[0]}1f`;
  // Los blobs ya no llevan blur, así que se compensa un poco la opacidad para el mismo brillo
  const blobOpacity = (isDark ? 0.3 : 0.2) * intensity;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        // Fundido inferior para mezclarse con lo que haya debajo
        maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 65%, transparent 100%)',
      }}
    >
      {/* 1) Blobs de color difuminados (degradado radial, sin filtro) */}
      {BLOB_LAYOUT.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: `${blob.size}vw`,
            height: `${blob.size}vw`,
            minWidth: 280,
            minHeight: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${colors[i]} 0%, ${colors[i]}00 70%)`,
            opacity: blobOpacity,
            // Capa propia en GPU solo si de verdad se va a animar
            willChange: lite ? 'auto' : 'transform',
          }}
          animate={
            lite ? undefined : { x: [0, 60, -40, 0], y: [0, -40, 30, 0] }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 2) Suelo de rejilla en perspectiva (estático) */}
      <Box
        sx={{
          position: 'absolute',
          left: '-10%',
          right: '-10%',
          bottom: 0,
          height: '42%',
          backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          transform: 'perspective(600px) rotateX(62deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black 0%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 85%)',
          opacity: isDark ? 0.5 : 0.4,
        }}
      />

      {/* 3) Spotlight que sigue al cursor: se mueve con transform, no se repinta */}
      {trackPointer && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: SPOTLIGHT_SIZE,
            height: SPOTLIGHT_SIZE,
            x: sx,
            y: sy,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${colors[2]}${isDark ? '29' : '1a'} 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      )}

      {/* 4) Ruido sutil, sin blend mode; se omite en modo ligero */}
      {!lite && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.035 : 0.025,
            backgroundImage: `url("${NOISE_URL}")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}
    </Box>
  );
}
