import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileMenu from '../../../src/components/profile/ProfileMenu';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('ProfileMenu', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
    mockUsePathname.mockReturnValue('/profile');
    jest.clearAllMocks();
  });

  it('менюг зөв харуулна', () => {
    render(<ProfileMenu />);

    expect(screen.getByText('Хэрэглэгчийн мэдээлэл')).toBeInTheDocument();
    expect(screen.getByText('Захиалгын түүх')).toBeInTheDocument();
    expect(screen.getByText('Нууц үг солих')).toBeInTheDocument();
  });

  it('идэвхтэй цэсийг зөв харуулна', () => {
    mockUsePathname.mockReturnValue('/orders');
    render(<ProfileMenu />);

    const ordersButton = screen.getByText('Захиалгын түүх');
    expect(ordersButton).toHaveClass('bg-[#2a2a2a]');
  });

  it('цэс дарахад router.push дуудагдана', () => {
    render(<ProfileMenu />);

    const changePasswordButton = screen.getByText('Нууц үг солих');
    fireEvent.click(changePasswordButton);

    expect(mockPush).toHaveBeenCalledWith('/change-password');
  });
});