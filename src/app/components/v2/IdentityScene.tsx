'use client';

// "Your identity, as an object": the GY Accounts card in 3D (references: Apple Card, the Vercel
// Ship badge, Stripe's card renders). The account's name stands huge behind it, like gy-web's
// monument. The scene is pinned: the card shows its front (who you are: photo, name, email,
// roles) and, once the scroll passes the middle of the scene, turns over in one sprung gesture to
// its back (the API key on the magnetic stripe). The turn is not scrubbed by the scroll, so the
// card never rests edge-on. The pointer tilts it and moves a light across its surface.
// Transform and opacity only; reduced motion shows both faces flat.
// Animations paused (the site's pause button, not the OS setting): the card still switches side
// with the scroll, but as a plain opacity crossfade — no 3D turn, no pointer tilt, no light sweep,
// no idle float. Heavier than the rest of the page's decoration, so it gets its own switch.

import { lexendFont, valorantFont } from '@/utils/fonts';
import { ERole } from '@gycoding/nebula';
import { Box } from '@mui/material';
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
import React, { useEffect, useRef, useState } from 'react';
import { RoleChip } from '../atoms/RoleChip';
import { useLook } from './look';

const BRAND = 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)';
const display = {
  fontWeight: 600,
  letterSpacing: '-0.045em',
  textWrap: 'balance',
} as const;
// Lexend, like the rest of the UI: the monument renders whatever the account typed as its
// username, which is not always Latin. Valorant's glyph set doesn't cover, say, Chinese, so a
// name with those characters fell through to Valorant's own (unreliable) fallback. Lexend is the
// font every other string on the page already goes through, so it shares the same, proven
// fallback chain for anything outside its own (Latin) subset.
const monumentFont = {
  fontFamily: lexendFont.style.fontFamily,
  fontWeight: 600,
  letterSpacing: '-0.03em',
} as const;
// Valorant, always "Gy" (its lowercase y is the slanted one). No kerning: its y–C pair touches.
// Only for the studio's own wordmark (the card's logo and the API key panel) — never user data.
const brand = {
  fontFamily: valorantFont.style.fontFamily,
  fontWeight: 400,
  fontSynthesis: 'none',
  fontKerning: 'none',
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
  // Animations paused: the card still switches side with the scroll, but as a plain crossfade
  // instead of a 3D turn, and the pointer no longer tilts it. `flat` on Face/Front/Back is how
  // that crossfade avoids the self-rotation each face normally carries for the 3D trick.
  paused: boolean;
}

