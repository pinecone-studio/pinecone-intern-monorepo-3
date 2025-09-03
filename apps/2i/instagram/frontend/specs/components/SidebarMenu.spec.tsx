import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarMenu } from '@/components/Sidebar/SidebarMenu';
import React from 'react';

// Mock next/image since it uses lazy loading and needs mocking in Jest
jest.mock('next/image', () => {
  const Image = (props: any) => <img {...props} />;
  Image.displayName = 'NextImage';
  return Image;
});

describe('SidebarMenu Component', () => {
  const onExpandClick = jest.fn();
  const onPanelToggle = jest.fn();

  const setup = (isCollapsed: boolean, activePanel: 'search' | 'notification' | null = null) => {
    render(<SidebarMenu isCollapsed={isCollapsed} activePanel={activePanel} onExpandClick={onExpandClick} onPanelToggle={onPanelToggle} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all menu items when expanded', () => {
    setup(false);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Notification')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('does not render labels when collapsed', () => {
    setup(true);

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Notification')).not.toBeInTheDocument();
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    // Icons or img should still exist (e.g. profile icon)
    const profileImg = screen.getByAltText('profile');
    expect(profileImg).toBeInTheDocument();
  });

  it('triggers correct callbacks on item click', () => {
    setup(false);

    fireEvent.click(screen.getByText('Home'));
    expect(onExpandClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Search'));
    expect(onPanelToggle).toHaveBeenCalledWith('search');

    fireEvent.click(screen.getByText('Notification'));
    expect(onPanelToggle).toHaveBeenCalledWith('notification');

    fireEvent.click(screen.getByText('Create'));
    expect(onExpandClick).toHaveBeenCalledTimes(2); // Called again

    fireEvent.click(screen.getByText('Profile'));
    expect(onExpandClick).toHaveBeenCalledTimes(3);
  });

  it('applies active class to active panel', () => {
    setup(false, 'search');
    const searchItem = screen.getByText('Search').closest('div');
    expect(searchItem).toHaveClass('text-pink-500');
  });

  it('renders icon even when collapsed', () => {
    setup(true);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
