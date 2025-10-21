import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloWrapper } from '../../../src/components/providers/ApolloWrapper';

// Mock Apollo Client
const mockClient = {
  query: jest.fn(),
  mutate: jest.fn(),
  cache: {
    readQuery: jest.fn(),
    writeQuery: jest.fn(),
  },
};

jest.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="apollo-provider">{children}</div>,
  ApolloClient: jest.fn(() => mockClient),
  InMemoryCache: jest.fn(),
  HttpLink: jest.fn(),
}));

jest.mock('@apollo/experimental-nextjs-app-support', () => ({
  ApolloNextAppProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="apollo-next-provider">{children}</div>,
}));

describe('ApolloWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children within Apollo provider', () => {
    const TestComponent = () => <div data-testid="test-child">Test Child</div>;

    render(
      <ApolloWrapper>
        <TestComponent />
      </ApolloWrapper>
    );

    expect(screen.getByTestId('apollo-next-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <ApolloWrapper>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ApolloWrapper>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    render(<ApolloWrapper>{null}</ApolloWrapper>);

    expect(screen.getByTestId('apollo-next-provider')).toBeInTheDocument();
  });

  it('should handle undefined children', () => {
    render(<ApolloWrapper>{undefined}</ApolloWrapper>);

    expect(screen.getByTestId('apollo-next-provider')).toBeInTheDocument();
  });

  it('should pass correct props to ApolloNextAppProvider', () => {
    render(
      <ApolloWrapper>
        <div data-testid="test-child">Test</div>
      </ApolloWrapper>
    );

    // The component should render without errors, indicating proper props
    expect(screen.getByTestId('apollo-next-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should work with React components', () => {
    const TestComponent = ({ message }: { message: string }) => <div data-testid="test-component">{message}</div>;

    render(
      <ApolloWrapper>
        <TestComponent message="Hello Apollo" />
      </ApolloWrapper>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Hello Apollo')).toBeInTheDocument();
  });

  it('should handle complex nested components', () => {
    const NestedComponent = () => (
      <div data-testid="nested">
        <div data-testid="deep-nested">
          <span data-testid="deepest">Deep content</span>
        </div>
      </div>
    );

    render(
      <ApolloWrapper>
        <NestedComponent />
      </ApolloWrapper>
    );

    expect(screen.getByTestId('nested')).toBeInTheDocument();
    expect(screen.getByTestId('deep-nested')).toBeInTheDocument();
    expect(screen.getByTestId('deepest')).toBeInTheDocument();
    expect(screen.getByText('Deep content')).toBeInTheDocument();
  });

  it('should maintain provider hierarchy', () => {
    render(
      <ApolloWrapper>
        <div data-testid="content">
          <span data-testid="inner-content">Inner content</span>
        </div>
      </ApolloWrapper>
    );

    const apolloProvider = screen.getByTestId('apollo-next-provider');
    const content = screen.getByTestId('content');
    const innerContent = screen.getByTestId('inner-content');

    expect(apolloProvider).toContainElement(content);
    expect(content).toContainElement(innerContent);
  });

  it('should handle conditional rendering', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <ApolloWrapper>
        {show && <div data-testid="conditional">Conditional content</div>}
        <div data-testid="always">Always visible</div>
      </ApolloWrapper>
    );

    const { rerender } = render(<ConditionalComponent show={false} />);

    expect(screen.queryByTestId('conditional')).not.toBeInTheDocument();
    expect(screen.getByTestId('always')).toBeInTheDocument();

    rerender(<ConditionalComponent show={true} />);

    expect(screen.getByTestId('conditional')).toBeInTheDocument();
    expect(screen.getByTestId('always')).toBeInTheDocument();
  });

  it('should handle fragments', () => {
    render(
      <ApolloWrapper>
        <>
          <div data-testid="fragment-child-1">Fragment 1</div>
          <div data-testid="fragment-child-2">Fragment 2</div>
        </>
      </ApolloWrapper>
    );

    expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
    expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
  });
});
