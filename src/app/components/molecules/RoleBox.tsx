/* eslint-disable react/react-in-jsx-scope */
import { border, overlineSx } from '@/utils/theme/gy';
import { ERole, UserProfile } from '@gycoding/nebula';
import { Box, Typography, useTheme } from '@mui/material';
import { RoleChip } from '../atoms/RoleChip';

interface RoleBoxProps {
  gyUser: UserProfile;
}

// Bloque de roles dentro de la tarjeta de identidad, separado por una línea sutil.
export default function RoleBox({ gyUser }: RoleBoxProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mt: 3,
        pt: 3,
        borderTop: `1px solid ${border(isDark).subtle}`,
        textAlign: 'center',
      }}
    >
      {/* Label overline "ROLES" */}
      <Typography sx={{ ...overlineSx(isDark), mb: 1.5 }}>Roles</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {gyUser.roles?.length ? (
          gyUser.roles.map((role, index) => (
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
