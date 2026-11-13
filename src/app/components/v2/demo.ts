'use client';

// Development-only demo of the dashboard: /?demo shows the GYCODING account with no API calls and
// /?demo=loading holds the loading state. Same shape as hooks/useUser, backed by local state.

import { ERole, UserProfile } from '@gycoding/nebula';
import { useEffect, useState } from 'react';

/** Simulated network latency of the demo actions. */
const DEMO_LATENCY_MS = 700;

export const DEMO_USER: UserProfile = {
  username: 'GYCODING',
  email: 'gycoding05@gmail.com',
  phoneNumber: '+34 123456780',
  roles: [ERole.ADMIN, ERole.DEVELOPER, ERole.COMMON],
  picture: '/gy-logo.png',
  apiKey: 'gy_demo_0000000000000000000000',
};

export type DemoMode = 'full' | 'loading' | null;

/** `?demo` shows the demo account and `?demo=loading` holds the skeleton (development only). */
export function useDemoFlag() {
  const [demo, setDemo] = useState<DemoMode>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const q = new URLSearchParams(globalThis.location.search);
    if (q.has('demo'))
      setDemo(q.get('demo') === 'loading' ? 'loading' : 'full');
  }, []);
  return demo;
}

// Same shape as hooks/useUser, backed by local state.
export function useDemoUser(loading: boolean) {
  const [data, setData] = useState<UserProfile>(DEMO_USER);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdatedAPIKEY, setIsUpdatedAPIKEY] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isUpdatingAPIKEY, setIsUpdatingAPIKEY] = useState(false);
  const wait = () => new Promise((r) => setTimeout(r, DEMO_LATENCY_MS));
  return {
    data: loading ? undefined : data,
    isLoading: loading,
    update: async (d: UserProfile) => {
      setIsLoadingUpdate(true);
      await wait();
      setData(d);
      setIsLoadingUpdate(false);
      setIsUpdated(true);
    },
    isLoadingUpdate,
    isErrorUpdate: false,
    setIsErrorUpdate: () => {},
    isUpdated,
    setIsUpdated,
    refreshApiKey: async () => {
      setIsUpdatingAPIKEY(true);
      await wait();
      setData((d) => ({
        ...d,
        apiKey: `gy_demo_${Math.random().toString(16).slice(2, 24)}`,
      }));
      setIsUpdatingAPIKEY(false);
      setIsUpdatedAPIKEY(true);
    },
    isUpdatingAPIKEY,
    isErrorUpdateAPIKEY: false,
    setIsErrorUpdateAPIKEY: () => {},
    isUpdatedAPIKEY,
    setIsUpdatedAPIKEY,
  };
}

// ─── Small parts ───────────────────────────────────────────────────────────────
