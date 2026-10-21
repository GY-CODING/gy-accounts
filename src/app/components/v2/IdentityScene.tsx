'use client';

// "Your identity, as an object": the GY Accounts card in 3D (references: Apple Card, the Vercel
// Ship badge, Stripe's card renders). The account's name stands huge behind it, like gy-web's
// monument. The scene is pinned: as the page scrolls the card arrives, holds its front (who you
// are: photo, name, email, roles), then turns over to its back (the API key on the magnetic
// stripe), with the key's controls appearing under it. The pointer tilts the card and moves a
// light across its surface. Transform and opacity only; reduced motion shows both faces flat.

import { valorantFont } from '@/utils/fonts';
import { ERole } from '@gycoding/nebula';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { RoleChip } from '../atoms/RoleChip';

const BRAND = 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)';
const display = {
  fontWeight: 600,
  letterSpacing: '-0.045em',
  textWrap: 'balance',
} as const;
const brand = {
  fontFamily: valorantFont.style.fontFamily,
  fontWeight: 400,
  fontSynthesis: 'none',
} as const;

export interface SceneProps {
  username: string;
  email: string;
  picture?: string;
  roles: ERole[];
  apiKey: string;
  isEditing: boolean;
  regenerating: boolean;
  onEdit: () => void;
  onRegenerate: () => void;
}

function Face({
  children,
  back = false,
}: {
  children: React.ReactNode;
  back?: boolean;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: { xs: '20px', md: '28px' },
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : 'none',
        // A dark violet object, the same in light and dark themes.
        background:
          'linear-gradient(150deg, #24104f 0%, #140a33 45%, #0a0620 100%)',
        color: '#f5f0ff',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
      }}
    >
      {/* fine grid and a violet glow, as on the app's backdrop */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(#8C54FF1c 1px, transparent 1px), linear-gradient(90deg, #8C54FF1c 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 80% 0%, black 10%, transparent 70%)',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          right: '-20%',
          top: '-40%',
          width: '80%',
          aspectRatio: '1',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0) 65%)',
        }}
      />
      {children}
    </Box>
  );
}

function Front({ p }: { p: SceneProps }) {
  const isLogo = !p.picture || p.picture === '/gy-logo.png';
  return (
    <Face>
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          p: { xs: 2.25, md: 3.5 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            component="span"
            sx={{
              ...brand,
              fontSize: { xs: 15, md: 20 },
              letterSpacing: '0.04em',
            }}
          >
            Gy ACCOUNTS
          </Box>
          <Image src="/gy-logo.png" alt="" width={32} height={32} />
        </Box>
        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.75, md: 2.5 },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 58, md: 92 },
              aspectRatio: '1',
              borderRadius: '50%',
              p: '3px',
              background: BRAND,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              {p.picture && (
                <Image
                  src={p.picture}
                  alt=""
                  fill
                  sizes="92px"
                  unoptimized
                  style={{
                    objectFit: isLogo ? 'contain' : 'cover',
                    padding: isLogo ? '16%' : 0,
                  }}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                ...display,
                fontSize: { xs: 24, md: 38 },
                lineHeight: 1.05,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.username || '—'}
            </Box>
            <Box
              sx={{
                mt: 0.5,
                fontSize: { xs: 12, md: 15 },
                color: '#c9bdf0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.email}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: { xs: 1.75, md: 2.75 },
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            '& > *': {
              transform: { xs: 'scale(0.85)', md: 'none' },
              transformOrigin: 'left center',
            },
          }}
        >
          {p.roles.map((r, i) => (
            <RoleChip key={r} role={r} index={i} />
          ))}
        </Box>
      </Box>
    </Face>
  );
}

