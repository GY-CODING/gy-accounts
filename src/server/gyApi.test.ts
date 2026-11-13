import {
  buildAuthHeaders,
  errorMessage,
  fetchGyApi,
  getGyApiBaseUrl,
} from './gyApi';

describe('gyApi helpers', () => {
  afterEach(() => {
    delete process.env.GY_API;
    jest.restoreAllMocks();
  });

  it('reads GY_API without quotes and fails when it is missing', () => {
    process.env.GY_API = '"https://api.test"';
    expect(getGyApiBaseUrl()).toBe('https://api.test');

    process.env.GY_API = '""';
    expect(getGyApiBaseUrl).toThrow(
      'GY_API environment variable is not defined'
    );
  });

  it('builds bearer headers and requires a token', () => {
    expect(buildAuthHeaders('t')).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer t',
    });
    expect(() => buildAuthHeaders()).toThrow('Missing idToken');
  });

  it('returns ok responses and throws on errors', async () => {
    const ok = { ok: true } as Response;
    global.fetch = jest.fn().mockResolvedValueOnce(ok).mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
    });

    await expect(fetchGyApi('u', {})).resolves.toBe(ok);
    await expect(fetchGyApi('u', {})).rejects.toThrow(
      'GYCODING API Error: 502 - Bad Gateway'
    );
  });

  it('turns any error into a message', () => {
    expect(errorMessage(new Error('x'))).toBe('x');
    expect(errorMessage('weird')).toBe('Unknown error');
  });
});
