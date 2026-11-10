import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { installMatchMedia } from '../../../../jest.setup';
import { buildTheme, ThemeProviderComponent, useTheme } from './ThemeContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProviderComponent>{children}</ThemeProviderComponent>
);

describe('ThemeProviderComponent', () => {
  afterEach(() => {
    localStorage.clear();
    installMatchMedia(false);
  });

  it('uses the saved mode and toggles it, remembering the choice', () => {
    localStorage.setItem('themeMode', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.themeMode).toBe('light');
    act(() => result.current.toggleTheme());
    expect(result.current.themeMode).toBe('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
    act(() => result.current.toggleTheme());
    expect(result.current.themeMode).toBe('light');
  });

  it('follows the system preference when nothing is saved', () => {
    installMatchMedia(true);
    expect(
      renderHook(() => useTheme(), { wrapper }).result.current.themeMode
    ).toBe('dark');

    installMatchMedia(false);
    expect(
      renderHook(() => useTheme(), { wrapper }).result.current.themeMode
    ).toBe('light');
  });

  it('marks <html> for the light-motion mode and renders its children', () => {
    render(
      <ThemeProviderComponent>
        <p>child</p>
      </ThemeProviderComponent>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
    expect(document.documentElement.dataset.lite).toBe('false');
  });

  it('fails outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme debe usarse dentro de ThemeProviderComponent'
    );
  });

  it('builds both palettes', () => {
    expect(buildTheme(true).palette.mode).toBe('dark');
    expect(buildTheme(false).palette.background.default).toBe('#ffffff');
  });
});
