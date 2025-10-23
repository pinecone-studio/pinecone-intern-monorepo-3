'use client';

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { useMyProfileQuery, useUpdateUserProfileMutation } from '@/generated';

const useCustomerData = () => {
  const [customerData, setCustomerData] = useState({
    phone: '',
    email: '',
  });

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useMyProfileQuery({
    errorPolicy: 'all',
  });

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

  return { customerData, handleCustomerChange, profileLoading, profileError, refetchProfile };
};

const useProfileSave = (refetchProfile: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [updateUserProfile, { loading: updateLoading }] = useUpdateUserProfileMutation();

  const handleSaveCustomer = async (customerData: { phone: string; email: string }) => {
    try {
      setIsLoading(true);
      await updateUserProfile({
        variables: {
          input: {
            phoneNumber: customerData.phone,
            username: customerData.email.split('@')[0],
          },
        },
      });
      
      // Success toast харуулах
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      
      // Profile data дахин ачаалах
      refetchProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Error toast харуулах
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    handleSaveCustomer, 
    isLoading, 
    updateLoading, 
    showSuccessToast, 
    showErrorToast,
    setShowSuccessToast,
    setShowErrorToast
  };
};

const ProfileForm = ({
  customerData,
  handleCustomerChange,
  handleSaveCustomer,
  isLoading,
  updateLoading,
}: {
  customerData: { phone: string; email: string };
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveCustomer: (customerData: { phone: string; email: string }) => Promise<void>;
  isLoading: boolean;
  updateLoading: boolean;
}) => (
  <div className="flex-1">
    <div className="max-w-[600px]">
      <div className="rounded-[12px] bg-[#111111] p-[24px]">
        <h2 className="mb-[24px] text-[20px] font-bold">Хувийн мэдээлэл</h2>
        <div className="space-y-[20px]">
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
          onClick={() => handleSaveCustomer(customerData)}
          disabled={isLoading || updateLoading}
          className="mt-[24px] rounded-[8px] bg-[#00B7F4] px-[24px] py-[12px] text-[14px] font-medium text-black hover:bg-[#0099CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || updateLoading ? 'Хадгалагдаж байна...' : 'Хадгалах'}
        </button>
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { customerData, handleCustomerChange, profileLoading, profileError, refetchProfile } = useCustomerData();
  const { 
    handleSaveCustomer, 
    isLoading, 
    updateLoading, 
    showSuccessToast, 
    showErrorToast,
    setShowSuccessToast,
    setShowErrorToast
  } = useProfileSave(refetchProfile);

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]"></div>
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
  }

  // Error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]"></div>
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
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
        <div className="mb-[24px]"></div>

        <div className="flex gap-[24px]">
          <ProfileMenu />

          <ProfileForm customerData={customerData} handleCustomerChange={handleCustomerChange} handleSaveCustomer={handleSaveCustomer} isLoading={isLoading} updateLoading={updateLoading} />
        </div>
      </main>

      <Footer />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-[20px] right-[20px] z-50 bg-green-600 text-white px-[16px] py-[12px] rounded-[8px] shadow-lg flex items-center gap-[8px] animate-in slide-in-from-right duration-300">
          <Check size={16} />
          <span className="text-[14px] font-medium">Мэдээлэл амжилттай хадгалагдлаа!</span>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed top-[20px] right-[20px] z-50 bg-red-600 text-white px-[16px] py-[12px] rounded-[8px] shadow-lg flex items-center gap-[8px] animate-in slide-in-from-right duration-300">
          <X size={16} />
          <span className="text-[14px] font-medium">Мэдээлэл хадгалахад алдаа гарлаа</span>
          <button 
            onClick={() => setShowErrorToast(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
