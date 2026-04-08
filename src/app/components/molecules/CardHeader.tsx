import { lexendFont } from '@/utils/fonts';
import { UserProfile } from '@gycoding/nebula';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

interface CardHeaderProps {
  previewImage: string | null;
  editData: UserProfile;
  gyUser: UserProfile;
  isEditing: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CardHeader({
  previewImage,
  editData,
  gyUser,
  isEditing,
  handleImageChange,
}: CardHeaderProps) {
  const avatarSrc =
    previewImage || editData.picture || gyUser?.picture || '/default.png';
  const displayName = isEditing ? editData.username : gyUser?.username;

  const avatarSx = {
    border: isEditing
      ? '3px solid transparent'
      : '3px solid rgba(255, 255, 255, 0.4)',
    backgroundImage: isEditing
      ? 'linear-gradient(white, white), linear-gradient(135deg, #8C54FF, #00F5FF)'
      : 'none',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: isEditing
      ? '0 0 30px rgba(0, 245, 255, 0.5), 0 6px 16px rgba(0, 0, 0, 0.25)'
      : '0 0 24px rgba(140, 84, 255, 0.5), 0 6px 16px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.3s ease',
    cursor: isEditing ? 'pointer' : 'default',
    '&:hover': { transform: 'scale(1.05)' },
  };

  const fileInput = isEditing && (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <label
        style={{
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </label>
    </Box>
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* ===== MOBILE hero layout ===== */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {/* Banner */}
        <Box
          sx={(theme) => ({
            height: '72px',
            background:
              theme.palette.mode === 'dark'
                ? isEditing
                  ? '#8C54FF'
                  : '#1a1a2e'
                : '#8C54FF',
          })}
        />
        {/* Avatar + Name pulled up over the banner */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: '-34px',
            pb: '6px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarSrc}
              alt={displayName}
              sx={{ width: 68, height: 68, ...avatarSx }}
            />
            {fileInput}
          </Box>
          <Typography
            variant="body1"
            fontWeight={700}
            sx={{ mt: '6px', fontFamily: lexendFont.style.fontFamily }}
          >
            {displayName}
          </Typography>
        </Box>
      </Box>

      {/* ===== DESKTOP layout ===== */}
      <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'relative' }}>
        <Box
          sx={(theme) => ({
            position: 'relative',
            borderRadius: '20px',
            height: '160px',
            background:
              theme.palette.mode === 'dark'
                ? isEditing
                  ? '#8C54FF'
                  : '#1a1a2e'
                : '#8C54FF',
            overflow: 'hidden',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
          })}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-64px',
            left: '16px',
            zIndex: 10,
          }}
        >
          <Box sx={{ position: 'relative', borderRadius: '50%' }}>
            <Avatar
              src={avatarSrc}
              alt={displayName}
              sx={{ width: 128, height: 128, ...avatarSx }}
            />
            {fileInput}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
