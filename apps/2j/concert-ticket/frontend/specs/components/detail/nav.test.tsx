import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../../../src/components/detail/nav';

describe('NavBar', () => {
  const mockOnSearch = jest.fn();
  const mockOnCartClick = jest.fn();
  const mockOnRegisterClick = jest.fn();
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navbar-ийн агуулгыг зөв харуулна', () => {
    render(
      <NavBar
        onSearch={mockOnSearch}
        onCartClick={mockOnCartClick}
        onRegisterClick={mockOnRegisterClick}
        onLoginClick={mockOnLoginClick}
      />
    );

    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    expect(screen.getByText('Бүртгүүлэх')).toBeInTheDocument();
    expect(screen.getByText('Нэвтрэх')).toBeInTheDocument();
  });

  it('хайлтын form ажиллана', () => {
    render(
      <NavBar
        onSearch={mockOnSearch}
        onCartClick={mockOnCartClick}
        onRegisterClick={mockOnRegisterClick}
        onLoginClick={mockOnLoginClick}
      />
    );

    const searchInput = screen.getByTestId('search-input');
    const searchForm = screen.getByTestId('search-form');

    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.submit(searchForm);

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('товчнууд ажиллана', () => {
    render(
      <NavBar
        onSearch={mockOnSearch}
        onCartClick={mockOnCartClick}
        onRegisterClick={mockOnRegisterClick}
        onLoginClick={mockOnLoginClick}
      />
    );

    fireEvent.click(screen.getByTestId('cart-button'));
    expect(mockOnCartClick).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('register-button'));
    expect(mockOnRegisterClick).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('login-button'));
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  it('testid-ууд зөв байна', () => {
    render(
      <NavBar
        onSearch={mockOnSearch}
        onCartClick={mockOnCartClick}
        onRegisterClick={mockOnRegisterClick}
        onLoginClick={mockOnLoginClick}
      />
    );

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('logo-dot')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });
});
