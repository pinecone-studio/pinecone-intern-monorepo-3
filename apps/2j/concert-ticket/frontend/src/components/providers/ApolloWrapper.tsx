'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren } from 'react';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.NEXT_PUBLIC_BACKEND_URI ?? 'http://localhost:4000/graphql';

// Add logging for GraphQL endpoint
if (process.env.NODE_ENV === 'development') {
  console.log('GraphQL endpoint:', uri);
}

const makeClient = () => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store', mode: 'cors' },
    headers: {
      'Content-Type': 'application/json',
      'x-apollo-operation-name': 'init', // ✅ Prevents CSRF error
    },
    // Add error handling
    fetch: (uri, options) => {
      return fetch(uri, options).catch((error) => {
        console.error('GraphQL fetch error:', error);
        throw error;
      });
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    let token: string | null = null;

    // Securely get token from localStorage (browser only)
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
    devtools: {
      enabled: process.env.NODE_ENV === 'development',
    },
    // Add default options for better performance
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
