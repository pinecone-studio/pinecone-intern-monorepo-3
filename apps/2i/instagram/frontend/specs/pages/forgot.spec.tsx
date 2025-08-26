import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPage from '../../src/app/forgot/page';

describe('ForgotPage', () => {
  it('should render forgot password form with all required elements', () => {
    render(<ForgotPage />);

    // Check if lock icon is displayed
    expect(screen.getByText('Trouble logging in?')).toBeInTheDocument();

    // Check if subtitle is displayed
    expect(screen.getByText(/Enter your email and we'll send you a link to get back into your account/)).toBeInTheDocument();

    // Check if email input field is present
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Check if send login link button is present
    expect(screen.getByRole('button', { name: 'Send login link' })).toBeInTheDocument();
  });

  it('should display OR divider correctly', () => {
    render(<ForgotPage />);

    // Check if OR divider is displayed
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('should display create new account button', () => {
    render(<ForgotPage />);

    // Check if create new account button is displayed
    expect(screen.getByText('Create new account')).toBeInTheDocument();

    // Check if link has correct href
    const createAccountLink = screen.getByText('Create new account');
    expect(createAccountLink).toHaveAttribute('href', '/signup');
  });

  it('should display back to login button', () => {
    render(<ForgotPage />);

    // Check if back to login button is displayed
    expect(screen.getByText('Back to login')).toBeInTheDocument();

    // Check if link has correct href
    const backToLoginLink = screen.getByText('Back to login');
    expect(backToLoginLink).toHaveAttribute('href', '/login');
  });

  it('should have proper form structure', () => {
    render(<ForgotPage />);

    // Check if form element exists
    const form = screen.getByPlaceholderText('Email').closest('form');
    expect(form).toBeInTheDocument();

    // Check if email input is within the form
    const emailInput = screen.getByPlaceholderText('Email');
    expect(form).toContainElement(emailInput);

    // Check if submit button is within the form
    const submitButton = screen.getByRole('button', { name: 'Send login link' });
    expect(form).toContainElement(submitButton);
  });

  it('should have proper styling classes', () => {
    render(<ForgotPage />);

    // Check if main container has proper classes (correct DOM hierarchy)
    const mainContainer = screen.getByText('Trouble logging in?').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center');

    // Check if content wrapper has proper classes
    const contentWrapper = screen.getByText('Trouble logging in?').closest('div')?.parentElement?.parentElement;
    expect(contentWrapper).toHaveClass('max-w-md', 'w-full', 'space-y-8');

    // Check if forgot password card has proper classes
    const forgotCard = screen.getByText('Trouble logging in?').closest('div')?.parentElement;
    expect(forgotCard).toHaveClass('bg-white', 'py-8', 'px-6', 'shadow', 'rounded-lg');

    // Check if send login link button has proper classes
    const sendButton = screen.getByRole('button', { name: 'Send login link' });
    expect(sendButton).toHaveClass('bg-blue-500', 'text-white', 'py-2', 'px-4', 'rounded-md');
  });

  it('should have accessible form labels and placeholders', () => {
    render(<ForgotPage />);

    // Check if email input has proper placeholder
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();

    // Check if email input has correct type
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should have proper button hierarchy and styling', () => {
    render(<ForgotPage />);

    // Check if primary button (Send login link) has blue styling
    const primaryButton = screen.getByRole('button', { name: 'Send login link' });
    expect(primaryButton).toHaveClass('bg-blue-500', 'text-white');

    // Check if secondary buttons have white styling
    const createAccountButton = screen.getByText('Create new account');
    const backToLoginButton = screen.getByText('Back to login');

    expect(createAccountButton).toHaveClass('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    expect(backToLoginButton).toHaveClass('bg-white', 'text-gray-700');
  });

  it('should display lock icon with proper styling', () => {
    render(<ForgotPage />);

    // Check if lock icon container has proper classes
    const lockIconContainer = screen.getByText('Trouble logging in?').previousElementSibling;
    expect(lockIconContainer).toHaveClass('mx-auto', 'w-16', 'h-16', 'bg-gray-200', 'rounded-full');
  });
});
