/* eslint-disable react/react-in-jsx-scope */
'use client';

import { MenuItem } from '@/utils/menuItems';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface NavItemProps {
  item: MenuItem;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

// Ítem de navegación del header (port de gy-web/components/menuItem.tsx).
export default function NavItem({
  item,
  index,
  isHovered,
  onHover,
}: NavItemProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasChildren = !!item.children?.length;

  const content = (
    <Box
      onMouseEnter={() => onHover(index)}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        padding: '8px 14px',
        cursor: 'pointer',
        borderRadius: '12px',
      }}
    >
      {/* Pastilla de hover compartida: `layoutId` hace que se deslice
          de un ítem a otro en vez de aparecer/desaparecer */}
      {isHovered && (
        <motion.div
          layoutId="nav-hover-pill"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          }}
        />
      )}

      <Typography
        sx={{
          position: 'relative',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: isDark
            ? isHovered
              ? '#fff'
              : 'grey.300'
            : isHovered
              ? '#000'
              : 'grey.700',
          transition: 'color 0.2s ease',
        }}
      >
        {item.title}
      </Typography>

      {/* Flecha que gira cuando el desplegable está abierto */}
      {hasChildren && (
        <KeyboardArrowDownRoundedIcon
          sx={{
            position: 'relative',
            fontSize: '1.1rem',
            color: isDark ? 'grey.400' : 'grey.600',
            transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        />
      )}
    </Box>
  );

  // Con hijos no es un enlace: abre el FloatingMenu
  if (hasChildren) return content;

  return (
    <a href={item.path} style={{ textDecoration: 'none' }}>
      {content}
    </a>
  );
}
