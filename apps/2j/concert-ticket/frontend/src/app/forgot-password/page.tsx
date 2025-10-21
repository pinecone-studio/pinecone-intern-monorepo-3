'use client';

import React, { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to reset password
    console.log('Password reset request for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]">
            <h1 className="text-[32px] font-bold">Forget password</h1>
          </div>

          <div className="flex gap-[24px]">
            <ProfileMenu />
            
            <div className="flex-1">
              <div className="max-w-[400px]">
                <div className="rounded-[12px] bg-[#111111] p-[24px] text-center">
                  <div className="text-[48px] mb-[16px]">✓</div>
                  <h2 className="text-[20px] font-semibold mb-[12px]">Имэйл илгээгдлээ</h2>
                  <p className="text-[14px] text-gray-300 mb-[24px]">
                    Таны имэйл хаяг руу нууц үг сэргээх холбоос илгээгдлээ.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-[8px] bg-[#00B7F4] px-[24px] py-[12px] text-[14px] font-medium text-black hover:bg-[#0099CC] transition-colors"
                  >
                    Буцах
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]">
            <h1 className="text-[32px] font-bold">Forget password</h1>
          </div>

          <div className="flex gap-[24px]">
            <ProfileMenu />
            
            <div className="flex-1">
              <div className="max-w-[400px]">
                <div className="rounded-[12px] bg-[#111111] p-[24px]">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-[20px]">
                      <label className="mb-[8px] block text-[14px] text-gray-300">
                        И-мэйл хаяг
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="И-мэйл хаяг оруулах"
                        required
                        className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-[8px] bg-[#00B7F4] px-[24px] py-[12px] text-[14px] font-medium text-black hover:bg-[#0099CC] transition-colors"
                    >
                      Нууц үг сэргээх
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
