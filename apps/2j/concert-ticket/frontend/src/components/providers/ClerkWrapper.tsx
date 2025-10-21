'use client';

import { PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export const ClerkWrapper = ({ children }: PropsWithChildren) => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no publishable key is available (e.g., during build), render children without Clerk
  if (!publishableKey) {
    console.warn('Clerk publishable key not found. Rendering without authentication.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/'}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/sign-up/success'}
    >
      {children}
    </ClerkProvider>
  );
};
