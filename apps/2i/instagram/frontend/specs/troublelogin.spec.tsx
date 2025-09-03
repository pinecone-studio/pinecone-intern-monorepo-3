import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import TroublePage from '@/app/troublelogin/page'
import { useTroubleloginMutation } from '@/generated'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))
jest.mock('@/generated', () => ({ useTroubleloginMutation: jest.fn() }))

describe('TroublePage Components', () => {
  const mockPush = jest.fn()
  const mockTroublelogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useTroubleloginMutation as jest.Mock).mockReturnValue([
      mockTroublelogin,
      { loading: false, error: null }
    ])
  })

  it('updates email input', async () => {
    const user = userEvent.setup()
    render(<TroublePage />)
    const emailInput = screen.getByTestId('email-input')
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    mockTroublelogin.mockResolvedValue({ data: { troublelogin: { success: true } } })
    render(<TroublePage />)
    await user.type(screen.getByTestId('email-input'), 'success@test.com')
    await user.click(screen.getByTestId('submit-button'))
    await waitFor(() =>
      expect(mockTroublelogin).toHaveBeenCalledWith({
        variables: { trouble: { email: 'success@test.com' } }
      })
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/otpverify'))
  })

  it('handles submission failure gracefully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    const troubleError = new Error('Network error')
    mockTroublelogin.mockRejectedValue(troubleError)

    render(<TroublePage />)
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
    render(<TroublePage />)
    await user.click(screen.getByTestId('submit-button'))
    expect(mockTroublelogin).not.toHaveBeenCalled()
  })

  it('submits form with Enter key', async () => {
    const user = userEvent.setup()
    mockTroublelogin.mockResolvedValue({ data: { troublelogin: { success: true } } })
    render(<TroublePage />)
    const emailInput = screen.getByTestId('email-input')
    await user.type(emailInput, 'enter@test.com{enter}')
    await waitFor(() =>
      expect(mockTroublelogin).toHaveBeenCalledWith({
        variables: { trouble: { email: 'enter@test.com' } }
      })
    )
  })
    it('displays loading message when request is in progress', () => {
    (useTroubleloginMutation as jest.Mock).mockReturnValue([
      mockTroublelogin,
      { loading: true, error: null }
    ])
    render(<TroublePage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('email-input')).not.toBeInTheDocument()
  })

 
  it('displays error message on failed submission', () => {
    const testError = { message: 'Email not found' };
    (useTroubleloginMutation as jest.Mock).mockReturnValue([
      mockTroublelogin,
      { loading: false, error: testError }
    ])
    render(<TroublePage />)
    expect(screen.getByText('Error: Email not found')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
  })
})
