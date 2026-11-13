import { ESeverity } from './constants/ESeverity';
import { ETheme } from './constants/theme.enum';
import { lexendFont, valorantFont } from './fonts';
import { toBase64 } from './global';

describe('toBase64', () => {
  it('resolves the data URL of a file', async () => {
    const file = new File(['hi'], 'hi.txt', { type: 'text/plain' });
    await expect(toBase64(file)).resolves.toBe('data:text/plain;base64,aGk=');
  });

  it('rejects when the reader fails', async () => {
    const reader = {
      // The source assigns `onerror` after calling readAsDataURL, so fail on the next tick.
      readAsDataURL: jest.fn(function (this: FileReader) {
        queueMicrotask(() =>
          this.onerror?.(
            new ProgressEvent('error') as ProgressEvent<FileReader>
          )
        );
      }),
    } as unknown as FileReader;
    jest.spyOn(window, 'FileReader').mockImplementation(() => reader);

    const error = await toBase64(new File([''], 'x')).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).cause).toBeInstanceOf(ProgressEvent);
  });
});

describe('roles', () => {
  const load = (publicRoles: string | undefined) => {
    if (publicRoles === undefined) delete process.env.PUBLIC_ROLES;
    else process.env.PUBLIC_ROLES = publicRoles;
    let mod: typeof import('./roles') | undefined;
    jest.isolateModules(() => {
      mod = jest.requireActual<typeof import('./roles')>('./roles');
    });
    return mod!;
  };

  afterEach(() => delete process.env.PUBLIC_ROLES);

  it('shows every role when PUBLIC_ROLES is not set', () => {
    expect(load(undefined).filterVisibleRoles(['ADMIN', 'COMMON'])).toEqual([
      'ADMIN',
      'COMMON',
    ]);
  });

  it('keeps only the configured roles, case-insensitively', () => {
    const { filterVisibleRoles } = load(' common , developer ');
    expect(filterVisibleRoles(['ADMIN', 'Common', 'DEVELOPER'])).toEqual([
      'Common',
      'DEVELOPER',
    ]);
  });

  it('handles missing roles', () => {
    expect(load('COMMON').filterVisibleRoles(null)).toEqual([]);
    expect(load(undefined).filterVisibleRoles(undefined)).toEqual([]);
  });
});

describe('constants and fonts', () => {
  it('exposes the theme, severity and font tokens', () => {
    expect(ETheme.DARK).toBe('dark');
    expect(ESeverity.SUCCESS).toBe('success');
    expect(lexendFont).toBeDefined();
    expect(valorantFont).toBeDefined();
  });
});
