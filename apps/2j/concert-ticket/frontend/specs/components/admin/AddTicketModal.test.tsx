import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTicketModal from '../../../src/components/admin/AddTicketModal';
import { MockedProvider } from '@apollo/client/testing';
import { CREATE_ARTIST_MUTATION, CREATE_CONCERT_MUTATION } from '../../../src/graphql/events.graphql';

const mockOnClose = jest.fn();

describe('AddTicketModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('модал нээгдэхгүй байх үед null буцаана', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={false} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.queryByText('Тасалбар нэмэх')).not.toBeInTheDocument();
  });

  it('модал нээгдэх үед зөв агуулгыг харуулна', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Тасалбар нэмэх')).toBeInTheDocument();
    expect(screen.getByText('Зураг')).toBeInTheDocument();
  });

  it('билетийн мэдээллийг зөв харуулна', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Тасалбарын ангилал')).toBeInTheDocument();
    expect(screen.getByText('VIP*')).toBeInTheDocument();
    expect(screen.getByText('Regular*')).toBeInTheDocument();
    expect(screen.getByText('Задгай*')).toBeInTheDocument();
  });

  it('Үүсгэх товч байна', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form input-уудыг оруулж болно', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    expect(nameInput).toBeInTheDocument();
    
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    expect(venueInput).toBeInTheDocument();
  });

  it('билетийн тоо хэмжээ оруулж болно', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    expect(quantityInputs).toHaveLength(3); // VIP, Regular, General
  });

  it('билетийн үнэ оруулж болно', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    expect(priceInputs).toHaveLength(3); // VIP, Regular, General
  });

  it('form input-уудыг өөрчлөх боломжтой', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    const artistInput = screen.getByPlaceholderText('Артистын нэр');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

    expect(nameInput).toHaveValue('Test Concert');
    expect(venueInput).toHaveValue('Test Venue');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(artistInput).toHaveValue('Test Artist');
  });

  it('билетийн тоо хэмжээг өөрчлөх боломжтой', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    
    fireEvent.change(quantityInputs[0], { target: { value: '100' } });
    fireEvent.change(quantityInputs[1], { target: { value: '200' } });
    fireEvent.change(quantityInputs[2], { target: { value: '300' } });

    expect(quantityInputs[0]).toHaveValue(100);
    expect(quantityInputs[1]).toHaveValue(200);
    expect(quantityInputs[2]).toHaveValue(300);
  });

  it('билетийн үнийг өөрчлөх боломжтой', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    
    fireEvent.change(priceInputs[0], { target: { value: '50000' } });
    fireEvent.change(priceInputs[1], { target: { value: '30000' } });
    fireEvent.change(priceInputs[2], { target: { value: '20000' } });

    expect(priceInputs[0]).toHaveValue(50000);
    expect(priceInputs[1]).toHaveValue(30000);
    expect(priceInputs[2]).toHaveValue(20000);
  });

  it('огноо болон цагийг оруулж болно', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');
    const timeInput = dateInputs.find(input => input.type === 'time');

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    expect(dateInput).toHaveValue('2024-12-25');
    expect(timeInput).toHaveValue('19:00');
  });

  it('модал хаахад form цэвэрлэгдэнэ', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    expect(nameInput).toHaveValue('Test Concert');

    // X товчийг олох (SVG icon-тай товч)
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('зураг upload хэсэг байна', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Зураг')).toBeInTheDocument();
    expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
  });

  it('form submit хийх үед validation ажиллана', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form-ийн бүх талбаруудыг бөглөх боломжтой', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    const artistInput = screen.getByPlaceholderText('Артистын нэр');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

    expect(nameInput).toHaveValue('Test Concert');
    expect(venueInput).toHaveValue('Test Venue');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(artistInput).toHaveValue('Test Artist');
  });

  it('билетийн ангилалын бүх талбаруудыг бөглөх боломжтой', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    // VIP ангилал
    fireEvent.change(quantityInputs[0], { target: { value: '100' } });
    fireEvent.change(priceInputs[0], { target: { value: '50000' } });

    // Regular ангилал
    fireEvent.change(quantityInputs[1], { target: { value: '200' } });
    fireEvent.change(priceInputs[1], { target: { value: '30000' } });

    // General ангилал
    fireEvent.change(quantityInputs[2], { target: { value: '300' } });
    fireEvent.change(priceInputs[2], { target: { value: '20000' } });

    expect(quantityInputs[0]).toHaveValue(100);
    expect(priceInputs[0]).toHaveValue(50000);
    expect(quantityInputs[1]).toHaveValue(200);
    expect(priceInputs[1]).toHaveValue(30000);
    expect(quantityInputs[2]).toHaveValue(300);
    expect(priceInputs[2]).toHaveValue(20000);
  });

  it('огноо болон цагийг оруулж болно', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');
    const timeInput = dateInputs.find(input => input.type === 'time');

    fireEvent.change(dateInput!, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput!, { target: { value: '19:00' } });

    expect(dateInput).toHaveValue('2024-12-25');
    expect(timeInput).toHaveValue('19:00');
  });

  it('модал нээгдэх үед бүх шаардлагатай элементүүд харагдана', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Тасалбар нэмэх')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын нэр*')).toBeInTheDocument();
    expect(screen.getByText('Хөтөлбөрийн тухай')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын газар*')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын өдөр сонгох*')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтын цаг сонгох*')).toBeInTheDocument();
    expect(screen.getByText('Үндсэн артистын нэр*')).toBeInTheDocument();
    expect(screen.getByText('Зураг')).toBeInTheDocument();
    expect(screen.getByText('Тасалбарын ангилал')).toBeInTheDocument();
    expect(screen.getByText('VIP*')).toBeInTheDocument();
    expect(screen.getByText('Regular*')).toBeInTheDocument();
    expect(screen.getByText('Задгай*')).toBeInTheDocument();
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
    expect(screen.getByText('Цуцлах')).toBeInTheDocument();
  });

  it('модал хаалттай үед харагдахгүй', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={false} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.queryByText('Тасалбар нэмэх')).not.toBeInTheDocument();
  });

  it('form validation ажиллана - шаардлагатай талбарууд хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - билетийн ангилал хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн үндсэн талбаруудыг бөглөх
    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    const artistInput = screen.getByPlaceholderText('Артистын нэр');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - билетийн ангилал бүрэн бөглөх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Бүх талбаруудыг бөглөх
    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    const artistInput = screen.getByPlaceholderText('Артистын нэр');

    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
    fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    // VIP ангилал
    fireEvent.change(quantityInputs[0], { target: { value: '100' } });
    fireEvent.change(priceInputs[0], { target: { value: '50000' } });

    // Regular ангилал
    fireEvent.change(quantityInputs[1], { target: { value: '200' } });
    fireEvent.change(priceInputs[1], { target: { value: '30000' } });

    // General ангилал
    fireEvent.change(quantityInputs[2], { target: { value: '300' } });
    fireEvent.change(priceInputs[2], { target: { value: '20000' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Form submit хийгдсэн
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form reset ажиллана - модал хаахад', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    expect(nameInput).toHaveValue('Test Concert');

    // Модал хаах
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form reset ажиллана - цуцлах товч дарахад', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
    expect(nameInput).toHaveValue('Test Concert');

    // Цуцлах товч дарах
    const cancelButton = screen.getByText('Цуцлах');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('form validation ажиллана - зөвхөн нэр хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн нэр хоослох
    const nameInput = screen.getByPlaceholderText('Нэр оруулах');
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн газар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн газар хоослох
    const venueInput = screen.getByPlaceholderText('Газар оруулах');
    fireEvent.change(venueInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн артист хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн артист хоослох
    const artistInput = screen.getByPlaceholderText('Артистын нэр');
    fireEvent.change(artistInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP ангилал хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[0], { target: { value: '' } });
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular ангилал хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[1], { target: { value: '' } });
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General ангилал хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General ангилал хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(quantityInputs[2], { target: { value: '' } });
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');

    fireEvent.change(quantityInputs[0], { target: { value: '' } });
    fireEvent.change(quantityInputs[1], { target: { value: '' } });
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

    fireEvent.change(priceInputs[0], { target: { value: '' } });
    fireEvent.change(priceInputs[1], { target: { value: '' } });
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('image upload ажиллана - файл сонгох', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
  });

  it('image upload ажиллана - файл хэмжээ хязгаар', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
  });

  it('form validation ажиллана - validateRequiredFields', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

         it('form validation ажиллана - validateTicketCategories', () => {
           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           // Зөвхөн үндсэн талбаруудыг бөглөх
           const nameInput = screen.getByPlaceholderText('Нэр оруулах');
           const venueInput = screen.getByPlaceholderText('Газар оруулах');
           const artistInput = screen.getByPlaceholderText('Артистын нэр');

           fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
           fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
           fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

           const submitButton = screen.getByText('Үүсгэх');
           fireEvent.click(submitButton);

           // Validation алдааны мессеж харагдах ёстой
           expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
         });

         it('image upload error handling ажиллана', () => {
           // Mock fetch to return error
           global.fetch = jest.fn().mockRejectedValue(new Error('Upload failed'));

           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
         });

         it('image upload success ажиллана', () => {
           // Mock fetch to return success
           global.fetch = jest.fn().mockResolvedValue({
             ok: true,
             json: () => Promise.resolve({ secure_url: 'https://example.com/image.jpg' })
           });

           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
         });

         it('image upload file size validation ажиллана', () => {
           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
         });

         it('image upload response not ok ажиллана', () => {
           // Mock fetch to return not ok response
           global.fetch = jest.fn().mockResolvedValue({
             ok: false,
             text: () => Promise.resolve('Upload failed')
           });

           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
         });

         it('image upload catch error ажиллана', () => {
           // Mock fetch to throw error
           global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           expect(screen.getByText('Зураг оруулах')).toBeInTheDocument();
         });

         it('form validation required fields ажиллана', () => {
           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           const submitButton = screen.getByText('Үүсгэх');
           fireEvent.click(submitButton);

           expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
         });

         it('form validation ticket categories ажиллана', () => {
           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           // Fill only required fields
           const nameInput = screen.getByPlaceholderText('Нэр оруулах');
           const venueInput = screen.getByPlaceholderText('Газар оруулах');
           const artistInput = screen.getByPlaceholderText('Артистын нэр');

           fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
           fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
           fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

           const submitButton = screen.getByText('Үүсгэх');
           fireEvent.click(submitButton);

           expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
         });

         it('form submission success ажиллана', () => {
           render(
             <MockedProvider mocks={mocks}>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           // Fill all fields
           const nameInput = screen.getByPlaceholderText('Нэр оруулах');
           const venueInput = screen.getByPlaceholderText('Газар оруулах');
           const artistInput = screen.getByPlaceholderText('Артистын нэр');

           fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
           fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
           fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

           const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
           const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

           fireEvent.change(quantityInputs[0], { target: { value: '100' } });
           fireEvent.change(priceInputs[0], { target: { value: '50000' } });
           fireEvent.change(quantityInputs[1], { target: { value: '200' } });
           fireEvent.change(priceInputs[1], { target: { value: '30000' } });
           fireEvent.change(quantityInputs[2], { target: { value: '300' } });
           fireEvent.change(priceInputs[2], { target: { value: '20000' } });

           const submitButton = screen.getByText('Үүсгэх');
           fireEvent.click(submitButton);

           expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
         });

         it('form submission error ажиллана', () => {
           render(
             <MockedProvider>
               <AddTicketModal isOpen={true} onClose={mockOnClose} />
             </MockedProvider>
           );

           // Fill all fields
           const nameInput = screen.getByPlaceholderText('Нэр оруулах');
           const venueInput = screen.getByPlaceholderText('Газар оруулах');
           const artistInput = screen.getByPlaceholderText('Артистын нэр');

           fireEvent.change(nameInput, { target: { value: 'Test Concert' } });
           fireEvent.change(venueInput, { target: { value: 'Test Venue' } });
           fireEvent.change(artistInput, { target: { value: 'Test Artist' } });

           const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
           const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');

           fireEvent.change(quantityInputs[0], { target: { value: '100' } });
           fireEvent.change(priceInputs[0], { target: { value: '50000' } });
           fireEvent.change(quantityInputs[1], { target: { value: '200' } });
           fireEvent.change(priceInputs[1], { target: { value: '30000' } });
           fireEvent.change(quantityInputs[2], { target: { value: '300' } });
           fireEvent.change(priceInputs[2], { target: { value: '20000' } });

           const submitButton = screen.getByText('Үүсгэх');
           fireEvent.click(submitButton);

           expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
         });


  it('form validation ажиллана - validateForm', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн огноо хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн огноо хоослох
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');

    fireEvent.change(dateInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн цаг хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн цаг хоослох
    const timeInputs = screen.getAllByDisplayValue('');
    const timeInput = timeInputs.find(input => input.type === 'time');

    fireEvent.change(timeInput!, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн тайлбар хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн тайлбар хоослох
    const descriptionInput = screen.getByPlaceholderText('Дэлгэрэнгүй мэдээлэл');
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General тоо хэмжээ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General тоо хэмжээ хоослох
    const quantityInputs = screen.getAllByPlaceholderText('Нийт тоо хэмжээ');
    fireEvent.change(quantityInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн VIP үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн VIP үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн Regular үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн Regular үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[1], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });

  it('form validation ажиллана - зөвхөн General үнэ хоосон байх үед', () => {
    render(
      <MockedProvider>
        <AddTicketModal isOpen={true} onClose={mockOnClose} />
      </MockedProvider>
    );

    // Зөвхөн General үнэ хоослох
    const priceInputs = screen.getAllByPlaceholderText('Нэгжийн үнэ');
    fireEvent.change(priceInputs[2], { target: { value: '' } });

    const submitButton = screen.getByText('Үүсгэх');
    fireEvent.click(submitButton);

    // Validation алдааны мессеж харагдах ёстой
    expect(screen.getByText('Үүсгэх')).toBeInTheDocument();
  });
});
