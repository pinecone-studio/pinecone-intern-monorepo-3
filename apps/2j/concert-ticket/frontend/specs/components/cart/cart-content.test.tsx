import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { CartContent } from '../../../src/components/cart/cart-content';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('CartContent', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render cart content with all sections', () => {
    render(<CartContent />);

    expect(screen.getByText('Тасалбар захиалах')).toBeInTheDocument();
    expect(screen.getByText('Тоглолт үзэх өдрөө сонгоно уу.')).toBeInTheDocument();
  });

  it('should render ticket categories with correct names and prices', () => {
    render(<CartContent />);

    expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument();

    expect(screen.getByText('89,000₮')).toBeInTheDocument();
    expect(screen.getByText('129,000₮')).toBeInTheDocument();
    expect(screen.getByText('159,000₮')).toBeInTheDocument();
  });

  it('should allow increasing ticket quantities', () => {
    render(<CartContent />);

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const firstPlusButton = plusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-plus'));

    expect(firstPlusButton).toBeInTheDocument();

    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);
      expect(screen.getByText('1')).toBeInTheDocument();
    }
  });

  it('should show order summary when tickets are selected', () => {
    render(<CartContent />);

    expect(screen.queryByText('Захиалгын дэлгэрэнгүй')).not.toBeInTheDocument();

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const firstPlusButton = plusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-plus'));

    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);
      expect(screen.getByText('Захиалгын дэлгэрэнгүй')).toBeInTheDocument();
    }
  });

  it('should handle back button click', () => {
    render(<CartContent />);

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should disable buy button when no tickets selected', () => {
    render(<CartContent />);

    const buyButton = screen.getByText('Тасалбар авах');
    expect(buyButton).toBeDisabled();
  });

  it('should enable buy button when tickets are selected', () => {
    render(<CartContent />);

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const firstPlusButton = plusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-plus'));

    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);

      const buyButton = screen.getByText('Тасалбар авах');
      expect(buyButton).not.toBeDisabled();
    }
  });

  it('should display stage plan image', () => {
    render(<CartContent />);

    const stagePlanImage = screen.getByAltText('Stage Plan');
    expect(stagePlanImage).toBeInTheDocument();
    expect(stagePlanImage).toHaveAttribute('src', '/images/cart-stage.png');
  });

  it('should handle payment button click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<CartContent />);

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const firstPlusButton = plusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-plus'));
    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);
    }

    const buyButton = screen.getByText('Тасалбар авах');
    fireEvent.click(buyButton);

    expect(consoleSpy).toHaveBeenCalledWith('Proceeding to payment...');
    consoleSpy.mockRestore();
  });

  it('should handle minus button click', () => {
    render(<CartContent />);

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const firstPlusButton = plusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-plus'));
    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);
    }

    const minusButtons = screen.getAllByRole('button', { name: '' });
    const firstMinusButton = minusButtons.find((button) => button.querySelector('svg') && button.querySelector('svg')?.classList.contains('lucide-minus'));
    if (firstMinusButton) {
      fireEvent.click(firstMinusButton);
    }

    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});
