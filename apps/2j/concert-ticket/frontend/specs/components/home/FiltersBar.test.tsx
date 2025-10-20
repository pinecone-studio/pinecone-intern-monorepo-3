import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FiltersBar from '../../../src/components/home/FiltersBar';

describe('FiltersBar', () => {
  it('renders category select', () => {
    render(<FiltersBar />);
    expect(screen.getByText('Клуб')).toBeInTheDocument();
  });

  it('renders sort select', () => {
    render(<FiltersBar />);
    expect(screen.getByText('Эрэмбэ')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<FiltersBar />);
    expect(screen.getByText('Шүүлт')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<FiltersBar className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('has two select elements', () => {
    render(<FiltersBar />);
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('has one button', () => {
    render(<FiltersBar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });
});
