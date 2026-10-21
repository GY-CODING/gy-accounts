'use client';

// Loading state of /v2 with the shape of the whole page, so nothing jumps when the profile
// arrives: the stage (the name behind, the card, its caption and actions) and the light sheet
// (section head and the bento). Same sizes and colours as IdentityScene and DashboardV2.
// The shimmer is one gradient moved with transform; reduced motion keeps the blocks still.

import { Box, useTheme as useMuiTheme } from '@mui/material';
import React from 'react';

const shimmer = {
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    transform: 'translateX(-100%)',
    background:
      'linear-gradient(90deg, transparent 0%, var(--sk-shine) 50%, transparent 100%)',
    animation: 'gy-shimmer 1.6s ease-in-out infinite',
  },
  '@keyframes gy-shimmer': { to: { transform: 'translateX(100%)' } },
  '@media (prefers-reduced-motion: reduce)': {
    '&::after': { animation: 'none', display: 'none' },
  },
} as const;

function Block({
  w,
  h,
  r = 10,
  sx,
}: {
  w: number | string | object;
  h: number | string | object;
  r?: number | string | object;
  sx?: object;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        ...shimmer,
        width: w,
        height: h,
        borderRadius: r,
        background: 'var(--sk-block)',
        ...sx,
      }}
    />
  );
}

