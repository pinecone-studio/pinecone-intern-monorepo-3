import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationPanel } from '@/components/Sidebar/NotificationPanel'; // Adjust path as needed

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('NotificationPanel Component', () => {
  describe('Visibility Logic', () => {
    it('should render when isVisible is true', () => {
      render(<NotificationPanel isVisible={true} />);

      expect(screen.getByText('Notifications')).toBeTruthy();
      expect(screen.getByText('No new notifications.')).toBeTruthy();
    });

    it('should not render when isVisible is false', () => {
      render(<NotificationPanel isVisible={false} />);

      expect(screen.queryByText('Notifications')).toBeNull();
      expect(screen.queryByText('No new notifications.')).toBeNull();
    });

    it('should toggle visibility correctly', () => {
      const { rerender } = render(<NotificationPanel isVisible={false} />);

      expect(screen.queryByText('Notifications')).toBeNull();

      rerender(<NotificationPanel isVisible={true} />);
      expect(screen.getByText('Notifications')).toBeTruthy();

      rerender(<NotificationPanel isVisible={false} />);
      expect(screen.queryByText('Notifications')).toBeNull();
    });

    it('should handle falsy isVisible values', () => {
      render(<NotificationPanel isVisible={undefined as any} />);
      expect(screen.queryByText('Notifications')).toBeNull();

      render(<NotificationPanel isVisible={null as any} />);
      expect(screen.queryByText('Notifications')).toBeNull();
    });
  });

  describe('Component Structure and Styling', () => {
    it('should render with correct CSS classes when visible', () => {
      render(<NotificationPanel isVisible={true} />);

      const panelContainer = screen.getByText('Notifications').closest('div');
      expect(panelContainer).toHaveClass('absolute', 'left-20', 'top-0', 'w-80', 'h-screen', 'border-r', 'border-gray-200', 'bg-white', 'p-4', 'z-10');
    });

    it('should render header with correct styling and attributes', () => {
      render(<NotificationPanel isVisible={true} />);

      const header = screen.getByText('Notifications');
      expect(header.tagName.toLowerCase()).toBe('h2');
      expect(header).toHaveClass('text-lg', 'font-semibold', 'mb-4');
    });

    it('should render no notifications message with correct styling', () => {
      render(<NotificationPanel isVisible={true} />);

      const message = screen.getByText('No new notifications.');
      expect(message).toHaveClass('text-gray-500');
    });
  });

  describe('Accessibility and Edge Cases', () => {
    it('should have proper accessibility attributes', () => {
      render(<NotificationPanel isVisible={true} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Notifications');
      expect(heading).toBeTruthy();
    });

    it('should handle visibility state changes', () => {
      const { rerender } = render(<NotificationPanel isVisible={false} />);

      // Start invisible
      expect(screen.queryByText('Notifications')).toBeNull();

      // Make visible
      rerender(<NotificationPanel isVisible={true} />);
      expect(screen.getByText('Notifications')).toBeTruthy();

      // Make invisible again
      rerender(<NotificationPanel isVisible={false} />);
      expect(screen.queryByText('Notifications')).toBeNull();
    });

    it('should maintain structure consistency when visible', () => {
      render(<NotificationPanel isVisible={true} />);

      // Check that all expected elements are present
      expect(screen.getByText('Notifications')).toBeTruthy();
      expect(screen.getByText('No new notifications.')).toBeTruthy();

      // Verify DOM structure
      const container = screen.getByText('Notifications').closest('div');
      const message = screen.getByText('No new notifications.');
      expect(container).toContainElement(message);
    });

    it('should not render content when invisible', () => {
      render(<NotificationPanel isVisible={false} />);

      // Should not render content when invisible
      expect(screen.queryByText('Notifications')).toBeNull();
      expect(screen.queryByText('No new notifications.')).toBeNull();
    });
  });

  describe('Animation Integration', () => {
    it('should render with motion div when visible', () => {
      render(<NotificationPanel isVisible={true} />);

      // Since framer-motion is mocked, we can verify the component renders
      const container = screen.getByText('Notifications').closest('div');
      expect(container).toBeTruthy();
    });

    it('should work with AnimatePresence wrapper', () => {
      const { rerender } = render(<NotificationPanel isVisible={true} />);

      expect(screen.getByText('Notifications')).toBeTruthy();

      // AnimatePresence should handle the visibility
      rerender(<NotificationPanel isVisible={false} />);
      expect(screen.queryByText('Notifications')).toBeNull();
    });
  });
});
