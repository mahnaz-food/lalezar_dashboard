import { loginSchema } from 'pages/Login/login-schema';
import { z } from 'zod';

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface ILoginRes {
  message: string;
}
