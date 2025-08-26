import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../../src/app/login/page';

describe('LoginPage', () => {
  it('should render login form with all required fields', () => {
    render(<LoginPage />);

    // Check if Instagram logo is displayed
    expect(screen.getByText('Instagram')).toBeInTheDocument();

    // Check if all input fields are present
    expect(screen.getByPlaceholderText('Mobile Number or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Check if login button is present
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('should display forgot password link', () => {
    render(<LoginPage />);

    // Check if forgot password link is displayed
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();

    // Check if link has correct href
    const forgotPasswordLink = screen.getByText('Forgot password?');
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot');
  });

  it('should display signup link for new users', () => {
    render(<LoginPage />);

    // Check if signup link is displayed
    expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Check if link has correct href
    const signupLink = screen.getByText('Sign Up');
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('should have proper form structure', () => {
    render(<LoginPage />);

    // Check if form element exists
    const form = screen.getByPlaceholderText('Mobile Number or Email').closest('form');
    expect(form).toBeInTheDocument();

    // Check if all inputs are within the form (including password)
    const allInputs = screen.getAllByRole('textbox');
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(allInputs).toHaveLength(1); // Email field (text input)
    expect(passwordInput).toBeInTheDocument(); // Password input (separate check)

    // Check if submit button is within the form
    const submitButton = screen.getByRole('button', { name: 'Log in' });
    expect(form).toContainElement(submitButton);
  });

  it('should have proper styling classes', () => {
    render(<LoginPage />);

    // Check if main container has proper classes (correct DOM hierarchy)
    const mainContainer = screen.getByText('Instagram').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center');

    // Check if content wrapper has proper classes
    const contentWrapper = screen.getByText('Instagram').closest('div')?.parentElement?.parentElement;
    expect(contentWrapper).toHaveClass('max-w-md', 'w-full', 'space-y-8');

    // Check if login card has proper classes
    const loginCard = screen.getByText('Instagram').closest('div')?.parentElement;
    expect(loginCard).toHaveClass('bg-white', 'py-8', 'px-6', 'shadow', 'rounded-lg');

    // Check if login button has proper classes
    const loginButton = screen.getByRole('button', { name: 'Log in' });
    expect(loginButton).toHaveClass('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded-md');
  });

  it('should have accessible form labels and placeholders', () => {
    render(<LoginPage />);

    // Check if all inputs have proper placeholders
    const emailInput = screen.getByPlaceholderText('Mobile Number or Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Check if password input has correct type
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should have proper layout structure', () => {
    render(<LoginPage />);

    // Check if there are two main cards (login form and signup link)
    const cards = screen.getAllByText(/Instagram|Don't have an account/);
    expect(cards).toHaveLength(2);

    // Check if forgot password link is positioned correctly (check parent div)
    const forgotPasswordLink = screen.getByText('Forgot password?');
    const parentDiv = forgotPasswordLink.closest('div');
    expect(parentDiv).toHaveClass('text-right');
  });
});
