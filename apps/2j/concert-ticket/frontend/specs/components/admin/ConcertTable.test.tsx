import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConcertTable from '../../../src/components/admin/ConcertTable';
import { ConcertForAdmin } from '../../../src/types/admin.type';

const mockConcerts: ConcertForAdmin[] = [
  {
    id: '1',
    name: 'Test Concert 1',
    description: 'Test Description 1',
    venue: 'Test Venue 1',
    date: '2024-12-25',
    time: '19:00',
    image: 'test-image-1.jpg',
    isActive: true,
    mainArtist: {
      id: 'artist-1',
      name: 'Test Artist 1',
      image: 'artist-image-1.jpg'
    },
    otherArtists: [],
    ticketCategories: [
      {
        id: 'ticket-1',
        type: 'VIP',
        totalQuantity: 100,
        availableQuantity: 80,
        unitPrice: 50000,
        discountedPrice: 45000,
        discountPercentage: 10,
        description: 'VIP ticket',
        features: ['VIP seat', 'VIP entrance']
      },
      {
        id: 'ticket-2',
        type: 'REGULAR',
        totalQuantity: 200,
        availableQuantity: 150,
        unitPrice: 30000,
        discountedPrice: null,
        discountPercentage: null,
        description: 'Regular ticket',
        features: ['Regular seat']
      }
    ],
    totalAvailableTickets: 300
  },
  {
    id: '2',
    name: 'Test Concert 2',
    description: 'Test Description 2',
    venue: 'Test Venue 2',
    date: '2024-12-26',
    time: '20:00',
    image: null,
    isActive: false,
    mainArtist: {
      id: 'artist-2',
      name: 'Test Artist 2',
      image: null
    },
    otherArtists: [],
    ticketCategories: [
      {
        id: 'ticket-3',
        type: 'GENERAL_ADMISSION',
        totalQuantity: 300,
        availableQuantity: 250,
        unitPrice: 20000,
        discountedPrice: null,
        discountPercentage: null,
        description: 'General ticket',
        features: ['General entrance']
      }
    ],
    totalAvailableTickets: 300
  }
];

const defaultProps = {
  concerts: mockConcerts,
  featuredConcerts: new Set(['1']),
  onStarClick: jest.fn(),
  onEditClick: jest.fn(),
  onDeleteClick: jest.fn(),
  currentPage: 1,
  pageSize: 10,
  totalCount: 2,
  hasMore: false,
  onPageChange: jest.fn()
};

describe('ConcertTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('концертуудыг зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    expect(screen.getByText('Test Concert 2')).toBeInTheDocument();
    expect(screen.getByText('Test Venue 1')).toBeInTheDocument();
    expect(screen.getByText('Test Venue 2')).toBeInTheDocument();
  });

  it('онцлогдсон концертыг зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const featuredBadge = screen.getByText('Онцлох');
    expect(featuredBadge).toBeInTheDocument();
    expect(featuredBadge.closest('span')).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('концертын зураг зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const concert1Image = screen.getByAltText('Test Concert 1');
    expect(concert1Image).toHaveAttribute('src', 'test-image-1.jpg');
  });

  it('зураггүй концертын placeholder зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const placeholder = screen.getByText('Зураг');
    expect(placeholder).toBeInTheDocument();
  });

  it('уран бүтээлчийн нэр зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
  });

  it('огноо зөв форматтайгаар харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    // 2024-12-25 should be formatted as Mongolian date
    expect(screen.getByText('2024 оны 12-р сарын 25')).toBeInTheDocument();
  });

  it('цаг зөв форматтайгаар харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });

  it('үнэний хүрээ зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    // Concert 1: min 30000, max 50000
    expect(screen.getByText('30,000₮ - 50,000₮')).toBeInTheDocument();
    // Concert 2: only 20000
    expect(screen.getByText('20,000₮ - 20,000₮')).toBeInTheDocument();
  });

  it('тасалбарын тоо зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    expect(screen.getAllByText('300')[0]).toBeInTheDocument();
  });

  it('идэвхитэй төлөв зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const activeStatus = screen.getByText('Идэвхитэй');
    expect(activeStatus.closest('span')).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('идэвхгүй төлөв зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const inactiveStatus = screen.getByText('Идэвхгүй');
    expect(inactiveStatus.closest('span')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('онцлох товч ажиллана', () => {
    render(<ConcertTable {...defaultProps} />);

    const featuredStar = screen.getByTitle('Онцлохоос хасах');
    fireEvent.click(featuredStar);

    expect(defaultProps.onStarClick).toHaveBeenCalledWith('1');
  });

  it('засах товч ажиллана', () => {
    render(<ConcertTable {...defaultProps} />);

    const editButtons = screen.getAllByTitle('Засах');
    fireEvent.click(editButtons[0]);

    expect(defaultProps.onEditClick).toHaveBeenCalledWith('1');
  });

  it('устгах товч ажиллана', () => {
    render(<ConcertTable {...defaultProps} />);

    const deleteButtons = screen.getAllByTitle('Устгах');
    fireEvent.click(deleteButtons[0]);

    expect(defaultProps.onDeleteClick).toHaveBeenCalledWith('1');
  });

  it('pagination зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    const matches = screen.getAllByText((_, node) => node?.textContent === '1 - 2 / 2 үр дүн');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('pagination товчнууд ажиллана', () => {
    const propsWithPagination = {
      ...defaultProps,
      totalCount: 25,
      hasMore: true
    };

    render(<ConcertTable {...propsWithPagination} />);

    const nextButton = screen.getAllByRole('button', { name: 'Дараах' })[0];
    fireEvent.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('хоосон жагсаалт зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} concerts={[]} />);

    expect(screen.getByText('Концерт олдсонгүй')).toBeInTheDocument();
    expect(screen.getByText('Одоогоор нэмэгдсэн концерт байхгүй байна.')).toBeInTheDocument();
  });

  it('table headers зөв харуулна', () => {
    render(<ConcertTable {...defaultProps} />);

    expect(screen.getByText('Концерт')).toBeInTheDocument();
    expect(screen.getByText('Уран бүтээлч')).toBeInTheDocument();
    expect(screen.getByText('Огноо')).toBeInTheDocument();
    expect(screen.getByText('Үнэ')).toBeInTheDocument();
    expect(screen.getByText('Тасалбар')).toBeInTheDocument();
    expect(screen.getByText('Төлөв')).toBeInTheDocument();
    expect(screen.getByText('Үйлдэл')).toBeInTheDocument();
  });

  it('онцлогдсон концертын од өөр өнгөтэй байна', () => {
    render(<ConcertTable {...defaultProps} />);

    const featuredStar = screen.getByTitle('Онцлохоос хасах');
    const regularStar = screen.getByTitle('Онцлох');

    expect(featuredStar).toHaveClass('text-yellow-500');
    expect(regularStar).toHaveClass('text-gray-400');
  });

  it('онцлогдсон концертын од hover title өөр байна', () => {
    render(<ConcertTable {...defaultProps} />);

    const featuredStar = screen.getByTitle('Онцлохоос хасах');
    const regularStar = screen.getByTitle('Онцлох');

    expect(featuredStar).toHaveAttribute('title', 'Онцлохоос хасах');
    expect(regularStar).toHaveAttribute('title', 'Онцлох');
  });
});
