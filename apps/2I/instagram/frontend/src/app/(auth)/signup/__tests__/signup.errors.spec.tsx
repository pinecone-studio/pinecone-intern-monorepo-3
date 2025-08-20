
import '@testing-library/jest-dom';

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect as jexpect, test, beforeEach } from "@jest/globals";
import SignupPage from "../page";


jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }),
  };
});


jest.mock("../../../../generated", () => {
  let currentImpl = jest.fn();
  return {
    __esModule: true,
    SignupDocument: {} as any,
    useSignupMutation: () => [currentImpl, { loading: false }] as const,
    __setSignupImpl: (impl: jest.Mock) => {
      currentImpl = impl;
    },
  };
});
const { __setSignupImpl } = require("../../../../generated");

beforeEach(() => {
  jest.clearAllMocks();
});

test("shows error when email is invalid", async () => {
  render(<SignupPage />);
  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText(/mobile number or email/i),
    "invalid-email"
  );
  await user.type(screen.getByPlaceholderText(/password/i), "secret123");
  await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
  await user.type(screen.getByPlaceholderText(/username/i), "testuser");

  const btn = screen.getByRole("button", { name: /sign up/i });
  await user.click(btn);


  const errNode = await screen.findByText(/зөв имэйл оруулна уу/i);
  jexpect(errNode).toBeTruthy();


  const contact = screen.getByPlaceholderText(/mobile number or email/i);
  await waitFor(() =>
    jexpect(contact.getAttribute("aria-invalid")).toBe("true")
  );
});

test("disables button when required fields missing", async () => {
  render(<SignupPage />);
  const btn = screen.getByRole("button", { name: /sign up/i }) as HTMLButtonElement;

  
  jexpect(btn).toBeTruthy();
  jexpect(btn.disabled).toBe(true);
  jexpect(btn.getAttribute("aria-disabled")).toBe("true");
});

test("shows server error when username exists", async () => {
  const mockSignup = jest.fn().mockRejectedValue({
    graphQLErrors: [{ message: "username already exists" }],
  });
  __setSignupImpl(mockSignup);

  render(<SignupPage />);
  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText(/mobile number or email/i),
    "test@example.com"
  );
  await user.type(screen.getByPlaceholderText(/password/i), "secret123");
  await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
  await user.type(screen.getByPlaceholderText(/username/i), "takenuser");

  const btn = screen.getByRole("button", { name: /sign up/i });
  await user.click(btn);

  const errNode = await screen.findByText(/a user with that username already exists/i);
  jexpect(errNode).toBeTruthy();

  jexpect(mockSignup).toHaveBeenCalledTimes(1);
});

test("shows server error when email exists", async () => {
  const mockSignup = jest.fn().mockRejectedValue({
    graphQLErrors: [{ message: "email already exists" }],
  });
  __setSignupImpl(mockSignup);

  render(<SignupPage />);
  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText(/mobile number or email/i),
    "taken@example.com"
  );
  await user.type(screen.getByPlaceholderText(/password/i), "secret123");
  await user.type(screen.getByPlaceholderText(/full name/i), "Test User");
  await user.type(screen.getByPlaceholderText(/username/i), "newuser");

  const btn = screen.getByRole("button", { name: /sign up/i });
  await user.click(btn);

  const errNode = await screen.findByText(/an account with that email already exists/i);
  jexpect(errNode).toBeTruthy();

  jexpect(mockSignup).toHaveBeenCalledTimes(1);
});
