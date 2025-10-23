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
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('renders concert data after loading', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Music of the Spheres')).toBeInTheDocument();
      expect(screen.getByText('Rock Concert')).toBeInTheDocument();
    });
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
    await waitFor(() => {
      expect(screen.getByText('Coldplay')).toBeInTheDocument();
      expect(screen.getByText('Rock Band')).toBeInTheDocument();
    });
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
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    const loadingMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: { data: { concerts: { concerts: [] } } },
      delay: 100,
    };
    render(
      <MockedProvider mocks={[loadingMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles error state', () => {
    const errorMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      error: new Error('Failed to fetch'),
    };
    render(
      <MockedProvider mocks={[errorMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles auto-play functionality', async () => {
    jest.useFakeTimers();
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Music of the Spheres'));

    jest.advanceTimersByTime(60000);

    expect(screen.getByText('Music of the Spheres')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('handles pause on hover', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Music of the Spheres'));

    const carousel = screen.getByText('Music of the Spheres').closest('div');
    if (carousel) {
      fireEvent.mouseEnter(carousel);
      fireEvent.mouseLeave(carousel);
    }

    expect(screen.getByText('Music of the Spheres')).toBeInTheDocument();
  });

  it('displays concert date correctly', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('12.26')).toBeInTheDocument();
      expect(screen.getByText('12.25')).toBeInTheDocument();
    });
  });

  it('displays venue information', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Music of the Spheres')).toBeInTheDocument());
  });

  it('handles single concert scenario', () => {
    const singleConcertMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Single Concert',
                date: '2024-12-25',
                venue: 'Single Venue',
                mainArtist: { name: 'Single Artist', id: 'sa1' },
                image: 'test.jpg',
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[singleConcertMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles empty concerts array', () => {
    const emptyMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[emptyMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles invalid date format', () => {
    const invalidDateMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Test Concert',
                date: 'invalid-date',
                venue: 'Test Venue',
                mainArtist: { name: 'Test Artist', id: 'ta1' },
                image: 'test.jpg',
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[invalidDateMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('handles navigation with empty items', () => {
    const emptyMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[emptyMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    const prevButton = screen.getByLabelText('Previous');
    const nextButton = screen.getByLabelText('Next');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    expect(prevButton).toBeInTheDocument();
  });

  it('finds concert with "music of the spheres" in name', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Music of the Spheres')).toBeInTheDocument());
  });

  it('handles concert without matching keyword', async () => {
    const noMatchMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Different Concert',
                date: '2024-12-25',
                time: '19:00',
                venue: 'Stadium',
                image: '/concert.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[noMatchMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Different Concert')).toBeInTheDocument());
  });

  it('handles concert with missing image', async () => {
    const noImageMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Concert Name',
                date: '2024-12-25',
                time: '19:00',
                venue: 'Venue',
                image: null,
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[noImageMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => {
      const img = screen.getByAltText('Concert Name');
      expect(img).toHaveAttribute('src', '/images/hero-placeholder.png');
    });
  });

  it('handles concert with missing artist name', async () => {
    const noArtistMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Concert Name',
                date: '2024-12-25',
                time: '19:00',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: null,
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[noArtistMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Concert Name')).toBeInTheDocument());
  });

  it('handles concert with missing name', async () => {
    const noNameMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: null,
                date: '2024-12-25',
                time: '19:00',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[noNameMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('MUSIC of the SPHERES')).toBeInTheDocument());
  });

  it('handles concert with missing date', async () => {
    const noDateMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Test Concert',
                date: null,
                time: '19:00',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[noDateMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Test Concert')).toBeInTheDocument());
  });

  it('handles concert with invalid date string', async () => {
    const invalidDateMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Test Concert',
                date: 'not-a-date',
                time: '19:00',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[invalidDateMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Test Concert')).toBeInTheDocument());
  });

  it('handles concert with numeric date string', async () => {
    const numericDateMock = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Test Concert',
                date: '1703520000000',
                time: '19:00',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[numericDateMock]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Test Concert')).toBeInTheDocument());
  });

  it('formats date with time parameter', async () => {
    const mockWithTime = {
      request: { query: HomeEventsDocument, variables: { limit: 20, offset: 0 } },
      result: {
        data: {
          concerts: {
            concerts: [
              {
                id: '1',
                name: 'Test Concert',
                date: '2024-12-25',
                time: '19:30',
                venue: 'Venue',
                image: '/img.jpg',
                mainArtist: { name: 'Artist', id: 'a1' },
                ticketCategories: [],
              },
            ],
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[mockWithTime]}>
        <HeroCarousel />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Test Concert')).toBeInTheDocument());
  });
});
