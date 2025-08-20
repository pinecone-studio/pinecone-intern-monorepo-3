
export const mockPush = jest.fn();
export const mockReplace = jest.fn();
export const mockRefresh = jest.fn();
export const mockPrefetch = jest.fn();


export { mockPush as pushMock };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
  usePathname: () => '/(auth)/signup',
}));
