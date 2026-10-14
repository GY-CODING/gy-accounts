/* eslint-disable react/react-in-jsx-scope */
'use client';

import { MenuItem } from '@/utils/menuItems';
import { border, surface } from '@/utils/theme/gy';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Box, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  onClose: () => void;
}

// Menú móvil (port de gy-web/components/MobileMenu.tsx).
// Diferencia: el botón final es "Log out" en lugar de "Login".
export default function MobileMenu({
  isOpen,
  menuItems,
  onClose,
}: MobileMenuProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const danger = theme.palette.error.main;
  // Qué grupo (Products/Docs/About) está desplegado
  const [expanded, setExpanded] = useState<number | null>(null);

  // Al cerrar el menú se pliegan todos los grupos
  useEffect(() => {
    if (!isOpen) setExpanded(null);
  }, [isOpen]);

  // Estilo de cada fila principal
  const rowSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    px: 2,
    py: 1.5,
    border: 'none',
    background: 'transparent',
    borderRadius: '14px',
    cursor: 'pointer',
    color: isDark ? '#fff' : 'grey.900',
    fontFamily: 'inherit',
    fontSize: '1rem',
    fontWeight: 600,
    textAlign: 'left' as const,
    '&:hover': {
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscurecido: tocar fuera cierra el menú */}
          <Box
            component={motion.div}
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            sx={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              height: 'calc(100vh - 64px)',
              background: 'rgba(0,0,0,0.35)',
              zIndex: 998,
            }}
          />

          {/* Panel flotante de cristal */}
          <Box
            component={motion.div}
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            sx={{
              position: 'fixed',
              top: '72px',
              left: 12,
              right: 12,
              p: 1.5,
              borderRadius: '22px',
              background: isDark
                ? 'rgba(14,14,20,0.92)'
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: `1px solid ${border(isDark).default}`,
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)',
              zIndex: 1000,
              maxHeight: 'calc(100vh - 88px)',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
            {menuItems.map((item, index) => {
              const isExpanded = expanded === index;

              // Ítem simple: enlace directo
              if (!item.children) {
                return (
                  <a key={item.title} href={item.path} onClick={onClose}>
                    <Box sx={rowSx}>{item.title}</Box>
                  </a>
                );
              }

              // Ítem con hijos: acordeón
              return (
                <Box key={item.title}>
                  <Box
                    component="button"
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    sx={rowSx}
                  >
                    {item.title}
                    <KeyboardArrowDownRoundedIcon
                      sx={{
                        color: isDark ? 'grey.400' : 'grey.600',
                        transform: isExpanded
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                      }}
                    />
                  </Box>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="children"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box sx={{ pb: 1, display: 'grid', gap: 0.5 }}>
                          {item.children.map((child) => (
                            <a
                              key={child.title}
                              href={child.path}
                              target={child.external ? '_blank' : undefined}
                              rel={
                                child.external
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                              onClick={onClose}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  px: 2,
                                  py: 1.25,
                                  borderRadius: '14px',
                                  '&:hover': {
                                    background: surface(isDark).hoverBrand,
                                  },
                                }}
                              >
                                {child.icon && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 36,
                                      height: 36,
                                      flexShrink: 0,
                                      borderRadius: '10px',
                                      background: isDark
                                        ? 'rgba(255,255,255,0.05)'
                                        : 'rgba(255,255,255,0.9)',
                                      border: `1px solid ${border(isDark).default}`,
                                    }}
                                  >
                                    <Image
                                      src={
                                        (isDark
                                          ? child.icon
                                          : child.icon_light) ?? child.icon
                                      }
                                      alt={child.title}
                                      width={20}
                                      height={20}
                                      unoptimized
                                    />
                                  </Box>
                                )}
                                <Box sx={{ minWidth: 0 }}>
                                  <Box
                                    sx={{
                                      color: isDark ? '#fff' : 'grey.900',
                                      fontSize: '0.92rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {child.title}
                                  </Box>
                                  {child.description && (
                                    <Box
                                      sx={{
                                        fontSize: '0.8rem',
                                        color: isDark ? 'grey.400' : 'grey.600',
                                        mt: 0.25,
                                      }}
                                    >
                                      {child.description}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </a>
                          ))}
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              );
            })}

            {/* Botón final: cerrar sesión (outline de peligro) */}
            <Box sx={{ p: 1, pt: 1.5 }}>
              <a href="/api/auth/logout" onClick={onClose}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    height: 48,
                    borderRadius: '14px',
                    fontWeight: 600,
                    color: danger,
                    background: surface(isDark).glass,
                    border: `1.5px solid ${danger}66`,
                  }}
                >
                  <LogoutRoundedIcon fontSize="small" />
                  Log out
                </Box>
              </a>
            </Box>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
}
