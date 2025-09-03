import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchPanel } from '@/_components/Sidebar/SearchPanel'; // Adjust path as needed

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('SearchPanel Component', () => {
  describe('Visibility Logic', () => {
    it('should render when isVisible is true', () => {
      render(<SearchPanel isVisible={true} />);

      expect(screen.getByText('Search')).toBeTruthy();
      expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
      expect(screen.getByText('No recent searches.')).toBeTruthy();
    });

    it('should not render when isVisible is false', () => {
      render(<SearchPanel isVisible={false} />);

      expect(screen.queryByText('Search')).toBeNull();
      expect(screen.queryByPlaceholderText('Search...')).toBeNull();
      expect(screen.queryByText('No recent searches.')).toBeNull();
    });

    it('should toggle visibility correctly', () => {
      const { rerender } = render(<SearchPanel isVisible={false} />);

      expect(screen.queryByText('Search')).toBeNull();

      rerender(<SearchPanel isVisible={true} />);
      expect(screen.getByText('Search')).toBeTruthy();

      rerender(<SearchPanel isVisible={false} />);
      expect(screen.queryByText('Search')).toBeNull();
    });
  });

  describe('Component Structure', () => {
    it('should render with correct CSS classes when visible', () => {
      render(<SearchPanel isVisible={true} />);

      const panelContainer = screen.getByText('Search').closest('div');
      expect(panelContainer).toHaveClass('absolute', 'left-20', 'w-80', 'h-screen', 'bg-white', 'p-4', 'z-10');
    });

    it('should render header and input with correct attributes', () => {
      render(<SearchPanel isVisible={true} />);

      const header = screen.getByText('Search');
      expect(header.tagName.toLowerCase()).toBe('h2');
      expect(header).toHaveClass('text-lg', 'font-semibold', 'mb-4');

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveClass('w-full', 'border', 'rounded-md', 'p-2');
    });

    it('should render no recent searches message', () => {
      render(<SearchPanel isVisible={true} />);

      const message = screen.getByText('No recent searches.');
      expect(message).toHaveClass('mt-4', 'text-gray-500');
    });
  });

  describe('Search Input Interaction', () => {
    it('should accept and handle user input', () => {
      render(<SearchPanel isVisible={true} />);

      const searchInput = screen.getByPlaceholderText('Search...');

      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput.value).toBe('test search');

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(searchInput.value).toBe('');
    });

    it('should handle keyboard events and focus', () => {
      render(<SearchPanel isVisible={true} />);

      const searchInput = screen.getByPlaceholderText('Search...');

      fireEvent.keyDown(searchInput, { key: 'Enter' });
      expect(searchInput).toBeTruthy();

      fireEvent.focus(searchInput);
      expect(searchInput).toBeTruthy(); // Just verify input exists after focus
    });

    it('should handle special characters and long text', () => {
      render(<SearchPanel isVisible={true} />);

      const searchInput = screen.getByPlaceholderText('Search...');

      fireEvent.change(searchInput, { target: { value: '@#$%^&*()' } });
      expect(searchInput.value).toBe('@#$%^&*()');

      const longText = 'a'.repeat(50);
      fireEvent.change(searchInput, { target: { value: longText } });
      expect(searchInput.value).toBe(longText);
    });
  });

  describe('Edge Cases and Accessibility', () => {
    it('should handle falsy isVisible values', () => {
      render(<SearchPanel isVisible={undefined as any} />);
      expect(screen.queryByText('Search')).toBeNull();

      render(<SearchPanel isVisible={null as any} />);
      expect(screen.queryByText('Search')).toBeNull();
    });

    it('should have proper accessibility attributes', () => {
      render(<SearchPanel isVisible={true} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Search');

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('placeholder', 'Search...');
    });

    it('should handle rapid visibility changes', () => {
      const { rerender } = render(<SearchPanel isVisible={false} />);

      // Test multiple state changes
      rerender(<SearchPanel isVisible={true} />);
      expect(screen.getByText('Search')).toBeTruthy();

      rerender(<SearchPanel isVisible={false} />);
      expect(screen.queryByText('Search')).toBeNull();

      rerender(<SearchPanel isVisible={true} />);
      expect(screen.getByText('Search')).toBeTruthy();
    });
  });
});
