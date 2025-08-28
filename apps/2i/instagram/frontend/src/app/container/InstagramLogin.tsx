"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export const InstagramLogin =() =>  {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/home")
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-8">
          <Card className="border border-border p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "cursive" }}>
                  Instagram
                </h1>
              </div>
              <form className="space-y-3" onSubmit={handleLogin}>
                <Input
                  type="text"
                  placeholder="Phone number, username, or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 bg-input text-sm"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-input text-sm"
                />
                <Button
                  type="submit"
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Log in
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground font-semibold">OR</span>
                </div>
              </div>

              {/* Facebook Login */}
              <Button
                variant="ghost"
                className="w-full text-secondary hover:text-secondary/80 font-semibold"
                onClick={() => router.push("/home")}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Log in with Facebook
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Forgot password?
                </a>
              </div>
            </div>
          </Card>

          {/* Sign Up Card */}
          <Card className="border border-border p-6">
            <div className="text-center text-sm">
              <span className="text-foreground">{"Don't have an account? "}</span>
              <a href="/signup" className="text-secondary font-semibold hover:text-secondary/80">
                Sign up
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Meta
            </a>
            <a href="#" className="hover:text-foreground">
              About
            </a>
            <a href="#" className="hover:text-foreground">
              Blog
            </a>
            <a href="#" className="hover:text-foreground">
              Jobs
            </a>
            <a href="#" className="hover:text-foreground">
              Help
            </a>
            <a href="#" className="hover:text-foreground">
              API
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Consumer Health Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Locations
            </a>
            <a href="#" className="hover:text-foreground">
              Instagram Lite
            </a>
            <a href="#" className="hover:text-foreground">
              Meta AI
            </a>
            <a href="#" className="hover:text-foreground">
              Meta AI Articles
            </a>
            <a href="#" className="hover:text-foreground">
              Threads
            </a>
            <a href="#" className="hover:text-foreground">
              Contact Uploading & Non-Users
            </a>
            <a href="#" className="hover:text-foreground">
              Meta Verified
            </a>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <span>English</span>
            <span>© 2025 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
