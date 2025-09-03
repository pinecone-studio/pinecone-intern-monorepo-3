import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/login/page'
import { useLoginMutation } from '@/generated'
import '@testing-library/jest-dom'
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
  MockLink.displayName = 'Link'
  return MockLink
})
jest.mock('@/generated', () => ({ useLoginMutation: jest.fn() }))
describe('LoginPage Component', () => {
  const mockPush = jest.fn()
  const mockLogin = jest.fn()
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
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: null }])
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
    it('renders footer links', () => {
      render(<LoginPage />)
      expect(screen.getByText('Forgot password?')).toHaveAttribute('href', '/forgot')
      expect(screen.getByText('Sign up')).toHaveAttribute('href', '/signup')
      expect(screen.getByText('Learn more')).toHaveAttribute('href', '#')
      expect(screen.getByText('Terms')).toHaveAttribute('href', '#')
      expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '#')
      expect(screen.getByText(/People who use our service/)).toBeInTheDocument()
      expect(screen.getByText(/By logging in, you agree/)).toBeInTheDocument()
      expect(screen.getByText(/Don't have an account/)).toBeInTheDocument()
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
    it('handles long and special inputs', async () => {
      const { user, email, password } = await setup()
      const longEmail = 'a'.repeat(50) + '@example.com'
      const longPassword = 'b'.repeat(100)
      await user.type(email, 'user+test@example.co.uk')
      await user.type(password, 'P@ssw0rd!#$%')
      expect(email).toHaveValue('user+test@example.co.uk')
      expect(password).toHaveValue('P@ssw0rd!#$%')
      await user.clear(email)
      await user.clear(password)
      await user.type(email, longEmail)
      await user.type(password, longPassword)
      expect(email).toHaveValue(longEmail)
      expect(password).toHaveValue(longPassword)
    })
    it('maintains focus order', async () => {
      const { user } = await setup()
      await user.tab()
      expect(screen.getByPlaceholderText('Phone number, username, or email')).toHaveFocus()
      await user.tab()
      expect(screen.getByPlaceholderText('Password')).toHaveFocus()
      await user.tab()
      expect(screen.getByRole('button', { name: /log in/i })).toHaveFocus()
      await user.tab()
      expect(screen.getByText('Forgot password?')).toHaveFocus()
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
        variables: { login: { email: 'test@example.com', password: 'password123' } }
      })
    })
    it('navigates on successful login', async () => {
      const { user, email, password, button } = await setup()
      mockLogin.mockResolvedValue({ data: { login: { success: true } } })
      await user.type(email, 'success@test.com')
      await user.type(password, 'correctpass')
      await user.click(button)
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
    })
    it('handles login failure gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const spy = jest.spyOn(console, "error").mockImplementation(() => {})
      const { user, email, password, button } = await setup()
      mockLogin.mockRejectedValue(new Error('Invalid credentials'))
      await user.type(email, 'wrong@test.com')
      await user.type(password, 'wrongpass')
      await user.click(button)
      await waitFor(() => expect(mockLogin).toHaveBeenCalled())
      expect(mockPush).not.toHaveBeenCalled()
      spy.mockRestore()
    })
    it('prevents submission with incomplete form', async () => {
      const { user, email, password, button } = await setup()
      await user.click(button)
      expect(mockLogin).not.toHaveBeenCalled()
      await user.type(email, 'onlyemail@test.com')
      await user.click(button)
      expect(mockLogin).not.toHaveBeenCalled()
      await user.clear(email); await user.type(password, 'onlypass')
      await user.click(button)
      expect(mockLogin).not.toHaveBeenCalled()
    })
    it('submits with Enter key', async () => {
      const { user, email, password } = await setup()
      mockLogin.mockResolvedValue({ data: { login: { success: true } } })
      await user.type(email, 'enter@test.com')
      await user.type(password, 'enterpass{enter}')
      await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
        variables: { login: { email: 'enter@test.com', password: 'enterpass' } }
      }))
    })
  })
  describe('Loading and Error States', () => {
    it('displays loading', () => {
      (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { loading: true, error: null }]);
      render(<LoginPage />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })
    it('shows form with error', () => {
      const testError = { message: 'Login failed' };
      (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { loading: false, error: testError }])
      render(<LoginPage />)
      expect(screen.getByText('Error: Login failed')).toBeInTheDocument()
      expect(screen.getByTestId('login-form')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    })
  })
})
