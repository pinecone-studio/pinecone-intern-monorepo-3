import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import ForgotPage from '@/app/forgot/page'
import {  useForgetverifyMutation } from '@/generated'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/generated', () => ({ useForgetverifyMutation: jest.fn() }))

describe('ForgotPage Component', () => {
  const mockPush = jest.fn()
  const mockForgotverify = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useForgetverifyMutation as jest.Mock).mockReturnValue([
      mockForgotverify,
      { loading: false, error: null }
    ])
  })

  it('updates email input', async () => {
    const user = userEvent.setup()
    render(<ForgotPage />)
    const emailInput = screen.getByTestId('email-input')
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup();
    mockForgotverify.mockResolvedValue({ data: { forgetverify: { success: true } } })
    render(<ForgotPage />)
    await user.type(screen.getByTestId('email-input'), 'success@test.com')
    await user.click(screen.getByTestId('submit-button'))
    await waitFor(() =>
      expect(mockForgotverify).toHaveBeenCalledWith({
        variables: { forget: { email: 'success@test.com' } }
      })
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
  })

  it('handles submission failure gracefully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    const troubleError = new Error('Network error')
    mockForgotverify.mockRejectedValue(troubleError)

    render(<ForgotPage />)
    await user.type(screen.getByTestId('email-input'), 'error@test.com')
    await user.click(screen.getByTestId('submit-button'))

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith('Failed to signup:', troubleError)
    )
    expect(mockPush).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('prevents submission with empty email', async () => {
    const user = userEvent.setup()
    render(<ForgotPage />)
    await user.click(screen.getByTestId('submit-button'))
    expect(mockForgotverify).not.toHaveBeenCalled()
  })

  it('submits form with Enter key', async () => {
    const user = userEvent.setup()
    mockForgotverify.mockResolvedValue({ data: { forgetverify: { success: true } } })
    render(<ForgotPage />)
    const emailInput = screen.getByTestId('email-input')
    await user.type(emailInput, 'enter@test.com{enter}')
    await waitFor(() =>
      expect(mockForgotverify).toHaveBeenCalledWith({
        variables: { forget: { email: 'enter@test.com' } }
      })
    )
  })
    it('displays loading message when request is in progress', () => {
    (useForgetverifyMutation as jest.Mock).mockReturnValue([
      mockForgotverify,
      { loading: true, error: null }
    ])
    render(<ForgotPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('email-input')).not.toBeInTheDocument()
  })

 
  it('displays error message on failed submission', () => {
    const testError = { message: 'Email not found' };
    ( useForgetverifyMutation as jest.Mock).mockReturnValue([
      mockForgotverify,
      { loading: false, error: testError }
    ])
    render(<ForgotPage />)
    expect(screen.getByText('Error: Email not found')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
  })
})
