import { render, screen } from '@testing-library/react';
import LandPage from '../../land/page';

describe('LandPage', () => {
  it('renders land properties page', () => {
    render(<LandPage />);

    expect(screen.getByText('Land Properties')).toBeInTheDocument();
    expect(screen.getByText('Discover land opportunities for residential and commercial development.')).toBeInTheDocument();
  });

  it('displays land categories', () => {
    render(<LandPage />);

    expect(screen.getByText('Residential Land')).toBeInTheDocument();
    expect(screen.getByText('Commercial Land')).toBeInTheDocument();
    expect(screen.getByText('Agricultural Land')).toBeInTheDocument();
  });

  it('has proper meta information', () => {
    render(<LandPage />);

    // Check that the page structure is correct
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Land Properties');
  });
});
