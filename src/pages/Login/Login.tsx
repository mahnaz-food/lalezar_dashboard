import { AppForm, FormFieldConfig } from 'components/form/AppFrom';
import { LoginFormValues } from 'types/user';
import { loginSchema } from './login-schema';
import { useLoginMutation } from 'hooks/api/user/userHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

interface ILoginForm {
  email: string;
  password: string;
}

const fields: FormFieldConfig<ILoginForm>[] = [
  { name: 'email', label: 'Email', md: 12, placeholder: 'Enter email' },
  { name: 'password', label: 'Password', md: 12, placeholder: 'Enter password', textFieldType: 'password' }
];

const defaultValues: LoginFormValues = {
  email: '',
  password: ''
};

// ================================|| LOGIN FORM ||================================ //

export default function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useLoginMutation();
  const onSubmit = async (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        navigate('/');
      }
    });
  };
  return (
    <AppForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      fields={fields}
      schema={loginSchema}
      submitLabel="Login"
      isButtonFullwidth
      isPending={isPending}
    />
  );
}