export default function DashboardSkeleton() {
  const isDark = useMuiTheme().palette.mode === 'dark';
  return (
    <Box aria-busy aria-label="Loading your profile" role="status">
      {/* ─── The stage ─── */}
      <Box
        sx={{
          '--sk-block': isDark
            ? 'rgba(242,240,247,0.07)'
            : 'rgba(20,11,51,0.07)',
          '--sk-shine': isDark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.55)',
          position: 'relative',
          minHeight: '100svh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2.5,
          pt: '56px',
          background: isDark ? '#0c0820' : '#f0ebff',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '120vw',
            maxWidth: 1500,
            aspectRatio: '1.6',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse at center, rgba(140,84,255,0.22) 0%, rgba(140,84,255,0) 60%)',
          }}
        />
        {/* the name behind the card */}
        <Block
          w={{ xs: '78vw', md: 'min(70vw, 1100px)' }}
          h={{ xs: '13vw', md: 'clamp(90px, 11vw, 190px)' }}
          r={{ xs: '14px', md: '24px' }}
          sx={{ position: 'absolute', top: { xs: '15%', md: '10%' } }}
        />
        {/* the card: the real object's colours, its contents as blocks */}
        <Box
          sx={{
            ...shimmer,
            position: 'relative',
            zIndex: 1,
            mt: { xs: '8svh', md: '9svh' },
            width: 'min(86vw, 560px)',
            aspectRatio: '1.586',
            borderRadius: { xs: '20px', md: '28px' },
            background:
              'linear-gradient(150deg, #24104f 0%, #140a33 45%, #0a0620 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
            '--sk-block': 'rgba(245,240,255,0.10)',
            '--sk-shine': 'rgba(255,255,255,0.07)',
            p: { xs: 2.25, md: 3.5 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Block w={{ xs: 96, md: 130 }} h={{ xs: 14, md: 18 }} r="6px" />
            <Block w={32} h={32} r="50%" />
          </Box>
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.75, md: 2.5 },
            }}
          >
            <Block
              w={{ xs: 58, md: 92 }}
              h={{ xs: 58, md: 92 }}
              r="50%"
              sx={{ flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, display: 'grid', gap: 1 }}>
              <Block w="62%" h={{ xs: 22, md: 34 }} r="8px" />
              <Block w="48%" h={{ xs: 11, md: 14 }} r="6px" />
            </Box>
          </Box>
          <Box sx={{ mt: { xs: 1.75, md: 2.75 }, display: 'flex', gap: 0.75 }}>
            <Block w={{ xs: 62, md: 80 }} h={{ xs: 22, md: 28 }} r="8px" />
            <Block w={{ xs: 76, md: 104 }} h={{ xs: 22, md: 28 }} r="8px" />
            <Block w={{ xs: 70, md: 96 }} h={{ xs: 22, md: 28 }} r="8px" />
          </Box>
        </Box>
        {/* caption and actions */}
        <Box
          sx={{
            position: 'relative',
            mt: { xs: 7, md: 8 },
            width: '100%',
            display: 'grid',
            justifyItems: 'center',
            rowGap: 1.25,
          }}
        >
          {/* on phones the caption takes two lines, as the real one does */}
          <Block w={{ xs: '62%', md: 520 }} h={{ xs: 30, md: 44 }} r="10px" />
          <Block
            w="58%"
            h={30}
            r="10px"
            sx={{ display: { xs: 'block', md: 'none' } }}
          />
          <Block
            w={{ xs: '82%', md: 560 }}
            h={{ xs: 16, md: 19 }}
            r="6px"
            sx={{ mt: { xs: 0.5, md: 0 } }}
          />
          <Block
            w="64%"
            h={16}
            r="6px"
            sx={{ display: { xs: 'block', md: 'none' } }}
          />
          <Box
            sx={{
              mt: { xs: 1.75, md: 2.25 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1.5, sm: 3 },
            }}
          >
            <Block w={150} h={52} r="14px" />
            <Block w={170} h={16} r="6px" />
          </Box>
        </Box>
      </Box>

      {/* ─── The light sheet ─── */}
      <Box
        sx={{
          '--sk-block': 'rgba(29,29,31,0.07)',
          '--sk-shine': 'rgba(255,255,255,0.7)',
          px: { xs: '20px', md: '32px' },
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          background: '#f5f5f7',
          borderRadius: { xs: '28px 28px 0 0', md: '40px 40px 0 0' },
          mt: { xs: '-28px', md: '-40px' },
          position: 'relative',
        }}
      >
        <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              columnGap: 4,
              rowGap: 3,
            }}
          >
            <Box
              sx={{ display: 'grid', gap: 2, width: { xs: '100%', md: 640 } }}
            >
              <Block w={70} h={30} r="999px" />
              <Block
                w={{ xs: '90%', md: 560 }}
                h={{ xs: 40, md: 64 }}
                r="12px"
              />
              <Block
                w={{ xs: '80%', md: 520 }}
                h={{ xs: 18, md: 21 }}
                r="6px"
              />
            </Box>
            <Block w={150} h={52} r="14px" />
          </Box>
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              display: 'grid',
              gap: { xs: 1.5, md: 2 },
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
            }}
          >
            <Box
              sx={{
                gridRow: { md: 'span 3' },
                minHeight: { xs: 360, md: 'auto' },
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                background: '#ffffff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Block
                w={{ xs: 104, md: 136 }}
                h={{ xs: 104, md: 136 }}
                r="50%"
              />
              <Box sx={{ mt: 'auto', pt: 4, display: 'grid', gap: 1.25 }}>
                <Block w="60%" h={{ xs: 30, md: 40 }} r="10px" />
                <Block w="70%" h={16} r="6px" />
                <Box sx={{ mt: 1.25, display: 'flex', gap: 0.75 }}>
                  <Block w={80} h={28} r="8px" />
                  <Block w={104} h={28} r="8px" />
                  <Block w={96} h={28} r="8px" />
                </Box>
              </Box>
            </Box>
            {[0, 1, 2].map((k) => (
              <Box
                key={k}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  alignItems: 'center',
                  columnGap: 2,
                  px: { xs: 2.5, md: 3 },
                  py: { xs: 2.25, md: 2.75 },
                  borderRadius: '24px',
                  background: '#ffffff',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                }}
              >
                <Block w={44} h={44} r="14px" />
                <Box sx={{ display: 'grid', gap: 0.75 }}>
                  <Block w={80} h={14} r="5px" />
                  <Block
                    w={['45%', '55%', '70%'][k]}
                    h={{ xs: 22, md: 28 }}
                    r="8px"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
