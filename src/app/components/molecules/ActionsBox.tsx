import { fadeInUpVariants } from '@/utils/animations/variants';
import { lexendFont } from '@/utils/fonts';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';

interface ActionsBoxProps {
  isEditing: boolean;
  handleEditClick: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  isLoadingUpdate: boolean;
  isSaveDisabled?: boolean;
}

export default function ActionsBox({
  isEditing,
  handleEditClick,
  handleSaveEdit,
  handleCancelEdit,
  isLoadingUpdate,
  isSaveDisabled,
}: ActionsBoxProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.9 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          justifyContent: ['stretch', 'space-between'],
          alignItems: 'center',
          gap: ['8px', '0'],
          mt: ['12px', '24px'],
        }}
      >
        {isEditing ? (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              flexDirection: ['column', 'row'],
              width: '100%',
            }}
          >
            <Button
              gradient={true}
              variant="contained"
              sx={{
                fontFamily: lexendFont.style.fontFamily,
                fontSize: ['12px', '14px'],
                width: ['100%', 'auto'],
              }}
              onClick={handleSaveEdit}
              disabled={isLoadingUpdate || !!isSaveDisabled}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              sx={{
                fontFamily: lexendFont.style.fontFamily,
                fontSize: ['12px', '14px'],
                width: ['100%', 'auto'],
              }}
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <>
            <Button
              gradient={true}
              variant="contained"
              sx={{
                fontFamily: lexendFont.style.fontFamily,
                fontSize: ['12px', '14px'],
                width: ['100%', 'auto'],
              }}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
            <Box sx={{ width: ['100%', 'auto'] }}>
              <a
                href="/api/auth/logout"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  sx={(theme) => ({
                    fontFamily: lexendFont.style.fontFamily,
                    fontSize: ['12px', '14px'],
                    width: ['100%', 'auto'],
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: theme.palette.error.main,
                      color: '#fff',
                      borderColor: theme.palette.error.main,
                      boxShadow: '0 8px 20px rgba(244, 67, 54, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  })}
                >
                  Logout
                </Button>
              </a>
            </Box>
          </>
        )}
      </Box>
    </motion.div>
  );
}
