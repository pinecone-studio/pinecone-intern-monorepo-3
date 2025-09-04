import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import SignupPage from '@/app/signup/page'
import { useSignMutation } from '@/generated'
import '@testing-library/jest-dom'


jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/generated', () => ({ useSignMutation: jest.fn() }))

describe('SignupPage Component - Optimized Coverage', () => {
  const mockPush = jest.fn()
  const mockSign = jest.fn()

beforeEach(() => {
  jest.clearAllMocks();
  // Fixed: Removed unnecessary semicolon
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useSignMutation as jest.Mock).mockReturnValue([mockSign, { loading: false, error: null }])
})

  it('renders UI elements correctly', () => {
    render(<SignupPage />)
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByTestId('signup-page')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mobile Number or Email')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Full Name')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Username')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('required')
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('updates all input fields when user types', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByPlaceholderText('Mobile Number or Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe123')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')

    expect(screen.getByPlaceholderText('Mobile Number or Email')).toHaveValue('test@example.com')
    expect(screen.getByPlaceholderText('Full Name')).toHaveValue('John Doe')
    expect(screen.getByPlaceholderText('Username')).toHaveValue('johndoe123')
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password123')
  })

  describe('Form Submission', () => {
    it('calls mutation and navigates on success', async () => {
      const user = userEvent.setup()
      mockSign.mockResolvedValue({ data: { signup: { success: true } } })

      render(<SignupPage />)
      await user.type(screen.getByPlaceholderText('Mobile Number or Email'), 'success@test.com')
      await user.type(screen.getByPlaceholderText('Full Name'), 'Success User')
      await user.type(screen.getByPlaceholderText('Username'), 'successuser')
      await user.type(screen.getByPlaceholderText('Password'), 'successpass')

      await user.click(screen.getByRole('button', { name: /sign up/i }))

      expect(mockSign).toHaveBeenCalledWith({
        variables: {
          signup: {
            email: 'success@test.com',
            fullname: 'Success User',
            username: 'successuser',
            password: 'successpass'
          }
        }
      })
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/otpverify'))
    })

    it('handles error state gracefully', async () => {
      const user = userEvent.setup()
      const signupError = new Error('Signup failed')
      mockSign.mockRejectedValue(signupError)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      render(<SignupPage />)
      await user.type(screen.getByPlaceholderText('Mobile Number or Email'), 'error@test.com')
      await user.type(screen.getByPlaceholderText('Full Name'), 'Error User')
      await user.type(screen.getByPlaceholderText('Username'), 'erroruser')
      await user.type(screen.getByPlaceholderText('Password'), 'errorpass')

      await user.click(screen.getByRole('button', { name: /sign up/i }))
      await waitFor(() => expect(mockSign).toHaveBeenCalled())
      expect(mockPush).not.toHaveBeenCalled()


         await user.click(screen.getByRole('button', { name: /sign up/i }))

  
    await screen.findByText('Sign up') 
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to signup:',
      expect.any(Error)
    )

    errorSpy.mockRestore()
    })

    it('submits with Enter key and supports edge cases', async () => {
      const user = userEvent.setup()
      mockSign.mockResolvedValue({ data: { signup: { success: true } } })
        

      render(<SignupPage />)
      await user.type(screen.getByPlaceholderText('Mobile Number or Email'), 'enter@test.com')
      await user.type(screen.getByPlaceholderText('Full Name'), 'José María')
      await user.type(screen.getByPlaceholderText('Username'), 'user_name-123')
      const passwordInput = screen.getByPlaceholderText('Password')
      await user.type(passwordInput, 'P@ssw0rd!#${enter}')

      await waitFor(() => expect(mockSign).toHaveBeenCalled())
      
      
    })

    it('prevents empty form submission', async () => {
      const user = userEvent.setup()
      render(<SignupPage />)
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(mockSign).not.toHaveBeenCalled()
    })
  })

  describe('Loading and Error UI', () => {
    it('shows loading state', () => {
      (useSignMutation as jest.Mock).mockReturnValue([mockSign, { loading: true, error: null }]);
      render(<SignupPage />)
      expect(screen.getByRole('button')).toHaveTextContent('Signing up...')
    })

    it('shows error message', () => {
      const testError = { message: 'Username already exists' }
      ;(useSignMutation as jest.Mock).mockReturnValue([mockSign, { loading: false, error: testError }])
      render(<SignupPage />)
      expect(screen.getByText('Error: Username already exists')).toBeInTheDocument()
      
    })
  })

  it('renders footer links and texts', () => {
    render(<SignupPage />)
    expect(screen.getByText('Learn more')).toBeInTheDocument()
    expect(screen.getByText('Terms')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toHaveAttribute('href', '/login')
    expect(screen.getByText(/People who use our service/)).toBeInTheDocument()
    expect(screen.getByText(/By signing up, you agree to our/)).toBeInTheDocument()
  })
})
