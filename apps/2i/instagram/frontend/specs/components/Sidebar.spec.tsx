import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '@/components/Sidebar/Sidebar';

// Mock all dependencies
jest.mock('next/image', () => ({ __esModule: true, default: (props) => <img {...props} /> }));
jest.mock('lucide-react', () => ({ AlignJustify: () => <div data-testid="menu-icon" /> }));
jest.mock('@/components/Sidebar/SidebarHeader', () => ({ SidebarHeader: ({ isCollapsed }) => <div data-testid="header">{isCollapsed ? 'collapsed' : 'expanded'}</div> }));
jest.mock('@/components/Sidebar/SidebarMenu', () => ({
  SidebarMenu: ({ onPanelToggle, onExpandClick }) => (
    <div>
      <button onClick={() => onPanelToggle('search')} data-testid="search-btn">
        Search
      </button>
      <button onClick={() => onPanelToggle('notification')} data-testid="notification-btn">
        Notification
      </button>
      <button onClick={onExpandClick} data-testid="expand-btn">
        Expand
      </button>
    </div>
  ),
}));
jest.mock('@/components/Sidebar/SearchPanel', () => ({ SearchPanel: ({ isVisible }) => <div data-testid="search-panel" style={{ display: isVisible ? 'block' : 'none' }} /> }));
jest.mock('@/components/Sidebar/NotificationPanel', () => ({ NotificationPanel: ({ isVisible }) => <div data-testid="notification-panel" style={{ display: isVisible ? 'block' : 'none' }} /> }));

describe('Sidebar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders expanded by default', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('header')).toHaveTextContent('expanded');
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('collapses when menu clicked', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByText('Menu')));
    expect(screen.getByTestId('header')).toHaveTextContent('collapsed');
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  test('expands when menu clicked while collapsed', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByText('Menu')));
    act(() => fireEvent.click(screen.getByTestId('menu-icon')));
    expect(screen.getByTestId('header')).toHaveTextContent('expanded');
  });

  test('opens search panel and collapses sidebar', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByTestId('search-btn')));
    expect(screen.getByTestId('header')).toHaveTextContent('collapsed');
    expect(screen.getByTestId('search-panel')).toHaveStyle('display: block');
    expect(screen.getByTestId('notification-panel')).toHaveStyle('display: none');
  });

  test('opens notification panel and collapses sidebar', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByTestId('notification-btn')));
    expect(screen.getByTestId('header')).toHaveTextContent('collapsed');
    expect(screen.getByTestId('notification-panel')).toHaveStyle('display: block');
    expect(screen.getByTestId('search-panel')).toHaveStyle('display: none');
  });

  test('switches between panels when collapsed', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByTestId('search-btn')));
    act(() => fireEvent.click(screen.getByTestId('notification-btn')));
    expect(screen.getByTestId('notification-panel')).toHaveStyle('display: block');
    expect(screen.getByTestId('search-panel')).toHaveStyle('display: none');
  });

  test('closes panel and expands on double click', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByTestId('search-btn')));
    act(() => fireEvent.click(screen.getByTestId('search-btn')));
    expect(screen.getByTestId('search-panel')).toHaveStyle('display: none');
    act(() => jest.advanceTimersByTime(300));
    expect(screen.getByTestId('header')).toHaveTextContent('expanded');
  });

  test('expand button resets to expanded state', () => {
    render(<Sidebar />);
    act(() => fireEvent.click(screen.getByTestId('search-btn')));
    act(() => fireEvent.click(screen.getByTestId('expand-btn')));
    expect(screen.getByTestId('header')).toHaveTextContent('expanded');
    expect(screen.getByTestId('search-panel')).toHaveStyle('display: none');
  });

  test('has correct CSS classes', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar-container');
    expect(sidebar).toHaveClass('w-64 px-4');

    act(() => fireEvent.click(screen.getByText('Menu')));
    expect(sidebar).toHaveClass('w-20', 'px-2');
  });
});
