/* eslint-disable react/react-in-jsx-scope */
import { filterVisibleRoles } from '@/utils/roles';
import { border, overlineSx } from '@/utils/theme/gy';
import { ERole, UserProfile } from '@gycoding/nebula';
import { Box, Typography, useTheme } from '@mui/material';
import { RoleChip } from '../atoms/RoleChip';

interface RoleBoxProps {
  gyUser: UserProfile;
}

export default function RoleBox({ gyUser }: RoleBoxProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const visibleRoles = filterVisibleRoles(gyUser.roles);

  return (
    <Box
      sx={{
        mt: 3,
        pt: 3,
        borderTop: `1px solid ${border(isDark).subtle}`,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ ...overlineSx(isDark), mb: 1.5 }}>Roles</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {visibleRoles.length ? (
          visibleRoles.map((role, index) => (
            <RoleChip key={role} role={role as ERole} index={index} />
          ))
        ) : (
          // Sin roles: guion en lugar de dejar el hueco vacío
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            —
          </Typography>
        )}
      </Box>
    </Box>
  );
}
