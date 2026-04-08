// src/app/components/organisms/ThemeContext.tsx
'use client';
import { ETheme } from '@/utils/constants/theme.enum'; // Enum para los temas
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
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
  const [themeMode, setThemeMode] = useState<ETheme>(ETheme.LIGHT);

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

  // Crear el tema dinámico basado en el modo
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#8C54FF',
        light: '#A370FF',
        dark: '#7340E6',
      },
      secondary: {
        main: '#00F5FF',
      },
      background: {
        default: themeMode === ETheme.DARK ? '#0a0a0a' : '#f5f5f5',
        paper: themeMode === ETheme.DARK ? '#121212' : '#FFFFFF',
      },
      text: {
        primary: themeMode === ETheme.DARK ? '#ffffff' : '#000000',
        secondary: themeMode === ETheme.DARK ? '#b3b3b3' : '#666666',
      },
      info: {
        main: '#8C54FF',
      },
      success: {
        main: '#00FF94',
      },
      error: {
        main: '#FF006E',
      },
      warning: {
        main: '#FFD600',
      },
    },
    typography: {
      fontFamily: 'Lexend, sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          slotProps: {
            input: {
              disableUnderline: true,
            },
          },
        },
        styleOverrides: {
          root: {
            '& .MuiFilledInput-root': {
              borderRadius: '12px',
              backgroundColor:
                themeMode === ETheme.DARK
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor:
                  themeMode === ETheme.DARK
                    ? 'rgba(140, 84, 255, 0.08)'
                    : 'rgba(140, 84, 255, 0.05)',
              },
              '&.Mui-focused': {
                backgroundColor:
                  themeMode === ETheme.DARK
                    ? 'rgba(140, 84, 255, 0.12)'
                    : 'rgba(140, 84, 255, 0.08)',
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            boxShadow:
              themeMode === ETheme.DARK
                ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                : '0 20px 60px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
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
