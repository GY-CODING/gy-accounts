/* eslint-disable react/react-in-jsx-scope */
'use client';

// The original dashboard, kept as a component (unrouted) when /v2 became the real one. Logic
// untouched — only moved from src/app/page.tsx and its imports re-pointed.

import { useUser as useUserGY } from '@/hooks/useUser';
import { ELogs } from '@/utils/constants/ELogs';
import { ESeverity } from '@/utils/constants/ESeverity';
import { product, text } from '@/utils/theme/gy';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@gycoding/nebula';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { toBase64 } from '../../../utils/global';
import AnimatedAlert from '../atoms/Alert';
import Button from '../atoms/Button';
import EyebrowBadge from '../atoms/EyebrowBadge';
import GlassCard from '../atoms/GlassCard';
import GradientHeadline from '../atoms/GradientHeadline';
import ActionsBox from '../molecules/ActionsBox';
import CardHeader from '../molecules/CardHeader';
import RoleBox from '../molecules/RoleBox';
import UserData from '../molecules/UserData';
import { ProfileSkeleton } from './ProfileSkeleton';

// Marco de página compartido con gy-web: hueco para el header fijo, contenedor de 1200px
// y cabecera de sección (eyebrow → titular → lead).
function PageShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="section"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 4 },
        // Padding superior de la guía para el primer bloque (header de 64px)
        pt: { xs: '112px', sm: '120px', md: '128px' },
      }}
    >
      {/* Cabecera de sección centrada, máx. 760px */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: { xs: 2, md: 2.5 },
          maxWidth: 760,
          mx: 'auto',
          mb: { xs: 6, md: 8 },
        }}
      >
        <EyebrowBadge>Account dashboard</EyebrowBadge>
        {/* Titular en Lexend, blanco sólido (negro en modo claro) */}
        <GradientHeadline
          text="Your account"
          gradient={null}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.08,
            color: text(isDark).primary,
            // Brillo violeta suave detrás del texto en oscuro
            textShadow: isDark ? `0 0 40px ${product.primary}66` : 'none',
          }}
        />
        {/* Lead en text-secondary, entra después del titular */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              lineHeight: 1.65,
              color: text(isDark).secondary,
              maxWidth: 600,
            }}
          >
            One identity across the entire GYCODING ecosystem. Manage your
            profile, roles and API access in one place.
          </Typography>
        </motion.div>
      </Box>
      {children}
    </Box>
  );
}

