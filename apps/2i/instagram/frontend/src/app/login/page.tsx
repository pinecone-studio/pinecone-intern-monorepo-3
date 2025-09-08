"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLoginMutation} from '@/generated';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Provider';



const LoginPage = () => {
const router = useRouter();
   const { token,loading,login: setAuthToken } = useAuth();
  const [ Login] = useLoginMutation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
 useEffect(() => {
    if (token) router.push('/');
  }, [token, router]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
       try {
      const response = await Login({
        variables: {
         login: {
            email: formData.email,
            password: formData.password
          }
        }
      });
        const result = response.data?.login;
    if ( result?.token) {
      setAuthToken(result.token);
      router.push("/");
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  } 
  };
 if (loading) return <div>Loading...</div>



if (token) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
        </div>
 
        <form  data-testid="login-form"  onSubmit={handleSubmit} className="space-y-4">
          <input
           
            type="email"
            name='email'
            placeholder="Phone number, username, or email"
            value={formData.email}
           onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
           
            type="password"
            placeholder="Password"
            name='password'
          
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button  type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors" >
            Log in
          </button>
         
        </form>
 
        <div className="mt-6 text-center">
          <Link href="/forgot" className="text-blue-900 hover:underline text-sm">
            Forgot password?
          </Link>
        </div>
 
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-4">
            People who use our service may have uploaded your contact information to Instagram.{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Learn more
            </a>
          </p>
          <p className="text-xs text-gray-500">
            By logging in, you agree to our{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
 
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-900 hover:underline" >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default LoginPage;