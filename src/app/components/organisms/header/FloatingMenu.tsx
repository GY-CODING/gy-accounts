/* eslint-disable react/react-in-jsx-scope */
'use client';

import { MenuItem } from '@/utils/menuItems';
import { border, product, shadow, surface } from '@/utils/theme/gy';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface FloatingMenuProps {
  items: MenuItem[];
  activeIndex: number | null;
  onHover: (index: number | null) => void;
}

// Desplegable de escritorio (port de gy-web/components/FloatingMenu.tsx).
export default function FloatingMenu({
  items,
  activeIndex,
  onHover,
}: FloatingMenuProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Hijos del ítem sobre el que está el ratón (vacío = menú cerrado)
  const activeChildren =
    (activeIndex !== null && items[activeIndex]?.children) || [];
  const isOpen = activeChildren.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Box
          key="floating-menu"
          component={motion.div}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onMouseLeave={() => onHover(null)}
          // Centrado con la `x` de Framer para que no choque con la `y` animada
          style={{ x: '-50%' }}
          sx={{
            position: 'fixed',
            top: '64px',
            left: '50%',
            // Padding transparente: puente entre la barra y el panel para no perder el hover
            pt: '12px',
            zIndex: 999,
          }}
        >
          {/* Panel de cristal (surface-popover) */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: '20px',
              background: surface(isDark).popover,
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: `1px solid ${border(isDark).default}`,
              boxShadow: shadow.popover(isDark),
              display: 'grid',
              gridTemplateColumns: {
                md: `repeat(${Math.min(activeChildren.length, 2)}, 280px)`,
                lg: `repeat(${Math.min(activeChildren.length, 3)}, 280px)`,
              },
              gap: 0.5,
            }}
          >
            {activeChildren.map((item, index) => (
              <a
                key={item.title}
                href={item.path}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => onHover(null)}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.75,
                    p: 1.75,
                    borderRadius: '14px',
                    transition: 'background 0.2s ease',
                    // La flecha aparece y el icono se ilumina al pasar el ratón
                    '& .menu-arrow': {
                      opacity: 0,
                      transform: 'translateX(-4px)',
                    },
                    '&:hover': {
                      background: surface(isDark).hoverBrand,
                      '& .menu-arrow': {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                      '& .menu-icon': { borderColor: border(isDark).hover },
                    },
                  }}
                >
                  {/* Icono del producto en tile de 44px */}
                  {item.icon && (
                    <Box
                      className="menu-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: '12px',
                        background: isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(255,255,255,0.9)',
                        border: `1px solid ${border(isDark).default}`,
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      {/* unoptimized: el middleware de Auth0 bloquearía el optimizador de imágenes */}
                      <Image
                        src={
                          (isDark ? item.icon : item.icon_light) ?? item.icon
                        }
                        alt={item.title}
                        width={24}
                        height={24}
                        unoptimized
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        color: isDark ? '#fff' : 'grey.900',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {item.title}
                      <ArrowForwardRoundedIcon
                        className="menu-arrow"
                        sx={{
                          fontSize: '0.95rem',
                          color: product.primary,
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Box>
                    {item.description && (
                      <Box
                        sx={{
                          color: isDark ? 'grey.400' : 'grey.600',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </Box>
                    )}
                  </Box>
                </Box>
              </a>
            ))}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}
