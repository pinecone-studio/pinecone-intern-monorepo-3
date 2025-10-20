'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren } from 'react';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.NEXT_PUBLIC_BACKEND_URI ?? 'http://localhost:4000/graphql';

const makeClient = () => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store', mode: 'cors' },
    headers: {
      'apollo-require-preflight': 'true',
      'content-type': 'application/json',
    },
  });

  const authLink = setContext((_, { headers }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: {
        ...headers,
        authorization: token ?? '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    devtools: {
      enabled: process.env.NODE_ENV === 'development',
    },
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
