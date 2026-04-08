/* eslint-disable react/react-in-jsx-scope */
import { chipVariants } from '@/utils/animations/variants';
import { lexendFont } from '@/utils/fonts';
import { ERole } from '@gycoding/nebula';
import CodeIcon from '@mui/icons-material/Code';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Chip } from '@mui/material';
import { motion } from 'framer-motion';
import AssistantIcon from '@mui/icons-material/Assistant';

interface RoleChipProps {
  role: ERole;
  index?: number;
}

export function RoleChip({ role, index = 0 }: RoleChipProps): JSX.Element {
  const getRoleColor = (role: ERole) => {
    switch (role) {
      case ERole.ADMIN:
        return '#4caf50'; // Verde
      case ERole.DEVELOPER:
        return '#2196f3'; // Azul
      case ERole.AI:
        return '#e7dc11'; // amarillo
      default:
        return '#9c27b0'; // Morado
    }
  };

  const getRoleIcon = (role: ERole) => {
    const color = getRoleColor(role);
    const iconStyle = { fontSize: '16px', color };
    switch (role) {
      case ERole.ADMIN:
        return <LockIcon sx={iconStyle} />;
      case ERole.DEVELOPER:
        return <CodeIcon sx={iconStyle} />;
      case ERole.AI:
        return <AssistantIcon sx={iconStyle} />;
      default:
        return <PersonIcon sx={iconStyle} />;
    }
  };

  const getRoleStyles = (role: ERole) => {
    const color = getRoleColor(role);
    return {
      color: `${color} !important`,
      borderColor: `${color} !important`,
      background:
        role === ERole.ADMIN
          ? 'rgba(76, 175, 80, 0.08)'
          : role === ERole.DEVELOPER
            ? 'rgba(33, 150, 243, 0.08)'
            : role === ERole.AI
              ? 'rgba(231, 220, 17, 0.08)'
              : 'rgba(156, 39, 176, 0.08)',
      borderWidth: '1px',
      '& .MuiChip-label': {
        color: `${color} !important`,
      },
      '& .MuiChip-icon': {
        color: `${color} !important`,
      },
    };
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={chipVariants}
      whileHover={{
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2 },
      }}
    >
      <Chip
        icon={getRoleIcon(role)}
        label={role}
        variant="outlined"
        size="medium"
        sx={{
          marginBottom: '8px',
          marginRight: '8px',
          padding: '6px 8px',
          fontWeight: 600,
          fontSize: '0.813rem',
          fontFamily: lexendFont.style.fontFamily,
          transition: 'all 0.2s ease',
          borderRadius: '10px',
          ...getRoleStyles(role),
        }}
      />
    </motion.div>
  );
}
