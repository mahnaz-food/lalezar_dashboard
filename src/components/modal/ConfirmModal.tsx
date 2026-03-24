import { Button, DialogContentText } from '@mui/material';
import { BaseModal } from './BaseModal';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ open, title = 'Are you sure?', description, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </Button>
        </>
      }
    >
      {description && <DialogContentText>{description}</DialogContentText>}
    </BaseModal>
  );
}
