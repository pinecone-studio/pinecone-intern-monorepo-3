
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

import { expect as jexpect, test } from "@jest/globals";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import SignupPage from "../page";

test("renders Sign up button", () => {
  render(
    <MockedProvider addTypename={false}>
      <SignupPage />
    </MockedProvider>
  );
  const btn = screen.queryByRole("button", { name: /sign up/i });
  jexpect(btn).not.toBeNull();
});
