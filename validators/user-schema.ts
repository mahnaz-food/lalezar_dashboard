import { ROLES } from 'lib/constants';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invallid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
});

export const baseUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address')
});

export const creatUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const updateUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(ROLES)
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invallid email address'),
  // role: z.enum(ROLES).optional(),
  password: z.string().min(6, 'Password is required')
});
