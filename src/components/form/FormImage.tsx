import { useWatch, Control, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { Button } from '@mui/material';

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
}

export function FormImageField<T extends FieldValues>({ name, label, placeholder, control, disabled }: Props<T>) {
  const { setValue } = useFormContext<T>();
  const value = useWatch({
    control,
    name
  });

  const handleReset = () => {
    setValue(name, '' as any);
  };

  return (
    <>
      <FormTextField<T> name={name} label={label} placeholder={placeholder} disabled={disabled} />

      {value && (
        <>
          <img
            src={value}
            alt={label}
            style={{
              width: '100%',
              maxHeight: 200,
              objectFit: 'cover',
              borderRadius: 8,
              marginTop: 8
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
            }}
          />
          <Button variant="outlined" color="error" size="small" onClick={handleReset}>
            Remove Image
          </Button>
        </>
      )}
    </>
  );
}
