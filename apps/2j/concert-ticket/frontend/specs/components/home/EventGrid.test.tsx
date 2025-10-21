import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EventGrid from '../../../src/components/home/EventGrid';
import { HomeEventsDocument } from '../../../src/generated';

const mockData = {
  request: { query: HomeEventsDocument, variables: { limit: 12, offset: 0 } },
  result: {
    data: {
      concerts: {
        concerts: [
          {
            id: '1',
            name: 'Concert 1',
            date: '2024-12-25',
            time: '19:00',
            venue: 'Venue 1',
            image: '/img1.jpg',
            mainArtist: { name: 'Artist 1', id: 'a1' },
            ticketCategories: [{ id: 't1', type: 'VIP', unitPrice: 100000, availableQuantity: 50 }],
          },
          {
            id: '2',
            name: 'Concert 2',
            date: '2024-12-26',
            time: '20:00',
            venue: 'Venue 2',
            image: '/img2.jpg',
            mainArtist: { name: 'Artist 2', id: 'a2' },
            ticketCategories: [{ id: 't2', type: 'REGULAR', unitPrice: 50000, availableQuantity: 100 }],
          },
        ],
      },
    },
  },
};

describe('EventGrid', () => {
  it('shows loading skeleton', () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <EventGrid />
      </MockedProvider>
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders concert cards after loading', async () => {
    render(
      <MockedProvider mocks={[mockData]}>
        <EventGrid />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Concert 1')).toBeInTheDocument());
    expect(screen.getByText('Concert 2')).toBeInTheDocument();
  });

  it('shows error message on failure', async () => {
    const errorMock = {
      request: { query: HomeEventsDocument, variables: { limit: 12, offset: 0 } },
      error: new Error('Network error'),
    };
    render(
      <MockedProvider mocks={[errorMock]}>
        <EventGrid />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Өгөгдөл татахад алдаа гарлаа.')).toBeInTheDocument());
  });

  it('renders with custom className', () => {
    const { container } = render(
      <MockedProvider mocks={[mockData]}>
        <EventGrid className="custom-class" />
      </MockedProvider>
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
