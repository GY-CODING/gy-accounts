import { act, renderHook } from '@testing-library/react';
import { DEMO_USER, useDemoFlag, useDemoUser } from './demo';

describe('demo mode', () => {
  const nodeEnv = process.env.NODE_ENV;
  afterEach(() => {
    (process.env as Record<string, string>).NODE_ENV = nodeEnv as string;
    window.history.replaceState(null, '', '/');
  });

  it.each([
    ['/?demo', 'development', 'full'],
    ['/?demo=loading', 'development', 'loading'],
    ['/', 'development', null],
    ['/?demo', 'production', null],
  ])('%s in %s → %s', (url, env, expected) => {
    (process.env as Record<string, string>).NODE_ENV = env;
    window.history.replaceState(null, '', url);
    expect(renderHook(() => useDemoFlag()).result.current).toBe(expected);
  });

  it('serves the demo account, or nothing while loading', () => {
    expect(renderHook(() => useDemoUser(false)).result.current.data).toEqual(
      DEMO_USER
    );
    expect(
      renderHook(() => useDemoUser(true)).result.current.data
    ).toBeUndefined();
  });

  it('simulates saving and a new API key, and never fails', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useDemoUser(false));

    let saving: Promise<void>;
    act(() => {
      saving = result.current.update({ ...DEMO_USER, username: 'demo' });
    });
    expect(result.current.isLoadingUpdate).toBe(true);
    await act(async () => {
      jest.runAllTimers();
      await saving;
    });
    expect(result.current.data?.username).toBe('demo');
    expect(result.current.isUpdated).toBe(true);

    let refreshing: Promise<void>;
    act(() => {
      refreshing = result.current.refreshApiKey();
    });
    expect(result.current.isUpdatingAPIKEY).toBe(true);
    await act(async () => {
      jest.runAllTimers();
      await refreshing;
    });
    expect(result.current.data?.apiKey).toMatch(/^gy_demo_/);
    expect(result.current.data?.apiKey).not.toBe(DEMO_USER.apiKey);
    expect(result.current.isUpdatedAPIKEY).toBe(true);

    // The error flags are fixed to false; their setters are no-ops.
    act(() => {
      result.current.setIsErrorUpdate();
      result.current.setIsErrorUpdateAPIKEY();
    });
    expect(result.current.isErrorUpdate).toBe(false);
    expect(result.current.isErrorUpdateAPIKEY).toBe(false);
    jest.useRealTimers();
  });
});
