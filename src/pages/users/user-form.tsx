import { useQueryClient } from '@tanstack/react-query';
import { AppForm, FormFieldConfig } from 'components/form/AppFrom';
import { useNavigate } from 'react-router';
import { CreateUserFormValues, UpdateUserFormValues, User } from 'types/user';
import { Option } from 'components/form/FormSingleSelect';
import FormSkeleton from 'components/skeleton/FormSkeleton';
import { userSchema } from '../../../validators/user-schema';
import { ROLES } from 'lib/constants';
import { useAddUserMutation, useUpdateUserMutation } from 'hooks/api/user/userHooks';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface UserFormProps {
  user?: User;
  isLoading?: boolean;
  id?: string;
}

const createDefaultValues: CreateUserFormValues = {
  email: '',
  name: '',
  password: ''
};

const roleOptions: Option[] = ROLES.map((r: string) => ({ label: r, value: r }));

export default function UserForm({ user, isLoading, id }: UserFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createUser, isPending: isCreating } = useAddUserMutation();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation({ id });

  // const fields: FormFieldConfig<UserFormValues>[] = useMemo(() => {});

  const updateFormValues: UpdateUserFormValues = useMemo(() => {
    return {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      password: ''
    };
  }, [user]);

  console.log(user);

  const fields: FormFieldConfig<CreateUserFormValues | UpdateUserFormValues>[] = useMemo(() => {
    if (user) {
      // UPDATE MODE
      return [
        { name: 'email', type: 'text', label: 'Email', placeholder: 'Enter email', md: 3 },
        { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', md: 3 },

        {
          name: 'role',
          type: 'select',
          label: 'Role',
          placeholder: 'Select role',
          options: roleOptions,
          md: 3
        },

        {
          name: 'password',
          type: 'password',
          label: 'New Password',
          placeholder: 'Leave blank to keep current password',
          md: 3
        }
      ];
    }

    // CREATE MODE
    return [
      { name: 'email', type: 'text', label: 'Email', placeholder: 'Enter email', md: 4 },
      { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', md: 4 },

      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter password',
        md: 4
      }
    ];
  }, [user]);

  const onSubmit = (data: CreateUserFormValues | UpdateUserFormValues) => {
    if (user && id) {
      // Update mode
      updateUser(data as UpdateUserFormValues, {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
      });
    } else {
      createUser(data as CreateUserFormValues, {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['user', id] });
          navigate('/users');
        }
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <FormSkeleton fields={fields.map((f) => ({ md: f.md ?? 12 }))} />
      ) : (
        <AppForm
          fields={fields}
          defaultValues={user ? updateFormValues : createDefaultValues}
          schema={userSchema}
          onSubmit={onSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </>
  );
}
