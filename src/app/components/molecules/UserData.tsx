import { lexendFont } from '@/utils/fonts';
import { Box, TextField, InputAdornment } from '@mui/material';
import React from 'react';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { EditData, User } from '@/domain/user';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface UserDataProps {
  user: UserProfile | undefined;
  gyUser: User;
  isEditing: boolean;
  setEditData: React.Dispatch<React.SetStateAction<EditData>>;
  editData: EditData;
}

export default function UserData({
  user,
  gyUser,
  isEditing,
  setEditData,
  editData,
}: UserDataProps) {
  return (
    <Box
      sx={{
        mb: '20px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'start',
        gap: ['.5rem', '1rem'],
      }}
    >
      {isEditing ? (
        <TextField
          value={editData.username}
          onChange={(e) =>
            setEditData({ ...editData, username: e.target.value })
          }
          sx={{
            mb: '8px',
            borderBottom: '2px solid #8C54FF',
          }}
          variant="standard"
          slotProps={{
            htmlInput: {
              style: {
                fontFamily: lexendFont.style.fontFamily,
                width: '250px',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row-reverse'],
          gap: ['.5rem', '1rem'],
          alignItems: 'center',
          justifyContent: 'start',
          width: '100%',
        }}
      >
        {isEditing ? (
          <TextField
            fullWidth
            value={editData.phoneNumber}
            onChange={(e) =>
              setEditData({
                ...editData,
                phoneNumber: e.target.value,
              })
            }
            variant="standard"
            sx={{
              mb: '8px',
              borderBottom: '2px solid #8C54FF',
            }}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: lexendFont.style.fontFamily,
                },
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
                style: {
                  fontFamily: lexendFont.style.fontFamily,
                },
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
          sx={{ mb: '8px' }}
          slotProps={{
            htmlInput: {
              style: {
                fontFamily: lexendFont.style.fontFamily,
              },
            },
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
    </Box>
  );
}
