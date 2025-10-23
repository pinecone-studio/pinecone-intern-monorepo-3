import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileMenu from '../../../src/components/profile/ProfileMenu';

const mockPush = jest.fn();
const mockPathname = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}));

describe('ProfileMenu', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPathname.mockReturnValue('/profile');
  });

  it('renders all menu items', () => {
    render(<ProfileMenu />);
    expect(screen.getByText('Хэрэглэгчийн мэдээлэл')).toBeInTheDocument();
    expect(screen.getByText('Захиалгын түүх')).toBeInTheDocument();
    expect(screen.getByText('Нууц үг солих')).toBeInTheDocument();
  });

  it('highlights active menu item', () => {
    mockPathname.mockReturnValue('/profile');
    render(<ProfileMenu />);
    const profileButton = screen.getByText('Хэрэглэгчийн мэдээлэл');
    expect(profileButton).toHaveClass('bg-[#2a2a2a]');
  });

  it('highlights orders when on orders page', () => {
    mockPathname.mockReturnValue('/orders');
    render(<ProfileMenu />);
    const ordersButton = screen.getByText('Захиалгын түүх');
    expect(ordersButton).toHaveClass('bg-[#2a2a2a]');
  });

  it('highlights change password when on change-password page', () => {
    mockPathname.mockReturnValue('/change-password');
    render(<ProfileMenu />);
    const changePasswordButton = screen.getByText('Нууц үг солих');
    expect(changePasswordButton).toHaveClass('bg-[#2a2a2a]');
  });

  it('navigates to profile when clicking profile button', () => {
    mockPathname.mockReturnValue('/orders');
    render(<ProfileMenu />);
    const profileButton = screen.getByText('Хэрэглэгчийн мэдээлэл');
    fireEvent.click(profileButton);
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  it('navigates to orders when clicking orders button', () => {
    mockPathname.mockReturnValue('/profile');
    render(<ProfileMenu />);
    const ordersButton = screen.getByText('Захиалгын түүх');
    fireEvent.click(ordersButton);
    expect(mockPush).toHaveBeenCalledWith('/orders');
  });

  it('navigates to change-password when clicking change password button', () => {
    mockPathname.mockReturnValue('/profile');
    render(<ProfileMenu />);
    const changePasswordButton = screen.getByText('Нууц үг солих');
    fireEvent.click(changePasswordButton);
    expect(mockPush).toHaveBeenCalledWith('/change-password');
  });

  it('applies inactive styles to non-active menu items', () => {
    mockPathname.mockReturnValue('/profile');
    render(<ProfileMenu />);
    const ordersButton = screen.getByText('Захиалгын түүх');
    expect(ordersButton).toHaveClass('bg-[#1a1a1a]');
  });

  it('renders all buttons with correct structure', () => {
    render(<ProfileMenu />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => {
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('rounded-[8px]');
      expect(button).toHaveClass('text-[14px]');
    });
  });
});
