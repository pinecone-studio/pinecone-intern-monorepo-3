import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../../src/components/home/Navbar';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Apollo Client mock
jest.mock('@/generated', () => ({
  useMyProfileQuery: jest.fn(() => ({
    data: { myProfile: null },
    loading: false,
    error: null
  }))
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
});
