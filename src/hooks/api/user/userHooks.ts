import { useMutation } from '@tanstack/react-query';
import { loginUser } from './userApi';
import { LoginFormValues } from 'types/user';

export const useLoginMutation = () => {
  const mutationKey = ['profile'];
  return useMutation({
    mutationKey,
    mutationFn: (data: LoginFormValues) => loginUser(data)
  });
};
