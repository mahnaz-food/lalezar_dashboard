import { Box, Button, Grid, IconButton } from '@mui/material';
import { useFieldArray, useFormContext, FieldValues, ArrayPath } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSingleSelect } from './FormSingleSelect';
import { Add, Trash } from 'iconsax-react';

type Props<T extends FieldValues> = {
  name: ArrayPath<T>;
};

export function FormButtonsField<T extends FieldValues>({ name }: Props<T>) {
  const { control } = useFormContext<T>();

  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  return (
    <Box>
      {/* Buttons List */}
      {fields.map((item, index) => (
        <Box key={item.id} mb={2} p={2} border="1px solid #eee" borderRadius={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormTextField<T> name={`${name}.${index}.label` as any} label="Label" placeholder="Button label" />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormTextField<T> name={`${name}.${index}.url` as any} label="URL" placeholder="/menu" />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormSingleSelect<T>
                name={`${name}.${index}.variant` as any}
                label="Variant"
                options={[
                  { label: 'Default', value: 'default' },
                  { label: 'Outline', value: 'outline' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={1} display="flex" alignItems="center">
              <IconButton color="error" onClick={() => remove(index)}>
                <Trash />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        sx={{ width: '100%' }}
        variant="outlined"
        size="small"
        startIcon={<Add />}
        onClick={() =>
          append({
            label: '',
            url: '',
            variant: 'default'
          } as any)
        }
      >
        Add Button
      </Button>
    </Box>
  );
}
