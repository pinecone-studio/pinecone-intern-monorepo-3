import z from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().nonempty('user@email.com'),
    password: z.string().min(6, 'password should at least 6 character'),
    otp: z.string(),
    confirmPassword: z.string().nonempty("passwords don't match"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
