'use client';

// GY Accounts dashboard, prototype in the gy-web /v2 language ("exhibition"): a thin bar with the
// account menu, the identity card in 3D (IdentityScene: profile on the front, API key on the back),
// then a light sheet with the personal information as a bento, like gy-web's "what we build". The
// page's ground and ink ease to the tone of the chapter at the middle of the screen, as on gy-web.
// Compact on purpose: it is a dashboard to see and edit a profile, not a landing page.
//
// Logic is the current dashboard's, unchanged (hooks/useUser: profile, update, API key refresh;
// same phone validation and the same toasts). Only the presentation is new.
// Development only: /v2?demo shows the GYCODING account from the app's capture with no API calls;
// /v2?demo=loading holds the loading state (the skeleton).

import { useUser as useUserGY } from '@/hooks/useUser';
import { ESeverity } from '@/utils/constants/ESeverity';
import { valorantFont } from '@/utils/fonts';
import { toBase64 } from '@/utils/global';
import { filterVisibleRoles } from '@/utils/roles';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ERole, UserProfile } from '@gycoding/nebula';
import EmailIcon from '@mui/icons-material/AlternateEmailRounded';
import LockIcon from '@mui/icons-material/LockRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import OpenIcon from '@mui/icons-material/NorthEastRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PhoneIcon from '@mui/icons-material/PhoneIphoneRounded';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import AnimatedAlert from '../atoms/Alert';
import { RoleChip } from '../atoms/RoleChip';
import IdentityScene from './IdentityScene';
import DashboardSkeleton from './Skeleton';

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

type DemoMode = 'full' | 'loading' | null;
function useDemoFlag() {
  const [demo, setDemo] = useState<DemoMode>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const q = new URLSearchParams(window.location.search);
    if (q.has('demo'))
      setDemo(q.get('demo') === 'loading' ? 'loading' : 'full');
  }, []);
  return demo;
}

