import { PropsWithChildren } from 'react';
import { ApolloWrapper } from '@/components/providers';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
