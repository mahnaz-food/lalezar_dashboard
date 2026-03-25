import { loginSchema } from '../../validators/user-schema';
import { z } from 'zod';

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface ILoginRes {
  message: string;
}
