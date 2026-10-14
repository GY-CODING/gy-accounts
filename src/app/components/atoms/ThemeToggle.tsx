/* eslint-disable react/react-in-jsx-scope */
'use client';

import { glassIconButtonSx } from '@/utils/theme/gy';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { IconButton, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

interface ThemeToggleProps {
  onToggle: () => void;
}

// Botón de tema de cristal, idéntico al de gy-web (sustituye al antiguo ThemeSwitch).
export default function ThemeToggle({ onToggle }: ThemeToggleProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      sx={{ ...glassIconButtonSx(isDark), overflow: 'hidden' }}
    >
      {/* El icono sale por arriba y entra el nuevo por abajo girando */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex' }}
        >
          {isDark ? (
            <LightModeRoundedIcon
              sx={{ fontSize: '1.25rem', color: '#fbbf24' }}
            />
          ) : (
            <DarkModeRoundedIcon
              sx={{ fontSize: '1.25rem', color: '#6366f1' }}
            />
          )}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}
