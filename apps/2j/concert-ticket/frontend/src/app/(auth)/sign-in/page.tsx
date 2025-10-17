'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

const signInSchema = yup.object({
  email: yup.string().email('Email not valid').required('Enter your email address'),
  password: yup.string().min(6, 'Password must include 6 characters').required('Please must enter your password'),
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

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const res = await fetch('http://localhost:8000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Login response data:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      } else {
        alert('Successfully logged in!');
      }

      localStorage.setItem('userEmail', data.user?.email || '');
      localStorage.setItem('token', data.token);

      console.log('Saved email to localStorage:', data.user?.email);

      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      alert(err.message);
    }
  };
  return (
    <div className="bg-black w-screen h-screen justify-center items-center text-white flex">
      <div className="w-1/3 h-1/2 border border-neutral-600 rounded-md flex p-12 flex-col gap-10">
        <h1 className="flex justify-center w-full font-bold text-[24px]">Нэвтрэх</h1>
        <div className="flex-col gap-6 flex justify-between h-full">
          <div className="flex-col gap-3 flex">
            <p>Имэйл хаяг:</p>
            <input type="email" placeholder="name@example.com" className="w-full bg-black border border-neutral-600 rounded-md py-2 px-4" />
          </div>
          <div className="flex-col gap-3 flex">
            <p>Нууц үг:</p>
            <input type="password" className="w-full bg-black border border-neutral-600 rounded-md py-2 px-4" />
          </div>
          <button className="bg-blue-400 text-black rounded-lg py-3">Нэвтрэх</button>
          <p className="w-full flex justify-center text-neutral-400">
            Та бүртгэлтэй хаяггүй бол
            <Link href="/sign-up" className="underline mx-1 hover:text-neutral-200">
              бүртгүүлэх
            </Link>
            хэсгээр орно уу
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
