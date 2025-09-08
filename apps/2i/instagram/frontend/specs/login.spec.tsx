
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/login/page'
import { useLoginMutation } from '@/generated'
import { useAuth } from '@/app/Provider'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
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

  describe('UI Rendering', () => {
    it('renders main elements', () => {
      render(<LoginPage />)
      expect(screen.getByText('Instagram')).toBeInTheDocument()
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Phone number, username, or email')).toBeRequired()
      expect(screen.getByPlaceholderText('Password')).toBeRequired()
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
      expect(screen.getByText('Forgot password?')).toBeInTheDocument()
      expect(screen.getByText('Sign up')).toBeInTheDocument()
    })
  })

  describe('Input Behavior', () => {
    it('updates and clears inputs', async () => {
      const { user, email, password } = await setup()
      await user.type(email, 'first@test.com')
      await user.type(password, 'pass123')
      expect(email).toHaveValue('first@test.com')
      expect(password).toHaveValue('pass123')
      await user.clear(email)
      await user.type(email, 'second@test.com')
      expect(email).toHaveValue('second@test.com')
    })
  })

  describe('Authentication', () => {
    it('calls login mutation with correct data', async () => {
      const { user, email, password, button } = await setup()
      mockLogin.mockResolvedValue({ data: { login: { success: true } } })

      await user.type(email, 'test@example.com')
      await user.type(password, 'password123')
      await user.click(button)

      expect(mockLogin).toHaveBeenCalledWith({
        variables: { login: { email: 'test@example.com', password: 'password123' } },
      })
    })

    it('navigates and stores token on successful login', async () => {
      const { user, email, password, button } = await setup()
      mockLogin.mockResolvedValue({ data: { login: { token: 'fake-token' } } })

      await user.type(email, 'success@test.com')
      await user.type(password, 'correctpass')
      await user.click(button)

      await waitFor(() => {
        expect(mockSetAuthToken).toHaveBeenCalledWith('fake-token')
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('handles login failure gracefully', async () => {
       // eslint-disable-next-line @typescript-eslint/no-empty-function
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const { user, email, password, button } = await setup()
      mockLogin.mockRejectedValue(new Error('Invalid credentials'))

      await user.type(email, 'wrong@test.com')
      await user.type(password, 'wrongpass')
      await user.click(button)

      await waitFor(() => expect(mockLogin).toHaveBeenCalled())
      expect(mockPush).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })
  describe('Loading and Error States', () => {
    it('displays loading', () => {
      (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { loading: true, error: null }]);
      (useAuth as jest.Mock).mockReturnValue({
        token: null,
        loading: true,
        login: mockSetAuthToken,
      });

      render(<LoginPage />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })
    it('shows form with error', () => {
      const testError = { message: 'Login failed' };
      (useLoginMutation as jest.Mock).mockReturnValue([
        mockLogin,
        { loading: false, error: testError },
      ]);
      render(<LoginPage />)
      expect(screen.getByText('Error: Login failed')).toBeInTheDocument()
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    })
  })
  it('redirects to home if token exists', () => {
  (useAuth as jest.Mock).mockReturnValue({
    token: 'fake-token', 
    loading: false,
    login: mockSetAuthToken,
  });
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  render(<LoginPage />)
  expect(mockPush).toHaveBeenCalledWith('/') 
  expect(screen.queryByTestId('login-form')).not.toBeInTheDocument() 
})

})
