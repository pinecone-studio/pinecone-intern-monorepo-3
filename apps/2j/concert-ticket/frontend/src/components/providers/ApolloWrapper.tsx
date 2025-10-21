'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren } from 'react';
import { setContext } from '@apollo/client/link/context';

// NEXT_PUBLIC_* хувьсагч нь client талд ил харагдана
const uri = process.env.NEXT_PUBLIC_BACKEND_URI ?? 'http://localhost:4200/api/graphql';

const makeClient = () => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store', mode: 'cors' },
    // CSRF preflight шаардлагыг биелүүлэхийн тулд header илгээнэ
    headers: {
      'apollo-require-preflight': 'true',
      'content-type': 'application/json',
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get token from localStorage for backward compatibility
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
