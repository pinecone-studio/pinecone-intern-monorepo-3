'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const signInSchema = yup.object({
  email: yup.string().email('Email not valid').required('Enter your email address'),
  password: yup.string().min(6, 'Password must include 6 characters').required('Please enter your password'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type SignInFormData = yup.InferType<typeof signInSchema>;

const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    mode: 'onChange',
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const res = await fetch('http://localhost:8000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Account created successfully! Login to your account');
      router.push('/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-black w-screen h-screen justify-center items-center text-white flex">
      <div className="w-1/3 h-1/2 border border-neutral-600 rounded-md flex p-12 flex-col gap-10">
        <h1 className="flex justify-center w-full font-bold text-[24px]">Бүртгүүлэх</h1>
        <div className="flex-col gap-6 flex justify-between h-full">
          <div className="flex-col gap-3 flex">
            <p>Имэйл хаяг:</p>
            <input type="email" placeholder="name@example.com" className="w-full bg-black border border-neutral-600 rounded-md py-2 px-4" />
          </div>
          <div className="flex-col gap-3 flex">
            <p>Нууц үг үүсгэх:</p>
            <input type="password" className="w-full bg-black border border-neutral-600 rounded-md py-2 px-4" />
            <input type="password" className="w-full bg-black border border-neutral-600 rounded-md py-2 px-4" />
          </div>
          <button className="bg-blue-400 text-black rounded-lg py-3">Бүртгүүлэх</button>
          <p className="w-full flex justify-center text-neutral-400">
            Та бүртгэлтэй хаягтай бол
            <Link href="/sign-in" className="underline mx-1">
              нэвтрэх
            </Link>
            хэсгээр орно уу
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
