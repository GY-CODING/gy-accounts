import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { buildTheme } from '@/app/components/organisms/ThemeContext';

/** Renders inside the app's MUI theme in the given mode. */
export const renderWithTheme = (ui: React.ReactElement, dark = true) =>
  render(<ThemeProvider theme={buildTheme(dark)}>{ui}</ThemeProvider>);
