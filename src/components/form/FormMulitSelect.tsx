import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { SelectProps } from '@mui/material';
import { IOption } from './FormSingleSelect';

type FormMultiSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: IOption[];
  placeholder?: string;
} & Omit<SelectProps, 'name' | 'value' | 'onChange' | 'multiple'>;

export function FormMultiSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = 'Select',
  ...selectProps
}: FormMultiSelectProps<T>) {
  const { control } = useFormContext<T>();

  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={1}>
          {label && <InputLabel id={labelId}>{label}</InputLabel>}

          <Select
            {...field}
            {...selectProps}
            labelId={labelId}
            id={name}
            multiple
            input={<OutlinedInput />}
            error={!!fieldState.error}
            fullWidth
            renderValue={(selected) => {
              if (!selected || (selected as any[]).length === 0) {
                return <em>{placeholder}</em>;
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as (string | number)[]).map((value) => {
                    const option = options.find((o) => o.value === value);
                    return <Chip key={value} label={option?.label || value} />;
                  })}
                </Box>
              );
            }}
          >
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