export default function DashboardV1() {
  const { user } = useUser();
  const {
    data: gyUser,
    isLoading: gyUserLoading,
    // error: isError,
    update,
    isLoadingUpdate,
    isErrorUpdate,
    isUpdated,
    setIsUpdated,
    setIsErrorUpdate,
    refreshApiKey,
    isUpdatingAPIKEY,
    isUpdatedAPIKEY,
    isErrorUpdateAPIKEY,
    setIsUpdatedAPIKEY,
    setIsErrorUpdateAPIKEY,
  } = useUserGY();
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editData, setEditData] = useState<UserProfile>({
    username: gyUser?.username || '',
    picture: gyUser?.picture || '',
    phoneNumber: gyUser?.phoneNumber || '',
    roles: gyUser?.roles || [],
    email: gyUser?.email || '',
    apiKey: gyUser?.apiKey || '',
  });

  const [phoneValidationError, setPhoneValidationError] = useState(false);

  const isPhoneValid =
    !isEditing || /^\+\d{1,4} \d+$/.test((editData.phoneNumber ?? '').trim());

  const handleOpenErrorAlert = isErrorUpdate;
  const handleOpenSuccessAlert = isUpdated;
  const handleOpenSuccessAlertRefreshApiKey = isUpdatedAPIKEY;

  const handleOpenErrorAlertClose = () => {
    setIsErrorUpdate(false);
  };
  const handleOpenSuccessAlertClose = () => {
    setIsUpdated(false);
  };

  const handleOpenSuccessAlertRefreshApiKeyClose = () => {
    setIsUpdatedAPIKEY(false);
  };

  const handleOpenSuccessAlertRefreshApiKeyErrorClose = () => {
    setIsErrorUpdateAPIKEY(false);
  };

  const handleRefreshAPIKey = async () => {
    try {
      await refreshApiKey();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setEditData({
      username: gyUser?.username || '',
      picture: gyUser?.picture || '',
      phoneNumber: gyUser?.phoneNumber || '',
      roles: gyUser?.roles || [],
      email: gyUser?.email || '',
      apiKey: gyUser?.apiKey || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPhoneValidationError(false);
    setEditData({
      username: '',
      picture: '',
      phoneNumber: '',
      roles: [],
      email: '',
      apiKey: '',
    });
  };

  const handleSaveEdit = async () => {
    if (!isPhoneValid) {
      setPhoneValidationError(true);
      return;
    }

    try {
      let base64Image = editData.picture;

      if (imageFile) {
        base64Image = await toBase64(imageFile);
      }

      const updatedData = { ...editData, picture: base64Image };
      await update(updatedData);

      setPreviewImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error(ELogs.ERROR_UPDATING_DATA, error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      setEditData((prev) => ({
        ...prev,
        picture: objectUrl,
      }));
    }
  };

  // Sin datos: tarjeta de cristal con opción de volver a iniciar sesión
  if (!gyUser && !gyUserLoading) {
    return (
      <PageShell>
        <GlassCard sx={{ maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.2rem', mb: 1 }}>
            {ELogs.NO_USER_DATA_AVAILABLE}
          </Typography>
          <Typography
            sx={{ color: 'text.secondary', fontSize: '0.95rem', mb: 3 }}
          >
            We couldn&apos;t load your profile. Try signing in again.
          </Typography>
          <Button href="/api/auth/login">Sign in</Button>
        </GlassCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {gyUserLoading ? (
        <ProfileSkeleton />
      ) : (
        // Dashboard: identidad (360px) a la izquierda + datos a la derecha; una columna en móvil
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
            gap: { xs: 2, md: 3 },
            alignItems: 'start',
          }}
        >
          {/* Tarjeta de identidad: se queda fija al hacer scroll en escritorio */}
          <GlassCard sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
            <CardHeader
              previewImage={previewImage}
              editData={editData}
              gyUser={gyUser!}
              email={user?.email ?? gyUser?.email}
              isEditing={isEditing}
              handleImageChange={handleImageChange}
            />
            <RoleBox gyUser={gyUser!} />
            <ActionsBox
              isEditing={isEditing}
              handleEditClick={handleEditClick}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              isLoadingUpdate={isLoadingUpdate}
              isSaveDisabled={!isPhoneValid}
            />
          </GlassCard>
          <UserData
            user={user}
            gyUser={gyUser!}
            isEditing={isEditing}
            setEditData={setEditData}
            editData={editData}
            updateApiKey={handleRefreshAPIKey}
            isUpdatingAPIKEY={isUpdatingAPIKEY}
          />
        </Box>
      )}

      {/* Avisos (toasts) */}
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={handleOpenErrorAlert}
        duration={5000}
        message={'Your profile could not be updated'}
        onClose={handleOpenErrorAlertClose}
      />
      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={handleOpenSuccessAlert}
        duration={5000}
        message={'Your profile has been updated'}
        onClose={handleOpenSuccessAlertClose}
      />
      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={handleOpenSuccessAlertRefreshApiKey}
        duration={5000}
        message={'Your API key has been regenerated'}
        onClose={handleOpenSuccessAlertRefreshApiKeyClose}
      />
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={isErrorUpdateAPIKEY}
        duration={5000}
        message={'Your API key could not be regenerated'}
        onClose={handleOpenSuccessAlertRefreshApiKeyErrorClose}
      />
      <AnimatedAlert
        severity={ESeverity.WARNING}
        open={phoneValidationError}
        duration={5000}
        message={'Phone number is required (e.g. +34 605624408)'}
        onClose={() => setPhoneValidationError(false)}
      />
    </PageShell>
  );
}
