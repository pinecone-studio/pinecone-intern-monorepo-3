import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedModal from '../../../src/components/admin/FeaturedModal';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

describe('FeaturedModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('модал нээгдэхгүй байх үед null буцаана', () => {
    render(
      <FeaturedModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Онцлох тоглолт болгох')).not.toBeInTheDocument();
  });

  it('модал нээгдэх үед зөв агуулгыг харуулна', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Онцлох тоглолт болгох')).toBeInTheDocument();
    expect(screen.getByText('Тийм')).toBeInTheDocument();
    expect(screen.getByText('Үгүй')).toBeInTheDocument();
    expect(screen.getByText('Цуцлах')).toBeInTheDocument();
    expect(screen.getByText('Хадгалах')).toBeInTheDocument();
  });

  it('X товчийг дарахад onClose дуудагдана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByTestId('x-icon').parentElement;
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('Цуцлах товчийг дарахад onClose дуудагдана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('Тийм сонголтыг сонгоод Хадгалах дарахад onSave(true) дуудагдана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const yesRadio = screen.getByDisplayValue('yes');
    fireEvent.click(yesRadio);

    const saveButton = screen.getByText('Хадгалах');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(true);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('Үгүй сонголтыг сонгоод Хадгалах дарахад onSave(false) дуудагдана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const noRadio = screen.getByDisplayValue('no');
    fireEvent.click(noRadio);

    const saveButton = screen.getByText('Хадгалах');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(false);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('Үгүй сонголт анхнаасаа сонгогдсон байна', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const noRadio = screen.getByDisplayValue('no') as HTMLInputElement;
    expect(noRadio.checked).toBe(true);
  });
});