function Face({
  children,
  back = false,
  flat = false,
}: {
  children: React.ReactNode;
  back?: boolean;
  flat?: boolean;
}) {
  const L = useLook();
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: { xs: '20px', md: '28px' },
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // The back face carries its own rotateY(180) so the 3D parent spin reads it right side up
        // past the halfway point. A flat crossfade has no parent spin to cancel, so it skips this.
        transform: !flat && back ? 'rotateY(180deg)' : 'none',
        // La tarjeta sigue al tema: oscura sobre el escenario oscuro, clara (con sombra y filete
        // para separarse del blanco) sobre el claro.
        background: L.card.bg,
        color: L.card.ink,
        boxShadow: L.card.ring,
      }}
    >
      {/* fine grid and a violet glow, as on the app's backdrop */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${L.card.grid} 1px, transparent 1px), linear-gradient(90deg, ${L.card.grid} 1px, transparent 1px)`,
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
          background: `radial-gradient(circle, ${L.card.glow} 0%, rgba(168,85,247,0) 65%)`,
        }}
      />
      {children}
    </Box>
  );
}

function Front({ p, flat = false }: { p: SceneProps; flat?: boolean }) {
  const L = useLook();
  const isLogo = !p.picture || p.picture === '/gy-logo.png';
  return (
    <Face flat={flat}>
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
                // The box clips (for the ellipsis), so it must hold descenders (g, y, p):
                // a taller line, pulled back so the layout stays where it was.
                lineHeight: 1.3,
                my: '-0.125em',
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
                lineHeight: 1.4,
                color: L.card.sub,
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
            <RoleChip key={r} role={r} index={i} mode={L.card.chips} />
          ))}
        </Box>
      </Box>
    </Face>
  );
}

function Back({
  p,
  show,
  flat = false,
}: {
  p: SceneProps;
  show: boolean;
  flat?: boolean;
}) {
  const L = useLook();
  return (
    <Face back flat={flat}>
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
        <Box sx={{ fontSize: { xs: 11, md: 13 }, color: L.card.sub }}>
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
            background: L.card.keyBg,
            boxShadow: L.card.keyRing,
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
            color: L.card.sub,
          }}
        >
          <span>Keep it secret — anyone with it can act on your behalf.</span>
          <Box
            component="span"
            sx={{ ...brand, fontSize: { xs: 13, md: 16 }, color: L.card.ink }}
          >
            GyCODING
          </Box>
        </Box>
      </Box>
    </Face>
  );
}

// Layers that share one grid cell (captions, action rows): the active one shows, the others fade
// out and leave the tab order once hidden.
const stack = {
  display: 'grid',
  justifyItems: 'center',
  '& > *': { gridArea: '1 / 1' },
} as const;
const layer = (on: boolean) =>
  ({
    opacity: on ? 1 : 0,
    transform: on ? 'none' : 'translateY(12px)',
    visibility: on ? 'visible' : 'hidden',
    transition: on
      ? 'opacity 0.5s ease 0.15s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, visibility 0s'
      : 'opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0.3s',
  }) as const;

function Caption({ title, line }: { title: string; line: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
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
          mt: 1.25,
          mx: 'auto',
          maxWidth: 620,
          fontSize: { xs: 16, md: 19 },
          lineHeight: 1.45,
          color: 'var(--tone-soft)',
          textWrap: 'balance',
        }}
      >
        {line}
      </Box>
    </Box>
  );
}

const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: 2 },
} as const;

// Every action row under the card: centred, one height, wrapping as one block on phones.
const row = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1.25,
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
    <Box sx={row}>
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
            '&:hover': {
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            },
          }}
        >
          Edit to regenerate ›
        </Box>
      )}
    </Box>
  );
}

// The name behind the card is a wordmark, in Lexend: shown exactly as the account wrote it, no
// brand-specific recasing (that was a Valorant-only trick — see monumentFont above).
const monumentText = (name: string) => name;

// It fills the width it has: long names get smaller instead of being cut.
const monumentSize = (name: string) => {
  const n = Math.max(4, name.length);
  // Lexend 600 averages ≈ 0.62em per glyph (narrower than Valorant was).
  const per = (n * 0.62).toFixed(2);
  return {
    xs: `min(16vw, calc((100vw - 32px) / ${per}))`,
    md: `min(clamp(110px, 13vw, 230px), calc((100vw - 96px) / ${per}))`,
  };
};

const monument = (name: string) =>
  ({
    ...monumentFont,
    fontSize: monumentSize(name),
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }) as const;

export default function IdentityScene(p: SceneProps) {
  const L = useLook();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Which face is up is decided by the scroll; the turn itself is a spring, so it always completes.
  const [backShown, setBackShown] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setBackShown(v > 0.5));
  const flipTarget = useMotionValue(0);
  useEffect(() => flipTarget.set(backShown ? 180 : 0), [backShown, flipTarget]);
  const flip = useSpring(flipTarget, { stiffness: 55, damping: 13, mass: 1 });
  // While it turns the card pulls back a little, like a hand turning it over.
  const lift = useTransform(flip, [0, 90, 180], [1, 0.9, 1]);
  const settle = useTransform(scrollYProgress, [0, 0.15], [0.96, 1]);
  const scale = useTransform(
    [lift, settle] as MotionValue<number>[],
    ([l, s]: number[]) => l * s
  );
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const nameOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.6],
    [1, 1, 0.3]
  );

  // Pointer tilt (desktop), sprung; the light follows it.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 120, damping: 20 });
  const sy = useSpring(ty, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(
    [flip, sx] as MotionValue<number>[],
    ([f, s]: number[]) => f + s * 8
  );
  const rotateX = useTransform(sy, (s) => -s * 6);
  const sheen = useTransform(sx, [-1, 1], ['-60%', '60%']);
  const onMove = (e: React.PointerEvent) => {
    if (p.paused || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    tx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ty.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    tx.set(0);
    ty.set(0);
  };
  // Pausing mid-tilt: snap the springs back to neutral instead of leaving the card leaning.
  useEffect(() => {
    if (p.paused) {
      tx.set(0);
      ty.set(0);
    }
  }, [p.paused, tx, ty]);

  const card = { width: 'min(86vw, 560px)', aspectRatio: '1.586' } as const;

  const editButton = (
    <Box
      component="button"
      onClick={p.onEdit}
      sx={{
        ...pill,
        height: 52,
        px: 3.5,
        fontSize: 17,
        color: '#fff',
        background: BRAND,
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      Edit profile
    </Box>
  );

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
          aria-label={p.username}
          sx={{ m: 0, ...monument(p.username) }}
        >
          {monumentText(p.username)}
        </Box>
        <Box sx={{ ...card, position: 'relative' }}>
          <Front p={p} />
        </Box>
        {editButton}
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
        height: { xs: '240svh', md: '260svh' },
        // El escenario lleva el color de la portada de su tema, así la hoja que viene después
        // (en el tono opuesto) enseña sus hombros redondeados contra él.
        background: L.tone.hero.bg,
        color: L.tone.hero.ink,
        '--tone-soft': L.tone.hero.soft,
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
          pt: '56px',
          '@keyframes gy-float': {
            from: { transform: 'translateY(3px)' },
            to: { transform: 'translateY(-5px)' },
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
            background: `radial-gradient(ellipse at center, ${L.stage.glow} 0%, rgba(140,84,255,0) 62%)`,
            pointerEvents: 'none',
          }}
        />

        {/* the account's name as a monument behind the card (the real h1) */}
        <Box
          component={motion.h1}
          style={{ y: nameY, opacity: nameOpacity }}
          aria-label={p.username}
          sx={{
            position: 'absolute',
            top: { xs: '16%', md: '11%' },
            left: 0,
            right: 0,
            m: 0,
            textAlign: 'center',
            ...monument(p.username),
            color: L.stage.monument,
          }}
        >
          {monumentText(p.username)}
        </Box>

        {/* the card */}
        <Box
          sx={{
            position: 'relative',
            mt: { xs: '8svh', md: '9svh' },
            perspective: p.paused ? 'none' : '1800px',
            zIndex: 1,
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <Box
              sx={{
                animation: p.paused
                  ? 'none'
                  : 'gy-float 5s ease-in-out infinite alternate',
              }}
            >
              {p.paused ? (
                // Paused: the card still switches side with the scroll, but as a plain
                // crossfade — no 3D spin, no pointer tilt, no light sweep.
                <Box sx={{ ...card, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: backShown ? 0 : 1,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: backShown ? 'none' : 'auto',
                    }}
                  >
                    <Front p={p} flat />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: backShown ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: backShown ? 'auto' : 'none',
                    }}
                  >
                    <Back p={p} show={show} flat />
                  </Box>
                </Box>
              ) : (
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
                          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          {/* shadow on the floor */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: '12%',
              right: '12%',
              bottom: -36,
              height: 28,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${L.stage.floor} 0%, rgba(20,11,51,0) 70%)`,
            }}
          />
        </Box>

        {/* Under the card: the caption, then its actions, each a stack of two layers (front / back). */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 720,
            mt: { xs: 7, md: 8 },
            display: 'grid',
            justifyItems: 'center',
            rowGap: { xs: 3, md: 3.5 },
          }}
        >
          <Box sx={stack}>
            <Box sx={layer(!backShown)} aria-hidden={backShown}>
              <Caption
                title="One identity, every product"
                line="Your GY account signs you in to everything GYCODING makes."
              />
            </Box>
            <Box sx={layer(backShown)} aria-hidden={!backShown}>
              <Caption
                title="Your key to the APIs"
                line="The back of the card: the key to build on GYCODING's services."
              />
            </Box>
          </Box>
          <Box sx={stack}>
            <Box
              sx={{
                ...layer(!backShown),
                ...row,
                flexDirection: { xs: 'column', sm: 'row' },
                columnGap: 3,
                rowGap: 1.5,
              }}
            >
              {editButton}
              <Box
                component="span"
                sx={{ fontSize: 15, color: 'var(--tone-soft)' }}
              >
                Scroll to turn the card ↓
              </Box>
            </Box>
            <Box sx={layer(backShown)}>
              <KeyControls p={p} show={show} setShow={setShow} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
