import { LogEnvironment } from '@gycoding/nebula';
import { logger, resolveEnvironment, toLogData } from './logger';
import { LogMessage } from './logs/logMessages';

const LINE =
  /^(DEBUG|INFO|WARN|ERROR) .+[.!?…] - \[\{"data": \{"env":"(LOCAL|DEV|PRO)","profileId":"[^"]*","userId":"[^"]*","additionalData":\{.*\}\}\}\]$/;

describe('logger', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  it('writes the shared GYCODING line', () => {
    process.env.ENV = 'PRO';
    const info = jest.spyOn(console, 'info').mockImplementation(() => {});

    logger.info(LogMessage.PROFILE_UPDATED, { userId: 'auth0|1' });

    expect(info.mock.calls[0][0]).toMatch(LINE);
    expect(info.mock.calls[0][0]).toBe(
      'INFO Profile updated. - [{"data": {"env":"PRO","profileId":"","userId":"auth0|1","additionalData":{}}}]'
    );
  });

  it('logs every level, appending errors', () => {
    process.env.ENV = 'DEV';
    const spies = (['debug', 'warn', 'error'] as const).map((level) =>
      jest.spyOn(console, level).mockImplementation(() => {})
    );

    logger.debug('Debug');
    logger.warn('Warn', { route: '/x' });
    logger.error('Boom', {}, new Error('down'));

    spies.forEach((spy) => expect(spy.mock.calls[0][0]).toMatch(LINE));
    expect(spies[2].mock.calls[0][0]).toContain('"error":"down"');
  });

  it('resolves the environment from LOG_ENV, ENV, NEXT_PUBLIC_LOG_ENV or the build mode', () => {
    delete process.env.LOG_ENV;
    delete process.env.ENV;
    delete process.env.NEXT_PUBLIC_LOG_ENV;
    expect(resolveEnvironment()).toBe(LogEnvironment.LOCAL);

    (process.env as Record<string, string>).NODE_ENV = 'production';
    expect(resolveEnvironment()).toBe(LogEnvironment.PRO);

    process.env.NEXT_PUBLIC_LOG_ENV = 'dev';
    expect(resolveEnvironment()).toBe(LogEnvironment.DEV);

    process.env.LOG_ENV = 'nonsense';
    expect(resolveEnvironment()).toBe(LogEnvironment.PRO);
  });

  it('moves loose keys into additionalData', () => {
    expect(
      toLogData({ userId: 'u', route: '/r', additionalData: { a: 1 } })
    ).toEqual({
      profileId: undefined,
      userId: 'u',
      additionalData: { route: '/r', a: 1 },
    });
    expect(toLogData()).toEqual({
      profileId: undefined,
      userId: undefined,
      additionalData: {},
    });
  });
});
