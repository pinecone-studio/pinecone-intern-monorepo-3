import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventGrid from '../../../src/components/home/EventGrid';
import { useHomeEventsQuery } from '../../../src/generated';

jest.mock('../../../src/generated', () => ({
  useHomeEventsQuery: jest.fn(),
}));

jest.mock('../../../src/components/home/EventCard', () => {
  return function MockEventCard({ item }: { item: { name: string; id: string } }) {
    return <div data-testid="event-card">{item.name}</div>;
  };
});

const mockUseHomeEventsQuery = useHomeEventsQuery as jest.MockedFunction<typeof useHomeEventsQuery>;

describe('EventGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loading үед skeleton картуудыг харуулна', () => {
    mockUseHomeEventsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as ReturnType<typeof useHomeEventsQuery>);

    render(<EventGrid />);

    const skeletonCards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse') && el.className.includes('bg-[#111111]')
    );
    expect(skeletonCards).toHaveLength(8);
  });

  it('error үед алдааны мессежийг харуулна', () => {
    mockUseHomeEventsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('Test error'),
    } as ReturnType<typeof useHomeEventsQuery>);

    render(<EventGrid />);

    expect(screen.getByText('Өгөгдөл татахад алдаа гарлаа.')).toBeInTheDocument();
  });

  it('өгөгдөл байгаа үед event картуудыг харуулна', () => {
    const mockData = {
      concerts: {
        concerts: [
          { id: '1', name: 'Test Concert 1' },
          { id: '2', name: 'Test Concert 2' },
        ],
      },
    };

    mockUseHomeEventsQuery.mockReturnValue({
      data: mockData,
      loading: false,
      error: undefined,
    } as ReturnType<typeof useHomeEventsQuery>);

    render(<EventGrid />);

    expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    expect(screen.getByText('Test Concert 2')).toBeInTheDocument();
  });

  it('className prop-г зөв ашиглана', () => {
    mockUseHomeEventsQuery.mockReturnValue({
      data: { concerts: { concerts: [] } },
      loading: false,
      error: undefined,
    } as ReturnType<typeof useHomeEventsQuery>);

    render(<EventGrid className="custom-class" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });
});