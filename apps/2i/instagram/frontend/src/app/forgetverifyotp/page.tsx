"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useForgetverifyOtpMutation } from "@/generated"


const  InstagramOtpVerify = () => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]) 
  const router = useRouter()
  const [ ForgetverifyOtp] = useForgetverifyOtpMutation()




  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
 
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      return
    }
    setIsLoading(true)
 
    try {
  const response = await ForgetverifyOtp({
        variables: { verifyOtp: {  otp: otpCode  } },
      });

   
     if (response.data?.forgetverifyOtp) {
        router.push('/forgetreset'); 
      } else {
        alert('OTP verification failed');
      }
  } catch (err) {
    console.error(err);
    
  } 
  }

  const handleResend = () => {
    console.log("Resending OTP...")
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" >
      <div className="w-full max-w-sm space-y-8">
     
        <Card className="border border-border p-8">
          <div className="space-y-6">
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "cursive" }}>
                Instagram
              </h1>
            </div>

            
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Enter confirmation code</h2>
              <p className="text-sm text-muted-foreground">{"Enter the 6-digit code we sent to your phone number"}</p>
            </div>

     
            <form onSubmit={handleSubmit} className="space-y-6"  role="form">
            
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {inputRefs.current[index] = el;}}
                    type="text"
                    role="textbox"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary"
                  />
                ))}
              </div>

          
              <Button
                type="submit"
                disabled={otp.join("").length !== 6 || isLoading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Confirm"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-secondary hover:text-secondary/80 font-semibold"
              >
                {"Didn't receive a code? Resend"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to login
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
export default  InstagramOtpVerify;
