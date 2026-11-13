import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import type { UserProfile } from '@gycoding/nebula';
import { ERole } from '@gycoding/nebula';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';
import { useUser as useUserGY } from '@/hooks/useUser';
import { renderWithTheme } from '@/test-utils/renderWithTheme';
import { ThemeProviderComponent } from '../organisms/ThemeContext';
import { ObserverStub } from '../../../../jest.setup';
import DashboardV2 from './DashboardV2';
import { look } from './look';

jest.mock('@auth0/nextjs-auth0/client', () => ({ useUser: jest.fn() }));
jest.mock('@/hooks/useUser', () => ({ useUser: jest.fn() }));

const profile: UserProfile = {
  username: 'gfigueras',
  email: 'g@test.dev',
  phoneNumber: '+34 600000000',
  picture: 'https://img.test/me.png',
  roles: [ERole.ADMIN, ERole.COMMON],
  apiKey: 'gy_key_123',
};

type GyUser = ReturnType<typeof useUserGY>;

const gyUser = (overrides: Partial<GyUser> = {}): GyUser => ({
  data: profile,
  isLoading: false,
  error: null,
  update: jest.fn().mockResolvedValue(undefined),
  isLoadingUpdate: false,
  isErrorUpdate: false,
  isUpdated: false,
  setIsUpdated: jest.fn(),
  setIsErrorUpdate: jest.fn(),
  refreshApiKey: jest.fn().mockResolvedValue(undefined),
  isUpdatingAPIKEY: false,
  isErrorUpdateAPIKEY: false,
  isUpdatedAPIKEY: false,
  setIsUpdatedAPIKEY: jest.fn(),
  setIsErrorUpdateAPIKEY: jest.fn(),
  ...overrides,
});

function renderDashboard(
  overrides: Partial<GyUser> = {},
  { authUser = { email: 'auth0@test.dev' } as object | null, dark = true } = {}
) {
  const hook = gyUser(overrides);
  (useUserGY as jest.Mock).mockReturnValue(hook);
  (useAuth0User as jest.Mock).mockReturnValue({ user: authUser });
  const view = renderWithTheme(
    <ThemeProviderComponent>
      <DashboardV2 />
    </ThemeProviderComponent>,
    dark
  );
  return { hook, ...view };
}

const editButton = () =>
  screen.getAllByRole('button', { name: 'Edit profile' })[0];
const field = (name: string) => screen.getByRole('textbox', { name });

/** The key controls sit on a `visibility: hidden` layer until the card turns, so they have no accessible name. */
const keyButton = (label: string) =>
  screen
    .getByText(label, { selector: 'button, button *' })
    .closest('button') as HTMLButtonElement;

