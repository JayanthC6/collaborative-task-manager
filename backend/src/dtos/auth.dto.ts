import { z } from 'zod';

export const RegisterDTOSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const LoginDTOSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;
export type LoginDTO = z.infer<typeof LoginDTOSchema>;
