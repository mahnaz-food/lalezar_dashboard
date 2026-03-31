import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { SelectProps } from '@mui/material';

export interface Option {
  label: string;
  value: string | number;
}

type FormSingleSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
} & Omit<SelectProps, 'name' | 'value' | 'onChange'>;

export function FormSingleSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = 'Select',
  ...selectProps
}: FormSingleSelectProps<T>) {
  const { control } = useFormContext<T>();

  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={1}>
          {label && <InputLabel id={labelId}>{label}</InputLabel>}

          <Select {...field} {...selectProps} labelId={labelId} id={name} displayEmpty error={!!fieldState.error} fullWidth>
            {/* Placeholder */}
            <MenuItem disabled value="">
              <em>{placeholder}</em>
            </MenuItem>

            {/* Options */}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
