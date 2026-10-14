// src/app/components/organisms/ThemeContext.tsx
'use client';
import { ETheme } from '@/utils/constants/theme.enum'; // Enum para los temas
import { lexendFont } from '@/utils/fonts';
import { border, product, radius, surface, text } from '@/utils/theme/gy';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { MotionConfig } from 'framer-motion';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Definir el contexto
interface ThemeContextType {
  themeMode: ETheme;
  toggleTheme: () => void;
}

// Creamos el contexto con un valor por defecto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Proveedor del contexto
export const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // "Oscuro primero" (principio 1 de la guía): se arranca en oscuro hasta leer la preferencia.
  const [themeMode, setThemeMode] = useState<ETheme>(ETheme.DARK);

  // Cargar el tema desde localStorage o usar el preferido del sistema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ETheme | null;
      if (savedMode) {
        setThemeMode(savedMode);
      } else {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setThemeMode(prefersDark ? ETheme.DARK : ETheme.LIGHT);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newThemeMode =
      themeMode === ETheme.LIGHT ? ETheme.DARK : ETheme.LIGHT;
    setThemeMode(newThemeMode);
    localStorage.setItem('themeMode', newThemeMode);
  };

  const isDark = themeMode === ETheme.DARK;
  const borders = border(isDark);
  const texts = text(isDark);

  // Tema de la suite GYCODING con la paleta de GY Accounts
  const theme = createTheme({
    palette: {
      mode: themeMode,
      // primary = violeta de Accounts (botones, focus, links)
      primary: {
        main: product.primary,
        light: product.accent,
        dark: '#6B40CC',
        contrastText: '#ffffff',
      },
      secondary: { main: product.secondary },
      // Fondos base de la guía; el fondo visible lo pinta PageBackdrop
      background: {
        default: isDark ? '#121212' : '#ffffff',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: texts.primary,
        secondary: texts.secondary,
      },
      divider: borders.default,
      // Colores de estado más suaves que los neón anteriores
      info: { main: product.primary },
      success: { main: '#22c55e' },
      error: { main: '#ef4444' },
      warning: { main: '#f59e0b' },
    },
    typography: {
      // Importante: usar el nombre que genera next/font, no 'Lexend' a pelo
      // (si no, la fuente no se carga y se ve la de sistema).
      fontFamily: lexendFont.style.fontFamily,
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: radius.sm },
    components: {
      // Todos los TextField son "outlined" por defecto
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
      },
      // Inputs de cristal: radio 14, borde 1px, hover violeta y anillo de focus
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: `${radius.md}px`,
            backgroundColor: surface(isDark).glass,
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: borders.default,
              transition: 'border-color 0.2s ease',
            },
            '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline':
              { borderColor: borders.hover },
            '&.Mui-focused': {
              backgroundColor: surface(isDark).hoverBrand,
              boxShadow: `0 0 0 4px ${product.primary}22`,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: product.primary,
              borderWidth: '1px',
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: borders.subtle,
            },
          },
          input: {
            // Los campos deshabilitados se leen bien (MUI los deja casi invisibles)
            '&.Mui-disabled': { WebkitTextFillColor: texts.secondary },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: texts.tertiary,
            '&.Mui-focused': { color: product.primary },
          },
        },
      },
      // Botones sin mayúsculas forzadas y con radio 14
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: `${radius.md}px`,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      // Tooltips oscuros de cristal con Lexend
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontFamily: lexendFont.style.fontFamily,
            borderRadius: `${radius.xs}px`,
            backgroundColor: 'rgba(14,14,20,0.92)',
            border: `1px solid ${border(true).default}`,
          },
          arrow: { color: 'rgba(14,14,20,0.92)' },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Respeta prefers-reduced-motion en todas las animaciones de Framer */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProviderComponent');
  }
  return context;
};
