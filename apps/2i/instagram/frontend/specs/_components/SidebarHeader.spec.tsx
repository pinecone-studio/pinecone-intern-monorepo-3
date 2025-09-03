import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarHeader } from '@/_components/Sidebar/SidebarHeader';
/* eslint-disable @typescript-eslint/no-empty-function */
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));
/* eslint-enable @typescript-eslint/no-empty-function */
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
});

afterAll(() => {
  /* noop */
  (console.error as jest.Mock).mockRestore();
});

describe('SidebarHeader', () => {
  it('renders full logo when not collapsed', () => {
    render(<SidebarHeader isCollapsed={false} />);
    const logo = screen.getByAltText('logo') as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain('/insta.png');
  });

  it('renders small logo when collapsed', () => {
    render(<SidebarHeader isCollapsed={true} />);
    const logo = screen.getByAltText('logo small') as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain('/insta-icon.png');
  });
});
