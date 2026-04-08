/* eslint-disable react/react-in-jsx-scope */
import { ERole, UserProfile } from '@gycoding/nebula';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { RoleChip } from '../atoms/RoleChip';

interface RoleBoxProps {
  gyUser: UserProfile;
}

export default function RoleBox({ gyUser }: RoleBoxProps) {
  return (
    <Box sx={{ mt: ['8px', '24px'] }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <Typography variant="body1" sx={{ mb: '4px', fontWeight: 'bold' }}>
          Roles
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: ['4px', '1rem'] }}>
          {gyUser.roles?.map((role, index) => (
            <RoleChip key={role} role={role as ERole} index={index} />
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}
