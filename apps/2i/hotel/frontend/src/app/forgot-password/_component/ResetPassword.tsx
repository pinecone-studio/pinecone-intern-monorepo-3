'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordSchema = z
  .string()
  .min(10, 'Доод тал нь 10 тэмдэгт')
  .refine((v) => /[A-Z]/.test(v), 'Том үсэг агуулсан байх')
  .refine((v) => /[a-z]/.test(v), 'Жижиг үсэг агуулсан байх')
  .refine((v) => /\d/.test(v), 'Тоо агуулсан байх');

const schema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Нууц үг таарахгүй байна',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPassword({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onChange' });

  const submit = () => onDone();

  const pw = watch('password') || '';

  return (
    <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-center">Set new password</h2>
      <p className="text-sm text-slate-500 text-center">Use a minimum of 10 characters, including uppercase, lowercase, and numbers</p>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" placeholder="••••••••••" {...register('password')} className="w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input type="password" placeholder="••••••••••" {...register('confirm')} className="w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm.message}</p>}
      </div>

      {/* Жижиг зөвлөгөөнүүд */}
      {/* <ul className="text-xs space-y-1 text-slate-600">
        <li className={pw.length >= 10 ? 'text-green-600' : ''}>• At least 10 characters</li>
        <li className={/[A-Z]/.test(pw) ? 'text-green-600' : ''}>• Uppercase letter</li>
        <li className={/[a-z]/.test(pw) ? 'text-green-600' : ''}>• Lowercase letter</li>
        <li className={/\d/.test(pw) ? 'text-green-600' : ''}>• Number</li>
      </ul> */}

      <button type="submit" disabled={!isValid} className={`w-full h-10 text-white rounded-md ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}>
        Continue
      </button>
    </form>
  );
}
