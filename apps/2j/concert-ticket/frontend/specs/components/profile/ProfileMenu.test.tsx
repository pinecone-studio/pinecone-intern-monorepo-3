import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileMenu from '@/components/profile/ProfileMenu';

const mockPush = jest.fn();
const mockPathname = '/profile';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

describe('ProfileMenu', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders all menu items', () => {
    render(<ProfileMenu />);
    expect(screen.getByText('Хэрэглэгчийн мэдээлэл')).toBeInTheDocument();
    expect(screen.getByText('Захиалгын түүх')).toBeInTheDocument();
    expect(screen.getByText('Нууц үг сэргээх')).toBeInTheDocument();
  });

  it('calls router.push with the correct path when a menu item is clicked', () => {
    render(<ProfileMenu />);
    fireEvent.click(screen.getByText('Захиалгын түүх'));
    expect(mockPush).toHaveBeenCalledWith('/orders');
  });

  it('applies active styles to the current path', () => {
    render(<ProfileMenu />);
    const profileButton = screen.getByText('Хэрэглэгчийн мэдээлэл');
    expect(profileButton).toHaveClass('bg-[#fafafa]/[0.1] text-white');
  });

  it('does not apply active styles to inactive paths', () => {
    render(<ProfileMenu />);
    const ordersButton = screen.getByText('Захиалгын түүх');
    expect(ordersButton).not.toHaveClass('bg-[#fafafa]/[0.1] text-white');
    expect(ordersButton).toHaveClass('text-gray-300 hover:bg-gray-800 hover:text-white');
  });
});
