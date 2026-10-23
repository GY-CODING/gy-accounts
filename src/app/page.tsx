/* eslint-disable react/react-in-jsx-scope */
import DashboardV2 from './components/v2/DashboardV2';

// The dashboard, in the app's light or dark theme (the switch is in the account menu). The previous
// one lives on, unrouted, as components/organisms/DashboardV1.tsx.
export default function Page() {
  return <DashboardV2 />;
}
