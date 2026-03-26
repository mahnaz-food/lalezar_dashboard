import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import { OutlinedInputProps } from '@mui/material';

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
} & Omit<OutlinedInputProps, 'name'>;

export function FormTextField<T extends FieldValues>({ name, label, ...inputProps }: FormTextFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={1}>
          {label && <InputLabel htmlFor={name}>{label}</InputLabel>}

          <OutlinedInput
            {...field}
            {...inputProps}
            id={name}
            error={!!fieldState.error}
            fullWidth
            type={inputProps.type}
            onChange={(e) => {
              const value = e.target.value;

              if (inputProps.type === 'number') {
                field.onChange(value === '' ? undefined : Number(value));
              } else {
                field.onChange(value);
              }
            }}
          />

          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
