import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { SignUpFormType, signUpSchema } from '../page';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { useSendOtpMutation } from '@/generated';
import { useRouter } from 'next/navigation';

type SignUpType = {
  form: UseFormReturn<SignUpFormType>;
  onSubmit: (_values: SignUpFormType) => void;
  setIndex: Dispatch<SetStateAction<number>>;
};

export const SignUp = ({ form, onSubmit, setIndex }: SignUpType) => {
  const router = useRouter();
  const handleLogIn = () => {
    router.push('/login');
  };
  const [sendOtpMutation] = useSendOtpMutation();
  const handleSendOtp = async () => {
    try {
      const { data } = await sendOtpMutation({
        variables: {
          email: form.getValues('email'),
        },
      });
      console.log(data?.sendOtp, 'sign up');
      setIndex((prev) => prev + 1);
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-4">
        <Form {...form}>
          <form className="flex flex-col gap-2">
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
            <Button variant="hotel" type="button" onClick={handleSendOtp}>
              Continue
            </Button>
          </form>
        </Form>
        <div className="w-full flex items-center gap-2">
          <div className="border flex-1"></div>
          <p className="text-[12px] text-[#71717A]">OR</p>
          <div className="border flex-1"></div>
        </div>
        <Button variant="outline" type="button" onClick={handleLogIn}>
          Log in
        </Button>
        <p className="text-center text-[14px] text-[#71717A] px-[20px]">By clicking continue, you agree to our Terms of Service and Privacy Policy.</p>
      </CardContent>
    </Card>
  );
};
