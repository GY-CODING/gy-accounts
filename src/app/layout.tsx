// src/app/layout.tsx
import { ThemeProviderComponent } from './components/organisms/ThemeContext';
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { lexendFont, valorantFont } from '@/utils/fonts';
// Antes globals.css no se importaba en ningún sitio
import './globals.css';

export const metadata: Metadata = {
  title: 'GY Accounts - Dashboard',
  description: 'Manage your GYCODING account settings and preferences',
  icons: {
    icon: '/gy-logo.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Las clases de next/font aseguran que Lexend y Valorant se cargan desde el principio
    <html
      lang="en"
      className={`${lexendFont.variable} ${valorantFont.variable}`}
    >
      <body>
        {/* Recoge los estilos de Emotion en el servidor para que coincidan con los del
            cliente. Sin esto, al re-renderizar (p. ej. hover en el header) algunos
            elementos cogían estilos de otros y cambiaban de fuente. */}
        <AppRouterCacheProvider>
          <UserProvider>
            <ThemeProviderComponent>
              {/* The only page is the dashboard, and it brings its own bar, background and
                  footer (components/v2/DashboardV2.tsx) — the old PageBackdrop/Header/Footer
                  stay in the repo, just unrouted, the same as DashboardV1. */}
              {children}
            </ThemeProviderComponent>
          </UserProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
