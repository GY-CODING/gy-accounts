import { lexendFont } from '@/utils/fonts';
import { copyToClipboard } from '@/utils/functions/CopyToClipBoard';
import colors from '@/utils/theme/colors';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment, TextField, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface TextFieldCopyTemplateProps {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label: string;
}

export default function TextFieldCopyTemplate({
  value,
  label,
  disabled = false,
  fullWidth = true,
}: TextFieldCopyTemplateProps) {
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TextField
      fullWidth={fullWidth}
      disabled={disabled}
      type={hidden ? 'password' : 'text'}
      label={label}
      value={value}
      variant="outlined"
      sx={{
        mb: '8px',
        width: '100%',
        transition: 'all 0.3s ease',
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(140, 84, 255, 0.05)',
            '& fieldset': {
              borderColor: colors.primary.light,
            },
          },
          '&.Mui-focused': {
            background: 'rgba(140, 84, 255, 0.08)',
            boxShadow: `0 0 0 3px ${colors.glow.primary}`,
            '& fieldset': {
              borderWidth: '2px',
              borderColor: colors.primary.main,
            },
          },
        },
      }}
      slotProps={{
        htmlInput: {
          style: {
            fontFamily: lexendFont.style.fontFamily,
            whiteSpace: !hidden ? 'nowrap' : 'pre-wrap',
            overflow: !hidden ? 'hidden' : 'auto',
            textOverflow: !hidden ? 'ellipsis' : 'unset',
            width: '100%',
            pointerEvents: 'none',
          },
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title={hidden ? 'Mostrar' : 'Ocultar'} arrow>
                <IconButton
                  onClick={() => setHidden(!hidden)}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    transition: 'all 0.2s ease',
                  }}
                >
                  {hidden ? (
                    <VisibilityIcon
                      sx={(theme) => ({
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: theme.palette.text.primary,
                        },
                      })}
                    />
                  ) : (
                    <VisibilityOffIcon
                      sx={(theme) => ({
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: theme.palette.text.primary,
                        },
                      })}
                    />
                  )}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={copied ? '¡Copiado!' : 'Copiar'} arrow>
                <IconButton
                  onClick={handleCopy}
                  edge="end"
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    width: 40,
                    height: 40,
                    margin: '0',
                    display: 'flex',
                    color: copied ? colors.accent.green : 'text.primary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: copied
                        ? 'rgba(0, 255, 148, 0.1)'
                        : 'rgba(140, 84, 255, 0.1)',
                    },
                  }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckIcon />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ContentCopyIcon />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
