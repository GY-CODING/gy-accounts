import { ERole } from '@gycoding/nebula';
import { SxProps } from '@mui/material';

export default function RoleTheme(role: ERole): SxProps {
  switch (role) {
    case ERole.ADMIN:
      return {
        color: 'lightgreen',
        backgroundColor: 'rgba(51, 255, 0, 0.2)',
        BorderColor: 'lightgreen',
      };
    case ERole.DEVELOPER:
      return {
        color: 'rgb(0, 125, 250)',
        backgroundColor: 'rgba(0, 125, 250, 0.25)',
        borderColor: 'rgb(0, 125, 250)',
      };
    case ERole.COMMON:
      return {
        color: 'primary.main',
        backgroundColor: 'rgba(158, 0, 250, 0.25)',
        BorderColor: 'primary.main',
      };
    default:
      return {};
  }
}
