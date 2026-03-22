import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import { Stack, InputLabel, OutlinedInput, FormHelperText, OutlinedInputProps } from '@mui/material';

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

          <OutlinedInput {...field} {...inputProps} id={name} error={!!fieldState.error} fullWidth />

          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
