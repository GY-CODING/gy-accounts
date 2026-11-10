import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';
import Page from './page';

jest.mock('./components/v2/DashboardV2', () => ({
  __esModule: true,
  default: () => <main>dashboard</main>,
}));

describe('app shell', () => {
  it('renders the dashboard as the only page', () => {
    render(<Page />);
    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });

  it('wraps pages in the html shell with the suite fonts', () => {
    const tree = RootLayout({ children: <p>child</p> });
    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');
    expect(metadata.title).toBe('GY Accounts - Dashboard');
  });
});
