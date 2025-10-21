'use client';

import { PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export const ClerkWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/'}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/sign-up/success'}
    >
      {children}
    </ClerkProvider>
  );
};
