import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { ERole } from '@gycoding/nebula';
import { ESeverity } from '@/utils/constants/ESeverity';
import { renderWithTheme } from '@/test-utils/renderWithTheme';
import AnimatedAlert from './Alert';
import { RoleChip } from './RoleChip';

describe('AnimatedAlert', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows an error as an alert with its title and closes itself', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <AnimatedAlert
        open
        severity={ESeverity.ERROR}
        title="Oops"
        message="Failed"
        onClose={onClose}
        duration={1000}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('OopsFailed');
    act(() => jest.advanceTimersByTime(1000));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('is a status by default, in light mode, and closes with its button', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <AnimatedAlert open message="Saved" onClose={onClose} />,
      false
    );

    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when closed and has no close button without a handler', () => {
    const { rerender } = renderWithTheme(
      <AnimatedAlert open={false} message="Hidden" />
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();

    rerender(<AnimatedAlert open message="No close" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('RoleChip', () => {
  it.each([ERole.ADMIN, ERole.DEVELOPER, ERole.AI, ERole.COMMON])(
    'shows %s with its colour and icon',
    (role) => {
      renderWithTheme(<RoleChip role={role} index={1} />);
      expect(screen.getByText(role.toLowerCase())).toBeInTheDocument();
    }
  );

  it('turns underscores into spaces and follows the forced or theme mode', () => {
    renderWithTheme(<RoleChip role={ERole.HOC_WIKI_USER} />, false);
    renderWithTheme(<RoleChip role={ERole.ADMIN} mode="light" />);

    expect(screen.getByText('hoc wiki user')).toBeInTheDocument();
    expect(screen.getByText('admin')).toHaveStyle({ color: '#15803d' });
  });
});
