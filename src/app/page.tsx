/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useUser as useUserGY } from '@/hooks/useUser';
import { cardVariants } from '@/utils/animations/variants';
import { ELogs } from '@/utils/constants/ELogs';
import { ESeverity } from '@/utils/constants/ESeverity';
import colors from '@/utils/theme/colors';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@gycoding/nebula';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toBase64 } from '../utils/global';
import AnimatedAlert from './components/atoms/Alert';
import AnimatedBackground from './components/atoms/AnimatedBackground';
import ActionsBox from './components/molecules/ActionsBox';
import CardHeader from './components/molecules/CardHeader';
import RoleBox from './components/molecules/RoleBox';
import UserData from './components/molecules/UserData';
import { ProfileSkeleton } from './components/organisms/ProfileSkeleton';

function Home() {
  const { user } = useUser();
  const theme = useTheme();
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
  const [showContent, setShowContent] = useState(false);
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

  useEffect(() => {
    if (!gyUserLoading && gyUser) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [gyUserLoading, gyUser]);

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

  if (!gyUser && !gyUserLoading) {
    return (
      <div>
        <Typography variant="h6">{ELogs.NO_USER_DATA_AVAILABLE}</Typography>
      </div>
    );
  }

  return (
    <Box
      sx={{
        height: { xs: '100dvh', sm: 'auto' },
        minHeight: { xs: 'unset', sm: '100vh' },
        width: '100%',
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        paddingTop: ['64px', '10%', '5%'],
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground />
      <Box
        sx={{
          padding: ['0', '16px'],
          width: '100%',
          paddingX: ['0', '5%'],
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="sync" initial={false}>
          {gyUserLoading ? (
            <Box
              component={motion.div}
              key="skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                padding: ['0', '16px'],
                paddingLeft: ['0', '5%'],
                paddingRight: ['0', '5%'],
              }}
            >
              <ProfileSkeleton />
            </Box>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Card
                component={motion.div}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  background: {
                    xs: 'transparent',
                    sm:
                      theme.palette.mode === 'dark'
                        ? 'rgba(18, 18, 18, 0.8)'
                        : 'rgba(255, 255, 255, 0.8)',
                  },
                  backdropFilter: { xs: 'none', sm: 'blur(20px)' },
                  border: {
                    xs: 'none',
                    sm: `1px solid ${colors.glass.border}`,
                  },
                  borderRadius: { xs: 0, sm: '24px' },
                  overflow: 'visible',
                  boxShadow: { xs: 'none', sm: colors.shadow.card },
                  padding: { xs: 0, sm: '16px' },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardHeader
                  previewImage={previewImage}
                  editData={editData}
                  gyUser={gyUser!}
                  isEditing={isEditing}
                  handleImageChange={handleImageChange}
                />
                <CardContent
                  sx={{
                    pt: ['8px', '80px'],
                    pb: ['4px', '10px'],
                    px: ['16px', '16px'],
                  }}
                >
                  <UserData
                    user={user}
                    gyUser={gyUser!}
                    isEditing={isEditing}
                    setEditData={setEditData}
                    editData={editData}
                    updateApiKey={handleRefreshAPIKey}
                    isUpdatingAPIKEY={isUpdatingAPIKEY}
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
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Box>
      {/* <AnimatedAlert
        severity={ESeverity.ERROR}
        open={isError }
        duration={5000}
        message={'An error occurred while fetching user data'}
        onClose={handleOpenErrorAlertClose}
      /> */}
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={handleOpenErrorAlert}
        duration={5000}
        message={'Profile could be not updated'}
        onClose={handleOpenErrorAlertClose}
      />

      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={handleOpenSuccessAlert}
        duration={5000}
        message={'Profile has been updated'}
        onClose={handleOpenSuccessAlertClose}
      />
      <AnimatedAlert
        severity={ESeverity.SUCCESS}
        open={handleOpenSuccessAlertRefreshApiKey}
        duration={5000}
        message={'API KEY Has been updated'}
        onClose={handleOpenSuccessAlertRefreshApiKeyClose}
      />
      <AnimatedAlert
        severity={ESeverity.ERROR}
        open={isErrorUpdateAPIKEY}
        duration={5000}
        message={'API KEY Cannot be updated'}
        onClose={handleOpenSuccessAlertRefreshApiKeyErrorClose}
      />
      <AnimatedAlert
        severity={ESeverity.WARNING}
        open={phoneValidationError}
        duration={5000}
        message={'Phone number is required (e.g. +34 605624408)'}
        onClose={() => setPhoneValidationError(false)}
      />
    </Box>
  );
}

export default Home;
