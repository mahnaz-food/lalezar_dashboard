// import { Button } from '@mui/material';
import { BaseModal } from './BaseModal';

type FormModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export function FormModal({ open, onClose, title, children, onSubmit, isSubmitting }: FormModalProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      // actions={
      //   <>
      //     <Button onClick={onClose}>Cancel</Button>
      //     <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
      //       Submit
      //     </Button>
      //   </>
      // }
    >
      {children}
    </BaseModal>
  );
}
