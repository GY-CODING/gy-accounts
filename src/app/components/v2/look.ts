'use client';

// Los dos temas del dashboard. Cada uno es una composición de dos tramos en tonos opuestos, como
// las baldosas de gy-web: en **claro** la portada es blanca con la tarjeta clara y la hoja de datos
// es negra; en **oscuro** la portada y la tarjeta son oscuras y la hoja de datos es clara.
// Los colores salen de aquí (no de ternarios sueltos) para que IdentityScene, Skeleton y
// DashboardV2 no se descuadren entre sí; el modo lo marca el interruptor del menú de usuario
// (ThemeContext, que lo guarda en localStorage).

import { useTheme } from '@mui/material';

export type Tone = 'hero' | 'info' | 'api';

export const look = (dark: boolean) =>
  dark
    ? {
        dark,
        // Colores de la página según el capítulo centrado en pantalla.
        tone: {
          hero: { bg: '#0c0820', ink: '#f2f0f7', soft: '#b3abd0' },
          info: { bg: '#f5f5f7', ink: '#1d1d1f', soft: '#6e6e73' },
          api: { bg: '#07070b', ink: '#f5f5f7', soft: '#a1a1a6' },
        },
        // La hoja de datos (clara) y sus baldosas blancas.
        sheet: {
          bg: '#f5f5f7',
          ink: '#1d1d1f',
          soft: '#6e6e73',
          line: 'rgba(0,0,0,0.06)',
          accent: '#6d28d9',
          accentText: '#7c3aed',
          pillBg: 'rgba(140,84,255,0.10)',
          pillRing: 'inset 0 0 0 1px rgba(140,84,255,0.22)',
          chips: 'light' as const,
        },
        tile: {
          bg: '#ffffff',
          rest: '0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
          ring: '0 0 0 2px #8C54FF, 0 20px 40px -24px rgba(140,84,255,0.45)',
          identity:
            'radial-gradient(120% 70% at 0% 0%, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0) 60%), radial-gradient(90% 60% at 100% 100%, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0) 60%), #ffffff',
        },
        // La tarjeta (oscura) sobre el escenario oscuro.
        card: {
          bg: 'linear-gradient(150deg, #24104f 0%, #140a33 45%, #0a0620 100%)',
          ink: '#f5f0ff',
          sub: '#c9bdf0',
          ring: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
          grid: '#8C54FF1c',
          glow: 'rgba(168,85,247,0.45)',
          keyBg: '#f5f0ff',
          keyRing: 'none',
          chips: 'dark' as const,
        },
        stage: {
          glow: 'rgba(140,84,255,0.30)',
          monument: 'color-mix(in srgb, var(--tone-ink) 90%, transparent)',
          floor: 'rgba(10,0,30,0.5)',
        },
        skeleton: {
          stageBlock: 'rgba(242,240,247,0.07)',
          stageShine: 'rgba(255,255,255,0.06)',
          cardBlock: 'rgba(245,240,255,0.10)',
          cardShine: 'rgba(255,255,255,0.07)',
          sheetBlock: 'rgba(29,29,31,0.07)',
          sheetShine: 'rgba(255,255,255,0.7)',
          tile: '#ffffff',
          tileRing: '0 0 0 1px rgba(0,0,0,0.05)',
        },
      }
    : {
        dark,
        tone: {
          hero: { bg: '#ffffff', ink: '#140b33', soft: '#5a5375' },
          info: { bg: '#0b0a12', ink: '#f5f5f7', soft: '#a1a1a6' },
          api: { bg: '#07070b', ink: '#f5f5f7', soft: '#a1a1a6' },
        },
        sheet: {
          bg: '#0b0a12',
          ink: '#f5f5f7',
          soft: '#a1a1a6',
          line: 'rgba(255,255,255,0.08)',
          accent: '#c9b4ff',
          accentText: '#c9b4ff',
          pillBg: 'rgba(140,84,255,0.16)',
          pillRing: 'inset 0 0 0 1px rgba(140,84,255,0.32)',
          chips: 'dark' as const,
        },
        tile: {
          bg: '#15131f',
          rest: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
          ring: '0 0 0 2px #8C54FF, 0 20px 40px -24px rgba(140,84,255,0.55)',
          identity:
            'radial-gradient(120% 70% at 0% 0%, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0) 62%), radial-gradient(90% 60% at 100% 100%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 62%), #15131f',
        },
        // Tarjeta clara sobre blanco: se separa por la sombra y el filete, como una física.
        card: {
          bg: 'linear-gradient(150deg, #ffffff 0%, #fbf9ff 45%, #f3eeff 100%)',
          ink: '#140b33',
          sub: '#5a5375',
          ring: 'inset 0 0 0 1px rgba(20,11,51,0.08), 0 30px 60px -28px rgba(20,11,51,0.35)',
          grid: '#8C54FF26',
          glow: 'rgba(168,85,247,0.22)',
          keyBg: '#f2edff',
          keyRing: 'inset 0 0 0 1px rgba(140,84,255,0.28)',
          chips: 'light' as const,
        },
        stage: {
          glow: 'rgba(140,84,255,0.16)',
          // Decoración, no texto: sobre blanco va como un fantasma violeta, no en tinta.
          monument: 'color-mix(in srgb, #8C54FF 13%, #ffffff)',
          floor: 'rgba(20,11,51,0.22)',
        },
        skeleton: {
          stageBlock: 'rgba(20,11,51,0.07)',
          stageShine: 'rgba(255,255,255,0.55)',
          cardBlock: 'rgba(20,11,51,0.08)',
          cardShine: 'rgba(255,255,255,0.6)',
          sheetBlock: 'rgba(245,245,247,0.08)',
          sheetShine: 'rgba(255,255,255,0.06)',
          tile: '#15131f',
          tileRing: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
        },
      };

export type Look = ReturnType<typeof look>;

/** La paleta del tema activo (el modo lo da el ThemeProvider de MUI de la app). */
export const useLook = (): Look => look(useTheme().palette.mode === 'dark');
