/* eslint-disable react/react-in-jsx-scope */
import DashboardV2 from '../components/v2/DashboardV2';
import V2DarkTheme from '../components/v2/V2DarkTheme';

// Prototype of the dashboard in the gy-web /v2 language. The current one stays at /.
// Dark only: see V2DarkTheme.
export default function Page() {
  return (
    <V2DarkTheme>
      <DashboardV2 />
    </V2DarkTheme>
  );
}
