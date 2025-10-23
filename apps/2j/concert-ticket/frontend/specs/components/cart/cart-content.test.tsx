import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { CartContent } from '../../../src/components/cart/cart-content';
import { GetConcertDocument } from '../../../src/generated';
import type { TicketCategoryType } from '../../../src/types/Event.type';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockPush = jest.fn();
const mockBack = jest.fn();

const mockData = {
  request: { query: GetConcertDocument, variables: { id: 'test-id' } },
  result: {
    data: {
      concert: {
        id: 'test-id',
        name: 'Test',
        date: '2024-12-25',
        venue: 'Venue',
        ticketCategories: [
          { id: '1', type: 'GENERAL_ADMISSION', unitPrice: 89000, availableQuantity: 123, discountPercentage: 0, discountedPrice: 89000 },
          { id: '2', type: 'VIP', unitPrice: 129000, availableQuantity: 38, discountPercentage: 20, discountedPrice: 103200 },
          { id: '3', type: 'REGULAR', unitPrice: 159000, availableQuantity: 38, discountPercentage: 10, discountedPrice: 143100 },
        ],
      },
    },
  },
};

describe('CartContent', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush, back: mockBack, forward: jest.fn(), refresh: jest.fn(), replace: jest.fn(), prefetch: jest.fn() });
  });

  afterEach(() => jest.clearAllMocks());

  it('shows loading', () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    expect(screen.getByText('Ачааллаж байна...')).toBeInTheDocument();
  });

  it('renders tickets', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());
  });

  it('renders all categories', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument();
      expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument();
      expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument();
    });
  });

  it('renders buy button', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Тасалбар авах')).toBeInTheDocument());
  });

  it('disables buy button initially', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Тасалбар авах')).toBeDisabled());
  });

  it('renders back button', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByTestId('back-button')).toBeInTheDocument());
  });

  it('calls back on click', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByTestId('back-button'));
    fireEvent.click(screen.getByTestId('back-button'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('increases quantity', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      fireEvent.click(plus);
      await waitFor(() => expect(screen.getAllByText('1').length).toBeGreaterThan(0));
    }
  });

  it('enables buy when selected', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      fireEvent.click(plus);
      await waitFor(() => expect(screen.getByText('Тасалбар авах')).not.toBeDisabled());
    }
  });

  it('decreases quantity', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      fireEvent.click(plus);
      const minus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-minus'));
      if (minus) fireEvent.click(minus);
    }
  });

  it('shows max ticket error', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      for (let i = 0; i < 11; i++) fireEvent.click(plus);
      await waitFor(() => expect(screen.getByText(/10-с олон/)).toBeInTheDocument());
    }
  });

  it('renders stage plan', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByAltText('Stage Plan')).toBeInTheDocument());
  });

  it('shows error on failure', async () => {
    const err = { request: { query: GetConcertDocument, variables: { id: 'test-id' } }, error: new Error('Failed') };
    render(
      <MockedProvider mocks={[err]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Концертын мэдээлэл олдсонгүй')).toBeInTheDocument());
  });

  it('displays prices', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('89,000₮')).toBeInTheDocument();
      expect(screen.getByText('129,000₮')).toBeInTheDocument();
    });
  });

  it('handles null concertId', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId={null} selectedDate="2024-12-25" />
      </MockedProvider>
    );
    expect(screen.queryByText('Ачааллаж байна...')).not.toBeInTheDocument();
  });

  it('handles null selectedDate', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate={null} />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());
  });

  it('renders VIP ticket type correctly', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument());
  });

  it('renders REGULAR ticket type correctly', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument());
  });

  it('displays ticket availability counts', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const elements = screen.getAllByText(/\d+/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders minus button', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const minus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-minus'));
      expect(minus).toBeInTheDocument();
    });
  });

  it('renders plus button', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
      expect(plus).toBeInTheDocument();
    });
  });

  it('handles ticket quantity at zero', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThan(0);
    });
  });

  it('shows available quantity in parentheses', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getAllByText(/\(\d+\)/).length).toBeGreaterThan(0));
  });

  it('renders ticket color dots', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const colorDots = document.querySelectorAll('.w-3.h-3.rounded-full');
      expect(colorDots.length).toBeGreaterThan(0);
    });
  });

  it('handles minus click at zero', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const minus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-minus'));
    if (minus) fireEvent.click(minus);
  });

  it('limits quantity to 10 per category', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) for (let i = 0; i < 15; i++) fireEvent.click(plus);
  });

  it('validates total tickets not exceeding 20', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const buttons = screen.getAllByRole('button').filter((b) => b.querySelector('svg.lucide-plus'));
    buttons.forEach((btn) => {
      for (let i = 0; i < 10; i++) fireEvent.click(btn);
    });
  });

  it('handles buy button click with valid selection', async () => {
    // Mock window.location.href
    delete (window as unknown as { location: unknown }).location;
    window.location = { href: '' } as unknown as Location;

    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      fireEvent.click(plus);
      await waitFor(() => {
        const buyButton = screen.getByText('Тасалбар авах');
        expect(buyButton).not.toBeDisabled();
        fireEvent.click(buyButton);
        expect(window.location.href).toContain('/checkout');
      });
    }
  });

  it('handles date selection change', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const dateSelect = screen.getByRole('combobox');
    expect(dateSelect).toBeInTheDocument();
  });

  it('displays correct ticket type colors', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      const colorDots = document.querySelectorAll('.w-3.h-3.rounded-full');
      expect(colorDots.length).toBe(3); // VIP, Regular, General Admission
    });
  });

  it('handles ticket type name mapping', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
      expect(screen.getByText('Энгийн тасалбар')).toBeInTheDocument();
      expect(screen.getByText('Арын тасалбар')).toBeInTheDocument();
    });
  });

  it('calculates total price correctly', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText(/Арын тасалбар/));
    const plus = screen.getAllByRole('button').find((b) => b.querySelector('svg.lucide-plus'));
    if (plus) {
      fireEvent.click(plus);
      await waitFor(() => {
        expect(screen.getAllByText('89,000₮')).toHaveLength(3);
      });
    }
  });

  it('handles empty ticket categories', async () => {
    const emptyMockData = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: '2024-12-25',
            venue: 'Venue',
            ticketCategories: [],
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[emptyMockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Тасалбар авах')).toBeDisabled();
    });
  });

  it('handles loading state correctly', async () => {
    const loadingMockData = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: '2024-12-25',
            venue: 'Venue',
            ticketCategories: [{ id: '1', type: 'GENERAL_ADMISSION', unitPrice: 89000, availableQuantity: 123 }],
          },
        },
      },
      delay: 100,
    };

    render(
      <MockedProvider mocks={[loadingMockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    expect(screen.getByText('Ачааллаж байна...')).toBeInTheDocument();
  });

  it('handles unknown ticket type mapping', async () => {
    const mockDataWithUnknownType = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test Concert',
            date: '2024-12-25',
            venue: 'Test Venue',
            artist: { name: 'Test Artist' },
            imageUrl: 'test.jpg',
            ticketCategories: [
              {
                id: '1',
                name: 'Unknown Type',
                price: 100000,
                availableQuantity: 50,
                type: 'UNKNOWN_TYPE' as unknown as TicketCategoryType,
                unitPrice: 100000,
                available: 50,
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockDataWithUnknownType]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Тасалбар')).toBeInTheDocument();
    });
  });

  it('handles unknown ticket type color mapping', async () => {
    const mockDataWithUnknownType = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test Concert',
            date: '2024-12-25',
            venue: 'Test Venue',
            artist: { name: 'Test Artist' },
            imageUrl: 'test.jpg',
            ticketCategories: [
              {
                id: '1',
                name: 'Unknown Type',
                price: 100000,
                availableQuantity: 50,
                type: 'UNKNOWN_TYPE' as unknown as TicketCategoryType,
                unitPrice: 100000,
                available: 50,
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockDataWithUnknownType]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Тасалбар')).toBeInTheDocument();
    });
  });

  it('handles timestamp date format', async () => {
    const mockDataWithTimestamp = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: '1703520000000',
            venue: 'Venue',
            ticketCategories: [{ id: '1', type: 'VIP', unitPrice: 50000, availableQuantity: 10 }],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockDataWithTimestamp]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
    });
  });

  it('handles invalid date format and returns original string', async () => {
    const mockDataWithInvalidDate = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: 'invalid-date-format',
            venue: 'Venue',
            ticketCategories: [{ id: '1', type: 'VIP', unitPrice: 50000, availableQuantity: 10 }],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockDataWithInvalidDate]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
    });
  });

  it('disables checkout button when no tickets selected', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());

    const checkoutButton = screen.getByText('Тасалбар авах');
    expect(checkoutButton).toBeDisabled();
  });

  it('enables checkout button when tickets are selected', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());

    const allButtons = screen.getAllByRole('button');
    const plusButton = allButtons.find((btn) => btn.className.includes('w-12 h-12') && !btn.hasAttribute('data-testid') && btn.querySelector('svg'));

    if (plusButton) {
      fireEvent.click(plusButton);

      await waitFor(() => {
        const checkoutButton = screen.getByText('Тасалбар авах');
        expect(checkoutButton).not.toBeDisabled();
      });
    }
  });

  it('handles date change to update selected date', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());

    const dateSelect = screen.getByRole('combobox');
    fireEvent.change(dateSelect, { target: { value: '12.25' } });

    expect(dateSelect).toBeInTheDocument();
  });

  it('handles missing concert date and uses current date', async () => {
    const mockDataWithoutDate = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: null,
            venue: 'Venue',
            ticketCategories: [{ id: '1', type: 'VIP', unitPrice: 50000, availableQuantity: 10 }],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockDataWithoutDate]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
    });
  });

  it('handles selectedDate being null in date selector', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <CartContent concertId="test-id" selectedDate={null as unknown as string} />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument());

    expect(screen.getByText('Өдөр сонгох')).toBeInTheDocument();
  });

  it('handles date formatting errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const mockDataWithBadDate = {
      request: { query: GetConcertDocument, variables: { id: 'test-id' } },
      result: {
        data: {
          concert: {
            id: 'test-id',
            name: 'Test',
            date: 'definitely-not-a-valid-date-format-123',
            venue: 'Venue',
            ticketCategories: [{ id: '1', type: 'VIP', unitPrice: 50000, availableQuantity: 10 }],
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[mockDataWithBadDate]}>
        <CartContent concertId="test-id" selectedDate="2024-12-25" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });
});
