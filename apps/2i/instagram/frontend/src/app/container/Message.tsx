"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"
import Link from "next/link"

export const InstagramForgotPassword =() =>  {


    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <Card className="border border-border p-8">
            <div className="space-y-6 text-center">
              {/* Instagram Logo */}
              <div>
                <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "cursive" }}>
                  Instagram
                </h1>
              </div>

              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground text-balance">Confirm</h2>
                <p className="text-sm text-muted-foreground text-pretty">
                  {
                    "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password."
                  }
                </p>
                <div className="pt-2">
     
                </div>
              </div>
             <Link href={"/login"}>
              <Button
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Back to Login
              </Button>
             </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  };
