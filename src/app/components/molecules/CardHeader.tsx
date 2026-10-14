/* eslint-disable react/react-in-jsx-scope */
import { product, radius, text } from '@/utils/theme/gy';
import { UserProfile } from '@gycoding/nebula';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

interface CardHeaderProps {
  previewImage: string | null;
  editData: UserProfile;
  gyUser: UserProfile;
  email?: string | null;
  isEditing: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Cabecera de la tarjeta de identidad: banner tipo hero de producto + avatar + nombre + email.
export default function CardHeader({
  previewImage,
  editData,
  gyUser,
  email,
  isEditing,
  handleImageChange,
}: CardHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Prioridad del avatar: imagen recién elegida > la de edición > la guardada > por defecto
  const avatarSrc =
    previewImage || editData.picture || gyUser?.picture || '/default.png';
  // Mientras se edita se muestra el nombre que se está escribiendo
  const displayName = isEditing ? editData.username : gyUser?.username;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Banner: márgenes negativos para llegar hasta los bordes de la tarjeta */}
      <Box
        sx={{
          position: 'relative',
          mx: { xs: -3, sm: -4 },
          mt: { xs: -3, sm: -4 },
          height: { xs: 112, sm: 128 },
          borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
          overflow: 'hidden',
          background: isDark ? product.pageDark : product.pageLight,
          borderBottom: `1px solid ${product.primary}22`,
        }}
      >
        {/* Brillo superior */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: product.glow(isDark),
          }}
        />
        {/* Rejilla pequeña de 28px difuminada */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${product.primary}22 1px, transparent 1px),
              linear-gradient(90deg, ${product.primary}22 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
            maskImage:
              'radial-gradient(ellipse 80% 100% at 50% 0%, black 10%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 100% at 50% 0%, black 10%, transparent 75%)',
          }}
        />
      </Box>

      {/* Avatar, nombre y email centrados, montados sobre el banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: { xs: '-52px', sm: '-60px' },
          position: 'relative',
        }}
      >
        {/* Es un <label>: en modo edición, al pulsarlo abre el selector de archivo */}
        <Box
          component={motion.label}
          whileHover={isEditing ? { scale: 1.04 } : undefined}
          sx={{
            position: 'relative',
            p: '3px', // grosor del anillo en gradiente
            borderRadius: '50%',
            background: product.gradient,
            // Anillo exterior del color de la tarjeta + glow violeta (más fuerte al editar)
            boxShadow: `0 0 0 4px ${isDark ? 'rgba(17,17,17,0.9)' : 'rgba(255,255,255,0.95)'}, ${
              isEditing
                ? `0 0 40px ${product.primary}88`
                : `0 20px 45px -12px ${product.primary}88`
            }`,
            cursor: isEditing ? 'pointer' : 'default',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <Avatar
            src={avatarSrc}
            alt={displayName}
            sx={{ width: { xs: 96, sm: 112 }, height: { xs: 96, sm: 112 } }}
          />
          {isEditing && (
            <>
              {/* Capa con icono de cámara para indicar que se puede cambiar */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '3px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(10,0,32,0.45)',
                  color: '#fff',
                  opacity: 0.9,
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 1 },
                }}
              >
                <PhotoCameraRoundedIcon />
              </Box>
              <input
                type="file"
                accept="image/*"
                aria-label="Change profile picture"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </>
          )}
        </Box>

        {/* Nombre (h3 de la escala: 600) */}
        <Typography
          component="h2"
          sx={{
            mt: 2,
            fontWeight: 600,
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            lineHeight: 1.3,
            wordBreak: 'break-word',
          }}
        >
          {displayName || '—'}
        </Typography>
        {/* Email en text-tertiary */}
        {email && (
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.9rem',
              color: text(isDark).tertiary,
              wordBreak: 'break-all',
            }}
          >
            {email}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
