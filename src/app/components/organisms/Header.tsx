/* eslint-disable react/react-in-jsx-scope */
// src/app/components/organisms/Header.tsx

'use client';

import { valorantFont } from '@/utils/fonts';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { ThemeSwitch } from '../atoms/ThemeSwitch';
import { useTheme } from './ThemeContext'; // Importamos el hook useTheme

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps): JSX.Element {
  const { themeMode, toggleTheme } = useTheme(); // Aquí estamos usando el contexto del tema

  return (
    <Box
      sx={(theme) => ({
        background:
          theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: theme.palette.text.primary,
        p: 1,
        fontFamily: valorantFont.style.fontFamily,
        height: '64px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100vw',
        paddingX: '10%',
        borderBottom: `1px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.18)'
            : 'rgba(0, 0, 0, 0.1)'
        }`,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      })}
    >
      <Box display="flex" alignItems="center" gap="1rem" height="100%">
        <Image src="/gycoding.png" alt="gy-image" width={32} height={32} />
        <Typography
          marginTop={'4px'}
          fontSize="20px"
          fontWeight={'bold'}
          fontFamily={valorantFont.style.fontFamily}
          variant="h5"
        >
          {title}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="1rem" height="100%">
        <ThemeSwitch theme={themeMode} setTheme={toggleTheme} />
      </Box>
    </Box>
  );
}
