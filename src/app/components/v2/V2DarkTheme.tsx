'use client';

// /v2 is dark only (the team's call: it reads fine in both themes, so there is no toggle and no
// reason to carry the live app's light/dark state here). This nests its own MUI ThemeProvider
// inside the app's real one, forced to dark, so every MUI component in the /v2 subtree —
// including the ones that read `useTheme().palette.mode` directly, like IdentityScene and
// DashboardSkeleton — renders dark regardless of what the rest of the app is set to. It never
// touches the shared ThemeContext or its localStorage, so leaving /v2 leaves the real app's theme
// exactly as the visitor had it.

import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useMemo } from 'react';
import { buildTheme } from '../organisms/ThemeContext';

export default function V2DarkTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(() => buildTheme(true), []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
