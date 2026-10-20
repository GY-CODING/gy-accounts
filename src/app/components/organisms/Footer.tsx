/* eslint-disable react/react-in-jsx-scope */
'use client';

import { valorantFont } from '@/utils/fonts';
import { GYCODING_URL } from '@/utils/menuItems';
import { overlineSx, product, text } from '@/utils/theme/gy';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

// Nombre de la marca como en gy-web ([company]GyCODING[/company]): Valorant, "y" minúscula.
// fontSynthesis: la fuente solo tiene un peso, así que se evita la negrita sintética.
const brandFontSx = {
  fontFamily: valorantFont.style.fontFamily,
  fontWeight: 400,
  fontSynthesis: 'none',
  letterSpacing: '0.04em',
};

// Enlaces del footer: todos llevan de vuelta a la web principal
const LINKS = [
  { name: 'GyCODING', href: GYCODING_URL },
  { name: 'GY Accounts', href: `${GYCODING_URL}/products/gy-accounts` },
  { name: 'Privacy', href: `${GYCODING_URL}/privacy` },
  { name: 'Terms', href: `${GYCODING_URL}/terms` },
  {
    name: 'Support',
    href: 'https://github.com/orgs/GY-CODING/discussions/new?category=support',
  },
];

// Versión compacta del footer de gy-web: línea en gradiente, brillo violeta, marca + enlaces.
export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const texts = text(isDark);

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        mt: { xs: 10, md: 14 },
        // Fondo semitransparente con blur sobre la aurora
        backgroundColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(250,250,252,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        // Línea superior de 1px en gradiente (gradient-hairline)
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: product.hairline,
        },
      }}
    >
      {/* Brillo radial que "cae" desde la línea superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(140,84,255,${isDark ? 0.18 : 0.1}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Fila principal: marca a la izquierda, enlaces a la derecha */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        {/* Caja de marca: logo + wordmark en Valorant sobre gradient-tint */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1.25,
            pr: 2,
            borderRadius: '16px',
            background: isDark
              ? 'linear-gradient(45deg, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.1) 100%)'
              : 'linear-gradient(45deg, rgba(168,85,247,0.05) 0%, rgba(99,102,241,0.05) 100%)',
            border: `1px solid rgba(140,84,255,${isDark ? 0.3 : 0.2})`,
          }}
        >
          <Image
            src="/gycoding.png"
            alt="GYCODING"
            width={26}
            height={26}
            unoptimized
          />
          <Typography
            sx={{
              ...brandFontSx,
              fontSize: '0.95rem',
              mt: '2px',
              color: texts.primary,
            }}
          >
            GyCODING
          </Typography>
        </Box>

        {/* Enlaces con subrayado en gradiente que crece al hacer hover (§6.11) */}
        <Box
          component="nav"
          sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 3, rowGap: 1 }}
        >
          {LINKS.map((link) => (
            <Box
              key={link.href}
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                position: 'relative',
                fontSize: '0.9rem',
                color: texts.secondary,
                transition: 'color 0.2s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -3,
                  height: 2,
                  width: 0,
                  borderRadius: 2,
                  background: product.gradient,
                  transition: 'width 0.3s ease',
                },
                '&:hover': { color: texts.primary },
                '&:hover::after': { width: '100%' },
              }}
            >
              {link.name}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Copyright */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          pb: 3,
        }}
      >
        <Typography
          sx={{
            ...overlineSx(isDark),
            letterSpacing: '0.04em',
            textTransform: 'none',
          }}
        >
          © {new Date().getFullYear()}{' '}
          <Box component="span" sx={{ ...brandFontSx, color: texts.secondary }}>
            GyCODING
          </Box>{' '}
          · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
