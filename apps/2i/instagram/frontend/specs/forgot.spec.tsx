import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPage from '../src/app/forgot/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('ForgotPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render forgot password form with all elements', () => {
    render(<ForgotPage />);

    // Check if main elements are rendered
    expect(screen.getByText('Trouble logging in?')).toBeTruthy();
    expect(screen.getByText("Enter your email and we'll send you a link to get back into your account.")).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send login link' })).toBeTruthy();
  });

  it('should render padlock icon', () => {
    render(<ForgotPage />);

    // Check if padlock icon is rendered (SVG)
    const padlockIcon = document.querySelector('svg');
    expect(padlockIcon).toBeTruthy();
  });

  it('should update email input when typing', () => {
    render(<ForgotPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should render OR separator', () => {
    render(<ForgotPage />);

    expect(screen.getByText('OR')).toBeTruthy();
  });

  it('should render create new account link', () => {
    render(<ForgotPage />);

    const createAccountLink = screen.getByText('Create new account');
    expect(createAccountLink).toBeTruthy();
    expect(createAccountLink.getAttribute('href')).toBe('/signup');
  });

  it('should render back to login link', () => {
    render(<ForgotPage />);

    const backToLoginLink = screen.getByText('Back to login');
    expect(backToLoginLink).toBeTruthy();
    expect(backToLoginLink.getAttribute('href')).toBe('/login');
  });

  it('should have proper form structure', () => {
    render(<ForgotPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput.getAttribute('type')).toBe('email');
    expect(emailInput.hasAttribute('required')).toBe(true);
  });

  it('should have proper styling classes', () => {
    render(<ForgotPage />);

    const sendButton = screen.getByRole('button', { name: 'Send login link' });
    expect(sendButton.className).toContain('bg-blue-500');
    expect(sendButton.className).toContain('text-white');
    expect(sendButton.className).toContain('rounded-md');
  });

  it('should have proper create account button styling', () => {
    render(<ForgotPage />);

    const createAccountLink = screen.getByText('Create new account');
    expect(createAccountLink.className).toContain('bg-white');
    expect(createAccountLink.className).toContain('border');
    expect(createAccountLink.className).toContain('text-black');
  });

  it('should have proper back to login button styling', () => {
    render(<ForgotPage />);

    const backToLoginLink = screen.getByText('Back to login');
    expect(backToLoginLink.className).toContain('bg-white');
    expect(backToLoginLink.className).toContain('border');
    expect(backToLoginLink.className).toContain('text-black');
  });
});
