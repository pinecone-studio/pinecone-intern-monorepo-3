import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfile } from '@clerk/nextjs';

export default async function ProfilePage() {
  const { userId } = auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <UserProfile 
            appearance={{
              elements: {
                card: 'shadow-none',
                navbar: 'hidden',
                pageScrollBox: 'p-8',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

