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
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={PopupTransition} keepMounted>
      <Box sx={{ p: 1.5 }}>
        {title && <DialogTitle>{title}</DialogTitle>}

        <DialogContent>{children}</DialogContent>

        {actions && <DialogActions>{actions}</DialogActions>}
      </Box>
    </Dialog>
  );
}
