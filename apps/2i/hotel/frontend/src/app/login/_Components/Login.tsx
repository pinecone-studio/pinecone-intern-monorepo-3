'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserLoginMutation } from '@/generated';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const Login = () => {
  const [userLoginMutation] = useUserLoginMutation();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/signup');
  };
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await userLoginMutation({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      const token = data?.userLogin.token;
      if (token) localStorage.setItem('token', token);
      console.log(data?.userLogin.message);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className="w-[350px] border-none shadow-none">
      <CardHeader className="flex flex-col items-center">
        <div className="flex gap-2 items-center mb-[22px]">
          <div className="w-[20px] h-[20px] bg-[#2563EB] rounded-full"></div>
          <h1 className="text-[20px]">Pedia</h1>
        </div>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email below to sign in</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-4">
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="hotel" type="submit">
              Log in
            </Button>
          </form>
        </Form>
        <div className="w-full flex items-center gap-2">
          <div className="border flex-1"></div>
          <p className="text-[12px] text-[#71717A]">OR</p>
          <div className="border flex-1"></div>
        </div>
        <Button variant="outline" type="button" onClick={handleSignUp}>
          Create an account
        </Button>
        <p className="text-center text-[14px] text-[#71717A] px-[20px]">By clicking continue, you agree to our Terms of Service and Privacy Policy.</p>
      </CardContent>
    </Card>
  );
};
