'use client';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  code: z.string().regex(/^\d{4}$/, '4 оронтой тоо оруулна уу'),
});
type FormValues = z.infer<typeof schema>;

export default function VerifyEmail({ email, onBack, onNext }: { email: string; onBack: () => void; onNext: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  const [boxes, setBoxes] = useState(['', '', '', '']);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [sec, setSec] = useState(15);

  // RHF value update
  useEffect(() => {
    setValue('code', boxes.join(''), { shouldValidate: true, shouldDirty: true });
  }, [boxes, setValue]);

  // countdown
  useEffect(() => {
    if (sec <= 0) return;
    const t = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [sec]);

  const changeBox = (i: number, v: string) => {
    const ch = v.replace(/\D/g, '').slice(-1);
    const next = [...boxes];
    next[i] = ch;
    setBoxes(next);
    if (ch && i < 3) refs.current[i + 1]?.focus();
    if (!ch && i > 0) refs.current[i - 1]?.focus();
  };

  const submit = () => onNext();

  return (
    <form onSubmit={handleSubmit(submit)} className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-center">Confirm email</h2>
      <p className="text-sm text-slate-500 text-center">
        To continue, enter the secure code we sent to <br />
        <span className="font-medium">{email}</span>
      </p>

      {/* OTP boxes */}
      <div className="flex justify-center gap-2">
        {boxes.map((v, i) => (
          <Input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            maxLength={1}
            value={v}
            onChange={(e) => changeBox(i, e.target.value)}
            className="w-12 h-12 text-center text-lg"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        ))}
      </div>

      {/* hidden RHF field to register `code` */}
      <input type="hidden" {...register('code')} />

      {errors.code && <p className="text-xs text-red-600 text-center -mt-4">{errors.code.message}</p>}

      {/* Continue button */}
      <Button type="submit" disabled={!isValid} className={`w-full h-10 ${isValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-400 text-white cursor-not-allowed'}`}>
        Continue
      </Button>

      {/* Back button */}
      <Button type="button" variant="outline" onClick={onBack} className="w-full h-10">
        Back
      </Button>

      <p className="text-sm text-center text-slate-500">
        {sec > 0 ? (
          <>Send again ({sec})</>
        ) : (
          <button type="button" onClick={() => setSec(15)} className="underline text-blue-600">
            Send again
          </button>
        )}
      </p>
    </form>
  );
}
