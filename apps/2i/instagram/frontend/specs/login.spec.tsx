import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../src/app/login/page';

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

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form with all elements', () => {
    render(<LoginPage />);

    // Check if main elements are rendered
    expect(screen.getByText('Instagram')).toBeTruthy();
    expect(screen.getByPlaceholderText('Phone number, username, or email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeTruthy();
  });

  it('should update form values when typing', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Phone number, username, or email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should render forgot password link', () => {
    render(<LoginPage />);

    const forgotLink = screen.getByText('Forgot password?');
    expect(forgotLink).toBeTruthy();
    expect(forgotLink.getAttribute('href')).toBe('/forgot');
  });

  it('should render sign up link', () => {
    render(<LoginPage />);

    const signupLink = screen.getByText('Sign up');
    expect(signupLink).toBeTruthy();
    expect(signupLink.getAttribute('href')).toBe('/signup');
  });

  it('should render terms and privacy policy links', () => {
    render(<LoginPage />);

    expect(screen.getByText('Learn more')).toBeTruthy();
    expect(screen.getByText('Terms')).toBeTruthy();
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });

  it('should have proper form structure', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Phone number, username, or email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput.getAttribute('type')).toBe('email');
    expect(passwordInput.getAttribute('type')).toBe('password');
    expect(emailInput.hasAttribute('required')).toBe(true);
    expect(passwordInput.hasAttribute('required')).toBe(true);
  });

  it('should have proper styling classes', () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole('button', { name: 'Log in' });
    expect(loginButton.className).toContain('bg-blue-500');
    expect(loginButton.className).toContain('text-white');
    expect(loginButton.className).toContain('rounded-md');
  });
});
