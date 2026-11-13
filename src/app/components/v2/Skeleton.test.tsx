import { renderWithTheme } from '@/test-utils/renderWithTheme';
import DashboardSkeleton from './Skeleton';

describe('DashboardSkeleton', () => {
  it.each([true, false])('renders the loading layout (dark=%s)', (dark) => {
    const { container } = renderWithTheme(<DashboardSkeleton />, dark);
    expect(container.firstChild).toBeInTheDocument();
  });
});
