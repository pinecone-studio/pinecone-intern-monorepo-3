'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button'; // shadcn button ашиглаж байна

const schema = z.object({
  email: z.string().email('Зөв имэйл оруулна уу'),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword({ email, setEmail, onNext }: { email: string; setEmail: (v: string) => void; onNext: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email },
  });

  const submit = (data: FormValues) => {
    setEmail(data.email);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-center">Forget password</h2>
      <p className="text-sm text-slate-500 text-center">Enter your email account to reset password</p>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" placeholder="name@example.com" {...register('email')} className="w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <Button type="submit" disabled={!isValid} className={`w-full h-10 ${isValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-400 text-white cursor-not-allowed'}`}>
        Continue
      </Button>
    </form>
  );
}
