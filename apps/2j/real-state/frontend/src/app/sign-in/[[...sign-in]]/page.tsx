import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account and find your dream property
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow-2xl rounded-2xl">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
              },
            }}
            afterSignInUrl="/"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

