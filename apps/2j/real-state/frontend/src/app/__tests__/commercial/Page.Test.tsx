import { render, screen } from '@testing-library/react';
import CommercialPage from '../../commercial/page';

describe('CommercialPage', () => {
  it('renders commercial properties page', () => {
    render(<CommercialPage />);

    expect(screen.getByText('Commercial Properties')).toBeInTheDocument();
    expect(screen.getByText('Find the perfect commercial space for your business needs.')).toBeInTheDocument();
  });

  it('displays property categories', () => {
    render(<CommercialPage />);

    expect(screen.getByText('Office Spaces')).toBeInTheDocument();
    expect(screen.getByText('Retail Spaces')).toBeInTheDocument();
    expect(screen.getByText('Warehouses')).toBeInTheDocument();
  });

  it('has proper meta information', () => {
    render(<CommercialPage />);

    // Check that the page structure is correct
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Commercial Properties');
  });
});
