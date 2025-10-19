import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import HeroCarousel from '../../../src/components/home/HeroCarousel';
import { HomeEventsDocument } from '../../../src/generated';

const mockData = {
  request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
  result: {
    data: {
      concerts: {
        concerts: [
          {
            id: '1',
            name: 'Rock Concert',
            date: '2024-12-25',
            time: '19:00',
            venue: 'Stadium',
            image: '/rock.jpg',
            mainArtist: { name: 'Rock Band', id: 'rb1' },
            ticketCategories: [],
          },
          {
            id: '2',
            name: 'Music of the Spheres',
            date: '2024-12-26',
            time: '20:00',
            venue: 'Arena',
            image: '/coldplay.jpg',
            mainArtist: { name: 'Coldplay', id: 'cp1' },
            ticketCategories: [],
          },
        ],
      },
    },
  },
};

describe('HeroCarousel', () => {
  it('renders placeholder when no data', () => {
    render(
      <MockedProvider mocks={[]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByAltText('Hero')).toBeInTheDocument();
  });

  it('renders concert data after loading', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Music of the Spheres')).toBeInTheDocument());
  });

  it('renders navigation buttons', () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('navigates to next concert', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Music of the Spheres'));
    fireEvent.click(screen.getByLabelText('Next'));
    await waitFor(() => expect(screen.getByText('Rock Concert')).toBeInTheDocument());
  });

  it('navigates to previous concert', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Music of the Spheres'));
    fireEvent.click(screen.getByLabelText('Previous'));
    await waitFor(() => expect(screen.getByText('Rock Concert')).toBeInTheDocument());
  });

  it('renders artist name', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Coldplay')).toBeInTheDocument());
  });

  it('renders with custom className', () => {
    const { container } = render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel className="custom-hero" />
      </MockedProvider>
    );
    expect(container.querySelector('.custom-hero')).toBeInTheDocument();
  });

  it('handles empty concert list', () => {
    const emptyMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: { data: { concerts: { concerts: [] } } },
    };
    render(
      <MockedProvider mocks={[emptyMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByAltText('Hero')).toBeInTheDocument();
  });
});
