/* eslint-disable react/react-in-jsx-scope */
import { copyToClipboard } from '@/utils/functions/CopyToClipBoard';
import { radius } from '@/utils/theme/gy';
import CheckIcon from '@mui/icons-material/CheckRounded';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffRounded';
import { InputAdornment, TextField, Tooltip, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface TextFieldCopyTemplateProps {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label: string;
}

// Campo de solo lectura para la API key: mostrar/ocultar a la izquierda, copiar a la derecha.
// El aspecto del input (cristal, radio 14, focus violeta) viene del tema.
export default function TextFieldCopyTemplate({
  value,
  label,
  disabled = false,
  fullWidth = true,
}: TextFieldCopyTemplateProps) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);

  // Copia y muestra el check verde durante 2s
  const handleCopy = async () => {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Botones de icono pequeños con hover violeta
  const iconButtonSx = {
    width: 36,
    height: 36,
    borderRadius: `${radius.sm - 2}px`,
    color: 'text.secondary',
    transition: 'background 0.2s ease, color 0.2s ease',
    '&:hover': {
      background: `${theme.palette.primary.main}1a`,
      color: 'primary.main',
    },
  };

  return (
    <TextField
      fullWidth={fullWidth}
      disabled={disabled}
      type={hidden ? 'password' : 'text'}
      label={label}
      value={value}
      sx={{ width: '100%' }}
      slotProps={{
        htmlInput: {
          style: {
            letterSpacing: hidden ? '0.15em' : '0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            pointerEvents: 'none',
          },
        },
        input: {
          // Mostrar / ocultar
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title={hidden ? 'Show' : 'Hide'} arrow>
                <IconButton
                  aria-label={hidden ? 'Show API key' : 'Hide API key'}
                  onClick={() => setHidden(!hidden)}
                  edge="start"
                  sx={iconButtonSx}
                >
                  {hidden ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
          // Copiar (cambia a check verde al copiar)
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow>
                <IconButton
                  aria-label="Copy API key"
                  onClick={handleCopy}
                  edge="end"
                  sx={{
                    ...iconButtonSx,
                    ...(copied && {
                      color: 'success.main',
                      background: `${theme.palette.success.main}1a`,
                    }),
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'check' : 'copy'}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: 'flex' }}
                    >
                      {copied ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )}
                    </motion.span>
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
