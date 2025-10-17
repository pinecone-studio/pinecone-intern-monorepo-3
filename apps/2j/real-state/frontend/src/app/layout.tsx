import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ApolloWrapper } from '../components/providers/ApolloWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'RealEstate MN - Find Your Dream Home in Mongolia',
  description: 'Discover the best properties in Ulaanbaatar and other cities. Professional advice and reliable service.',
  keywords: 'real estate, mongolia, ulaanbaatar, apartment, house, property',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">
          <ApolloWrapper>{children}</ApolloWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;