'use client';

import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

export default function ConfirmEmailPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.push('/signup/password');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="mx-auto h-4 w-4 rounded-full bg-blue-600" />
            <h2 className="mt-3 text-xl font-semibold text-gray-900">Confirm email</h2>
            <p className="text-sm text-gray-500">
              To continue, enter the secure code we sent to <span className="font-medium">n.shagai@nest.mn</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP slots */}
            <div className="flex justify-center">
              <InputOTP maxLength={4}>
                <InputOTPGroup className="flex gap-2">
                  <InputOTPSlot index={0} className="rounded-md" />
                  <InputOTPSlot index={1} className="rounded-md" />
                  <InputOTPSlot index={2} className="rounded-md" />
                  <InputOTPSlot index={3} className="rounded-md" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full rounded-md bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700">
              Continue
            </Button>

            {/* Resend */}
            <p className="text-center text-xs text-gray-500">
              Send again <span className="opacity-60">(15)</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
