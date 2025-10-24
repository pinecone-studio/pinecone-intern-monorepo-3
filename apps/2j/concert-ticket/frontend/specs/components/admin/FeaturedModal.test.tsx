import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturedModal from '../../../src/components/admin/FeaturedModal';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe('FeaturedModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('модал нээгдэх үед зөв харагдана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Онцлох тохиргоо')).toBeInTheDocument();
    expect(screen.getByText('Энэ концертыг онцлох эсэхийг сонгоно уу. Онцлогдсон концертууд хүснэгтийн дээд талд харагдана.')).toBeInTheDocument();
    expect(screen.getByText('Онцлохоос хасах')).toBeInTheDocument();
    expect(screen.getByText('Онцлох')).toBeInTheDocument();
  });

  it('модал хаагдсан үед харагдахгүй', () => {
    render(
      <FeaturedModal
        isOpen={false}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Онцлох тохиргоо')).not.toBeInTheDocument();
  });

  it('concertId null байвал харагдахгүй', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId={null}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Онцлох тохиргоо')).not.toBeInTheDocument();
  });

  it('онцлох товч ажиллана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    const featuredButton = screen.getByText('Онцлох');
    fireEvent.click(featuredButton);

    expect(mockOnSave).toHaveBeenCalledWith(true);
  });

  it('онцлохоос хасах товч ажиллана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    const unfeaturedButton = screen.getByText('Онцлохоос хасах');
    fireEvent.click(unfeaturedButton);

    expect(mockOnSave).toHaveBeenCalledWith(false);
  });

  it('X товч ажиллана', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('онцлох товч нь зөв өнгөтэй байна', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    const featuredButton = screen.getByText('Онцлох');
    expect(featuredButton).toHaveClass('bg-yellow-600', 'hover:bg-yellow-700');
  });

  it('онцлохоос хасах товч нь зөв өнгөтэй байна', () => {
    render(
      <FeaturedModal
        isOpen={true}
        onClose={mockOnClose}
        concertId="concert-1"
        onSave={mockOnSave}
      />
    );

    const unfeaturedButton = screen.getByText('Онцлохоос хасах');
    expect(unfeaturedButton).toHaveClass('bg-gray-100', 'hover:bg-gray-200');
  });
});
