import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConcertSchedule } from '../../../src/components/detail/concert-schedule';

describe('ConcertSchedule', () => {
  const mockProps = {
    eventDate: '2024.11.15 - 11.18',
    eventTime: '19:00',
    venue: 'UG ARENA',
    specialArtists: ['Artist 1', 'Artist 2'],
    schedule: ['Door open: 18:00', 'Music start: 19:00'],
  };

  it('should render all schedule information', () => {
    render(<ConcertSchedule {...mockProps} />);

    expect(screen.getByText('Special Artist')).toBeInTheDocument();
    expect(screen.getByText('Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
    expect(screen.getByText('Тоглолтийн цагийн хуваарь:')).toBeInTheDocument();
    expect(screen.getByText('Door open: 18:00')).toBeInTheDocument();
    expect(screen.getByText('Music start: 19:00')).toBeInTheDocument();
    expect(screen.getByText('Stage plan:')).toBeInTheDocument();
    expect(screen.getByText('2024.11.15 - 11.18')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('UG ARENA')).toBeInTheDocument();
  });

  it('should render stage plan image', () => {
    render(<ConcertSchedule {...mockProps} />);

    const stageImage = screen.getByAltText('Stage Plan');
    expect(stageImage).toBeInTheDocument();
    expect(stageImage).toHaveAttribute('src', '/images/stage-plan.png');
  });
});
