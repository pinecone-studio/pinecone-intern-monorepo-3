import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FiltersBar from '../../../src/components/home/FiltersBar';

describe('FiltersBar', () => {
  it('filters bar-ийн агуулгыг зөв харуулна', () => {
    render(<FiltersBar />);

    expect(screen.getByText('Клуб')).toBeInTheDocument();
    expect(screen.getByText('Эрэмбэ')).toBeInTheDocument();
    expect(screen.getByText('Шүүлт')).toBeInTheDocument();
  });

  it('className prop-г зөв ашиглана', () => {
    render(<FiltersBar className="custom-class" />);

    const filtersBar = screen.getByText('Клуб').closest('div')?.parentElement;
    expect(filtersBar).toHaveClass('custom-class');
  });
});