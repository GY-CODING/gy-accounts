import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { buildTheme } from '@/app/components/organisms/ThemeContext';
import { look, useLook } from '@/app/components/v2/look';
import {
  auroraColors,
  border,
  easeOut,
  glassIconButtonSx,
  overlineSx,
  product,
  reveal,
  shadow,
  surface,
  text,
} from './gy';

describe('suite tokens', () => {
  it.each([true, false])('builds every token for dark=%s', (dark) => {
    expect(surface(dark).card).toContain('rgba');
    expect(border(dark).hover).toBe('rgba(140,84,255,0.5)');
    expect(text(dark).primary).toBe(dark ? '#ffffff' : '#000000');
    expect(shadow.card(dark)).toContain('rgba');
    expect(shadow.header(dark)).toContain('rgba');
    expect(shadow.popover(dark)).toContain('rgba');
    expect(product.glow(dark)).toContain(dark ? '0.25' : '0.4');
    expect(overlineSx(dark).textTransform).toBe('uppercase');
    expect(glassIconButtonSx(dark).width).toBe(40);
  });

  it('exposes the brand colours and the reveal animation', () => {
    expect(auroraColors).toEqual([
      product.primary,
      product.accent,
      product.secondary,
    ]);
    expect(shadow.cta).toContain(product.primary);
    expect(reveal().transition.delay).toBe(0);
    expect(reveal(0.2).transition.delay).toBe(0.2);
    expect(reveal().transition.ease).toBe(easeOut);
  });
});

describe('dashboard look', () => {
  it('has opposite tones in each mode', () => {
    expect(look(true).card.chips).toBe('dark');
    expect(look(false).card.chips).toBe('light');
    expect(look(false).stage.monument).toContain('var(--tone-ink)');
  });

  it.each([true, false])('follows the MUI theme (dark=%s)', (dark) => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeProvider, { theme: buildTheme(dark) }, children);
    expect(renderHook(() => useLook(), { wrapper }).result.current.dark).toBe(
      dark
    );
  });
});
