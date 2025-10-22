'use client';

import React, { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { Eye, EyeOff } from 'lucide-react';
import { useChangePasswordMutation } from '@/generated';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  shown: boolean;
  onToggle: () => void;
  ariaLabel: string;
};

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, shown, onToggle, ariaLabel }) => (
  <div className="mb-[20px]">
    <label className="mb-[8px] block text-[14px] text-gray-300">{label}</label>
    <div className="relative">
      <input
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="********"
        required
        className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] pr-[40px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
      />
      <button type="button" aria-label={ariaLabel} onClick={onToggle} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
        {shown ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePasswordMutation, { loading }] = useChangePasswordMutation();

  const validate = (): string | null => {
    if (newPassword !== confirmPassword) return 'Шинэ нууц үг хоёр таарахгүй байна';
    if (newPassword.length < 6) return 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const result = await changePasswordMutation({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      if (result.data?.changePassword) {
        setIsSubmitted(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Нууц үг солиход алдаа гарлаа';
      setError(errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]">
            <h1 className="text-[32px] font-bold">Нууц үг солих</h1>
          </div>
          <div className="flex gap-[24px]">
            <ProfileMenu />
            <div className="flex-1">
              <div className="max-w-[600px]">
                <div className="rounded-[12px] bg-[#111111] p-[24px] text-center">
                  <div className="text-[48px] mb-[16px]">✓</div>
                  <h2 className="text-[20px] font-semibold mb-[12px]">Амжилттай хадгалагдлаа</h2>
                  <p className="text-[14px] text-gray-300 mb-[24px]">Таны нууц үг амжилттай шинэчлэгдлээ.</p>
                  <button
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setError(null);
                      setShowCurrent(false);
                      setShowNew(false);
                      setShowConfirm(false);
                      setIsSubmitted(false);
                    }}
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
          <h1 className="text-[32px] font-bold">Нууц үг солих</h1>
        </div>
        <div className="flex gap-[24px]">
          <ProfileMenu />
          <div className="flex-1">
            <div className="max-w-[600px]">
              <div className="rounded-[12px] bg-[#111111] p-[24px]">
                <form onSubmit={handleSubmit}>
                  <PasswordField
                    label="Хуучин нууц үг:"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    shown={showCurrent}
                    onToggle={() => setShowCurrent((s) => !s)}
                    ariaLabel="toggle current password"
                  />
                  <PasswordField label="Шинэ нууц үг:" value={newPassword} onChange={setNewPassword} shown={showNew} onToggle={() => setShowNew((s) => !s)} ariaLabel="toggle new password" />
                  <PasswordField
                    label="Шинэ нууц үг давтах:"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    shown={showConfirm}
                    onToggle={() => setShowConfirm((s) => !s)}
                    ariaLabel="toggle confirm password"
                  />
                  {error && <div className="mb-[12px] text-[13px] text-red-500">{error}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[8px] bg-[#00B7F4] px-[24px] py-[12px] text-[14px] font-medium text-black hover:bg-[#0099CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Хадгалж байна...' : 'Хадгалах'}
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

export default ChangePasswordPage;
