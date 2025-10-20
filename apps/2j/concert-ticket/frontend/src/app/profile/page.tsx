'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { useMyProfileQuery, useUpdateUserProfileMutation } from '@/generated';

const ProfilePage: React.FC = () => {
  const [customerData, setCustomerData] = useState({
    phone: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // GraphQL queries
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useMyProfileQuery({
    errorPolicy: 'all', // Error гарсан ч data харуулах
  });
  const [updateUserProfile, { loading: updateLoading }] = useUpdateUserProfileMutation();

  // Profile data-г default утгаар тохируулах
  useEffect(() => {
    if (profileData?.myProfile) {
      setCustomerData({
        phone: profileData.myProfile.phoneNumber || '',
        email: profileData.myProfile.email || '',
      });
    }
  }, [profileData]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCustomer = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile({
        variables: {
          input: {
            phoneNumber: customerData.phone,
            username: customerData.email.split('@')[0], // Email-ээс username үүсгэх
          },
        },
      });
      alert('Мэдээлэл амжилттай хадгалагдлаа!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Мэдээлэл хадгалахад алдаа гарлаа.');
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) return <LoadingState />;
  if (profileError) return <ErrorState />;

  return <ProfilePageContent customerData={customerData} handleCustomerChange={handleCustomerChange} handleSaveCustomer={handleSaveCustomer} isLoading={isLoading || updateLoading} />;
};

interface ProfilePageContentProps {
  customerData: { phone: string; email: string };
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveCustomer: () => void;
  isLoading: boolean;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({ customerData, handleCustomerChange, handleSaveCustomer, isLoading }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
        <div className="mb-[24px]">
          <h1 className="text-[32px] font-bold">User Profile</h1>
        </div>

        <div className="flex gap-[24px]">
          <ProfileMenu />

          <div className="flex-1">
            <div className="rounded-[12px] bg-[#111111] p-[24px]">
              <h2 className="mb-[20px] text-[20px] font-semibold">Захиалагчийн мэдээлэл</h2>

              <div className="space-y-[16px]">
                <div>
                  <label className="mb-[8px] block text-[14px] text-gray-300">Утасны дугаар</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleCustomerChange}
                    placeholder="Утасны дугаар оруулах"
                    className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-[8px] block text-[14px] text-gray-300">И-мэйл хаяг</label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleCustomerChange}
                    placeholder="И-мэйл хаяг оруулах"
                    className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCustomer}
                disabled={isLoading || updateLoading}
                className="mt-[24px] rounded-[8px] bg-[#00B7F4] px-[24px] py-[12px] text-[14px] font-medium text-black hover:bg-[#0099CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || updateLoading ? 'Хадгалагдаж байна...' : 'Хадгалах'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-black text-white">
    <Navbar />
    <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
      <div className="mb-[24px]">
        <h1 className="text-[32px] font-bold">User Profile</h1>
      </div>
      <div className="flex gap-[24px]">
        <ProfileMenu />
        <div className="flex-1">
          <div className="rounded-[12px] bg-[#111111] p-[24px]">
            <div className="animate-pulse">
              <div className="h-[20px] bg-gray-700 rounded mb-[20px]"></div>
              <div className="space-y-[16px]">
                <div className="h-[40px] bg-gray-700 rounded"></div>
                <div className="h-[40px] bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-black text-white">
    <Navbar />
    <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
      <div className="mb-[24px]">
        <h1 className="text-[32px] font-bold">User Profile</h1>
      </div>
      <div className="flex gap-[24px]">
        <ProfileMenu />
        <div className="flex-1">
          <div className="rounded-[12px] bg-red-900/30 p-[24px] text-red-200">
            <h2 className="text-[20px] font-semibold mb-[12px]">Алдаа</h2>
            <p>Профайл авахад алдаа гарлаа. Дахин оролдоно уу.</p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ProfilePage;
