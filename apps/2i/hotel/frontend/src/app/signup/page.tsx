'use client';

import z from 'zod';
import { SignUp } from './_Components/SignUp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { VerifyOtp } from './_Components/VerifyOtp';
import { Password } from './_Components/Password';
import { useUserSignUpMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { signUpSchema } from './_Components/Validation';

export type SignUpFormType = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [userSignUpMutation] = useUserSignUpMutation();
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [index, setIndex] = useState<number>(0);

  const comp = [SignUp, VerifyOtp, Password];
  const Stepper = comp[index];

  const onSubmit = async (values: SignUpFormType) => {
    try {
      const { data } = await userSignUpMutation({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      console.log(data?.userSignUp.message);
      router.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Stepper form={form} onSubmit={onSubmit} setIndex={setIndex} />
    </div>
  );
};

export default SignUpPage;
