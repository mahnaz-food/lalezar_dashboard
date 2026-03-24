import { AppForm } from 'components/form/AppFrom';
import { ConfirmModal } from 'components/modal/ConfirmModal';
import { FormModal } from 'components/modal/FormModal';
import { createContext, useContext, useState } from 'react';

interface IConfirmOptions {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
}

interface IFormOptions<T = any> {
  title?: string;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  fields: any;
  schema: any;
}

interface IModalContext {
  confirm: (options: IConfirmOptions) => Promise<boolean>;
  openForm: <T>(options: IFormOptions<T>) => void;
}

const ModalContext = createContext<IModalContext | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  // Confirm state
  const [confirmState, setConfirmState] = useState<{
    options: IConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  //   Form state
  const [formState, setFormState] = useState<IFormOptions<any> | null>(null);

  // Confirm (Promise-based)
  const confirm = (options: IConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  };

  // ✅ Open Form
  const openForm = <T,>(options: IFormOptions<T>) => {
    setFormState(options);
  };

  // ================= HANDLERS =================

  const handleConfirmClose = () => {
    confirmState?.resolve(false);
    setConfirmState(null);
  };

  const handleConfirm = async () => {
    if (confirmState?.options.onConfirm) {
      await confirmState.options.onConfirm(); // API call here
    }
    confirmState?.resolve(true);
    setConfirmState(null);
  };

  const handleFormClose = () => setFormState(null);

  const handleFormSubmit = async (data: any) => {
    if (formState?.onSubmit) {
      await formState.onSubmit(data); // API call here
    }
    setFormState(null); // close after success
  };

  return (
    <ModalContext.Provider value={{ confirm, openForm }}>
      {children}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmState}
        title={confirmState?.options.title}
        description={confirmState?.options.description}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
      />

      {/* Form Modal */}
      {formState && (
        <FormModal open={!!formState} title={formState.title} onClose={handleFormClose} onSubmit={() => {}}>
          <AppForm
            defaultValues={formState.defaultValues}
            onSubmit={handleFormSubmit}
            fields={formState.fields}
            schema={formState.schema}
          />
        </FormModal>
      )}
    </ModalContext.Provider>
  );
}
