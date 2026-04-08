/* eslint-disable react-hooks/exhaustive-deps */
import { lexendFont } from '@/utils/fonts';
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

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

import { fadeInUpVariants } from '@/utils/animations/variants';
import colors from '@/utils/theme/colors';
import { UserProfile as Auth0UserProfile } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@gycoding/nebula';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';
import TextFieldCopyTemplate from '../atoms/textfieldCopyPaste';

interface UserDataProps {
  user: Auth0UserProfile | undefined;
  gyUser: UserProfile;
  isEditing: boolean;
  setEditData: React.Dispatch<React.SetStateAction<UserProfile>>;
  editData: UserProfile;
  updateApiKey: () => void;
  isUpdatingAPIKEY: boolean;
}

export default function UserData({
  user,
  gyUser,
  isEditing,
  setEditData,
  editData,
  updateApiKey,
  isUpdatingAPIKEY,
}: UserDataProps) {
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

  return (
    <Box sx={{ mb: '20px', width: '100%' }}>
      {/* ===== MOBILE: info rows (view mode) ===== */}
      <Box
        sx={{
          display: { xs: isEditing ? 'none' : 'block', sm: 'none' },
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mb: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            gap: 1.5,
          }}
        >
          <PhoneAndroidIcon
            sx={{ color: 'text.secondary', fontSize: 18, flexShrink: 0 }}
          />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ lineHeight: 1.2 }}
            >
              Phone
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ fontFamily: lexendFont.style.fontFamily }}
            >
              {gyUser.phoneNumber || '—'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            gap: 1.5,
          }}
        >
          <EmailIcon
            sx={{ color: 'text.secondary', fontSize: 18, flexShrink: 0 }}
          />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ lineHeight: 1.2 }}
            >
              Email
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ fontFamily: lexendFont.style.fontFamily }}
            >
              {user?.email || '—'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ px: 2, pt: 1, pb: 0 }}>
          <TextFieldCopyTemplate
            label="API KEY"
            disabled
            value={gyUser.apiKey as string}
          />
        </Box>
      </Box>

      {/* ===== MOBILE: edit fields (edit mode) ===== */}
      <Box
        sx={{
          display: { xs: isEditing ? 'flex' : 'none', sm: 'none' },
          flexDirection: 'column',
          gap: '16px',
          mb: '16px',
          width: '100%',
        }}
      >
        <TextField
          fullWidth
          value={editData.username}
          onChange={(e) =>
            setEditData({ ...editData, username: e.target.value })
          }
          label="Username"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: colors.primary.main },
            },
          }}
          slotProps={{
            htmlInput: {
              style: {
                fontFamily: lexendFont.style.fontFamily,
                fontWeight: 600,
              },
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: '8px', width: '100%' }}>
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
            variant="outlined"
            error={prefixError}
            helperText={prefixError ? 'Format: +XX' : ''}
            sx={{
              width: '90px',
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: colors.primary.main },
              },
            }}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: lexendFont.style.fontFamily,
                  textAlign: 'center',
                },
              },
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
            variant="outlined"
            error={digitsError}
            helperText={digitsError ? 'Phone number is required' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: colors.primary.main },
              },
            }}
            slotProps={{
              htmlInput: { style: { fontFamily: lexendFont.style.fontFamily } },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <TextFieldCopyTemplate
              label="API KEY"
              disabled
              value={gyUser.apiKey as string}
            />
          </Box>
          <IconButton
            disabled={isUpdatingAPIKEY}
            onClick={updateApiKey}
            sx={{
              mb: '8px',
              width: '48px',
              height: '48px',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(140, 84, 255, 0.1)',
              },
            }}
          >
            <motion.div
              animate={{ rotate: isUpdatingAPIKEY ? 360 : 0 }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
                repeat: isUpdatingAPIKEY ? Infinity : 0,
              }}
            >
              <RefreshIcon />
            </motion.div>
          </IconButton>
        </Box>
      </Box>

      {/* ===== DESKTOP: existing layout ===== */}

      {/* Username */}
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {isEditing ? (
            <TextField
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              sx={{
                mb: '8px',
                borderBottom: '2px solid #8C54FF',
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .MuiInput-underline:before': {
                    borderBottomColor: colors.primary.light,
                  },
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primary.main,
                },
              }}
              variant="standard"
              slotProps={{
                htmlInput: {
                  style: {
                    fontFamily: lexendFont.style.fontFamily,
                    width: '100%',
                    maxWidth: '300px',
                    fontWeight: '700',
                    fontSize: '25px',
                    borderRadius: '20px',
                  },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <TextField
              disabled
              value={gyUser.username}
              variant="standard"
              sx={(theme) => ({
                mb: '8px',
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              })}
              slotProps={{
                htmlInput: {
                  style: {
                    fontFamily: lexendFont.style.fontFamily,
                    width: 'auto',
                    fontWeight: '700',
                    fontSize: '25px',
                    borderRadius: '20px',
                  },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={(theme) => ({ color: theme.palette.text.primary })}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </Box>
      </motion.div>

      {/* Phone + Email */}
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row-reverse',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          {isEditing ? (
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                width: '100%',
                mb: '8px',
                alignItems: 'flex-end',
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
                variant="standard"
                error={prefixError}
                helperText={prefixError ? 'Format: +XX' : ''}
                sx={{
                  width: '70px',
                  flexShrink: 0,
                  borderBottom: '2px solid #8C54FF',
                  '& .MuiInput-underline:after': {
                    borderBottomColor: colors.primary.main,
                  },
                }}
                slotProps={{
                  htmlInput: {
                    style: {
                      fontFamily: lexendFont.style.fontFamily,
                      textAlign: 'center',
                    },
                  },
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
                variant="standard"
                error={digitsError}
                helperText={digitsError ? 'Phone number is required' : ''}
                sx={{
                  borderBottom: '2px solid #8C54FF',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    '& .MuiInput-underline:before': {
                      borderBottomColor: colors.primary.light,
                    },
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: colors.primary.main,
                  },
                }}
                slotProps={{
                  htmlInput: {
                    style: { fontFamily: lexendFont.style.fontFamily },
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroidIcon
                          sx={(theme) => ({
                            color: theme.palette.text.primary,
                          })}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          ) : (
            <TextField
              fullWidth
              disabled
              value={gyUser.phoneNumber}
              variant="standard"
              sx={(theme) => ({
                mb: '8px',
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              })}
              slotProps={{
                htmlInput: {
                  style: { fontFamily: lexendFont.style.fontFamily },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidIcon
                        sx={(theme) => ({ color: theme.palette.text.primary })}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          <TextField
            fullWidth
            value={user?.email}
            disabled
            variant="standard"
            sx={{ mb: '8px', transition: 'all 0.3s ease' }}
            slotProps={{
              htmlInput: { style: { fontFamily: lexendFont.style.fontFamily } },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'gray' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </motion.div>

      {/* API Key */}
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.7 }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextFieldCopyTemplate
            label="API KEY"
            disabled
            value={gyUser.apiKey as string}
          />
          {isEditing && (
            <IconButton
              disabled={isUpdatingAPIKEY}
              onClick={updateApiKey}
              sx={{
                width: '48px',
                height: '48px',
                marginTop: '-6px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(140, 84, 255, 0.1)',
                },
              }}
            >
              <motion.div
                animate={{ rotate: isUpdatingAPIKEY ? 360 : 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                  repeat: isUpdatingAPIKEY ? Infinity : 0,
                }}
              >
                <RefreshIcon sx={{ width: '32px', height: '32px' }} />
              </motion.div>
            </IconButton>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
