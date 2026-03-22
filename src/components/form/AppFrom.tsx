import { Grid } from '@mui/material';
import { FormProvider, SubmitHandler, useForm, FieldValues, DefaultValues, UseFormReturn, Path } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import AnimateButton from 'components/@extended/AnimateButton';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  textFieldType?: 'text' | 'password';
  xs?: number;
  md?: number;
};

interface AppFormProps<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  fields: FormFieldConfig<T>[];
  schema: ZodType<T, any, any>;
  isPending?: boolean;
  submitLabel?: string;
  isButtonFullwidth?: boolean;
}

// ================================|| APPFORM COMPONENT ||================================ //

export function AppForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  fields,
  schema,
  isPending,
  submitLabel = 'Submit',
  isButtonFullwidth = false
}: AppFormProps<T>) {
  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const {
    formState: { isSubmitting }
  } = methods;

  return (
    <FormProvider<T> {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={field.xs ?? 12} md={field.md ?? 6} key={field.name}>
              <FormTextField<T> name={field.name} label={field.label} placeholder={field.placeholder} type={field.textFieldType} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || isPending}
                fullWidth={isButtonFullwidth}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                {submitLabel}
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
