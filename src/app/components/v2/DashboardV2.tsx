'use client';

// GY Accounts dashboard, prototype in the gy-web /v2 language ("exhibition"): a thin bar, a short
// identity poster, then two chapters — personal information (light) and API access (dark). The
// page's ground and ink ease to the tone of the chapter at the middle of the screen, as on gy-web.
// Compact on purpose: it is a dashboard to see and edit a profile, not a landing page.
//
// Logic is the current dashboard's, unchanged (hooks/useUser: profile, update, API key refresh;
// same phone validation and the same toasts). Only the presentation is new.
// Development only: /v2?demo shows the GYCODING account from the app's capture with no API calls.

import { useUser as useUserGY } from '@/hooks/useUser';
import { ESeverity } from '@/utils/constants/ESeverity';
import { valorantFont } from '@/utils/fonts';
import { toBase64 } from '@/utils/global';
import { filterVisibleRoles } from '@/utils/roles';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ERole, UserProfile } from '@gycoding/nebula';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import AnimatedAlert from '../atoms/Alert';
import { RoleChip } from '../atoms/RoleChip';
import { useTheme } from '../organisms/ThemeContext';

const ease = [0.16, 1, 0.3, 1] as const;
const BRAND = 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)';
const MARGIN = { xs: '20px', md: '32px' };
const SOFT = 'var(--tone-soft)';
const display = {
  fontWeight: 600,
  letterSpacing: '-0.045em',
  textWrap: 'balance',
} as const;

type Tone = 'hero' | 'info' | 'api';
const toneColors = (tone: Tone, dark: boolean) =>
  tone === 'hero'
    ? dark
      ? { bg: '#0c0820', ink: '#f2f0f7', soft: '#b3abd0' }
      : { bg: '#f0ebff', ink: '#140b33', soft: '#5a5375' }
    : tone === 'info'
      ? { bg: '#f5f5f7', ink: '#1d1d1f', soft: '#6e6e73' }
      : { bg: '#07070b', ink: '#f5f5f7', soft: '#a1a1a6' };

const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.8, delay, ease },
});

// ─── Demo data (development only, /v2?demo) ────────────────────────────────────
const DEMO_USER: UserProfile = {
  username: 'GYCODING',
  email: 'gycoding05@gmail.com',
  phoneNumber: '+34 123456780',
  roles: [ERole.ADMIN, ERole.DEVELOPER, ERole.COMMON],
  picture: '/gy-logo.png',
  apiKey: 'gy_demo_0000000000000000000000',
};

function useDemoFlag() {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    setDemo(
      process.env.NODE_ENV === 'development' &&
        new URLSearchParams(window.location.search).has('demo')
    );
  }, []);
  return demo;
}

// Same shape as hooks/useUser, backed by local state.
function useDemoUser() {
  const [data, setData] = useState<UserProfile>(DEMO_USER);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdatedAPIKEY, setIsUpdatedAPIKEY] = useState(false);
  const [isLoadingUpdate, setLoading] = useState(false);
  const [isUpdatingAPIKEY, setUpdatingKey] = useState(false);
  const wait = () => new Promise((r) => setTimeout(r, 700));
  return {
    data,
    isLoading: false,
    update: async (d: UserProfile) => {
      setLoading(true);
      await wait();
      setData(d);
      setLoading(false);
      setIsUpdated(true);
    },
    isLoadingUpdate,
    isErrorUpdate: false,
    setIsErrorUpdate: () => {},
    isUpdated,
    setIsUpdated,
    refreshApiKey: async () => {
      setUpdatingKey(true);
      await wait();
      setData((d) => ({
        ...d,
        apiKey: `gy_demo_${Math.random().toString(16).slice(2, 24)}`,
      }));
      setUpdatingKey(false);
      setIsUpdatedAPIKEY(true);
    },
    isUpdatingAPIKEY,
    isErrorUpdateAPIKEY: false,
    setIsErrorUpdateAPIKEY: () => {},
    isUpdatedAPIKEY,
    setIsUpdatedAPIKEY,
  };
}

