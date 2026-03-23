import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import { SwitchProps } from '@mui/material';

type FormSwitchProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
} & Omit<SwitchProps, 'name' | 'checked' | 'onChange'>;

export function FormSwitch<T extends FieldValues>({ name, label, labelPlacement = 'end', ...switchProps }: FormSwitchProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          <FormControlLabel
            label={label}
            labelPlacement={labelPlacement}
            control={<Switch {...switchProps} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
          />

          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
