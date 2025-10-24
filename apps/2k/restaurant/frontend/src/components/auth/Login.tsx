'use client';
 
import React from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '@/generated';
 
interface LoginFormInputs {
  email: string;
  password: string;
}
 
const Login: React.FC = () => {
  const router = useRouter();
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(
      z.object({
        email: z.string().email('Имэйл буруу байна').min(1, 'Имэйл хоосон байна'),
        password: z.string().min(6, 'Нууц үг 6 тэмдэгтээс их байх ёстой'),
      })
    ),
    defaultValues: { email: '', password: '' },
  });
 
  const [userLogin, { loading }] = useSignInMutation();
 
  const onSubmit = async (values: LoginFormInputs) => {
    try {
      const { data } = await userLogin({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      });
 
      if (!data?.userLogin || !data.userLogin.user) {
        form.setError('email', { message: 'Имэйл эсвэл нууц үг буруу байна' });
        return;
      }
 
   
      localStorage.setItem('token', data.userLogin.token);
 

      localStorage.setItem('user', JSON.stringify(data.userLogin.user));
 
   
      const role = data.userLogin.user.role;
      if (role === 'ADMIN') {
        router.push('/admin/order');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      form.setError('email', { message: 'Имэйл эсвэл нууц үг буруу байна' });
    }
  };
 
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-6 bg-gray-50">
      <Image src="/mainLogo.png" alt="Logo" width={108} height={104} />
      <div className="flex flex-col w-[327px] items-center gap-6">
        <h1 className="text-2xl font-semibold text-[#441500]">Нэвтрэх</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Имэйл хаяг" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Нууц үг" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full bg-[#441500] text-white">
              {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
            </Button>
          </form>
        </Form>
        <Button type="button" onClick={() => router.push('/reset-password')} className="w-full text-black bg-transparent hover:bg-gray-100">
          Нууц үг мартсан?
        </Button>
        <div className="flex gap-2 w-full items-center">
          <div className="w-full h-[1px] bg-[#E4E4E7]" />
          <span className="text-[12px] text-[#71717A]">Эсвэл</span>
          <div className="w-full h-[1px] bg-[#E4E4E7]" />
        </div>
        <Button type="button" onClick={() => router.push('/sign-up')} className="w-full bg-transparent border border-[#E4E4E7] text-[#441500] hover:bg-gray-100">
          Бүргүүлэх
        </Button>
      </div>
    </div>
  );
};
 
export default Login;