// ─── Small parts ───────────────────────────────────────────────────────────────
function Avatar({
  src,
  size,
  editing,
  onPick,
}: {
  src?: string;
  size: object;
  editing: boolean;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const isLogo = !src || src === '/gy-logo.png';
  return (
    <Box
      component={editing ? 'label' : 'div'}
      sx={{
        position: 'relative',
        display: 'block',
        width: size,
        aspectRatio: '1',
        borderRadius: '50%',
        p: '4px',
        background: BRAND,
        boxShadow: '0 30px 60px -20px #8C54FF99',
        cursor: editing ? 'pointer' : 'default',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': editing ? { transform: 'scale(1.04)' } : {},
        '&:focus-within': {
          outline: '2px solid currentColor',
          outlineOffset: 4,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="200px"
            unoptimized
            style={{
              objectFit: isLogo ? 'contain' : 'cover',
              padding: isLogo ? '18%' : 0,
            }}
          />
        ) : null}
        <AnimatePresence>
          {editing && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(10,0,32,0.5)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Change photo
            </Box>
          )}
        </AnimatePresence>
      </Box>
      {editing && (
        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          aria-label="Change photo"
        />
      )}
    </Box>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        '&:hover': disabled ? {} : { transform: 'translateY(-2px)' },
        '&:active': disabled ? {} : { transform: 'scale(0.95)' },
        '&:focus-visible': {
          outline: '2px solid currentColor',
          outlineOffset: 3,
        },
      }}
    >
      {children}
    </Box>
  );
}

function TextButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <Box
      component={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      sx={{
        border: 0,
        background: 'none',
        p: 0,
        fontFamily: 'inherit',
        fontSize: 17,
        fontWeight: 600,
        color: 'inherit',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline', textUnderlineOffset: '5px' },
        '&:focus-visible': {
          outline: '2px solid currentColor',
          outlineOffset: 3,
          borderRadius: '4px',
        },
      }}
    >
      {children}
    </Box>
  );
}

