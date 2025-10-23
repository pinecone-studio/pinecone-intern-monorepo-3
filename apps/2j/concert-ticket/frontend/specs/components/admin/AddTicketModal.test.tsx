import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTicketModal from '../../../src/components/admin/AddTicketModal';
import { MockedProvider } from '@apollo/client/testing';
import { CreateConcertDocument, CreateArtistDocument } from '../../../src/generated';

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock fetch for Cloudinary upload
global.fetch = jest.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-preview-url');

const mockOnClose = jest.fn();

const mocks = [
  {
    request: {
      query: CreateArtistDocument,
      variables: {
        input: {
          name: 'Test Artist',
          bio: '',
          image: ''
        }
      }
    },
    result: {
      data: {
        createArtist: {
          id: 'artist-1',
          name: 'Test Artist',
          bio: '',
          image: '',
          __typename: 'Artist'
        }
      }
    }
  },
  {
    request: {
      query: CreateConcertDocument,
      variables: {
        input: {
          name: 'Test Concert',
          description: '',
          venue: 'Test Venue',
          date: '2024-12-25',
          time: '19:00',
          image: 'https://cloudinary.com/test-image.jpg',
          mainArtistId: 'artist-1',
          otherArtistIds: [],
          ticketCategories: [
            {
              type: 'VIP',
              totalQuantity: 100,
              unitPrice: 50000,
              description: 'VIP тасалбар',
              features: ['VIP суудал', 'VIP орц', 'VIP үйлчилгээ']
            },
            {
              type: 'REGULAR',
              totalQuantity: 200,
              unitPrice: 30000,
              description: 'Энгийн тасалбар',
              features: ['Энгийн суудал']
            },
            {
              type: 'GENERAL_ADMISSION',
              totalQuantity: 300,
              unitPrice: 20000,
              description: 'Ерөнхий тасалбар',
              features: ['Ерөнхий орц']
            }
          ]
        }
      }
    },
    result: {
      data: {
        createConcert: {
          id: 'concert-1',
          name: 'Test Concert',
          description: '',
          venue: 'Test Venue',
          date: '2024-12-25',
          time: '19:00',
          image: 'https://cloudinary.com/test-image.jpg',
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
  },
  {
    request: {
      query: CreateConcertDocument,
    },
    result: {
      data: {
        createConcert: {
          id: 'concert-1',
          name: 'Test Concert',
          description: '',
          venue: 'Test Venue',
          date: '2024-12-25',
          time: '19:00',
          image: 'https://cloudinary.com/test-image.jpg',
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

describe('AddTicketModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('модал нээгдэх үед зөв харагдана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Тасалбар нэмэх')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Концертын нэр')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Уран бүтээлчийн нэр')).toBeInTheDocument();
    expect(screen.getByText('Зураг')).toBeInTheDocument();
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
    expect(screen.getByText('Цуцлах')).toBeInTheDocument();
  });

  it('модал хаагдсан үед харагдахгүй', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={false} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.queryByText('Тасалбар нэмэх')).not.toBeInTheDocument();
  });

  it('form fields зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Концертын нэр');
    const artistInput = screen.getByPlaceholderText('Уран бүтээлчийн нэр');
    const venueInput = screen.getByPlaceholderText('Тоглолтын газар');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });

    expect(nameInput).toHaveValue('Test Concert');
    expect(artistInput).toHaveValue('Test Artist');
    expect(venueInput).toHaveValue('Test Venue');
  });

  it('textarea зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const descriptionTextarea = screen.getByPlaceholderText('Концертын тайлбар');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });

    expect(descriptionTextarea).toHaveValue('Test Description');
  });

  it('date болон time inputs зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const dateInput = screen.getByTestId('date');
    const timeInput = screen.getByTestId('time');

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    expect(dateInput).toHaveValue('2024-12-25');
    expect(timeInput).toHaveValue('19:00');
  });

  it('зураг upload ажиллана', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ secureUrl: 'https://cloudinary.com/test-image.jpg' }) });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const fileInput = screen.getByLabelText('Зураг', { selector: 'input[type="file"]' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Preview should be shown immediately after selecting a file
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });

  it('зурагны хэмжээ шалгана', async () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const fileInput = screen.getByLabelText('Зураг', { selector: 'input[type="file"]' });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Зурагны хэмжээ 5MB-аас их байж болохгүй');
    });
  });

  it('буруу файлын төрөл шалгана', async () => {
    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const fileInput = screen.getByLabelText('Зураг', { selector: 'input[type="file"]' });
    fireEvent.change(fileInput, { target: { files: [textFile] } });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Зөвхөн зурагны файл оруулна уу');
    });
  });

  it('тасалбарын ангилал fields зөв ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const vipQuantityInput = screen.getByTestId('vipQuantity');
    const vipPriceInput = screen.getByTestId('vipPrice');

    fireEvent.change(vipQuantityInput, { target: { value: '100' } });
    fireEvent.change(vipPriceInput, { target: { value: '50000' } });

    expect(vipQuantityInput).toHaveValue(100);
    expect(vipPriceInput).toHaveValue(50000);
  });

  it('form validation ажиллана - шаардлагатай талбарууд хоосон байх үед', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Бүх шаардлагатай талбаруудыг бөглөнө үү');
    });
  });

  it('form validation ажиллана - тасалбарын ангилал хоосон байх үед', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Required fields бөглөх
    const nameInput = screen.getByPlaceholderText('Концертын нэр');
    const artistInput = screen.getByPlaceholderText('Уран бүтээлчийн нэр');
    const venueInput = screen.getByPlaceholderText('Тоглолтын газар');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Бүх тасалбарын ангилалын мэдээллийг бөглөнө үү');
    });
  });

  it('амжилттай form submit ажиллана', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    // 1) Cloudinary upload
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ secureUrl: 'https://cloudinary.com/test-image.jpg' }) });
    // 2) /api/artists returns existing artist to skip createArtist
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 'artist-1', name: 'Test Artist' }]) });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Form бөглөх
    const nameInput = screen.getByPlaceholderText('Концертын нэр');
    const artistInput = screen.getByPlaceholderText('Уран бүтээлчийн нэр');
    const venueInput = screen.getByPlaceholderText('Тоглолтын газар');
    const dateInput = screen.getByTestId('date');
    const timeInput = screen.getByTestId('time');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    // Тасалбарын ангилал бөглөх
    const vipQuantityInput = screen.getByTestId('vipQuantity');
    const vipPriceInput = screen.getByTestId('vipPrice');
    const regularQuantityInput = screen.getByTestId('regularQuantity');
    const regularPriceInput = screen.getByTestId('regularPrice');
    const generalQuantityInput = screen.getByTestId('generalQuantity');
    const generalPriceInput = screen.getByTestId('generalPrice');

    fireEvent.change(vipQuantityInput, { target: { value: '100' } });
    fireEvent.change(vipPriceInput, { target: { value: '50000' } });
    fireEvent.change(regularQuantityInput, { target: { value: '200' } });
    fireEvent.change(regularPriceInput, { target: { value: '30000' } });
    fireEvent.change(generalQuantityInput, { target: { value: '300' } });
    fireEvent.change(generalPriceInput, { target: { value: '20000' } });

    // Зураг upload
    const fileInput = screen.getByLabelText('Зураг', { selector: 'input[type="file"]' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Preview гарсныг баталгаажуулж Cloudinary upload дууссаныг хүлээнэ
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Концерт амжилттай үүсгэгдлээ!');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('цуцлах товч ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('X товч ажиллана', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('зураг upload алдаа гарвал зөв харуулна', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const fileInput = screen.getByLabelText('Зураг', { selector: 'input[type="file"]' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText('Зураг байршуулахад алдаа гарлаа')).toBeInTheDocument();
    });
  });

  it('form submit алдаа гарвал зөв харуулна', async () => {
    const errorMocks = [
      {
        request: {
          query: CreateArtistDocument,
          variables: {
            input: {
              name: 'Test Artist',
              bio: '',
              image: ''
            }
          }
        },
        error: new Error('GraphQL error')
      }
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Form бөглөх
    const nameInput = screen.getByPlaceholderText('Концертын нэр');
    const artistInput = screen.getByPlaceholderText('Уран бүтээлчийн нэр');
    const venueInput = screen.getByPlaceholderText('Тоглолтын газар');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    // /api/artists хоосон буцаана
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    // Бүх тасалбарын ангиллыг бөглөх (validation давах)
    fireEvent.change(screen.getByTestId('vipQuantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('vipPrice'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('regularQuantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('regularPrice'), { target: { value: '1000' } });
    fireEvent.change(screen.getByTestId('generalQuantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('generalPrice'), { target: { value: '1000' } });
    // 1) Ensure /api/artists returns empty to attempt GraphQL createArtist which errors
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    // 2) Fill minimal category fields to pass validation
    fireEvent.change(screen.getByTestId('vipQuantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('vipPrice'), { target: { value: '1000' } });

    // Fill minimal ticket category fields to pass validation
    fireEvent.change(screen.getByTestId('vipQuantity'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('vipPrice'), { target: { value: '1000' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Концерт үүсгэхэд алдаа гарлаа');
    });
  });
});
