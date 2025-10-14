import { SquareChevronLeft, CheckCircle } from 'lucide-react';
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
  return <div>signin</div>;
};
