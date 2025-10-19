import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { RelatedConcerts } from '../../../src/components/detail/related-concerts';
import { HomeEventsDocument } from '../../../src/generated';

const mockData = {
  request: { query: HomeEventsDocument, variables: { limit: 6, offset: 0 } },
  result: {
    data: {
      concerts: {
        concerts: [
          { id: '1', name: 'Concert 1', date: '2024-12-25', time: '19:00', venue: 'Venue 1', image: '/img1.jpg', mainArtist: { name: 'Artist 1' }, ticketCategories: [{ unitPrice: 50000 }] },
          { id: '2', name: 'Concert 2', date: '2024-12-26', time: '20:00', venue: 'Venue 2', image: '/img2.jpg', mainArtist: { name: 'Artist 2' }, ticketCategories: [{ unitPrice: 60000 }] },
          { id: '3', name: 'Concert 3', date: '2024-12-27', time: '21:00', venue: 'Venue 3', image: '/img3.jpg', mainArtist: { name: 'Artist 3' }, ticketCategories: [{ unitPrice: 70000 }] },
          { id: '4', name: 'Concert 4', date: '2024-12-28', time: '22:00', venue: 'Venue 4', image: '/img4.jpg', mainArtist: { name: 'Artist 4' }, ticketCategories: [{ unitPrice: 80000 }] },
        ],
      },
    },
  },
};

describe('RelatedConcerts', () => {
  it('should render title after loading', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Холбоотой эвент болон тоглолтууд')).toBeInTheDocument());
  });

  it('should render concert names', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Concert 1')).toBeInTheDocument();
      expect(screen.getByText('Concert 2')).toBeInTheDocument();
      expect(screen.getByText('Concert 3')).toBeInTheDocument();
    });
  });

  it('should render venues', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Venue 1')).toBeInTheDocument());
  });

  it('should render prices', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('50,000₮')).toBeInTheDocument());
  });

  it('should exclude specified concert', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="1" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Concert 2'));
    expect(screen.queryByText('Concert 1')).not.toBeInTheDocument();
  });

  it('should limit to 3 concerts', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => screen.getByText('Concert 1'));
    expect(screen.getByText('Concert 3')).toBeInTheDocument();
    expect(screen.queryByText('Concert 4')).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    expect(screen.queryByText('Холбоотой эвент болон тоглолтууд')).not.toBeInTheDocument();
  });

  it('should handle error gracefully', async () => {
    const errorMock = { request: { query: HomeEventsDocument, variables: { limit: 6, offset: 0 } }, error: new Error('Failed') };
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.queryByText('Холбоотой эвент болон тоглолтууд')).not.toBeInTheDocument());
  });

  it('should handle empty concerts', async () => {
    const emptyMock = { request: { query: HomeEventsDocument, variables: { limit: 6, offset: 0 } }, result: { data: { concerts: { concerts: [] } } } };
    render(
      <MockedProvider mocks={[emptyMock]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.queryByText('Холбоотой эвент болон тоглолтууд')).not.toBeInTheDocument());
  });

  it('should render concert images', async () => {
    render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <RelatedConcerts excludeConcertId="test-id" />
      </MockedProvider>
    );
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });
});
