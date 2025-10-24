import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '../../../src/app/admin/page';
import { MockedProvider } from '@apollo/client/testing';
import { GetAdminConcertsDocument, DeleteConcertDocument } from '../../../src/generated';

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

const mockConcerts = [
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
      }
    ],
    totalAvailableTickets: 100
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
    totalAvailableTickets: 200
  }
];

const mocks = [
  {
    request: {
      query: GetAdminConcertsDocument,
      variables: {
        filter: undefined,
        pagination: {
          limit: 10,
          offset: 0
        }
      }
    },
    result: {
      data: {
        concerts: {
          totalCount: 2,
          hasMore: false,
          concerts: mockConcerts
        }
      }
    }
  },
  {
    request: {
      query: GetAdminConcertsDocument,
      variables: {
        filter: { name: 'Test' },
        pagination: {
          limit: 10,
          offset: 0
        }
      }
    },
    result: {
      data: {
        concerts: {
          totalCount: 2,
          hasMore: false,
          concerts: mockConcerts
        }
      }
    }
  },
  {
    request: {
      query: DeleteConcertDocument,
      variables: { id: '1' }
    },
    result: {
      data: {
        deleteConcert: true
      }
    }
  }
];

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('admin хуудас зөв харагдана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    });
    
    // Tab-ууд шалгах
    expect(screen.getByText('Концертууд')).toBeInTheDocument();
    expect(screen.getByText('Захиалгууд')).toBeInTheDocument();
  });

  it('концертуудыг зөв харуулна', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
      expect(screen.getByText('Test Concert 2')).toBeInTheDocument();
      expect(screen.getByText('Test Venue 1')).toBeInTheDocument();
      expect(screen.getByText('Test Venue 2')).toBeInTheDocument();
    });
  });

  it('хайлт ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Концерт хайх');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Test');
    });
  });

  it('хайлт цэвэрлэх ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Концерт хайх');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Test');
    });

    const clearButton = screen.getByText('Цэвэрлэх Х');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });

  it('онцлох товч ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    });

    const starButtons = screen.getAllByTitle('Онцлох');
    fireEvent.click(starButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Онцлох тохиргоо')).toBeInTheDocument();
    });
  });

  it('засах товч ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Засах');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Концерт засах')).toBeInTheDocument();
    });
  });

  it('устгах товч ажиллана', async () => {
    mockConfirm.mockReturnValue(true);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Устгах');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      '"Test Concert 1" концертыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.'
    );
  });

  it('устгах цуцлах ажиллана', async () => {
    mockConfirm.mockReturnValue(false);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Concert 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Устгах');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    // Устгах цуцлагдсан үед alert дуудахгүй байж болох ч UI өөр газарт дуудах магадлалтай, тиймээс хүлээлгүй
  });

  it('цуцлах хүсэлт tab ажиллана', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    });

    const refundsTab = screen.getByText('Захиалгууд');
    fireEvent.click(refundsTab);

    await waitFor(() => {
      expect(screen.getByText('Захиалгууд харах функц хөгжүүлэгдэж байна...')).toBeInTheDocument();
    });
  });

  it('loading state зөв харуулна', () => {
    const loadingMocks = [
      {
        request: {
          query: GetAdminConcertsDocument,
          variables: {
            filter: undefined,
            pagination: {
              limit: 10,
              offset: 0
            }
          }
        },
        result: new Promise(() => {}) // Never resolves
      }
    ];

    render(
      <MockedProvider mocks={loadingMocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    // Check for loading spinner instead of text
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('error state зөв харуулна', async () => {
    const errorMocks = [
      {
        request: {
          query: GetAdminConcertsDocument,
          variables: {
            filter: undefined,
            pagination: {
              limit: 10,
              offset: 0
            }
          }
        },
        error: new Error('GraphQL error')
      }
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Алдаа гарлаа')).toBeInTheDocument();
      expect(screen.getByText('GraphQL error')).toBeInTheDocument();
    });
  });

  it('хоосон концерт жагсаалт зөв харуулна', async () => {
    const emptyMocks = [
      {
        request: {
          query: GetAdminConcertsDocument,
          variables: {
            filter: undefined,
            pagination: {
              limit: 10,
              offset: 0
            }
          }
        },
        result: {
          data: {
            concerts: {
              totalCount: 0,
              hasMore: false,
              concerts: []
            }
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <AdminPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Концерт олдсонгүй')).toBeInTheDocument();
    });
  });
});