describe('DashboardV2', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    localStorage.clear();
  });

  it('shows the account, using the Auth0 email', () => {
    renderDashboard();
    expect(screen.getAllByText('gfigueras').length).toBeGreaterThan(0);
    expect(screen.getAllByText('auth0@test.dev').length).toBeGreaterThan(0);
  });

  it('falls back to the profile email and renders in light mode', () => {
    localStorage.setItem('themeMode', 'light');
    renderDashboard({}, { authUser: null, dark: false });
    expect(screen.getAllByText('g@test.dev').length).toBeGreaterThan(0);
  });

  it('shows placeholders for an incomplete profile', () => {
    renderDashboard(
      {
        data: {
          ...profile,
          username: '',
          email: undefined as unknown as string,
          phoneNumber: undefined as unknown as string,
          picture: '',
        },
      },
      { authUser: null }
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);

    fireEvent.click(editButton());
    expect(
      screen.getByText('Format: +XX number (e.g. +34 605624408)')
    ).toBeInTheDocument();
  });

  it('shows the skeleton while loading and a fallback without a profile', () => {
    const { unmount } = renderDashboard({ data: undefined, isLoading: true });
    expect(screen.queryByText('gfigueras')).not.toBeInTheDocument();
    unmount();

    const { unmount: unmountSignedIn } = renderDashboard({ data: undefined });
    expect(
      screen.queryByRole('button', { name: 'Edit profile' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
    unmountSignedIn();

    // Signed out and without a profile: no account button at all
    renderDashboard({ data: undefined }, { authUser: null });
    expect(screen.queryByText('Log out')).not.toBeInTheDocument();
  });

  it('edits and saves the profile', async () => {
    const { hook } = renderDashboard();
    fireEvent.click(editButton());

    fireEvent.change(field('Username'), { target: { value: 'gf' } });
    fireEvent.change(field('Phone'), { target: { value: '+34 611111111' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(hook.update).toHaveBeenCalledWith({
        ...profile,
        username: 'gf',
        phoneNumber: '+34 611111111',
      })
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Save changes' })
      ).not.toBeInTheDocument()
    );
  });

  it('uploads a new photo as base64 when saving', async () => {
    const { hook } = renderDashboard();
    fireEvent.click(editButton());

    const file = new File(['img'], 'me.png', { type: 'image/png' });
    fireEvent.change(screen.getAllByLabelText('Change photo')[0], {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(hook.update).toHaveBeenCalledWith(
        expect.objectContaining({
          picture: expect.stringMatching(/^data:image\/png;base64,/),
        })
      )
    );
  });

  it('ignores an empty file selection', () => {
    renderDashboard();
    fireEvent.click(editButton());
    fireEvent.change(screen.getAllByLabelText('Change photo')[0], {
      target: { files: [] },
    });
    expect(URL.createObjectURL).not.toHaveBeenCalledWith(undefined);
  });

  it('blocks saving an invalid phone and keeps editing when the update fails', async () => {
    const { hook } = renderDashboard({
      update: jest.fn().mockRejectedValue(new Error('down')),
    });
    fireEvent.click(editButton());

    fireEvent.change(field('Phone'), { target: { value: '600' } });
    expect(
      screen.getByText('Format: +XX number (e.g. +34 605624408)')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    fireEvent.change(field('Phone'), { target: { value: '+34 600' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(hook.update).toHaveBeenCalled());
    expect(
      screen.getByRole('button', { name: 'Save changes' })
    ).toBeInTheDocument();
  });

  it('cancels editing with the button or Escape', async () => {
    const saveButton = () =>
      screen.queryByRole('button', { name: 'Save changes' });
    renderDashboard();

    fireEvent.click(editButton());
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    // The bar leaves with an exit animation.
    await waitFor(() => expect(saveButton()).not.toBeInTheDocument());

    fireEvent.click(editButton());
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(saveButton()).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(saveButton()).not.toBeInTheDocument());
  });

  it('shows the saving state', () => {
    renderDashboard({ isLoadingUpdate: true });
    fireEvent.click(editButton());
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  });

  it('pauses and resumes the animations', () => {
    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: 'Pause animations' }));
    expect(
      screen.getByRole('button', { name: 'Play animations' })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens the account menu, edits, toggles the theme and closes on outside click or Escape', () => {
    renderDashboard();
    const trigger = screen.getByRole('button', { name: 'Account: gfigueras' });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: /Edit profile/ }));
    expect(
      screen.getByRole('button', { name: 'Save changes' })
    ).toBeInTheDocument();

    fireEvent.click(trigger);
    const themeItem = screen.getByRole('menuitem', { name: /theme/ });
    fireEvent.click(themeItem);
    expect(screen.getByRole('menuitem', { name: /theme/ })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.pointerDown(
      within(screen.getByRole('menu')).getAllByRole('menuitem')[0]
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('regenerates the API key while editing', () => {
    const { hook } = renderDashboard();
    fireEvent.click(keyButton('Edit to regenerate ›'));
    fireEvent.click(keyButton('Regenerate'));
    expect(hook.refreshApiKey).toHaveBeenCalled();
  });

  it('takes the page colours from the chapter in the middle of the screen', () => {
    renderDashboard();
    const root = document.querySelector('[style*="--tone-bg"]') as HTMLElement;
    const info = root.querySelector('[data-tone="info"]') as HTMLElement;
    const observer = ObserverStub.instances.at(-1)!;

    act(() => observer.callback([{ isIntersecting: false, target: info }]));
    act(() => observer.callback([{ isIntersecting: true, target: info }]));

    // No saved or system preference: the app renders in light.
    expect(root.style.getPropertyValue('--tone-bg')).toBe(
      look(false).tone.info.bg
    );
  });

  it.each([
    ['isErrorUpdate', 'Your profile could not be updated', 'setIsErrorUpdate'],
    ['isUpdated', 'Your profile has been updated', 'setIsUpdated'],
    [
      'isUpdatedAPIKEY',
      'Your API key has been regenerated',
      'setIsUpdatedAPIKEY',
    ],
    [
      'isErrorUpdateAPIKEY',
      'Your API key could not be regenerated',
      'setIsErrorUpdateAPIKEY',
    ],
  ] as const)('shows the %s toast and clears it', (flag, message, setter) => {
    const { hook } = renderDashboard({ [flag]: true });
    expect(screen.getByText(message)).toBeInTheDocument();
    const toast = screen.getByText(message).closest('[role]') as HTMLElement;
    fireEvent.click(within(toast).getByRole('button', { name: 'Close' }));
    expect(hook[setter]).toHaveBeenCalledWith(false);
  });

  describe('demo mode (development)', () => {
    const nodeEnv = process.env.NODE_ENV;
    beforeEach(() => {
      (process.env as Record<string, string>).NODE_ENV = 'development';
    });
    afterEach(() => {
      (process.env as Record<string, string>).NODE_ENV = nodeEnv as string;
    });

    it('stays off outside development', async () => {
      (process.env as Record<string, string>).NODE_ENV = 'production';
      window.history.replaceState(null, '', '/?demo');
      renderDashboard({ data: undefined, isLoading: true });
      await act(async () => {});
      expect(
        screen.queryByRole('button', { name: 'Edit profile' })
      ).not.toBeInTheDocument();
    });

    it('shows the demo account and simulates saving and a new key', async () => {
      window.history.replaceState(null, '', '/?demo');
      jest.useFakeTimers();
      renderDashboard({ data: undefined, isLoading: true });

      await act(async () => {});
      fireEvent.click(editButton());
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
      await act(async () => jest.runAllTimers());
      expect(
        screen.getByText('Your profile has been updated')
      ).toBeInTheDocument();

      fireEvent.click(keyButton('Edit to regenerate ›'));
      fireEvent.click(keyButton('Regenerate'));
      await act(async () => jest.runAllTimers());
      expect(
        screen.getByText('Your API key has been regenerated')
      ).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('holds the skeleton with ?demo=loading', async () => {
      window.history.replaceState(null, '', '/?demo=loading');
      renderDashboard({ data: undefined, isLoading: false });
      await act(async () => {});
      expect(
        screen.queryByRole('button', { name: 'Edit profile' })
      ).not.toBeInTheDocument();
    });
  });
});
