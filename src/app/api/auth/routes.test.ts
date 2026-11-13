/**
 * @jest-environment node
 */
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { PATCH } from './apikey/route';
import { GET, PUT } from './profile/route';
import { GET as authHandler } from './[auth0]/route';

jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(),
  // The real wrapper checks the session; here the handler is called directly.
  withApiAuthRequired: (handler: unknown) => handler,
  handleAuth: () => 'auth-handler',
}));

const mockGetSession = getSession as jest.Mock;
const session = { idToken: 'id-token', user: { sub: 'auth0|1' } };
type Handler = (req?: NextRequest) => Promise<Response>;

const apiResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Bad Gateway',
  json: async () => body,
});

describe('auth routes', () => {
  beforeEach(() => {
    process.env.GY_API = 'https://api.test';
    mockGetSession.mockResolvedValue(session);
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  it('exposes the Auth0 handler', () => {
    expect(authHandler).toBe('auth-handler');
  });

  describe('GET /api/auth/profile', () => {
    it('returns the GY Accounts profile', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(apiResponse({ username: 'ana' }));

      const res = await (GET as Handler)();

      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({ username: 'ana' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test/accounts/user/profile',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer id-token',
          },
        }
      );
    });

    it('answers 500 when the API fails', async () => {
      global.fetch = jest.fn().mockResolvedValue(apiResponse(null, false, 502));

      const res = await (GET as Handler)();

      expect(res.status).toBe(500);
      await expect(res.json()).resolves.toEqual({
        error: 'GYCODING API Error: 502 - Bad Gateway',
      });
    });
  });

  describe('PUT /api/auth/profile', () => {
    const request = (body: unknown) =>
      new NextRequest('http://localhost/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

    it('sends the editable fields with a normalized phone', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(apiResponse({ username: 'ana' }));

      const res = await (PUT as Handler)(
        request({
          username: 'ana',
          picture: 'p',
          phoneNumber: ' +34   600 ',
          email: 'x',
        })
      );

      expect(res.status).toBe(200);
      const [, init] = (global.fetch as jest.Mock).mock.calls[0];
      expect(JSON.parse(init.body)).toEqual({
        username: 'ana',
        picture: 'p',
        phoneNumber: '+34 600',
      });
    });

    it('answers 500 when the update fails', async () => {
      mockGetSession.mockResolvedValue(null);

      const res = await (PUT as Handler)(request({ username: 'ana' }));

      expect(res.status).toBe(500);
      await expect(res.json()).resolves.toEqual({
        error: 'Profile could not be updated',
      });
    });
  });

  describe('PATCH /api/auth/apikey', () => {
    it('refreshes the API key', async () => {
      global.fetch = jest.fn().mockResolvedValue(apiResponse({}));

      const res = await PATCH();

      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({ success: true });
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
        'https://api.test/accounts/user/metadata/apikey'
      );
    });

    it('answers 401 without a session', async () => {
      mockGetSession.mockResolvedValue(null);

      const res = await PATCH();

      expect(res.status).toBe(401);
      await expect(res.json()).resolves.toEqual({
        error: 'No active session found',
      });
    });

    it('answers 500 when the API fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('network'));

      const res = await PATCH();

      expect(res.status).toBe(500);
      await expect(res.json()).resolves.toEqual({ error: 'network' });
    });
  });
});
