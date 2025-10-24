'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren } from 'react';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.NEXT_PUBLIC_BACKEND_URI ?? 'http://localhost:4000/api/graphql';

// Add logging for GraphQL endpoint
if (typeof window !== 'undefined') {
  console.log('🔵 GraphQL endpoint:', uri);
  console.log('🔵 NEXT_PUBLIC_BACKEND_URI:', process.env.NEXT_PUBLIC_BACKEND_URI);
  console.log('🔵 NEXT_PUBLIC_GRAPHQL_ENDPOINT:', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
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
      console.log('🟢 Fetching:', uri, 'with options:', options);
      return fetch(uri, options)
        .then(response => {
          console.log('🟢 Response status:', response.status);
          console.log('🟢 Response headers:', response.headers);
          return response;
        })
        .catch((error) => {
          console.error('🔴 GraphQL fetch error:', error);
          console.error('🔴 Error details:', error.message);
          throw error;
        });
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    let token: string | null = null;

    // Securely get token from localStorage (browser only)
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
      console.log('🟡 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
    }

    const authHeaders = {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    };
    console.log('🟡 Auth headers:', authHeaders);

    return {
      headers: authHeaders,
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