function Back({ p, show }: { p: SceneProps; show: boolean }) {
  return (
    <Face back>
      {/* the magnetic stripe */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: { xs: '14%', md: '15%' },
          height: { xs: '22%', md: '21%' },
          background: 'linear-gradient(180deg, #050208 0%, #120a22 100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 18, md: 28 },
          right: { xs: 18, md: 28 },
          bottom: { xs: 16, md: 26 },
        }}
      >
        <Box sx={{ fontSize: { xs: 11, md: 13 }, color: '#c9bdf0' }}>
          API key
        </Box>
        <Box
          component="code"
          sx={{
            display: 'block',
            mt: 0.75,
            px: { xs: 1.5, md: 2 },
            py: { xs: 1, md: 1.5 },
            borderRadius: '12px',
            background: '#f5f0ff',
            color: '#1a0b3d',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: { xs: 12, md: 17 },
            letterSpacing: show ? '0.01em' : '0.2em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {show ? p.apiKey : '•'.repeat(28)}
        </Box>
        <Box
          sx={{
            mt: 1.25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: { xs: 11, md: 13 },
            color: '#c9bdf0',
          }}
        >
          <span>Keep it secret — anyone with it can act on your behalf.</span>
          <Box
            component="span"
            sx={{ ...brand, fontSize: { xs: 13, md: 16 }, color: '#f5f0ff' }}
          >
            GyCODING
          </Box>
        </Box>
      </Box>
    </Face>
  );
}

// A caption that holds the stage for one phase of the scroll.
function Caption({
  progress,
  range,
  title,
  line,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  title: string;
  line: string;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [24, 0, 0, -24]);
  return (
    <Box
      component={motion.div}
      style={{ opacity, y }}
      sx={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}
    >
      <Box
        component="h2"
        sx={{
          m: 0,
          ...display,
          fontSize: { xs: 30, md: 44 },
          lineHeight: 1.05,
        }}
      >
        {title}
      </Box>
      <Box
        component="p"
        sx={{
          m: 0,
          mt: 1,
          mx: 'auto',
          maxWidth: 560,
          fontSize: { xs: 16, md: 19 },
          color: 'var(--tone-soft)',
        }}
      >
        {line}
      </Box>
    </Box>
  );
}

const pill = {
  height: 44,
  px: 2.25,
  border: 0,
  borderRadius: '14px',
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  color: 'inherit',
  background: 'color-mix(in srgb, currentColor 10%, transparent)',
  transition: 'background-color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    background: 'color-mix(in srgb, currentColor 16%, transparent)',
  },
  '&:active': { transform: 'scale(0.95)' },
  '&:focus-visible': { outline: '2px solid currentColor' },
} as const;

