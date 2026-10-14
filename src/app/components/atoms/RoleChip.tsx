/* eslint-disable react/react-in-jsx-scope */
import { radius } from '@/utils/theme/gy';
import { ERole } from '@gycoding/nebula';
import AssistantIcon from '@mui/icons-material/AssistantRounded';
import CodeIcon from '@mui/icons-material/CodeRounded';
import LockIcon from '@mui/icons-material/LockRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface RoleChipProps {
  role: ERole;
  index?: number;
}

// Color de cada rol: [modo oscuro, modo claro].
// En claro se usa un tono más oscuro para que el texto se lea sobre blanco.
const ROLE_COLORS: Partial<Record<ERole, [string, string]>> = {
  [ERole.ADMIN]: ['#4ade80', '#15803d'], // verde
  [ERole.DEVELOPER]: ['#60a5fa', '#1d4ed8'], // azul
  [ERole.AI]: ['#fbbf24', '#b45309'], // ámbar
};
const DEFAULT_COLOR: [string, string] = ['#a855f7', '#6d28d9']; // violeta (resto de roles)

const ROLE_ICONS: Partial<Record<ERole, typeof PersonIcon>> = {
  [ERole.ADMIN]: LockIcon,
  [ERole.DEVELOPER]: CodeIcon,
  [ERole.AI]: AssistantIcon,
};

// Chip de rol (§4 radius-xs): fondo del color al 10%, borde al 27%, texto e icono en el color.
export function RoleChip({ role, index = 0 }: RoleChipProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [dark, light] = ROLE_COLORS[role] ?? DEFAULT_COLOR;
  const color = isDark ? dark : light;
  const Icon = ROLE_ICONS[role] ?? PersonIcon;

  return (
    <Box
      component={motion.div}
      // Entrada escalonada: cada chip 0.06s después del anterior
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 + index * 0.06 }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: `${radius.xs}px`,
        border: `1px solid ${color}44`,
        background: `${color}1a`,
        color,
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
      }}
    >
      <Icon sx={{ fontSize: 15 }} />
      {/* HOC_WIKI_USER → "Hoc Wiki User" */}
      {role.toLowerCase().replace(/_/g, ' ')}
    </Box>
  );
}