// Same shape as hooks/useUser, backed by local state.
function useDemoUser(loading: boolean) {
  const [data, setData] = useState<UserProfile>(DEMO_USER);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdatedAPIKEY, setIsUpdatedAPIKEY] = useState(false);
  const [isLoadingUpdate, setLoading] = useState(false);
  const [isUpdatingAPIKEY, setUpdatingKey] = useState(false);
  const wait = () => new Promise((r) => setTimeout(r, 700));
  return {
    data: loading ? undefined : data,
    isLoading: loading,
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

// The bento tiles of the information sheet: white, radius 24, a violet ring while editable.
const tileSx = (ring: boolean) =>
  ({
    position: 'relative',
    borderRadius: '24px',
    background: '#ffffff',
    color: '#1d1d1f',
    '--tone-soft': '#6e6e73',
    boxShadow: ring
      ? '0 0 0 2px #8C54FF, 0 20px 40px -24px rgba(140,84,255,0.45)'
      : '0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.3s ease',
  }) as const;

// One field: an icon in the product colour, the label, and the value large; an input when editing.
function FieldTile({
  icon,
  label,
  value,
  editing = false,
  locked = false,
  onChange,
  error,
  hint,
  inputProps,
}: {
  icon: React.ReactNode;
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
  const editable = editing && !locked;
  return (
    <Box
      sx={{
        ...tileSx(editable),
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        columnGap: 2,
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.25, md: 2.75 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '14px',
          color: '#7c3aed',
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.14), rgba(99,102,241,0.14))',
          '& svg': { fontSize: 22 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box
          component="label"
          htmlFor={id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            fontSize: 14,
            color: SOFT,
          }}
        >
          {label}
          {locked && (
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 13,
              }}
            >
              · <LockIcon sx={{ fontSize: 13 }} /> Read only
            </Box>
          )}
        </Box>
        {editable ? (
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
              display: 'block',
              width: '100%',
              mt: 0.25,
              border: 0,
              outline: 'none',
              background: 'transparent',
              p: 0,
              fontFamily: 'inherit',
              ...display,
              letterSpacing: '-0.03em',
              fontSize: { xs: 22, md: 26 },
              lineHeight: 1.25,
              color: 'inherit',
              caretColor: '#8C54FF',
            }}
          />
        ) : (
          <Box
            id={id}
            sx={{
              mt: 0.25,
              ...display,
              letterSpacing: '-0.03em',
              fontSize: { xs: 22, md: 26 },
              lineHeight: 1.25,
              overflowWrap: 'anywhere',
              opacity: locked && editing ? 0.55 : 1,
            }}
          >
            {value || '—'}
          </Box>
        )}
        {editable && (error || hint) && (
          <Box sx={{ mt: 0.5, fontSize: 14, color: error ? '#dc2626' : SOFT }}>
            {error || hint}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// The account menu in the bar: who is signed in, and the ways out (the site, signing out).
function AccountMenu({
  user,
  email,
  onEdit,
}: {
  user: UserProfile;
  email: string;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) =>
      !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const isLogo = !user.picture || user.picture === '/gy-logo.png';
  const pic = (size: number) => (
    <Box
      sx={{
        position: 'relative',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        p: '2px',
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
        {user.picture && (
          <Image
            src={user.picture}
            alt=""
            fill
            sizes={`${size}px`}
            unoptimized
            style={{
              objectFit: isLogo ? 'contain' : 'cover',
              padding: isLogo ? '16%' : 0,
            }}
          />
        )}
      </Box>
    </Box>
  );
  const item = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    width: '100%',
    height: 44,
    px: 1.5,
    border: 0,
    borderRadius: '12px',
    background: 'transparent',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'left',
    textDecoration: 'none',
    cursor: 'pointer',
    '& svg': { fontSize: 19, opacity: 0.75 },
    '&:hover, &:focus-visible': {
      outline: 'none',
      background: 'color-mix(in srgb, currentColor 8%, transparent)',
    },
  } as const;
  return (
    <Box ref={root} sx={{ position: 'relative' }}>
      <Box
        component="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${user.username}`}
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          height: 40,
          pl: 0.5,
          pr: { xs: 0.5, sm: 1.5 },
          border: 0,
          borderRadius: '999px',
          background: open
            ? 'color-mix(in srgb, currentColor 12%, transparent)'
            : 'color-mix(in srgb, currentColor 6%, transparent)',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            background: 'color-mix(in srgb, currentColor 12%, transparent)',
          },
          '&:focus-visible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
          },
        }}
      >
        {pic(32)}
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {user.username}
        </Box>
      </Box>
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            sx={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              width: 280,
              p: 1,
              borderRadius: '20px',
              transformOrigin: 'top right',
              background: '#1d1b26',
              color: '#f5f5f7',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                pt: 1.25,
                pb: 1.5,
              }}
            >
              {pic(40)}
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ fontWeight: 600, fontSize: 16 }}>
                  {user.username}
                </Box>
                <Box
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: '#a1a1a6',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {email}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                height: '1px',
                mx: 1.5,
                mb: 0.75,
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <Box
              component="button"
              role="menuitem"
              sx={item}
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            >
              <PersonIcon /> Edit profile
            </Box>
            <Box
              component="a"
              role="menuitem"
              href="https://gycoding.com"
              sx={item}
            >
              <OpenIcon /> Go to GYCODING
            </Box>
            <Box
              sx={{
                height: '1px',
                mx: 1.5,
                my: 0.75,
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <Box
              component="a"
              role="menuitem"
              href="/api/auth/logout"
              sx={{ ...item, color: '#ff8a8a', '& svg': { fontSize: 19 } }}
            >
              <LogoutIcon /> Log out
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ─── The page ──────────────────────────────────────────────────────────────────
export default function DashboardV2() {
  const demo = useDemoFlag();
  const real = useUserGY();
  const fake = useDemoUser(demo === 'loading');
  const u = demo ? fake : real;
  const { user } = useUser();
  const gyUser = u.data;
  const loading = !gyUser && (u.isLoading || (!demo && real.isLoading));
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  // Pauses the identity card's 3D tilt/turn and idle float (the heaviest motion on the page,
  // continuous 3D transforms on pointer move): the card still switches side with the scroll, as a
  // plain crossfade instead.
  const [paused, setPaused] = useState(false);

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
          background: 'color-mix(in srgb, var(--tone-bg) 92%, transparent)',
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
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play animations' : 'Pause animations'}
            title={paused ? 'Play animations' : 'Pause animations'}
            sx={{
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '14px',
              border:
                '1.5px solid color-mix(in srgb, currentColor 22%, transparent)',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
              '&:hover': { borderColor: 'currentColor' },
              '&:active': { transform: 'scale(0.95)' },
              '&:focus-visible': {
                outline: '2px solid currentColor',
                outlineOffset: 2,
              },
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              {paused ? (
                <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
              ) : (
                <>
                  <rect
                    x="2.5"
                    y="1.5"
                    width="3"
                    height="11"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="8.5"
                    y="1.5"
                    width="3"
                    height="11"
                    rx="1"
                    fill="currentColor"
                  />
                </>
              )}
            </svg>
          </Box>
          {gyUser ? (
            <AccountMenu user={gyUser} email={email} onEdit={startEdit} />
          ) : loading ? (
            // where the account button will be
            <Box
              aria-hidden
              sx={{
                width: { xs: 40, sm: 132 },
                height: 40,
                borderRadius: '999px',
                background: 'color-mix(in srgb, currentColor 8%, transparent)',
              }}
            />
          ) : (
            user && <TextButton href="/api/auth/logout">Log out</TextButton>
          )}
        </Box>
      </Box>

      {/* ─── The card (identity in 3D), or loading (the page's skeleton) / no profile ─── */}
      {loading ? (
        <DashboardSkeleton />
      ) : gyUser && view ? (
        <IdentityScene
          username={view.username}
          email={email}
          picture={view.picture}
          roles={roles}
          apiKey={gyUser.apiKey}
          isEditing={isEditing}
          regenerating={u.isUpdatingAPIKEY}
          paused={paused}
          onEdit={startEdit}
          onRegenerate={() => u.refreshApiKey()}
        />
      ) : (
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
          {!gyUser ? (
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
              <Box
                component="p"
                sx={{ m: 0, mt: 2, fontSize: 20, color: SOFT }}
              >
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
          ) : null}
        </Box>
      )}

      {gyUser && view && (
        <>
          {/* ─── Personal information: a light sheet with a bento of the profile ─── */}
          <Box
            ref={infoRef}
            component="section"
            data-tone="info"
            aria-labelledby="info-title"
            sx={{
              position: 'relative',
              zIndex: 2,
              px: MARGIN,
              pt: { xs: 8, md: 12 },
              pb: { xs: 10, md: 14 },
              scrollMarginTop: '56px',
              background: '#f5f5f7',
              color: '#1d1d1f',
              '--tone-soft': '#6e6e73',
              borderRadius: { xs: '28px 28px 0 0', md: '40px 40px 0 0' },
              // The rounded corner only reads as a corner where it reveals a DIFFERENT colour
              // behind it. In normal flow this sheet sits flush under the hero section, so the
              // curve's cutout reveals the page's own background — which, at this scroll
              // position, is this same #f5f5f7 (the tone engine sets --tone-bg to whichever
              // section is centred in the viewport). Same colour on both sides of the curve made
              // it invisible: a flat seam where the hero's square-cornered dark box meets the
              // sheet, not a rendering glitch. Pulling the sheet up by its own radius makes it
              // overlap the hero's last pixels, so the cutout reveals hero's dark background
              // instead and the "rounded shoulders" the comment above promises actually show.
              mt: { xs: '-28px', md: '-40px' },
            }}
          >
            <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
              {/* Section head (eyebrow → title → lead), the action aligned to its foot. */}
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
                <Box component={motion.div} {...enter()} sx={{ maxWidth: 640 }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 30,
                      px: 1.5,
                      borderRadius: '999px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#6d28d9',
                      background: 'rgba(140,84,255,0.10)',
                      boxShadow: 'inset 0 0 0 1px rgba(140,84,255,0.22)',
                    }}
                  >
                    Profile
                  </Box>
                  <Box
                    component="h2"
                    id="info-title"
                    sx={{
                      m: 0,
                      mt: 2,
                      ...display,
                      fontSize: { xs: 40, md: 64 },
                      lineHeight: 1,
                    }}
                  >
                    Personal information
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      mt: 2,
                      fontSize: { xs: 18, md: 21 },
                      lineHeight: 1.45,
                      color: SOFT,
                    }}
                  >
                    This is how you appear across every GYCODING product.
                  </Box>
                </Box>
                <Box component={motion.div} {...enter(0.06)}>
                  {isEditing ? (
                    <Box
                      sx={{ fontSize: 15, fontWeight: 600, color: '#7c3aed' }}
                    >
                      Editing — save or cancel at the bottom.
                    </Box>
                  ) : (
                    <PrimaryButton onClick={startEdit}>
                      Edit profile
                    </PrimaryButton>
                  )}
                </Box>
              </Box>

              <Box
                component={motion.div}
                {...enter(0.12)}
                sx={{
                  mt: { xs: 5, md: 7 },
                  display: 'grid',
                  gap: { xs: 1.5, md: 2 },
                  gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
                }}
              >
                {/* Who you are: the photo tile, lit like the card */}
                <Box
                  sx={{
                    ...tileSx(isEditing),
                    gridRow: { md: 'span 3' },
                    overflow: 'hidden',
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    background:
                      'radial-gradient(120% 70% at 0% 0%, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0) 60%), radial-gradient(90% 60% at 100% 100%, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0) 60%), #ffffff',
                  }}
                >
                  <Avatar
                    src={view.picture}
                    size={{ xs: 104, md: 136 }}
                    editing={isEditing}
                    onPick={pickImage}
                  />
                  <Box
                    sx={{
                      mt: { xs: 3, md: 'auto' },
                      pt: { md: 4 },
                      minWidth: 0,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        ...display,
                        fontSize: { xs: 30, md: 40 },
                        lineHeight: 1.05,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {view.username || '—'}
                    </Box>
                    <Box
                      sx={{
                        mt: 0.75,
                        fontSize: 16,
                        color: SOFT,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {email}
                    </Box>
                    {roles.length > 0 && (
                      <Box
                        sx={{
                          mt: 2.5,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.75,
                        }}
                      >
                        {roles.map((r, i) => (
                          <RoleChip key={r} role={r} index={i} mode="light" />
                        ))}
                      </Box>
                    )}
                    <Box
                      sx={{
                        mt: 2.5,
                        fontSize: 14,
                        color: isEditing ? '#7c3aed' : SOFT,
                      }}
                    >
                      {isEditing
                        ? 'Tap the photo to change it.'
                        : 'Your photo and name, on every product.'}
                    </Box>
                  </Box>
                </Box>

                <FieldTile
                  icon={<PersonIcon />}
                  label="Username"
                  value={view.username}
                  editing={isEditing}
                  onChange={(v) =>
                    setEdit((d) => (d ? { ...d, username: v } : d))
                  }
                  inputProps={{ autoComplete: 'username', name: 'username' }}
                />
                <FieldTile
                  icon={<PhoneIcon />}
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
                <FieldTile
                  icon={<EmailIcon />}
                  label="Email"
                  value={email}
                  editing={isEditing}
                  locked
                />
              </Box>
            </Box>
          </Box>

          {/* ─── Footer ─── */}
          <Box
            component="footer"
            data-tone="info"
            sx={{
              px: MARGIN,
              background: '#f5f5f7',
              borderTop: '1px solid rgba(0,0,0,0.06)',
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
                  fontKerning: 'none',
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
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Editing profile
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: { xs: 1, sm: 'none' },
                gap: 2,
                pl: { xs: 2, sm: 0 },
                whiteSpace: 'nowrap',
              }}
            >
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
