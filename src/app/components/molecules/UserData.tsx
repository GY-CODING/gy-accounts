/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {
  border,
  overlineSx,
  product,
  radius,
  surface,
  text,
} from '@/utils/theme/gy';
import { UserProfile as Auth0UserProfile } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@gycoding/nebula';
import EmailIcon from '@mui/icons-material/EmailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PhoneAndroidIcon from '@mui/icons-material/PhoneIphoneRounded';
import RefreshIcon from '@mui/icons-material/RefreshRounded';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import GlassCard from '../atoms/GlassCard';
import TextFieldCopyTemplate from '../atoms/textfieldCopyPaste';

// Separa "+34 605624408" en prefijo y número (lógica original sin cambios)
function parsePhone(phone?: string | null): { prefix: string; digits: string } {
  if (!phone) return { prefix: '+34', digits: '' };
  const trimmed = phone.trim();
  const spaceIdx = trimmed.indexOf(' ');
  if (spaceIdx > 0 && trimmed[0] === '+') {
    return {
      prefix: trimmed.slice(0, spaceIdx),
      digits: trimmed.slice(spaceIdx + 1),
    };
  }
  return { prefix: '+34', digits: trimmed };
}

// Fila de solo lectura (§6.9 listas): surface-subtle + borde sutil + icono en tile violeta.
function InfoRow({
  icon,
  label,
  value,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  isDark: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        pr: 2,
        borderRadius: `${radius.md}px`,
        background: surface(isDark).subtle,
        border: `1px solid ${border(isDark).subtle}`,
        minWidth: 0,
        transition: 'border-color 0.2s ease, background 0.2s ease',
        '&:hover': {
          borderColor: `${product.primary}44`,
          background: surface(isDark).hoverBrand,
        },
      }}
    >
      {/* Tile de icono 40×40 */}
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: `${radius.sm}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? product.accent : product.secondary,
          background: `${product.primary}1f`,
          border: `1px solid ${product.primary}33`,
          '& svg': { fontSize: 20 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.8rem',
            color: text(isDark).tertiary,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
        {/* Valor; si no hay, guion en color apagado */}
        <Typography
          sx={{
            fontSize: '0.95rem',
            fontWeight: 500,
            color: value ? text(isDark).primary : text(isDark).muted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );
}

// Cabecera de cada tarjeta: overline → título → descripción
function CardTitle({
  overline,
  title,
  description,
  isDark,
}: {
  overline: string;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ ...overlineSx(isDark), mb: 1 }}>{overline}</Typography>
      <Typography
        component="h3"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.35rem' },
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.75,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: text(isDark).tertiary,
          maxWidth: 520,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

interface UserDataProps {
  user: Auth0UserProfile | undefined;
  gyUser: UserProfile;
  isEditing: boolean;
  setEditData: React.Dispatch<React.SetStateAction<UserProfile>>;
  editData: UserProfile;
  updateApiKey: () => void;
  isUpdatingAPIKEY: boolean;
}

// Columna derecha: tarjeta "Personal information" + tarjeta "API access".
// Antes había un bloque para móvil y otro para escritorio; ahora es una sola maqueta responsive.
export default function UserData({
  user,
  gyUser,
  isEditing,
  setEditData,
  editData,
  updateApiKey,
  isUpdatingAPIKEY,
}: UserDataProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // --- Estado del teléfono (lógica original sin cambios) ---
  const [phonePrefix, setPhonePrefix] = useState(
    () => parsePhone(editData.phoneNumber).prefix
  );
  const [phoneDigits, setPhoneDigits] = useState(
    () => parsePhone(editData.phoneNumber).digits
  );
  const [prefixTouched, setPrefixTouched] = useState(false);
  const [digitsTouched, setDigitsTouched] = useState(false);

  const prefixError = prefixTouched && !/^\+\d{1,4}$/.test(phonePrefix.trim());
  const digitsError =
    digitsTouched &&
    (phoneDigits.trim() === '' || !/^\d+$/.test(phoneDigits.trim()));

  // Al entrar en edición se rellenan prefijo y número con el valor guardado
  useEffect(() => {
    if (isEditing) {
      const { prefix, digits } = parsePhone(editData.phoneNumber);
      setPhonePrefix(prefix);
      setPhoneDigits(digits);
    }
    setPrefixTouched(false);
    setDigitsTouched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Icono al inicio de cada input
  const iconAdornment = (icon: React.ReactNode) => (
    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
      {icon}
    </InputAdornment>
  );

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}
    >
      {/* ===== Tarjeta 1: datos personales ===== */}
      <GlassCard delay={0.1}>
        <CardTitle
          overline="Profile"
          title="Personal information"
          description="This is how you appear across every GYCODING product."
          isDark={isDark}
        />

        {/* Transición suave entre modo lectura y modo edición */}
        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            // --- Modo edición: inputs en rejilla de 2 columnas (1 en móvil) ---
            <Box
              key="edit"
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                label="Username"
                slotProps={{
                  input: { startAdornment: iconAdornment(<PersonIcon />) },
                }}
              />
              {/* El email no se puede editar */}
              <TextField
                fullWidth
                disabled
                value={user?.email ?? ''}
                label="Email"
                slotProps={{
                  input: { startAdornment: iconAdornment(<EmailIcon />) },
                }}
              />
              {/* Teléfono: prefijo + número, ocupa las 2 columnas */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  gridColumn: { sm: '1 / -1' },
                  alignItems: 'flex-start',
                }}
              >
                <TextField
                  value={phonePrefix}
                  onChange={(e) => {
                    const newPrefix = e.target.value;
                    setPhonePrefix(newPrefix);
                    setEditData({
                      ...editData,
                      phoneNumber: `${newPrefix} ${phoneDigits}`.trim(),
                    });
                  }}
                  onBlur={() => setPrefixTouched(true)}
                  label="Prefix"
                  error={prefixError}
                  helperText={prefixError ? 'Format: +XX' : ''}
                  sx={{ width: 104, flexShrink: 0 }}
                  slotProps={{
                    htmlInput: { style: { textAlign: 'center' } },
                  }}
                />
                <TextField
                  fullWidth
                  value={phoneDigits}
                  onChange={(e) => {
                    const newDigits = e.target.value;
                    setPhoneDigits(newDigits);
                    setEditData({
                      ...editData,
                      phoneNumber: `${phonePrefix} ${newDigits}`.trim(),
                    });
                  }}
                  onBlur={() => setDigitsTouched(true)}
                  label="Phone"
                  error={digitsError}
                  helperText={digitsError ? 'Phone number is required' : ''}
                  slotProps={{
                    input: {
                      startAdornment: iconAdornment(<PhoneAndroidIcon />),
                    },
                  }}
                />
              </Box>
            </Box>
          ) : (
            // --- Modo lectura: filas de información ---
            <Box
              key="view"
              component={motion.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              <InfoRow
                icon={<PersonIcon />}
                label="Username"
                value={gyUser.username}
                isDark={isDark}
              />
              <InfoRow
                icon={<PhoneAndroidIcon />}
                label="Phone"
                value={gyUser.phoneNumber}
                isDark={isDark}
              />
              {/* Email a ancho completo (suele ser largo) */}
              <Box sx={{ gridColumn: { sm: '1 / -1' }, minWidth: 0 }}>
                <InfoRow
                  icon={<EmailIcon />}
                  label="Email"
                  value={user?.email}
                  isDark={isDark}
                />
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* ===== Tarjeta 2: API key ===== */}
      <GlassCard delay={0.2}>
        <CardTitle
          overline="Developers"
          title="API access"
          description="Use this key to authenticate requests to the GYCODING APIs. Keep it secret — anyone with it can act on your behalf."
          isDark={isDark}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextFieldCopyTemplate
              label="API key"
              disabled
              value={gyUser.apiKey as string}
            />
          </Box>
          {/* Regenerar la key: solo en modo edición, como antes */}
          <AnimatePresence initial={false}>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                <Tooltip title="Regenerate key" arrow>
                  {/* <span> para que el tooltip funcione con el botón deshabilitado */}
                  <span>
                    <IconButton
                      aria-label="Regenerate API key"
                      disabled={isUpdatingAPIKEY}
                      onClick={updateApiKey}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: `${radius.md}px`,
                        border: `1px solid ${border(isDark).default}`,
                        background: surface(isDark).glass,
                        color: 'text.primary',
                        transition:
                          'border-color 0.2s ease, background 0.2s ease',
                        '&:hover': {
                          borderColor: border(isDark).hover,
                          background: surface(isDark).hoverBrand,
                        },
                      }}
                    >
                      {/* El icono gira mientras se regenera */}
                      <motion.div
                        animate={{ rotate: isUpdatingAPIKEY ? 360 : 0 }}
                        transition={{
                          duration: 0.6,
                          ease: 'easeInOut',
                          repeat: isUpdatingAPIKEY ? Infinity : 0,
                        }}
                        style={{ display: 'flex' }}
                      >
                        <RefreshIcon />
                      </motion.div>
                    </IconButton>
                  </span>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        {/* Pista para descubrir dónde se regenera la key */}
        {!isEditing && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.8rem',
              color: text(isDark).muted,
            }}
          >
            <KeyRoundedIcon sx={{ fontSize: 16 }} />
            Enter edit mode to regenerate your key.
          </Box>
        )}
      </GlassCard>
    </Box>
  );
}
