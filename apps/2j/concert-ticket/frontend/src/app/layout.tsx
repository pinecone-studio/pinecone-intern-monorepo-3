import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';
import { ClerkWrapper } from '@/components/providers/ClerkWrapper';

export const metadata = {
  title: 'Concert Ticket',
  description: 'Concert Ticket',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <ClerkWrapper>
          <ApolloWrapper>{children}</ApolloWrapper>
        </ClerkWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
