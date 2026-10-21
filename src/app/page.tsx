/* eslint-disable react/react-in-jsx-scope */
import DashboardV2 from './components/v2/DashboardV2';
import V2DarkTheme from './components/v2/V2DarkTheme';

// The dashboard: dark only, see V2DarkTheme. The previous one lives on, unrouted, as
// components/organisms/DashboardV1.tsx.
export default function Page() {
  return (
    <V2DarkTheme>
      <DashboardV2 />
    </V2DarkTheme>
  );
}