function KeyControls({
  p,
  show,
  setShow,
}: {
  p: SceneProps;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(p.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box component="button" onClick={() => setShow(!show)} sx={pill}>
        {show ? 'Hide key' : 'Show key'}
      </Box>
      <Box component="button" onClick={copy} sx={pill}>
        <span
          aria-live="polite"
          style={{ color: copied ? '#22c55e' : undefined }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </Box>
      {p.isEditing ? (
        <Box
          component="button"
          onClick={p.onRegenerate}
          disabled={p.regenerating}
          sx={{ ...pill, color: '#fff', background: BRAND, '&:hover': {} }}
        >
          {p.regenerating ? 'Regenerating…' : 'Regenerate'}
        </Box>
      ) : (
        <Box
          component="button"
          onClick={p.onEdit}
          sx={{
            ...pill,
            background: 'transparent',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Edit to regenerate ›
        </Box>
      )}
    </Box>
  );
}

export default function IdentityScene(p: SceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDark = useMuiTheme().palette.mode === 'dark';
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Choreography over the pinned scroll.
  const flip = useTransform(scrollYProgress, [0.42, 0.68], [0, 180]);
  const enterX = useTransform(scrollYProgress, [0, 0.18], [18, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.55, 1],
    [0.94, 1, 1.04, 1]
  );
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const nameOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.75],
    [1, 1, 0.35]
  );
  const controlsO = useTransform(scrollYProgress, [0.68, 0.76], [0, 1]);
  const introO = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const [backShown, setBackShown] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setBackShown(v > 0.7));

  // Pointer tilt (desktop), sprung; the light follows it.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 140, damping: 18 });
  const sy = useSpring(ty, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(
    [flip, sx] as MotionValue<number>[],
    ([f, s]: number[]) => f + s * 10
  );
  const rotateX = useTransform(
    [enterX, sy] as MotionValue<number>[],
    ([e, s]: number[]) => e - s * 8
  );
  const sheen = useTransform(sx, [-1, 1], ['-60%', '60%']);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    tx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ty.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    tx.set(0);
    ty.set(0);
  };

  const card = { width: 'min(86vw, 560px)', aspectRatio: '1.586' } as const;

  if (reduce) {
    // Both faces, flat, one under the other.
    return (
      <Box
        component="section"
        data-tone="hero"
        aria-label="Your GY Accounts card"
        sx={{
          px: 2.5,
          pt: 14,
          pb: 10,
          display: 'grid',
          justifyItems: 'center',
          gap: 3,
        }}
      >
        <Box
          component="h1"
          sx={{ m: 0, ...display, fontSize: { xs: 52, md: 96 } }}
        >
          {p.username}
        </Box>
        <Box sx={{ ...card, position: 'relative' }}>
          <Front p={p} />
        </Box>
        <Box
          sx={{
            ...card,
            position: 'relative',
            '& > div': { transform: 'none' },
          }}
        >
          <Back p={p} show={show} />
        </Box>
        <KeyControls p={p} show={show} setShow={setShow} />
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      component="section"
      data-tone="hero"
      aria-label="Your GY Accounts card"
      sx={{
        height: { xs: '260svh', md: '300svh' },
        // The stage keeps its own colours, so the light sheet that follows shows its rounded
        // shoulders against it and the captions stay readable while the page changes tone.
        background: isDark ? '#0c0820' : '#f0ebff',
        color: isDark ? '#f2f0f7' : '#140b33',
        '--tone-soft': isDark ? '#b3abd0' : '#5a5375',
      }}
    >
      <Box
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        sx={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2.5,
          '@keyframes gy-sway': {
            from: { transform: 'rotate(-1.5deg) translateY(4px)' },
            to: { transform: 'rotate(1.5deg) translateY(-6px)' },
          },
        }}
      >
        {/* glow behind the stage */}
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
              'radial-gradient(ellipse at center, rgba(140,84,255,0.30) 0%, rgba(140,84,255,0) 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* the account's name as a monument behind the card (the real h1) */}
        <Box
          component={motion.h1}
          style={{ y: nameY, opacity: nameOpacity }}
          sx={{
            position: 'absolute',
            top: { xs: '14%', md: '9%' },
            left: 0,
            right: 0,
            m: 0,
            textAlign: 'center',
            ...display,
            fontSize: { xs: '19vw', md: 'clamp(120px, 15vw, 260px)' },
            lineHeight: 0.9,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'clip',
            color: 'color-mix(in srgb, var(--tone-ink) 90%, transparent)',
          }}
        >
          {p.username}
        </Box>

        {/* the card */}
        <Box
          sx={{
            position: 'relative',
            mt: { xs: '12svh', md: '10svh' },
            perspective: '1400px',
            zIndex: 1,
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 80, rotateX: 30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <Box
              sx={{ animation: 'gy-sway 6s ease-in-out infinite alternate' }}
            >
              <Box
                component={motion.div}
                style={{ rotateY, rotateX, scale }}
                sx={{
                  ...card,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                }}
              >
                <Front p={p} />
                <Back p={p} show={show} />
                {/* light across the surface, following the pointer */}
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: { xs: '20px', md: '28px' },
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    transform: 'translateZ(1px)',
                  }}
                >
                  <Box
                    component={motion.div}
                    style={{ x: sheen }}
                    sx={{
                      position: 'absolute',
                      top: '-50%',
                      bottom: '-50%',
                      left: '20%',
                      width: '45%',
                      transform: 'rotate(20deg)',
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 100%)',
                      mixBlendMode: 'screen',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {/* shadow on the floor */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              bottom: -40,
              height: 30,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at center, rgba(10,0,30,0.55) 0%, rgba(10,0,30,0) 70%)',
              filter: 'none',
            }}
          />
        </Box>

        {/* captions and controls under the card */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 720,
            height: { xs: 200, md: 150 },
            mt: { xs: 6, md: 7 },
          }}
        >
          <Caption
            progress={scrollYProgress}
            range={[-0.01, 0.0, 0.32, 0.42]}
            title="One identity, every product"
            line="Your GY account signs you in to everything GYCODING makes."
          />
          <Caption
            progress={scrollYProgress}
            range={[0.66, 0.74, 1.01, 1.02]}
            title="Your key to the APIs"
            line="Turn the card over: the key to build on GYCODING's services."
          />
          <Box
            component={motion.div}
            style={{ opacity: controlsO }}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: { xs: 136, md: 100 },
              pointerEvents: backShown ? 'auto' : 'none',
            }}
            aria-hidden={!backShown}
          >
            <KeyControls p={p} show={show} setShow={setShow} />
          </Box>
          {/* first screen: the way into editing, and a hint to scroll */}
          <Box
            component={motion.div}
            style={{ opacity: introO }}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: { xs: 136, md: 100 },
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              alignItems: 'center',
              pointerEvents: backShown ? 'none' : 'auto',
            }}
          >
            <Box
              component="button"
              onClick={p.onEdit}
              sx={{
                height: 52,
                px: 3.5,
                border: 0,
                borderRadius: '14px',
                fontFamily: 'inherit',
                fontSize: 17,
                fontWeight: 600,
                color: '#fff',
                background: BRAND,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' },
                '&:active': { transform: 'scale(0.95)' },
                '&:focus-visible': {
                  outline: '2px solid currentColor',
                  outlineOffset: 3,
                },
              }}
            >
              Edit profile
            </Box>
            <Box
              component="span"
              sx={{ fontSize: 15, color: 'var(--tone-soft)' }}
            >
              Scroll to turn the card ↓
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
