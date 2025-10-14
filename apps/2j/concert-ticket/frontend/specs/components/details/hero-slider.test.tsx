import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroSlider } from '../../../src/components/detail/hero-slider';

describe('HeroSlider', () => {
  const defaultProps = {
    title: 'MUSIC of the SPHERES',
    artist: 'coldplay',
    dates: ['10.31', '11.01', '11.02'],
  };

  it('should render hero slider with correct structure', () => {
    render(<HeroSlider {...defaultProps} />);

    expect(screen.getByTestId('hero-slider')).toBeInTheDocument();
    expect(screen.getByTestId('artist-name')).toHaveTextContent('coldplay');
    expect(screen.getByTestId('concert-title')).toHaveTextContent('MUSIC of the SPHERES');
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('should render dates correctly', () => {
    render(<HeroSlider {...defaultProps} />);

    const datesContainer = screen.getByTestId('dates');
    expect(datesContainer).toHaveTextContent('10.31');
    expect(datesContainer).toHaveTextContent('11.01');
    expect(datesContainer).toHaveTextContent('11.02');
  });

  it('should have correct height and styling classes', () => {
    render(<HeroSlider {...defaultProps} />);

    const slider = screen.getByTestId('hero-slider');
    expect(slider).toHaveClass('w-full', 'h-[300px]', 'overflow-hidden');
  });

  it('should render with custom background image', () => {
    const customImage = 'https://example.com/custom-image.jpg';
    render(<HeroSlider {...defaultProps} backgroundImage={customImage} />);

    const slider = screen.getByTestId('hero-slider');
    expect(slider).toBeInTheDocument();
  });

  it('should handle single date correctly', () => {
    const singleDateProps = {
      ...defaultProps,
      dates: ['12.25'],
    };

    render(<HeroSlider {...singleDateProps} />);

    const datesContainer = screen.getByTestId('dates');
    expect(datesContainer).toHaveTextContent('12.25');
  });

  it('should handle long titles gracefully', () => {
    const longTitleProps = {
      ...defaultProps,
      title: 'VERY LONG CONCERT TITLE THAT MIGHT WRAP TO MULTIPLE LINES',
    };

    render(<HeroSlider {...longTitleProps} />);

    expect(screen.getByTestId('concert-title')).toHaveTextContent('VERY LONG CONCERT TITLE THAT MIGHT WRAP TO MULTIPLE LINES');
  });

  it('should render artist name with rounded border styling', () => {
    render(<HeroSlider {...defaultProps} />);

    const artistName = screen.getByTestId('artist-name');
    expect(artistName).toHaveClass('border', 'border-gray-300', 'rounded-full', 'px-3', 'py-1');
  });
});
