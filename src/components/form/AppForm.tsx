import { Grid } from '@mui/material';
import { FormProvider, SubmitHandler, useForm, FieldValues, DefaultValues, UseFormReturn, Path } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodTypeAny } from 'zod';
import { FormSingleSelect, Option } from './FormSingleSelect';
import { FormSwitch } from './FormSwitch';
import { FormMultiSelect } from './FormMulitSelect';
import { FormImageField } from './FormImage';
import { FormButtonsField } from './FormButton';

export type FieldType = 'text' | 'number' | 'multiLineText' | 'password' | 'select' | 'multiselect' | 'switch' | 'image' | 'buttons';

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: FieldType;
  rows?: number;
  options?: Option[];
  xs?: number;
  md?: number;
  disabled?: boolean;
};

interface AppFormProps<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  fields: FormFieldConfig<T>[];
  schema: ZodTypeAny;
  isPending?: boolean;
  submitLabel?: string;
  isButtonFullwidth?: boolean;
  children?: React.ReactNode;
}

// ================================|| APPFORM COMPONENT ||================================ //

export function AppForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  fields,
  schema,
  isPending,
  submitLabel = 'Submit',
  isButtonFullwidth = false,
  children
}: AppFormProps<T>) {
  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema as any)
  });

  const {
    formState: { isSubmitting }
  } = methods;

  const renderField = (field: FormFieldConfig<T>) => {
    switch (field.type) {
      case 'select':
        return (
          <FormSingleSelect<T>
            name={field.name}
            label={field.label}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );

      case 'multiselect':
        return (
          <FormMultiSelect
            name={field.name}
            label={field.label}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );

      case 'password':
        return (
          <FormTextField<T>
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type="password"
            disabled={field.disabled}
          />
        );

      case 'image':
        return (
          <FormImageField
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            disabled={field.disabled}
            control={methods.control}
          />
        );

      case 'buttons':
        return <FormButtonsField name={field.name as any} />;

      case 'number':
        return <FormTextField<T> name={field.name} label={field.label} type="number" />;

      case 'multiLineText':
        return (
          <FormTextField<T>
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            multiline
            rows={field.rows || 2}
            disabled={field.disabled}
          />
        );
      case 'switch':
        return <FormSwitch name={field.name} label={field.label} disabled={field.disabled} />;

      case 'text':
      default:
        return <FormTextField<T> name={field.name} label={field.label} placeholder={field.placeholder} />;
    }
  };

  return (
    <FormProvider<T> {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* CUSTOM CONTENT */}
          {children && (
            <Grid item xs={12}>
              {children}
            </Grid>
          )}

          {fields.map((field) => (
            <Grid item xs={field.xs ?? 12} md={field.md ?? 6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}

          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
