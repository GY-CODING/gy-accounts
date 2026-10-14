/* eslint-disable react/react-in-jsx-scope */
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Box } from '@mui/material';
import Button from '../atoms/Button';

interface ActionsBoxProps {
  isEditing: boolean;
  handleEditClick: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  isLoadingUpdate: boolean;
  isSaveDisabled?: boolean;
}

// Botones a ancho completo al pie de la tarjeta de identidad.
export default function ActionsBox({
  isEditing,
  handleEditClick,
  handleSaveEdit,
  handleCancelEdit,
  isLoadingUpdate,
  isSaveDisabled,
}: ActionsBoxProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4 }}>
      {isEditing ? (
        <>
          {/* Modo edición: guardar (primario) + cancelar (secundario) */}
          <Button
            fullWidth
            onClick={handleSaveEdit}
            disabled={isLoadingUpdate || !!isSaveDisabled}
          >
            {isLoadingUpdate ? 'Saving…' : 'Save changes'}
          </Button>
          <Button fullWidth tone="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          {/* Modo lectura: editar (primario) + cerrar sesión (peligro) */}
          <Button
            fullWidth
            startIcon={<EditRoundedIcon />}
            onClick={handleEditClick}
          >
            Edit profile
          </Button>
          <Button
            fullWidth
            tone="danger"
            href="/api/auth/logout"
            startIcon={<LogoutRoundedIcon />}
          >
            Log out
          </Button>
        </>
      )}
    </Box>
  );
}
