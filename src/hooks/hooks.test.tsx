import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import type { UserProfile } from '@gycoding/nebula';
import { getUser, updateApiKey, updateUser } from '@/services/user';
import { installMatchMedia } from '../../jest.setup';
import { detectLiteMotion, useLiteMotion } from './useLiteMotion';
import { useUser } from './useUser';

jest.mock('@/services/user', () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
  updateApiKey: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);
const profile = { username: 'ana' } as UserProfile;

describe('useUser', () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockResolvedValue(profile);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('loads the profile', async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(profile));
  });

  it('updates the profile and flags success', async () => {
    (updateUser as jest.Mock).mockResolvedValue(profile);
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(() => result.current.update(profile));

    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isErrorUpdate).toBe(false);
    act(() => {
      result.current.setIsUpdated(false);
      result.current.setIsErrorUpdate(true);
    });
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isErrorUpdate).toBe(true);
  });

  it('flags and rethrows update errors', async () => {
    (updateUser as jest.Mock).mockRejectedValue(new Error('down'));
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(() =>
      expect(result.current.update(profile)).rejects.toThrow('down')
    );

    expect(result.current.isErrorUpdate).toBe(true);
    expect(result.current.isLoadingUpdate).toBe(false);
  });

  it('refreshes the API key and flags success', async () => {
    (updateApiKey as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await result.current.refreshApiKey();
    });

    expect(result.current.isUpdatedAPIKEY).toBe(true);
    act(() => {
      result.current.setIsUpdatedAPIKEY(false);
      result.current.setIsErrorUpdateAPIKEY(true);
    });
    expect(result.current.isErrorUpdateAPIKEY).toBe(true);
  });

  it('flags API key errors', async () => {
    (updateApiKey as jest.Mock).mockRejectedValue(new Error('down'));
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      await expect(result.current.refreshApiKey()).rejects.toThrow('down');
    });

    expect(result.current.isErrorUpdateAPIKEY).toBe(true);
    expect(result.current.isUpdatingAPIKEY).toBe(false);
  });
});

describe('useLiteMotion', () => {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  afterEach(() => {
    installMatchMedia(false);
    Object.defineProperty(nav, 'hardwareConcurrency', {
      value: 8,
      configurable: true,
    });
    delete nav.deviceMemory;
    delete nav.connection;
  });

  it('is off on a capable desktop', () => {
    Object.defineProperty(nav, 'hardwareConcurrency', {
      value: 8,
      configurable: true,
    });
    expect(detectLiteMotion()).toBe(false);
    const { result, unmount } = renderHook(() => useLiteMotion());
    expect(result.current).toBe(false);
    unmount();
  });

  it.each([
    ['a touch screen', () => installMatchMedia(true)],
    [
      'few CPU cores',
      () =>
        Object.defineProperty(nav, 'hardwareConcurrency', {
          value: 2,
          configurable: true,
        }),
    ],
    ['little memory', () => Object.assign(nav, { deviceMemory: 2 })],
    [
      'data saver',
      () => Object.assign(nav, { connection: { saveData: true } }),
    ],
  ])('turns on with %s', (_label, arrange) => {
    arrange();
    expect(detectLiteMotion()).toBe(true);
  });

  it('defaults hardware hints when the browser does not expose them', () => {
    Object.defineProperty(nav, 'hardwareConcurrency', {
      value: undefined,
      configurable: true,
    });
    expect(detectLiteMotion()).toBe(false);
  });
});
