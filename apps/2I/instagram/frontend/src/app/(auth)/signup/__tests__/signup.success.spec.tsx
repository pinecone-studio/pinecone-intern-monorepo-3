
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));


const mockSignupFn = jest.fn().mockResolvedValue({
  data: {
    signup: {
      id: 'u1',

      token: 'tok_123',
      user: { id: 'u1' },
    },
  },
});
jest.mock('../../../../generated', () => ({
  __esModule: true,
  SignupDocument: {} as any,
  useSignupMutation: () => [mockSignupFn, { loading: false }] as const,
}));

import { expect as jexpect, test, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../page';


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

beforeEach(() => {

  jest.useRealTimers();
  mockSignupFn.mockClear();
  mockPush.mockClear();
});

test('signs up with email and redirects to /(auth)/login', async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText(/Mobile Number or Email/i),
    'test@example.com'
  );
  await user.type(screen.getByPlaceholderText(/Password/i), 'secret1');
  await user.type(screen.getByPlaceholderText(/Full Name/i), 'John Doe');
  await user.type(screen.getByPlaceholderText(/Username/i), 'john.doe');


  await sleep(700);

  const btn = screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement;


  await waitFor(() => jexpect(btn.disabled).toBe(false));

  await user.click(btn);

  await waitFor(() =>
    jexpect(mockSignupFn).toHaveBeenCalledWith({
      variables: {
        input: {
          contact: 'test@example.com',
          fullName: 'John Doe',
          password: 'secret1',
          username: 'john.doe',
        },
      },
    })
  );

  
  await waitFor(() => jexpect(mockPush).toHaveBeenCalledWith('/(auth)/login'));
});