// One row of the information chapter: label on the left, the value large; an input when editing.
function InfoRow({
  label,
  value,
  editing = false,
  locked = false,
  onChange,
  error,
  hint,
  inputProps,
}: {
  label: string;
  value: string;
  editing?: boolean;
  locked?: boolean;
  onChange?: (v: string) => void;
  error?: string;
  hint?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Box
      component={motion.div}
      layout
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
        alignItems: 'center',
        columnGap: 4,
        rowGap: 0.75,
        px: { xs: 3, md: 4 },
        py: { xs: 2.5, md: 3 },
        borderRadius: '24px',
        // White card with its own ink, so it stays readable while the page changes tone.
        background: '#ffffff',
        color: '#1d1d1f',
        '--tone-soft': '#6e6e73',
        boxShadow: editing && !locked ? '0 0 0 2px #8C54FF' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Box component="label" htmlFor={id} sx={{ fontSize: 17, color: SOFT }}>
        {label}
        {locked && editing && (
          <Box component="span" sx={{ ml: 1, fontSize: 13 }}>
            · read only
          </Box>
        )}
      </Box>
      {editing && !locked ? (
        <Box>
          <Box
            component="input"
            id={id}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange?.(e.target.value)
            }
            spellCheck={false}
            {...inputProps}
            sx={{
              width: '100%',
              border: 0,
              outline: 'none',
              background: 'transparent',
              p: 0,
              fontFamily: 'inherit',
              ...display,
              fontSize: { xs: 24, md: 32 },
              color: 'inherit',
              caretColor: '#8C54FF',
            }}
          />
          {(error || hint) && (
            <Box
              sx={{ mt: 0.5, fontSize: 14, color: error ? '#dc2626' : SOFT }}
            >
              {error || hint}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          id={id}
          sx={{
            ...display,
            fontSize: { xs: 24, md: 32 },
            lineHeight: 1.15,
            minWidth: 0,
            overflowWrap: 'anywhere',
            opacity: locked && editing ? 0.5 : 1,
          }}
        >
          {value || '—'}
        </Box>
      )}
    </Box>
  );
}

// ─── The page ──────────────────────────────────────────────────────────────────
export default function DashboardV2() {
  const demo = useDemoFlag();
  const real = useUserGY();
  const fake = useDemoUser();
  const u = demo ? fake : real;
  const { user } = useUser();
  const gyUser = u.data;
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const { toggleTheme } = useTheme();

  // Tone engine (as gy-web /v2): the chapter at the middle line sets the page colours.
  const mainRef = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<Tone>('hero');
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) =>
            e.isIntersecting &&
            setTone((e.target as HTMLElement).dataset.tone as Tone)
        ),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    root.querySelectorAll('[data-tone]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [gyUser]);
  const t = toneColors(tone, isDark);

  // Editing state (same rules as the current dashboard).
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [edit, setEdit] = useState<UserProfile | null>(null);
  const [phoneError, setPhoneError] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const isPhoneValid =
    !isEditing || /^\+\d{1,4} \d+$/.test((edit?.phoneNumber ?? '').trim());

  const startEdit = () => {
    if (!gyUser) return;
    setEdit({ ...gyUser });
    setIsEditing(true);
    infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setEdit(null);
    setImageFile(null);
    setPhoneError(false);
  };
  const save = async () => {
    if (!edit) return;
    if (!isPhoneValid) return setPhoneError(true);
    try {
      const picture = imageFile ? await toBase64(imageFile) : edit.picture;
      await u.update({ ...edit, picture });
      setIsEditing(false);
      setImageFile(null);
    } catch {
      /* the hook raises the error toast */
    }
  };
  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !edit) return;
    setImageFile(file);
    setEdit({ ...edit, picture: URL.createObjectURL(file) });
  };
  const copyKey = async () => {
    if (!gyUser?.apiKey) return;
    await navigator.clipboard.writeText(gyUser.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!isEditing) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cancelEdit();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEditing]);

  const view = isEditing && edit ? edit : gyUser;
  const roles = filterVisibleRoles(
    gyUser?.roles as string[] | undefined
  ) as ERole[];
  const email = user?.email ?? gyUser?.email ?? '';

  return (
    <Box
      ref={mainRef}
      style={
        {
          '--tone-bg': t.bg,
          '--tone-ink': t.ink,
          '--tone-soft': t.soft,
        } as React.CSSProperties
      }
      sx={{
        minHeight: '100dvh',
        background: 'var(--tone-bg)',
        color: 'var(--tone-ink)',
        transition:
          'background-color 0.9s cubic-bezier(0.16, 1, 0.3, 1), color 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {/* ─── Bar ─── */}
      <Box
        component="nav"
        aria-label="GY Accounts"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          height: 56,
          px: MARGIN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'color-mix(in srgb, var(--tone-bg) 84%, transparent)',
          backdropFilter: 'saturate(180%) blur(20px)',
          transition: 'background-color 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Box
          component="a"
          href="https://gycoding.com"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <Image src="/gy-logo.png" alt="GYCODING" width={26} height={26} />
          <Box
            component="span"
            sx={{
              fontFamily: valorantFont.style.fontFamily,
              fontWeight: 400,
              fontSynthesis: 'none',
              fontSize: 18,
              letterSpacing: '0.04em',
            }}
          >
            Gy ACCOUNTS
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, md: 2.5 },
          }}
        >
          <Box
            component="button"
            onClick={toggleTheme}
            aria-label="Switch light and dark"
            title="Switch light and dark"
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              border: 0,
              borderRadius: '12px',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              '&:focus-visible': { outline: '2px solid currentColor' },
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
            </svg>
          </Box>
          {gyUser && (
            <Box
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                alignItems: 'center',
                gap: 1,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 26,
                  height: 26,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                {gyUser.picture && (
                  <Image
                    src={gyUser.picture}
                    alt=""
                    fill
                    sizes="26px"
                    unoptimized
                    style={{
                      objectFit:
                        gyUser.picture === '/gy-logo.png' ? 'contain' : 'cover',
                      padding: gyUser.picture === '/gy-logo.png' ? 3 : 0,
                    }}
                  />
                )}
              </Box>
              {gyUser.username}
            </Box>
          )}
          <TextButton href="/api/auth/logout">Log out</TextButton>
        </Box>
      </Box>

      {/* ─── Identity poster ─── */}
      <Box
        component="section"
        data-tone="hero"
        aria-labelledby="who"
        sx={{
          minHeight: { xs: '86svh', md: '84svh' },
          px: MARGIN,
          pt: { xs: 12, md: 12 },
          pb: { xs: 8, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '@keyframes gy-float': {
            from: { transform: 'translateY(0)' },
            to: { transform: 'translateY(-10px)' },
          },
        }}
      >
        {/* soft glow in the product colour */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            width: '120vw',
            maxWidth: 1400,
            aspectRatio: '2',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(ellipse at center, rgba(140,84,255,0.28) 0%, rgba(140,84,255,0) 62%)',
            pointerEvents: 'none',
          }}
        />
        {u.isLoading || (!gyUser && !demo && real.isLoading) ? (
          <Box sx={{ display: 'grid', placeItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(140,84,255,0.15)',
              }}
            />
            <Box
              sx={{
                width: 260,
                height: 48,
                borderRadius: '14px',
                background: 'rgba(140,84,255,0.12)',
              }}
            />
            <Box
              sx={{
                width: 200,
                height: 18,
                borderRadius: '8px',
                background: 'rgba(140,84,255,0.1)',
              }}
            />
          </Box>
        ) : !gyUser ? (
          <Box sx={{ position: 'relative' }}>
            <Box
              component="h1"
              sx={{
                m: 0,
                ...display,
                fontSize: { xs: 44, md: 72 },
                lineHeight: 1,
              }}
            >
              We couldn&apos;t load your profile
            </Box>
            <Box component="p" sx={{ m: 0, mt: 2, fontSize: 20, color: SOFT }}>
              Try signing in again.
            </Box>
            <Box sx={{ mt: 4 }}>
              <Box
                component="a"
                href="/api/auth/login"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 52,
                  px: 3.5,
                  borderRadius: '14px',
                  background: BRAND,
                  color: '#fff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease }}
            >
              <Box
                sx={{
                  animation: 'gy-float 5s ease-in-out infinite alternate',
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                }}
              >
                <Avatar
                  src={view?.picture}
                  size={{ xs: 132, md: 168 }}
                  editing={isEditing}
                  onPick={pickImage}
                />
              </Box>
            </Box>
            <Box
              component={motion.h1}
              id="who"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.1 }}
              sx={{
                m: 0,
                mt: { xs: 3.5, md: 4.5 },
                ...display,
                fontSize: { xs: 52, md: 'clamp(64px, 8vw, 128px)' },
                lineHeight: 0.95,
                overflowWrap: 'anywhere',
              }}
            >
              {view?.username || '—'}
            </Box>
            <Box
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              sx={{ m: 0, mt: 2, fontSize: { xs: 18, md: 22 }, color: SOFT }}
            >
              {email}
            </Box>
            {roles.length > 0 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                sx={{
                  mt: 3,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                {roles.map((r, i) => (
                  <RoleChip key={r} role={r} index={i} />
                ))}
              </Box>
            )}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.45 }}
              sx={{
                mt: 5,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 3.5,
                rowGap: 2,
              }}
            >
              {isEditing ? (
                <TextButton onClick={cancelEdit}>Cancel editing</TextButton>
              ) : (
                <PrimaryButton onClick={startEdit}>Edit profile</PrimaryButton>
              )}
              <TextButton
                onClick={() =>
                  document
                    .getElementById('api')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                API access ›
              </TextButton>
            </Box>
          </Box>
        )}
      </Box>

      {gyUser && view && (
        <>
          {/* ─── Personal information (light chapter) ─── */}
          <Box
            ref={infoRef}
            component="section"
            data-tone="info"
            aria-labelledby="info-title"
            sx={{ px: MARGIN, py: { xs: 8, md: 10 }, scrollMarginTop: '56px' }}
          >
            <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
              <Box
                component={motion.h2}
                {...enter()}
                id="info-title"
                sx={{
                  m: 0,
                  ...display,
                  fontSize: { xs: 40, md: 64 },
                  lineHeight: 1,
                }}
              >
                Personal information
              </Box>
              <Box
                component={motion.p}
                {...enter(0.06)}
                sx={{ m: 0, mt: 2, fontSize: { xs: 18, md: 22 }, color: SOFT }}
              >
                This is how you appear across every GYCODING product.
              </Box>
              <Box
                component={motion.div}
                {...enter(0.12)}
                sx={{ mt: { xs: 5, md: 7 }, display: 'grid', gap: 1.5 }}
              >
                <InfoRow
                  label="Username"
                  value={view.username}
                  editing={isEditing}
                  onChange={(v) =>
                    setEdit((d) => (d ? { ...d, username: v } : d))
                  }
                  inputProps={{ autoComplete: 'username', name: 'username' }}
                />
                <InfoRow
                  label="Phone"
                  value={view.phoneNumber}
                  editing={isEditing}
                  onChange={(v) =>
                    setEdit((d) => (d ? { ...d, phoneNumber: v } : d))
                  }
                  error={
                    isEditing && !isPhoneValid
                      ? 'Format: +XX number (e.g. +34 605624408)'
                      : undefined
                  }
                  hint={
                    isEditing ? 'Prefix, a space, then the number.' : undefined
                  }
                  inputProps={{
                    type: 'tel',
                    inputMode: 'tel',
                    autoComplete: 'tel',
                    name: 'phone',
                  }}
                />
                <InfoRow
                  label="Email"
                  value={email}
                  editing={isEditing}
                  locked
                />
              </Box>
            </Box>
          </Box>

          {/* ─── API access (dark chapter) ─── */}
          <Box
            id="api"
            component="section"
            data-tone="api"
            aria-labelledby="api-title"
            sx={{ px: MARGIN, py: { xs: 8, md: 10 }, scrollMarginTop: '56px' }}
          >
            <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
              <Box
                component={motion.h2}
                {...enter()}
                id="api-title"
                sx={{
                  m: 0,
                  ...display,
                  fontSize: { xs: 40, md: 64 },
                  lineHeight: 1,
                }}
              >
                API access
              </Box>
              <Box
                component={motion.p}
                {...enter(0.06)}
                sx={{
                  m: 0,
                  mt: 2,
                  maxWidth: 680,
                  fontSize: { xs: 18, md: 22 },
                  lineHeight: 1.45,
                  color: SOFT,
                }}
              >
                Use this key to authenticate requests to the GYCODING APIs. Keep
                it secret — anyone with it can act on your behalf.
              </Box>
              <Box
                component={motion.div}
                {...enter(0.12)}
                sx={{
                  mt: { xs: 5, md: 7 },
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 2.5, md: 3.5 },
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  component="code"
                  aria-label="API key"
                  sx={{
                    flex: '1 1 320px',
                    minWidth: 0,
                    fontFamily: 'ui-monospace, Menlo, monospace',
                    fontSize: { xs: 16, md: 22 },
                    letterSpacing: showKey ? '0.01em' : '0.18em',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {showKey
                    ? gyUser.apiKey
                    : '•'.repeat(Math.min(32, gyUser.apiKey?.length || 32))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    {
                      label: showKey ? 'Hide' : 'Show',
                      onClick: () => setShowKey((s) => !s),
                    },
                    { label: copied ? 'Copied!' : 'Copy', onClick: copyKey },
                  ].map((b) => (
                    <Box
                      key={b.label}
                      component="button"
                      onClick={b.onClick}
                      sx={{
                        height: 44,
                        px: 2.25,
                        border: 0,
                        borderRadius: '14px',
                        fontFamily: 'inherit',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'inherit',
                        background: 'rgba(255,255,255,0.08)',
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',
                        '&:hover': { background: 'rgba(255,255,255,0.14)' },
                        '&:active': { transform: 'scale(0.95)' },
                        '&:focus-visible': {
                          outline: '2px solid currentColor',
                        },
                      }}
                    >
                      <Box
                        component="span"
                        aria-live="polite"
                        sx={{
                          color: b.label === 'Copied!' ? '#4ade80' : 'inherit',
                        }}
                      >
                        {b.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box
                component={motion.div}
                {...enter(0.18)}
                sx={{
                  mt: 3,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2.5,
                }}
              >
                {isEditing ? (
                  <PrimaryButton
                    onClick={() => u.refreshApiKey()}
                    disabled={u.isUpdatingAPIKEY}
                  >
                    {u.isUpdatingAPIKEY ? 'Regenerating…' : 'Regenerate key'}
                  </PrimaryButton>
                ) : (
                  <Box sx={{ fontSize: 16, color: SOFT }}>
                    Enter edit mode to regenerate your key.{' '}
                    <TextButton onClick={startEdit}>Edit profile ›</TextButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* ─── Footer ─── */}
          <Box
            component="footer"
            data-tone="api"
            sx={{
              px: MARGIN,
              py: 4,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 15,
              color: SOFT,
            }}
          >
            <span>
              © {new Date().getFullYear()}{' '}
              <Box
                component="span"
                sx={{
                  fontFamily: valorantFont.style.fontFamily,
                  fontWeight: 400,
                  fontSynthesis: 'none',
                }}
              >
                GyCODING
              </Box>
            </span>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                '& a': {
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': { color: 'var(--tone-ink)' },
                },
              }}
            >
              <a href="https://gycoding.com">GYCODING</a>
              <a href="https://gycoding.com/privacy">Privacy</a>
              <a href="https://gycoding.com/terms">Terms</a>
            </Box>
          </Box>
        </>
      )}

      {/* ─── Save bar, while editing ─── */}
      <AnimatePresence>
        {isEditing && (
          <Box
            component={motion.div}
            role="region"
            aria-label="Editing profile"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            sx={{
              position: 'fixed',
              zIndex: 30,
              left: '50%',
              bottom: { xs: 16, md: 28 },
              translate: '-50% 0',
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              pl: 3,
              pr: 1,
              py: 1,
              borderRadius: '20px',
              background: '#1d1d1f',
              color: '#f5f5f7',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            }}
          >
            <Box sx={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Editing profile
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextButton onClick={cancelEdit}>Cancel</TextButton>
              <PrimaryButton
                onClick={save}
                disabled={!isPhoneValid || u.isLoadingUpdate}
              >
                {u.isLoadingUpdate ? 'Saving…' : 'Save changes'}
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Toasts: the current dashboard's messages */}
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={u.isErrorUpdate}
        message="Your profile could not be updated"
        onClose={() => u.setIsErrorUpdate(false)}
      />
      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={u.isUpdated}
        message="Your profile has been updated"
        onClose={() => u.setIsUpdated(false)}
      />
      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={u.isUpdatedAPIKEY}
        message="Your API key has been regenerated"
        onClose={() => u.setIsUpdatedAPIKEY(false)}
      />
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={u.isErrorUpdateAPIKEY}
        message="Your API key could not be regenerated"
        onClose={() => u.setIsErrorUpdateAPIKEY(false)}
      />
      <AnimatedAlert
        severity={ESeverity.WARNING}
        open={phoneError}
        message="Phone number is required (e.g. +34 605624408)"
        onClose={() => setPhoneError(false)}
      />
    </Box>
  );
}
