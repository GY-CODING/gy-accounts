/* eslint-disable react/react-in-jsx-scope */
// src/app/components/organisms/Header.tsx

'use client';

import { useLiteMotion } from '@/hooks/useLiteMotion';
import { getUser } from '@/services/user';
import { GYCODING_URL, menuItems } from '@/utils/menuItems';
import {
  border,
  glassIconButtonSx,
  product,
  shadow,
  surface,
} from '@/utils/theme/gy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ThemeToggle from '../atoms/ThemeToggle';
import FloatingMenu from './header/FloatingMenu';
import MobileMenu from './header/MobileMenu';
import NavItem from './header/NavItem';
import { useTheme } from './ThemeContext';

// Header de la suite (port de gy-web/components/Header.tsx).
// Diferencia: donde gy-web tiene el botón "Login", aquí va la cuenta del usuario.
export default function Header(): JSX.Element {
  const { toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  // Navegación de escritorio desde `md` (900px), como en la web
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // En modo ligero no hay blur detrás de la barra, así que se hace casi opaca
  const lite = useLiteMotion();

  // Misma clave SWR que la página: no duplica la petición y se refresca al guardar el perfil
  const { data: gyUser } = useSWR('/api/auth/profile', getUser);

  // Barra de progreso de scroll con muelle suave
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // Transparente arriba del todo, cristal en cuanto se hace scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Si se pasa a escritorio con el menú móvil abierto, se cierra
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  // Sólido mientras haya un menú abierto, para que el panel no flote sobre una barra transparente
  const solid = scrolled || mobileMenuOpen || hoveredIndex !== null;

  return (
    <Box
      component="header"
      // El desplegable es hijo del header: salir del header es la señal fiable para cerrarlo
      onMouseLeave={() => setHoveredIndex(null)}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 1000,
        // El cristal va en un pseudo-elemento: backdrop-filter en el propio header lo
        // convertiría en containing block de los paneles `fixed` y los descolocaría.
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundColor: solid
            ? lite
              ? isDark
                ? 'rgba(10,10,14,0.94)'
                : 'rgba(255,255,255,0.95)'
              : surface(isDark).overlay
            : 'transparent',
          backdropFilter: solid ? 'blur(16px) saturate(160%)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(16px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${solid ? border(isDark).subtle : 'transparent'}`,
          boxShadow: solid ? shadow.header(isDark) : 'none',
          transition:
            'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        },
      }}
    >
      {/* Contenedor centrado de 1200px */}
      <Box
        sx={{
          maxWidth: '1200px',
          height: '100%',
          margin: '0 auto',
          padding: { xs: '0 1rem', sm: '0 2rem' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Izquierda: logo + navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a
            href={GYCODING_URL}
            aria-label="GYCODING"
            onMouseEnter={() => setHoveredIndex(null)}
          >
            <Box
              component={motion.div}
              whileHover={{ scale: 1.06, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                position: 'relative',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/gy-logo.png"
                alt="GYCODING"
                fill
                sizes="40px"
                style={{ objectFit: 'contain' }}
                priority
                unoptimized
              />
            </Box>
          </a>

          {/* Visible desde md por CSS (no por JS): así el HTML del servidor ya sale bien en móvil */}
          <Box
            component="nav"
            sx={{ display: { xs: 'none', md: 'flex' }, gap: '0.25rem' }}
          >
            {menuItems.map((item, index) => (
              <NavItem
                key={item.title}
                item={item}
                index={index}
                isHovered={hoveredIndex === index}
                onHover={setHoveredIndex}
              />
            ))}
          </Box>
        </Box>

        {/* Derecha: tema + cuenta (escritorio) o hamburguesa (móvil) */}
        <Box
          onMouseEnter={() => setHoveredIndex(null)}
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
        >
          <ThemeToggle onToggle={toggleTheme} />
          {/* Hamburguesa: solo por debajo de md (CSS) */}
          <IconButton
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
            sx={{
              ...glassIconButtonSx(isDark),
              display: { xs: 'inline-flex', md: 'none' },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                {mobileMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
              </motion.span>
            </AnimatePresence>
          </IconButton>
          {/* Píldora de cuenta (solo desde md): avatar con anillo en gradiente + username */}
          {gyUser && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                alignItems: 'center',
                gap: 1,
                ml: 1,
                height: 40,
                pl: 0.5,
                pr: 1.75,
                borderRadius: '12px',
                border: `1px solid ${border(isDark).default}`,
                background: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  p: '2px',
                  borderRadius: '9px',
                  background: product.gradient,
                }}
              >
                <Avatar
                  src={gyUser.picture || undefined}
                  alt={gyUser.username}
                  variant="rounded"
                  sx={{ width: 28, height: 28, borderRadius: '7px' }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {gyUser.username}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Barra de progreso de scroll de 2px en el borde inferior */}
      <motion.div
        style={{
          scaleX: progress,
          transformOrigin: '0% 50%',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 2,
          background: product.gradient,
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {!isMobile && (
        <FloatingMenu
          items={menuItems}
          activeIndex={hoveredIndex}
          onHover={setHoveredIndex}
        />
      )}

      <MobileMenu
        isOpen={mobileMenuOpen}
        menuItems={menuItems}
        onClose={() => setMobileMenuOpen(false)}
      />
    </Box>
  );
}
