'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

// The /v2 prototype brings its own bar, background and footer; the current chrome hides there.
export default function HideOnV2({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path?.startsWith('/v2')) return null;
  return <>{children}</>;
}
