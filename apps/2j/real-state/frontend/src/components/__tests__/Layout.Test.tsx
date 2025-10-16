import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Layout />);
    // Layout should render without crashing
    expect(document.body).toBeInTheDocument();
  });
});
