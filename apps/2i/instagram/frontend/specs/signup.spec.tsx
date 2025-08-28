import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupPage from '../src/app/signup/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form with all elements', () => {
    render(<SignupPage />);

    // Check if main elements are rendered
    expect(screen.getByText('Instagram')).toBeTruthy();
    expect(screen.getByText('Sign up to see photos and videos from your friends.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Mobile Number or Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Full Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeTruthy();
  });

  it('should update form values when typing', () => {
    render(<SignupPage />);

    const emailInput = screen.getByPlaceholderText('Mobile Number or Email');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(fullNameInput.value).toBe('Test User');
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('should render login link', () => {
    render(<SignupPage />);

    const loginLink = screen.getByText('Log in');
    expect(loginLink).toBeTruthy();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  it('should render terms and privacy policy links', () => {
    render(<SignupPage />);

    expect(screen.getByText('Learn more')).toBeTruthy();
    expect(screen.getByText('Terms')).toBeTruthy();
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });

  it('should have proper form structure', () => {
    render(<SignupPage />);

    const emailInput = screen.getByPlaceholderText('Mobile Number or Email');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput.getAttribute('type')).toBe('email');
    expect(fullNameInput.getAttribute('type')).toBe('text');
    expect(usernameInput.getAttribute('type')).toBe('text');
    expect(passwordInput.getAttribute('type')).toBe('password');
    expect(emailInput.hasAttribute('required')).toBe(true);
    expect(fullNameInput.hasAttribute('required')).toBe(true);
    expect(usernameInput.hasAttribute('required')).toBe(true);
    expect(passwordInput.hasAttribute('required')).toBe(true);
  });

  it('should have proper styling classes', () => {
    render(<SignupPage />);

    const signupButton = screen.getByRole('button', { name: 'Sign up' });
    expect(signupButton.className).toContain('bg-blue-500');
    expect(signupButton.className).toContain('text-white');
    expect(signupButton.className).toContain('rounded-md');
  });
});
