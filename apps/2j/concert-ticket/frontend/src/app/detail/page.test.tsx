import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page';

// Mock the components
jest.mock('@/components/detail/nav', () => ({
  NavBar: ({ onSearch, onCartClick, onRegisterClick, onLoginClick }: Record<string, unknown>) => (
    <nav data-testid="nav-bar">
      <button onClick={() => onSearch?.('test search')} data-testid="mock-search">
        Search
      </button>
      <button onClick={onCartClick} data-testid="mock-cart">
        Cart
      </button>
      <button onClick={onRegisterClick} data-testid="mock-register">
        Register
      </button>
      <button onClick={onLoginClick} data-testid="mock-login">
        Login
      </button>
    </nav>
  ),
}));

jest.mock('@/components/detail/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer Content</footer>,
}));

describe('Detail Page', () => {
  beforeEach(() => {
    // Mock console.log to track function calls
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should render the page with navigation and footer', () => {
    render(<Page />);

    // Check that the page renders
    expect(screen.getByText('Concert Ticket Booking')).toBeInTheDocument();
    expect(screen.getByTestId('nav-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('Should handle search functionality', () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId('mock-search'));
    expect(console.log).toHaveBeenCalledWith('Search query:', 'test search');
  });

  it('Should handle cart click', () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId('mock-cart'));
    expect(console.log).toHaveBeenCalledWith('Cart clicked');
  });

  it('Should handle register click', () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId('mock-register'));
    expect(console.log).toHaveBeenCalledWith('Register clicked');
  });

  it('Should handle login click', () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId('mock-login'));
    expect(console.log).toHaveBeenCalledWith('Login clicked');
  });

  it('Should have correct layout structure', () => {
    render(<Page />);

    const mainContainer = screen.getByText('Concert Ticket Booking').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-900', 'flex', 'flex-col');
  });
});
