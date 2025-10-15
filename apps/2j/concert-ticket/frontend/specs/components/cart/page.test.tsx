import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Page from '../../../src/app/cart/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('CartPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the cart page', () => {
    render(<Page />);

    expect(screen.getByText('Тасалбар захиалах')).toBeInTheDocument();
  });

  it('should render cart content', () => {
    render(<Page />);

    expect(screen.getByText('Тасалбар захиалах')).toBeInTheDocument();
    expect(screen.getByAltText('Stage Plan')).toBeInTheDocument();
  });

  it('should render ticket categories', () => {
    render(<Page />);

    expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<Page />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-900');
  });
});
