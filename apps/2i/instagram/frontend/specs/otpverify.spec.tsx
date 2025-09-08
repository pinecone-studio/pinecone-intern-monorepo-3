import React from "react"
import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import InstagramOtpVerify from "@/app/otpverify/page"
import { useVerifyOtpMutation } from "@/generated"
import { fireEvent } from "@testing-library/react"
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush })
}))
jest.mock("@/generated", () => ({ useVerifyOtpMutation: jest.fn() }))
describe("InstagramOtpVerify Components", () => {
  const mockVerifyOtp = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useVerifyOtpMutation as jest.Mock).mockReturnValue([mockVerifyOtp])
  })
  const fillOtp = async (user: ReturnType<typeof userEvent.setup>, code: string) => {
    const inputs = screen.getAllByRole("textbox")
    for (let i = 0; i < code.length; i++) {await user.type(inputs[i], code[i])  }
  }
  it("renders all inputs and buttons", () => {
    render(<InstagramOtpVerify />)
    expect(screen.getAllByRole("textbox")).toHaveLength(6)
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument()
    expect(screen.getByText(/resend/i)).toBeInTheDocument()
    expect(screen.getByText(/back to login/i)).toBeInTheDocument()
  })
  it("updates OTP inputs and auto-focuses next", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    const inputs = screen.getAllByRole("textbox")
    await user.type(inputs[0], "1")
    expect(inputs[0]).toHaveValue("1")
    expect(document.activeElement).toBe(inputs[1])
  })
  it("handles backspace and focuses previous input", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    const inputs = screen.getAllByRole("textbox")
    await user.type(inputs[0], "1")
    await user.type(inputs[1], "2")
    await user.clear(inputs[1])
    await user.keyboard("{Backspace}")
    expect(document.activeElement).toBe(inputs[0])
  })
  it("submits 6-digit OTP successfully", async () => {
    const user = userEvent.setup()
    mockVerifyOtp.mockResolvedValue({ data: { verifyOtp: { message: "Success", token: "123" } } })
    render(<InstagramOtpVerify />)
    await fillOtp(user, "123456")
    const button = screen.getByRole("button", { name: /confirm/i })
    await user.click(button)
    await waitFor(() =>
      expect(mockVerifyOtp).toHaveBeenCalledWith({ variables: { verifyOtp: { otp: "123456" } } }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"))
  })
  it("does not submit if OTP is incomplete", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    await fillOtp(user, "123")
    const button = screen.getByRole("button", { name: /confirm/i })
    expect(button).toBeDisabled()
  })
  it("calls resend function on click", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    const resendBtn = screen.getByText(/resend/i)
    console.log = jest.fn()
    await user.click(resendBtn)
    expect(console.log).toHaveBeenCalledWith("Resending OTP...")
  })
  it("navigates back to login", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    const backBtn = screen.getByText(/back to login/i)
    await user.click(backBtn)
    expect(mockPush).toHaveBeenCalledWith("/login")
  })
  it("handles special characters and long OTP gracefully", async () => {
    const user = userEvent.setup()
    render(<InstagramOtpVerify />)
    const inputs = screen.getAllByRole("textbox")
    await user.type(inputs[0], "1")
    await user.type(inputs[1], "a")
    expect(inputs[1]).toHaveValue("a")
  })
  it("focus starts on first input on mount", () => {
    render(<InstagramOtpVerify />)
    const inputs = screen.getAllByRole("textbox")
    expect(document.activeElement).toBe(inputs[0])
  })
  it("alerts when OTP verification fails", async () => {
  const user = userEvent.setup()
  mockVerifyOtp.mockResolvedValue({ data: { verifyOtp: { message: "Invalid OTP" } } })
  render(<InstagramOtpVerify />)
  await fillOtp(user, "654321")
  window.alert = jest.fn()
  const button = screen.getByRole("button", { name: /confirm/i })
  await user.click(button)
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Invalid OTP"))
})
it("alerts on network or unexpected error", async () => {
  const user = userEvent.setup()
  mockVerifyOtp.mockRejectedValue(new Error("Network Error"))
  render(<InstagramOtpVerify />)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
   const spy = jest.spyOn(console, "error").mockImplementation(() => {})
  await fillOtp(user, "111111")
  window.alert = jest.fn()
  const button = screen.getByRole("button", { name: /confirm/i })
  await user.click(button)
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Something went wrong!"))
   spy.mockRestore()
})
it("disables submit button and shows verifying text while loading", async () => {
  const user = userEvent.setup()
  let resolveFn: any
  mockVerifyOtp.mockImplementation(() => new Promise(res => { resolveFn = res }))
  render(<InstagramOtpVerify />)
  await fillOtp(user, "222222")
  const button = screen.getByRole("button", { name: /confirm/i })
  await user.click(button)
  expect(button).toHaveTextContent("Verifying...")
  resolveFn({ data: { verifyOtp: { message: "OK", token: "123" } } })
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"))
})
it("calls return branch if OTP is incomplete", async () => {
  const user = userEvent.setup()
  render(<InstagramOtpVerify />)
  const form = screen.getByRole("form")
  const inputs = screen.getAllByRole("textbox")
  await user.type(inputs[0], "1")
  await user.type(inputs[1], "2")
  await user.type(inputs[2], "3")
  window.alert = jest.fn()
  fireEvent.submit(form)
  expect(mockVerifyOtp).not.toHaveBeenCalled()
})
it("ignores input if more than 1 character is typed at once", async () => {
  render(<InstagramOtpVerify />)
  const inputs = screen.getAllByRole("textbox")
  fireEvent.change(inputs[0], { target: { value: "12" } })
  expect(inputs[0]).toHaveValue("")
})
})