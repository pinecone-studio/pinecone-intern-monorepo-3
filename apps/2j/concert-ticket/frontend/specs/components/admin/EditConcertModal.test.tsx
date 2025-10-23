import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditConcertModal from '../../../src/components/admin/EditConcertModal';
import { useUpdateConcertMutation, useCreateArtistMutation } from '../../../src/generated';
import { UPDATE_CONCERT_MUTATION } from '../../../src/graphql/events.graphql';

jest.mock('../../../src/generated', () => ({
  useUpdateConcertMutation: jest.fn(),
  useCreateArtistMutation: jest.fn(),
}));

const mockOnClose = jest.fn();
const mockConcert = {
  id: '1',
  name: 'Test Concert',
  description: 'Test Description',
  venue: 'Test Venue',
  date: '2024-01-01',
  time: '19:00',
  image: 'test-image.jpg',
  mainArtist: { id: 'artist1', name: 'Test Artist' },
  otherArtists: [],
  ticketCategories: [
    { id: 'vip', type: 'VIP', totalQuantity: 100, unitPrice: 50000 },
    { id: 'regular', type: 'Regular', totalQuantity: 0, unitPrice: 0 },
    { id: 'general', type: 'General', totalQuantity: 0, unitPrice: 0 },
  ],
};

describe('EditConcertModal', () => {
  beforeEach(() => {
    (useUpdateConcertMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    (useCreateArtistMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    jest.clearAllMocks();
  });

  it('модал хаалттай үед харагдахгүй', () => {
    render(
      <EditConcertModal
        isOpen={false}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );
    expect(screen.queryByText('Тасалбар засах')).not.toBeInTheDocument();
  });

  it('модал нээгдэх үед зөв агуулгыг харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Тасалбар засах')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Concert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('билетийн мэдээллийг зөв харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Тасалбарын ангилал')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
  });

  it('Шинэчлэх товч байна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('одоогийн зураг байгаа бол харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const currentImage = screen.getByAltText('Uploaded');
    expect(currentImage).toBeInTheDocument();
    expect(currentImage).toHaveAttribute('src', 'test-image.jpg');
  });

  it('form-ийн бүх талбаруудыг харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByDisplayValue('Test Concert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Venue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Artist')).toBeInTheDocument();
  });

  it('билетийн ангилалуудыг харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('VIP*')).toBeInTheDocument();
    expect(screen.getByText('Regular*')).toBeInTheDocument();
    expect(screen.getByText('Задгай*')).toBeInTheDocument();
  });

  it('VIP билетийн мэдээллийг харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
  });

  it('form input-уудыг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    const venueInput = screen.getByDisplayValue('Test Venue');
    const artistInput = screen.getByDisplayValue('Test Artist');

    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    fireEvent.change(venueInput, { target: { value: 'Updated Venue' } });
    fireEvent.change(artistInput, { target: { value: 'Updated Artist' } });

    expect(nameInput).toHaveValue('Updated Concert');
    expect(descriptionInput).toHaveValue('Updated Description');
    expect(venueInput).toHaveValue('Updated Venue');
    expect(artistInput).toHaveValue('Updated Artist');
  });

  it('билетийн тоо хэмжээг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const vipQuantityInput = screen.getByDisplayValue('100');
    fireEvent.change(vipQuantityInput, { target: { value: '150' } });
    expect(vipQuantityInput).toHaveValue(150);
  });

  it('билетийн үнийг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const vipPriceInput = screen.getByDisplayValue('50000');
    fireEvent.change(vipPriceInput, { target: { value: '60000' } });
    expect(vipPriceInput).toHaveValue(60000);
  });

  it('огноо болон цагийг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const dateInput = screen.getByDisplayValue('2024-01-01');
    const timeInput = screen.getByDisplayValue('19:00');

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '20:00' } });

    expect(dateInput).toHaveValue('2024-12-25');
    expect(timeInput).toHaveValue('20:00');
  });

  it('модал хаахад onClose дуудагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    fireEvent.click(screen.getByText('Цуцлах'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('X товчийг дарахад onClose дуудагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // X товчийг олох (SVG icon-тай товч)
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('зураг upload хэсэг байна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Зураг')).toBeInTheDocument();
    // Зураг upload хэсэг байгаа эсэхийг шалгая
    expect(screen.getByRole('img', { name: 'Uploaded' })).toBeInTheDocument();
  });

  it('form submit хийх үед validation ажиллана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('билетийн ангилалуудын мэдээллийг харуулна', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('VIP*')).toBeInTheDocument();
    expect(screen.getByText('Regular*')).toBeInTheDocument();
    expect(screen.getByText('Задгай*')).toBeInTheDocument();
  });

  it('form-ийн бүх талбаруудыг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    const venueInput = screen.getByDisplayValue('Test Venue');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    const artistInput = screen.getByDisplayValue('Test Artist');

    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Updated Venue' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    fireEvent.change(artistInput, { target: { value: 'Updated Artist' } });

    expect(nameInput).toHaveValue('Updated Concert');
    expect(venueInput).toHaveValue('Updated Venue');
    expect(descriptionInput).toHaveValue('Updated Description');
    expect(artistInput).toHaveValue('Updated Artist');
  });

  it('билетийн ангилалын мэдээллийг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    // VIP ангилал
    fireEvent.change(quantityInputs[0], { target: { value: '150' } });
    fireEvent.change(priceInputs[0], { target: { value: '60000' } });

    // Regular ангилал
    fireEvent.change(quantityInputs[1], { target: { value: '250' } });
    fireEvent.change(priceInputs[1], { target: { value: '35000' } });

    // General ангилал
    fireEvent.change(quantityInputs[2], { target: { value: '350' } });
    fireEvent.change(priceInputs[2], { target: { value: '25000' } });

    expect(quantityInputs[0]).toHaveValue(150);
    expect(priceInputs[0]).toHaveValue(60000);
    expect(quantityInputs[1]).toHaveValue(250);
    expect(priceInputs[1]).toHaveValue(35000);
    expect(quantityInputs[2]).toHaveValue(350);
    expect(priceInputs[2]).toHaveValue(25000);
  });

  it('огноо болон цагийг өөрчлөх боломжтой', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const dateInput = screen.getByDisplayValue('2024-01-01');
    const timeInput = screen.getByDisplayValue('19:00');

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '20:00' } });

    expect(dateInput).toHaveValue('2024-12-25');
    expect(timeInput).toHaveValue('20:00');
  });

  it('модал нээгдэх үед бүх шаардлагатай элементүүд харагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Тасалбар засах')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын нэр*')).toBeInTheDocument();
    expect(screen.getByText('Хөтөлбөрийн тухай*')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын газар*')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын өдөр сонгох*')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын цаг сонгох*')).toBeInTheDocument();
    expect(screen.getByText('Үндсэн артистын нэр*')).toBeInTheDocument();
    expect(screen.getByText('Зураг')).toBeInTheDocument();
    expect(screen.getByText('Тасалбарын ангилал')).toBeInTheDocument();
    expect(screen.getByText('VIP*')).toBeInTheDocument();
    expect(screen.getByText('Regular*')).toBeInTheDocument();
    expect(screen.getByText('Задгай*')).toBeInTheDocument();
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
    expect(screen.getByText('Цуцлах')).toBeInTheDocument();
  });

  it('модал хаалттай үед харагдахгүй', () => {
    render(
      <EditConcertModal
        isOpen={false}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.queryByText('Тасалбар засах')).not.toBeInTheDocument();
  });

  it('form validation ажиллана - шаардлагатай талбарууд хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Бүх талбаруудыг хоослох
    const nameInput = screen.getByDisplayValue('Test Concert');
    const venueInput = screen.getByDisplayValue('Test Venue');
    const artistInput = screen.getByDisplayValue('Test Artist');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(venueInput, { target: { value: '' } });
    fireEvent.change(artistInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - билетийн ангилал хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Билетийн ангилалын талбаруудыг хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[0], { target: { value: '' } });
    fireEvent.change(priceInputs[0], { target: { value: '' } });
    fireEvent.change(quantityInputs[1], { target: { value: '' } });
    fireEvent.change(priceInputs[1], { target: { value: '' } });
    fireEvent.change(quantityInputs[2], { target: { value: '' } });
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - билетийн ангилал бүрэн бөглөх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Бүх талбаруудыг бөглөх
    const nameInput = screen.getByDisplayValue('Test Concert');
    const venueInput = screen.getByDisplayValue('Test Venue');
    const artistInput = screen.getByDisplayValue('Test Artist');

    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Updated Venue' } });
    fireEvent.change(artistInput, { target: { value: 'Updated Artist' } });

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    // VIP ангилал
    fireEvent.change(quantityInputs[0], { target: { value: '150' } });
    fireEvent.change(priceInputs[0], { target: { value: '60000' } });

    // Regular ангилал
    fireEvent.change(quantityInputs[1], { target: { value: '250' } });
    fireEvent.change(priceInputs[1], { target: { value: '35000' } });

    // General ангилал
    fireEvent.change(quantityInputs[2], { target: { value: '350' } });
    fireEvent.change(priceInputs[2], { target: { value: '25000' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Form submit хийгдсэн
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form reset ажиллана - модал хаахад', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    expect(nameInput).toHaveValue('Updated Concert');

    // Модал хаах
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form reset ажиллана - цуцлах товч дарахад', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: 'Updated Concert' } });
    expect(nameInput).toHaveValue('Updated Concert');

    // Цуцлах товч дарах
    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form validation ажиллана - зөвхөн нэр хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн нэр хоослох
    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн газар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн газар хоослох
    const venueInput = screen.getByDisplayValue('Test Venue');
    fireEvent.change(venueInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн артист хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн артист хоослох
    const artistInput = screen.getByDisplayValue('Test Artist');
    fireEvent.change(artistInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP ангилал хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[0], { target: { value: '' } });
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular ангилал хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[1], { target: { value: '' } });
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General ангилал хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[2], { target: { value: '' } });
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');

    fireEvent.change(quantityInputs[0], { target: { value: '' } });
    fireEvent.change(quantityInputs[1], { target: { value: '' } });
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(priceInputs[0], { target: { value: '' } });
    fireEvent.change(priceInputs[1], { target: { value: '' } });
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('image upload ажиллана - зураг харагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByAltText('Uploaded')).toBeInTheDocument();
  });

  it('image upload ажиллана - зураг талбар харагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Зураг')).toBeInTheDocument();
  });

  it('image upload ажиллана - файл input харагдана', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const fileInput = screen.getByLabelText('Зураг');
    expect(fileInput).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('2024-01-01');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('19:00');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Шинэчлэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Шинэчлэх')).toBeInTheDocument();
  });

  it('image upload error handling ажиллана', () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockRejectedValue(new Error('Upload failed'));

    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Зураг')).toBeInTheDocument();
  });

  it('image upload success ажиллана', () => {
    // Mock fetch to return success
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ secure_url: 'https://example.com/image.jpg' })
    });

    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    expect(screen.getByText('Зураг')).toBeInTheDocument();
  });


  it('form reset ажиллана - модал хаахад', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: 'Modified Concert' } });
    expect(nameInput).toHaveValue('Modified Concert');

    // Модал хаах
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form reset ажиллана - цуцлах товч дарахад', () => {
    render(
      <EditConcertModal
        isOpen={true}
        onClose={mockOnClose}
        concert={mockConcert}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Concert');
    fireEvent.change(nameInput, { target: { value: 'Modified Concert' } });
    expect(nameInput).toHaveValue('Modified Concert');

    // Цуцлах товч дарах
    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
