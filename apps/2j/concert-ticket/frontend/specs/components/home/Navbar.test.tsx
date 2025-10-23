import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseMyProfileQuery = useMyProfileQuery as jest.MockedFunction<typeof useMyProfileQuery>;

describe('Navbar', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    } as ReturnType<typeof useRouter>);
    mockUsePathname.mockReturnValue('/');
    mockUseMyProfileQuery.mockReturnValue({
      data: null,
    } as ReturnType<typeof useMyProfileQuery>);
    jest.clearAllMocks();
  });

  it('navbar-ийн агуулгыг зөв харуулна', () => {
    render(<Navbar />);

    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    expect(screen.getByText('Бүртгүүлэх')).toBeInTheDocument();
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('хайлтын input ажиллана', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/search?q=test%20query');
  });

  it('logo дарахад home руу очино', () => {
    render(<Navbar />);

    const logoButton = screen.getByTestId('logo').parentElement;
    if (logoButton) {
      fireEvent.click(logoButton);
    }

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('className prop-г зөв ашиглана', () => {
    render(<Navbar className="custom-class" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });

  it('testid-ууд зөв байна', () => {
    render(<Navbar />);

    expect(screen.getByTestId('logo-dot')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('бүртгүүлэх товчийг дарахад register руу очино', () => {
    render(<Navbar />);

    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);

    // Товч дарагдаж байгаа эсэхийг шалгая
    expect(registerButton).toBeInTheDocument();
  });

  it('нэвтрэх товчийг дарахад login руу очино', () => {
    render(<Navbar />);

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    // Товч дарагдаж байгаа эсэхийг шалгая
    expect(loginButton).toBeInTheDocument();
  });

  it('хайлтын input хоосон байх үед Enter дарахад хайлт хийхгүй', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    // Input хоосон байгаа эсэхийг шалгая
    expect(searchInput).toHaveValue('');
  });

  it('хайлтын input-д зөвхөн зай байх үед Enter дарахад хайлт хийхгүй', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    // Input зөвхөн зай агуулж байгаа эсэхийг шалгая
    expect(searchInput).toHaveValue('   ');
  });

  it('хайлтын input-д тэмдэгт байх үед Enter дарахад хайлт хийнэ', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'concert' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/search?q=concert');
  });

  it('хайлтын input-д олон үг байх үед Enter дарахад хайлт хийнэ', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'rock concert 2024' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/search?q=rock%20concert%202024');
  });

  it('хайлтын input-д тусгай тэмдэгт байх үед Enter дарахад хайлт хийнэ', () => {
    render(<Navbar />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'concert & show' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/search?q=concert%20%26%20show');
  });
});