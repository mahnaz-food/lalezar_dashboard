import { creatUserSchema, loginSchema, updateUserSchema } from '../../validators/user-schema';
import { z } from 'zod';
import { BaseQueryParams } from './api';

export interface GetUsersParams extends BaseQueryParams {}

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginRes {
  message: string;
}

export type CreateUserFormValues = z.infer<typeof creatUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
