
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/login/page'
import { useLoginMutation } from '@/generated'
import { useAuth } from '@/app/Provider'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'Link'
  return MockLink
})
jest.mock('@/generated', () => ({ useLoginMutation: jest.fn() }))
jest.mock('@/app/Provider', () => ({
  useAuth: jest.fn(),
}))
jest.mock('@/generated', () => ({
  useLoginMutation: jest.fn(),
}))
jest.mock('@/app/Provider', () => ({
  useAuth: jest.fn(),
}))
 


describe('LoginPage Component', () => {
  const mockPush = jest.fn()
  const mockLogin = jest.fn()
  const mockSetAuthToken = jest.fn()

  const setup = async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    const email = screen.getByPlaceholderText('Phone number, username, or email')
    const password = screen.getByPlaceholderText('Password')
    const button = screen.getByRole('button', { name: /log in/i })
    return { user, email, password, button }
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { loading: false, error: null },
    ])
    ;(useAuth as jest.Mock).mockReturnValue({
      token: null,
      loading: false,
      login: mockSetAuthToken,
    })
  })

  it('renders UI correctly', () => {
    render(<LoginPage />)
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone number, username, or email')).toBeRequired()
    expect(screen.getByPlaceholderText('Password')).toBeRequired()
  })

  it('updates inputs when typing', async () => {
    const { user, email, password } = await setup()
    await user.type(email, 'test@example.com')
    await user.type(password, 'mypassword')
    expect(email).toHaveValue('test@example.com')
    expect(password).toHaveValue('mypassword')
  })
  it('calls login mutation with correct data', async () => {
    const { user, email, password, button } = await setup()
    mockLogin.mockResolvedValue({ data: { login: { token: 'fake-token' } } })
    await user.type(email, 'test@example.com')
    await user.type(password, 'mypassword')
    await user.click(button)
    expect(mockLogin).toHaveBeenCalledWith({
      variables: {
        login: { email: 'test@example.com', password: 'mypassword' },
      },
    })
  })
  it('sets token and navigates on successful login', async () => {
    const { user, email, password, button } = await setup()
    mockLogin.mockResolvedValue({ data: { login: { token: 'abc123' } } })
    await user.type(email, 'success@test.com')
    await user.type(password, 'correctpass')
    await user.click(button)
    await waitFor(() => {
      expect(mockSetAuthToken).toHaveBeenCalledWith('abc123')
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
  it('handles login error gracefully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const { user, email, password, button } = await setup()
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))
    await user.type(email, 'fail@test.com')
    await user.type(password, 'wrongpass')
    await user.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalled())
    expect(alertSpy).toHaveBeenCalledWith('Something went wrong!')
    spy.mockRestore()
    alertSpy.mockRestore()
  })
  it('renders loading state when loading is true', () => {
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { loading: true, error: null }]);
    (useAuth as jest.Mock).mockReturnValue({
      token: null,
      loading: true,
      login: mockSetAuthToken,
    });
    render(<LoginPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  it('returns null if token exists', () => {
    (useAuth as jest.Mock).mockReturnValue({
      token: 'existing-token',
      loading: false,
      login: mockSetAuthToken,
    });
    render(<LoginPage />)
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
  })
it('handles login with and without token correctly', async () => {
  const { user, email, password, button } = await setup();
  mockLogin.mockResolvedValue({ data: { login: { token: 'fake-token' } } });
  await user.type(email, 'test@example.com');
  await user.type(password, 'password123');
  await user.click(button);

  await waitFor(() => {
    expect(mockSetAuthToken).toHaveBeenCalledWith('fake-token');
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  jest.clearAllMocks();
  mockLogin.mockResolvedValue({ data: { login: { user: { email: 'test2@example.com' } } } });
  await user.clear(email);
  await user.clear(password);
  await user.type(email, 'test2@example.com');
  await user.type(password, 'password456');
  await user.click(button);

  await waitFor(() => {
    expect(mockSetAuthToken).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
})
