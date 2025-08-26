import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '../../src/app/signup/page';

describe('SignupPage', () => {
  it('should render signup form with all required fields', () => {
    render(<SignupPage />);

    // Check if Instagram logo is displayed
    expect(screen.getByText('Instagram')).toBeInTheDocument();

    // Check if subtitle is displayed
    expect(screen.getByText('Sign up to see photos and videos from your friends')).toBeInTheDocument();

    // Check if all input fields are present
    expect(screen.getByPlaceholderText('Mobile Number or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();

    // Check if signup button is present
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('should display terms and privacy links', () => {
    render(<SignupPage />);

    // Check if terms and privacy text is displayed
    expect(screen.getByText(/People who use our service may have uploaded your contact information to Instagram/)).toBeInTheDocument();
    expect(screen.getByText(/By signing up, you agree to our/)).toBeInTheDocument();

    // Check if links are present
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Cookies Policy')).toBeInTheDocument();
  });

  it('should display login link for existing users', () => {
    render(<SignupPage />);

    // Check if login link is displayed
    expect(screen.getByText(/Have an account\?/)).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('should have proper form structure', () => {
    render(<SignupPage />);

    // Check if form element exists
    const form = screen.getByPlaceholderText('Mobile Number or Email').closest('form');
    expect(form).toBeInTheDocument();

    // Check if all inputs are within the form (including password)
    const allInputs = screen.getAllByRole('textbox');
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(allInputs).toHaveLength(3); // Mobile/Email, Full Name, Username (text inputs)
    expect(passwordInput).toBeInTheDocument(); // Password input (separate check)

    // Check if submit button is within the form
    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    expect(form).toContainElement(submitButton);
  });

  it('should have proper styling classes', () => {
    render(<SignupPage />);

    // Check if main container has proper classes (correct DOM hierarchy)
    const mainContainer = screen.getByText('Instagram').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center');

    // Check if content wrapper has proper classes
    const contentWrapper = screen.getByText('Instagram').closest('div')?.parentElement?.parentElement;
    expect(contentWrapper).toHaveClass('max-w-md', 'w-full', 'space-y-8');

    // Check if signup card has proper classes
    const signupCard = screen.getByText('Instagram').closest('div')?.parentElement;
    expect(signupCard).toHaveClass('bg-white', 'py-8', 'px-6', 'shadow', 'rounded-lg');

    // Check if signup button has proper classes
    const signupButton = screen.getByRole('button', { name: 'Sign up' });
    expect(signupButton).toHaveClass('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded-md');
  });

  it('should have accessible form labels and placeholders', () => {
    render(<SignupPage />);

    // Check if all inputs have proper placeholders
    const emailInput = screen.getByPlaceholderText('Mobile Number or Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(fullNameInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();

    // Check if password input has correct type
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
