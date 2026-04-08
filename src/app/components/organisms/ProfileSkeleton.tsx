/* eslint-disable react/react-in-jsx-scope */
'use client';

import { shimmerVariants } from '@/utils/animations/variants';
import colors from '@/utils/theme/colors';
import { Box, Card, CardContent, Skeleton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedBackground from '../atoms/AnimatedBackground';

export function ProfileSkeleton() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground />
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: '100%',
          maxWidth: '100%',
          background: {
            xs: 'transparent',
            sm:
              theme.palette.mode === 'dark'
                ? 'rgba(18, 18, 18, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
          },
          backdropFilter: { xs: 'none', sm: 'blur(20px)' },
          border: { xs: 'none', sm: `1px solid ${colors.glass.border}` },
          borderRadius: { xs: 0, sm: '24px' },
          padding: { xs: 0, sm: '16px' },
          boxShadow: { xs: 'none', sm: colors.shadow.card },
          flexShrink: 0,
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: ['100px', '120px'],
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(140, 84, 255, 0.1)'
                : 'rgba(140, 84, 255, 0.05)',
            borderRadius: ['0', '16px'],
            overflow: 'visible',
          }}
        >
          <Box
            component={motion.div}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          />
        </Box>
        {/* Avatar skeleton fuera del header */}
        <Box
          sx={{ position: 'absolute', top: '76px', left: '32px', zIndex: 10 }}
        >
          <Skeleton
            width={'120px'}
            height={'120px'}
            variant="circular"
            sx={{
              boxShadow: colors.shadow.glow,
              '&::after': {
                animation: 'shimmer 2s infinite',
              },
              '@keyframes shimmer': {
                '0%': { opacity: 0.5 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.5 },
              },
            }}
          />
        </Box>
        <CardContent sx={{ pt: '80px', pb: '10px' }}>
          <Skeleton
            variant="text"
            width="100%"
            height={75}
            sx={{
              mb: '2px',
              borderRadius: '8px',
              '&::after': {
                animation: 'shimmer 2s infinite',
              },
            }}
          />
          <Box display={'flex'} flexDirection={'column'}>
            <Box>
              <Skeleton
                variant="text"
                width="20%"
                height={75}
                sx={{
                  borderRadius: '8px',
                  '&::after': {
                    animation: 'shimmer 2s infinite 0.2s',
                  },
                }}
              />
            </Box>
            <Box>
              <Skeleton
                variant="text"
                width="15%"
                height={75}
                sx={{
                  borderRadius: '8px',
                  '&::after': {
                    animation: 'shimmer 2s infinite 0.4s',
                  },
                }}
              />
            </Box>
          </Box>
          <Skeleton
            variant="text"
            width="15%"
            height={75}
            sx={{
              mt: '10px',
              borderRadius: '8px',
              '&::after': {
                animation: 'shimmer 2s infinite 0.6s',
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: '24px',
            }}
          >
            <Skeleton
              variant="rectangular"
              width={150}
              height={40}
              sx={{
                borderRadius: '12px',
                '&::after': {
                  animation: 'shimmer 2s infinite 0.8s',
                },
              }}
            />
            <Skeleton
              variant="rectangular"
              width={150}
              height={40}
              sx={{
                borderRadius: '12px',
                '&::after': {
                  animation: 'shimmer 2s infinite 1s',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
