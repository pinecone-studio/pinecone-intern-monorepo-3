import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../../src/components/home/Navbar';
import { useRouter, usePathname } from 'next/navigation';
import { useMyProfileQuery } from '../../../src/generated';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('../../../src/generated', () => ({
  useMyProfileQuery: jest.fn(),
}));

jest.mock('@/generated', () => ({
  useMyProfileQuery: jest.fn(() => ({
    data: { myProfile: null },
    loading: false,
    error: null,
  })),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('Navbar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    (usePathname as jest.Mock).mockReturnValue('/');
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
    const logoButton = screen.getByText('TICKET BOOKING');
    fireEvent.click(logoButton);
    expect(mockPush).toHaveBeenCalledWith('/');
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

  it('should handle profile button click when logged in', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.mocked(useMyProfileQuery).mockReturnValue({
      data: {
        myProfile: {
          email: 'test@example.com',
        },
      },
      loading: false,
      error: null,
    } as ReturnType<typeof useMyProfileQuery>);

    render(<Navbar />);

    const profileButton = screen.getByText('test@example.com');
    fireEvent.click(profileButton);

    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  it('should show default email when profile data is not available', () => {
    jest.mocked(useMyProfileQuery).mockReturnValue({
      data: {
        myProfile: null,
      },
      loading: false,
      error: null,
    } as ReturnType<typeof useMyProfileQuery>);

    render(<Navbar />);

    expect(screen.getByText('Бүртгүүлэх')).toBeInTheDocument();
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('should show fallback email when logged in but email is missing', () => {
    jest.mocked(useMyProfileQuery).mockReturnValue({
      data: {
        myProfile: {
          email: null,
        },
      },
      loading: false,
      error: null,
    } as ReturnType<typeof useMyProfileQuery>);

    render(<Navbar />);

    expect(screen.getByText('name@ticketbooking.com')).toBeInTheDocument();
  });

  it('handles non-Enter key press in search input', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText('Хайх...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'a' }); // Press 'a' key instead of Enter
    expect(mockPush).not.toHaveBeenCalledWith('/search?q=test');
  });
});
