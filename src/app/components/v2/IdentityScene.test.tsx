import { act, fireEvent, screen } from '@testing-library/react';
import { ERole } from '@gycoding/nebula';
import { renderWithTheme } from '@/test-utils/renderWithTheme';
import IdentityScene, { SceneProps } from './IdentityScene';

// The scroll progress of the scene, driven by the tests to turn the card over.
const mockScrollProgress = jest.requireActual('framer-motion').motionValue(0);
// framer-motion reads prefers-reduced-motion once and caches it, so the tests drive it here.
const mockMotion = { reduce: false };
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useScroll: () => ({ scrollYProgress: mockScrollProgress }),
  useReducedMotion: () => mockMotion.reduce,
}));

const props = (overrides: Partial<SceneProps> = {}): SceneProps => ({
  username: 'gfigueras',
  email: 'g@test.dev',
  picture: 'https://img.test/me.png',
  roles: [ERole.ADMIN, ERole.COMMON],
  apiKey: 'gy_key_123',
  isEditing: false,
  regenerating: false,
  onEdit: jest.fn(),
  onRegenerate: jest.fn(),
  paused: false,
  ...overrides,
});

/** The key controls sit on a `visibility: hidden` layer until the card turns, so they have no accessible name. */
const keyButton = (label: string) =>
  screen
    .getByText(label, { selector: 'button, button *' })
    .closest('button') as HTMLButtonElement;

describe('IdentityScene', () => {
  it.each([true, false])(
    'shows the account name and card (dark=%s)',
    (dark) => {
      renderWithTheme(<IdentityScene {...props()} />, dark);
      expect(screen.getAllByLabelText('gfigueras').length).toBeGreaterThan(0);
      expect(screen.getAllByText('g@test.dev').length).toBeGreaterThan(0);
    }
  );

  it('renders the paused, editing and regenerating states without a picture', () => {
    renderWithTheme(
      <IdentityScene
        {...props({
          paused: true,
          isEditing: true,
          regenerating: true,
          picture: undefined,
          username: '',
        })}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('asks to edit before regenerating, and regenerates while editing', () => {
    const onEdit = jest.fn();
    const onRegenerate = jest.fn();
    const { rerender } = renderWithTheme(
      <IdentityScene {...props({ onEdit, onRegenerate })} />
    );

    fireEvent.click(keyButton('Edit to regenerate ›'));
    expect(onEdit).toHaveBeenCalled();

    rerender(
      <IdentityScene {...props({ onEdit, onRegenerate, isEditing: true })} />
    );
    fireEvent.click(keyButton('Regenerate'));
    expect(onRegenerate).toHaveBeenCalled();

    rerender(
      <IdentityScene {...props({ isEditing: true, regenerating: true })} />
    );
    expect(keyButton('Regenerating…')).toBeDisabled();
  });

  it('shows, hides and copies the API key', async () => {
    jest.useFakeTimers();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderWithTheme(<IdentityScene {...props()} />);

    fireEvent.click(keyButton('Show key'));
    expect(screen.getAllByText('gy_key_123').length).toBeGreaterThan(0);
    fireEvent.click(keyButton('Hide key'));

    await act(async () => {
      fireEvent.click(keyButton('Copy'));
    });
    expect(writeText).toHaveBeenCalledWith('gy_key_123');
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(2000));
    expect(keyButton('Copy')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('tilts with the mouse only, and not while paused', () => {
    const { rerender } = renderWithTheme(<IdentityScene {...props()} />);
    const stage = () =>
      screen.getByRole('region', { name: 'Your GY Accounts card' })
        .firstElementChild as HTMLElement;

    fireEvent.pointerMove(stage(), {
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(stage(), {
      pointerType: 'touch',
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerLeave(stage());

    rerender(<IdentityScene {...props({ paused: true })} />);
    fireEvent.pointerMove(stage(), {
      pointerType: 'mouse',
      clientX: 10,
      clientY: 10,
    });
    expect(stage()).toBeInTheDocument();
  });

  it('turns the card over past half the scroll, also when paused', () => {
    const { rerender } = renderWithTheme(<IdentityScene {...props()} />);

    act(() => mockScrollProgress.set(0.8));
    expect(screen.getAllByText('Your key to the APIs').length).toBeGreaterThan(
      0
    );

    rerender(<IdentityScene {...props({ paused: true })} />);
    act(() => mockScrollProgress.set(0.2));
    act(() => mockScrollProgress.set(0.9));
    expect(
      screen.getAllByText('One identity, every product').length
    ).toBeGreaterThan(0);
    act(() => mockScrollProgress.set(0));
  });

  it('lays both faces out flat, one under the other, when the user prefers reduced motion', () => {
    mockMotion.reduce = true;
    renderWithTheme(<IdentityScene {...props()} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'gfigueras' })
    ).toBeInTheDocument();
    // Both sides are visible at once, so the key controls have their accessible names.
    expect(
      screen.getByRole('button', { name: 'Show key' })
    ).toBeInTheDocument();
    mockMotion.reduce = false;
  });
});
