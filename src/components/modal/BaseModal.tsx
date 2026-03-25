import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function BaseModal({ open, onClose, title, children, actions }: BaseModalProps) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={PopupTransition}
      keepMounted
      sx={{ '& .MuiDialog-paper': { width: ['90%', '80%', '80%', '50%'], maxHeight: 435 } }}
      maxWidth={matchDownMD ? 'sm' : 'lg'}
    >
      <Box sx={{ p: 1.5 }}>
        {title && <DialogTitle>{title}</DialogTitle>}

        <DialogContent>{children}</DialogContent>

        {actions && <DialogActions>{actions}</DialogActions>}
      </Box>
    </Dialog>
  );
}
