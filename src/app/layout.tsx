// src/app/layout.tsx
import { ThemeProviderComponent } from './components/organisms/ThemeContext';
import Header from './components/organisms/Header';
import Footer from './components/organisms/Footer';
import PageBackdrop from './components/organisms/PageBackdrop';
import HideOnV2 from './components/organisms/HideOnV2';
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
              {/* Capa 0: fondo fijo (gradiente + aurora + rejilla) */}
              <HideOnV2>
                <PageBackdrop />
              </HideOnV2>
              {/* Capa 1: header, contenido y footer */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  minHeight: '100dvh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <HideOnV2>
                  <Header />
                </HideOnV2>
                <main style={{ flex: 1 }}>{children}</main>
                <HideOnV2>
                  <Footer />
                </HideOnV2>
              </div>
            </ThemeProviderComponent>
          </UserProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
