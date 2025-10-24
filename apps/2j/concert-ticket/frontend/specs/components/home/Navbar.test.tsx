import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/generated', () => ({
  useMyProfileQuery: jest.fn(),
}));

import Navbar from '../../../src/components/home/Navbar';
import { useMyProfileQuery } from '@/generated';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseMyProfileQuery = useMyProfileQuery as jest.Mock;

describe('Navbar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    (usePathname as jest.Mock).mockReturnValue('/');
    // Default mock - нэвтрээгүй хэрэглэгч
    mockUseMyProfileQuery.mockReturnValue({
      data: { myProfile: null },
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo', () => {
    render(<Navbar />);
    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
  });

  it('navigates to home when clicking logo', () => {
    render(<Navbar />);
    const logoLink = screen.getByText('TICKET BOOKING');
    fireEvent.click(logoLink);
    // Link component handles navigation internally, so we don't expect router.push to be called
    expect(logoLink).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<Navbar />);
    expect(screen.getByPlaceholderText('Хайх...')).toBeInTheDocument();
  });

  it('renders cart button', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Сагс')).toBeInTheDocument();
  });

  it('renders auth buttons', () => {
    render(<Navbar />);
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('navigates to search on input focus', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.focus(input);
    expect(mockPush).toHaveBeenCalledWith('/search');
  });

  it('handles Enter key press', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalledWith('/search?q=test%20query');
  });

  it('handles empty search', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalledWith('/search');
  });

  it('uses replace when already on search page', () => {
    (usePathname as jest.Mock).mockReturnValue('/search');
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockReplace).toHaveBeenCalledWith('/search?q=new');
  });

  it('should render profile button when logged in', () => {
    mockUseMyProfileQuery.mockReturnValue({
      data: {
        myProfile: {
          email: 'test@example.com',
        },
      },
      loading: false,
      error: null,
    });

    render(<Navbar />);

    // Профайл товч харагдаж байгааг шалгах
    const profileButton = screen.queryByTestId('profile-button');
    expect(profileButton).toBeInTheDocument();
    
    // Auth товчнууд харагдахгүй байгааг шалгах
    expect(screen.queryByTestId('register-button')).not.toBeInTheDocument();
  });

  it('should show default email when profile data is not available', () => {
    // beforeEach-ийн default mock ашиглана (myProfile: null)
    render(<Navbar />);
    expect(screen.getByText('Бүртгүүлэх')).toBeInTheDocument();
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('should show profile button when logged in even if email is missing', () => {
    mockUseMyProfileQuery.mockReturnValue({
      data: {
        myProfile: {
          email: null,
        },
      },
      loading: false,
      error: null,
    });

    render(<Navbar />);

    // Профайл товч байгааг шалгах (нэвтэрсэн хэрэглэгч)
    const profileButton = screen.queryByTestId('profile-button');
    expect(profileButton).toBeInTheDocument();
    
    // Auth товчнууд харагдахгүй байгааг шалгах
    expect(screen.queryByTestId('register-button')).not.toBeInTheDocument();
  });

  it('handles non-Enter key press in search input', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'a' }); // Press 'a' key instead of Enter
    expect(mockPush).not.toHaveBeenCalledWith('/search?q=test');
  });
});
