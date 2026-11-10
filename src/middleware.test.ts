/**
 * @jest-environment node
 */
import { NextFetchEvent, NextRequest } from 'next/server';

const requireAuth = jest.fn(() => 'auth-required');
jest.mock('@auth0/nextjs-auth0/edge', () => ({
  withMiddlewareAuthRequired: () => requireAuth,
}));

const loadMiddleware = (nodeEnv: string) => {
  (process.env as Record<string, string>).NODE_ENV = nodeEnv;
  let mod: typeof import('./middleware') | undefined;
  jest.isolateModules(() => {
    mod = jest.requireActual<typeof import('./middleware')>('./middleware');
  });
  return mod!;
};

const run = (nodeEnv: string, url: string) =>
  loadMiddleware(nodeEnv).default(new NextRequest(url), {} as NextFetchEvent);

describe('middleware', () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    (process.env as Record<string, string>).NODE_ENV = originalEnv as string;
    requireAuth.mockClear();
  });

  it('requires a session in production, even with ?demo', () => {
    expect(run('production', 'http://localhost/?demo')).toBe('auth-required');
  });

  it('lets ?demo and public images through in development', () => {
    expect(run('development', 'http://localhost/?demo')).not.toBe(
      'auth-required'
    );
    expect(run('development', 'http://localhost/icons/logo.png')).not.toBe(
      'auth-required'
    );
    expect(requireAuth).not.toHaveBeenCalled();
  });

  it('requires a session for other development routes', () => {
    expect(run('development', 'http://localhost/')).toBe('auth-required');
  });

  it('skips auth, API auth and static assets in the matcher', () => {
    expect(loadMiddleware('test').config.matcher[0]).toContain('api/auth');
  });
});
