import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditConcertModal from '../../../src/components/admin/EditConcertModal';
import { MockedProvider } from '@apollo/client/testing';
import { UpdateConcertDocument } from '../../../src/generated';
import { ConcertForAdmin } from '../../../src/types/admin.type';

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

const mockConcert: ConcertForAdmin = {
  id: '1',
  name: 'Test Concert',
  description: 'Test Description',
  venue: 'Test Venue',
  date: '2024-12-25',
  time: '19:00',
  image: 'test-image.jpg',
  isActive: true,
  mainArtist: {
    id: 'artist-1',
    name: 'Test Artist',
    image: 'artist-image.jpg'
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
    }
  ],
  totalAvailableTickets: 100
};

const mockOnClose = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateConcertDocument,
      variables: {
        id: '1',
        input: {
          name: 'Updated Concert',
          description: 'Updated Description',
          venue: 'Updated Venue',
          date: '2024-12-26',
          time: '20:00',
          isActive: true
        }
      }
    },
    result: {
      data: {
        updateConcert: {
          id: '1',
          name: 'Updated Concert',
          description: 'Updated Description',
          venue: 'Updated Venue',
          date: '2024-12-26',
          time: '20:00',
          image: 'test-image.jpg',
          isActive: true,
          mainArtist: {
            id: 'artist-1',
            name: 'Test Artist',
            __typename: 'Artist'
          },
          ticketCategories: [
            {
              id: 'ticket-1',
              type: 'VIP',
              totalQuantity: 100,
              unitPrice: 50000,
              __typename: 'TicketCategory'
            }
          ],
          __typename: 'Concert'
        }
      }
    }
  }
];

describe('EditConcertModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('модал нээгдэх үед зөв харагдана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    expect(screen.getByText('Концерт засах')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Concert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Venue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19:00')).toBeInTheDocument();
  });

  it('модал хаагдсан үед харагдахгүй', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={false} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    expect(screen.queryByText('Концерт засах')).not.toBeInTheDocument();
  });

  it('concert null байвал харагдахгүй', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={null} />
      </MockedProvider>
    );

    expect(screen.queryByText('Концерт засах')).not.toBeInTheDocument();
  });

  it('form fields зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    const descriptionTextarea = screen.getByDisplayValue('Test Description');
    const venueInput = screen.getByDisplayValue('Test Venue');

    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });
    fireEvent.change(venueInput, { target: { value: 'Updated Venue' } });

    expect(nameInput).toHaveValue('Updated Concert');
    expect(descriptionTextarea).toHaveValue('Updated Description');
    expect(venueInput).toHaveValue('Updated Venue');
  });

  it('date болон time inputs зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const dateInput = screen.getByDisplayValue('2024-12-25');
    const timeInput = screen.getByDisplayValue('19:00');

    fireEvent.change(dateInput, { target: { value: '2024-12-26' } });
    fireEvent.change(timeInput, { target: { value: '20:00' } });

    expect(dateInput).toHaveValue('2024-12-26');
    expect(timeInput).toHaveValue('20:00');
  });

  it('төлөв select зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const statusSelect = screen.getByRole('combobox', { name: 'Төлөв' });
    fireEvent.change(statusSelect, { target: { value: 'inactive' } });

    expect(statusSelect).toHaveValue('inactive');
  });

  it('амжилттай form submit ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    const descriptionTextarea = screen.getByDisplayValue('Test Description');
    const venueInput = screen.getByDisplayValue('Test Venue');
    const dateInput = screen.getByDisplayValue('2024-12-25');
    const timeInput = screen.getByDisplayValue('19:00');

    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });
    fireEvent.change(venueInput, { target: { value: 'Updated Venue' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-26' } });
    fireEvent.change(timeInput, { target: { value: '20:00' } });

    const submitButton = screen.getByText('Хадгалах');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Концертын мэдээлэл амжилттай шинэчлэгдлээ!');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('цуцлах товч ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('X товч ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form submit алдаа гарвал зөв харуулна', async () => {
    const errorMocks = [
      {
        request: {
          query: UpdateConcertDocument,
          variables: {
            id: '1',
            input: {
              name: 'Updated Concert',
              description: 'Test Description',
              venue: 'Test Venue',
              date: '2024-12-25',
              time: '19:00',
              isActive: true
            }
          }
        },
        error: new Error('GraphQL error')
      }
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });

    const submitButton = screen.getByText('Хадгалах');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Концерт шинэчлэхэд алдаа гарлаа: GraphQL error');
    });
  });

  it('required fields зөв тэмдэглэгдсэн байна', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    const requiredFields = screen.getAllByText('*');
    expect(requiredFields).toHaveLength(4); // name, venue, date, time
  });

  it('идэвхгүй концертын төлөв зөв харуулна', () => {
    const inactiveConcert = { ...mockConcert, isActive: false };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={inactiveConcert} />
      </MockedProvider>
    );

    const statusSelect = screen.getByRole('combobox', { name: 'Төлөв' });
    expect(statusSelect).toBeInTheDocument();
  });

  it('form fields нь концертын анхны утгаар бөглөгдсэн байна', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditConcertModal isOpen={true} onClose={mockOnClose} concert={mockConcert} />
      </MockedProvider>
    );

    expect(screen.getByDisplayValue('Test Concert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Venue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19:00')).toBeInTheDocument();
  });
});
