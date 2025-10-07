import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavBar } from './nav';

describe('NavBar Component', () => {
  const mockProps = {
    onSearch: jest.fn(),
    onCartClick: jest.fn(),
    onRegisterClick: jest.fn(),
    onLoginClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render all navigation elements', () => {
    render(<NavBar {...mockProps} />);

    // Check logo
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('logo-dot')).toBeInTheDocument();
    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();

    // Check search elements
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Хайлт')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByTestId('cart-button')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByText('Бүртгүүлэх')).toBeInTheDocument();
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('Should handle search form submission', () => {
    render(<NavBar {...mockProps} />);

    const searchInput = screen.getByTestId('search-input');
    const searchForm = screen.getByTestId('search-form');

    fireEvent.change(searchInput, { target: { value: 'concert' } });
    fireEvent.submit(searchForm);

    expect(mockProps.onSearch).toHaveBeenCalledWith('concert');
  });

  it('Should handle button clicks', () => {
    render(<NavBar {...mockProps} />);

    // Test cart button
    fireEvent.click(screen.getByTestId('cart-button'));
    expect(mockProps.onCartClick).toHaveBeenCalledTimes(1);

    // Test register button
    fireEvent.click(screen.getByTestId('register-button'));
    expect(mockProps.onRegisterClick).toHaveBeenCalledTimes(1);

    // Test login button
    fireEvent.click(screen.getByTestId('login-button'));
    expect(mockProps.onLoginClick).toHaveBeenCalledTimes(1);
  });

  it('Should work without optional props', () => {
    render(<NavBar />);

    // Should render without errors
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('Should have correct CSS classes', () => {
    render(<NavBar {...mockProps} />);

    // Check navigation classes
    expect(screen.getByRole('navigation')).toHaveClass('px-6', 'py-4', 'text-white', 'bg-black');

    // Check logo dot classes
    expect(screen.getByTestId('logo-dot')).toHaveClass('w-3', 'h-3', 'rounded-full', 'bg-cyan-400');

    // Check search input classes
    expect(screen.getByTestId('search-input')).toHaveClass('w-full', 'bg-[#1a1a1a]', 'text-white');

    // Check login button classes
    expect(screen.getByTestId('login-button')).toHaveClass('bg-cyan-400', 'hover:bg-cyan-500');
  });
});
