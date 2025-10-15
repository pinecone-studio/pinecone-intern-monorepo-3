import React from 'react';
import { render } from '@testing-library/react';
import { ApolloWrapper } from '../../../src/components/providers/ApolloWrapper';

// Mock Apollo Client
jest.mock('@apollo/experimental-nextjs-app-support', () => ({
  ApolloNextAppProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="apollo-provider">{children}</div>,
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  HttpLink: jest.fn(),
  setContext: jest.fn(() => jest.fn()),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('ApolloWrapper', () => {
  it('should render children with Apollo provider', () => {
    const { getByTestId, getByText } = render(
      <ApolloWrapper>
        <div>Test Child</div>
      </ApolloWrapper>
    );

    expect(getByTestId('apollo-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
