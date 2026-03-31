import { useMutation, useQuery } from '@tanstack/react-query';
import { addUser, deleteUser, getUser, getUsers, loginUser, updateUser } from './userApi';
import { CreateUserFormValues, GetUsersParams, LoginFormValues, UpdateUserFormValues } from 'types/user';

export const useLoginMutation = () => {
  const mutationKey = ['profile'];
  return useMutation({
    mutationKey,
    mutationFn: (data: LoginFormValues) => loginUser(data)
  });
};

export const useGetUsersQuery = (params?: GetUsersParams) => {
  const queryKey = ['users', params?.page, params?.limit, params?.query];
  return useQuery({
    queryKey,
    queryFn: () => getUsers(params)
  });
};

export const useGetUserQuery = ({ id }: { id?: string }) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => {
      if (!id) throw new Error('id is required');
      return getUser({ id });
    },
    enabled: !!id
  });
};

export const useAddUserMutation = () => {
  return useMutation({
    mutationKey: ['add-user'],
    mutationFn: (data: CreateUserFormValues) => addUser(data)
  });
};

export const useUpdateUserMutation = ({ id }: { id?: string }) => {
  return useMutation({
    mutationKey: ['update-user', id],
    mutationFn: (data: UpdateUserFormValues) => {
      if (!id) throw new Error('id is required');
      return updateUser({ id, data });
    }
  });
};

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: ['delete-user'],
    mutationFn: ({ id }: { id: string }) => deleteUser({ id })
  });
};
