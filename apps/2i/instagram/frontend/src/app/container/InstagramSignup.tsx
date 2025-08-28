"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const  InstagramSignup = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Signup form submitted with data:", formData)
    console.log("[v0] Attempting to navigate to /home")

    
    try {
      router.push("/home")
      console.log("[v0] Navigation to /home initiated")
    } catch (error) {
      console.error("[v0] Navigation error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
       
        <div className="bg-white border border-gray-300 p-10 mb-3">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif italic text-gray-900 tracking-tight">Instagram</h1>
          </div>

          
          <div className="text-center mb-6">
            <p className="text-gray-500 font-semibold text-lg leading-tight">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

         
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4 flex items-center justify-center gap-2"
            onClick={() => router.push("/home")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Log in with Facebook
          </Button>

         
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-gray-500 text-sm font-semibold">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

       
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="text"
              name="email"
              placeholder="Mobile Number or Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-2 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:border-gray-400 focus:bg-white"
              required
            />

            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-2 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:border-gray-400 focus:bg-white"
              required
            />

            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-2 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:border-gray-400 focus:bg-white"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-2 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:border-gray-400 focus:bg-white"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200 disabled:opacity-50"
                disabled={!formData.email || !formData.fullName || !formData.username || !formData.password}
              >
                Sign up
              </Button>
            </div>
          </form>

        
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 leading-4">
              By signing up, you agree to our{" "}
              <Link href="#" className="font-semibold">
                Terms
              </Link>
              ,{" "}
              <Link href="#" className="font-semibold">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-semibold">
                Cookies Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 text-center">
          <p className="text-sm">
            Have an account?{" "}
            <Link href="/" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm mb-4">Get the app.</p>
          <div className="flex justify-center gap-2">
            <Link href="#" className="block">
              <img src="/app-store-download-badge.png" alt="Download on the App Store" className="h-10" />
            </Link>
            <Link href="#" className="block">
              <img src="/images/google-play-badge.png" alt="Get it on Google Play" className="h-10" />
            </Link>
          </div>
        </div>
        <footer className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
            <Link href="#" className="hover:underline">
              Meta
            </Link>
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Blog
            </Link>
            <Link href="#" className="hover:underline">
              Jobs
            </Link>
            <Link href="#" className="hover:underline">
              Help
            </Link>
            <Link href="#" className="hover:underline">
              API
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Locations
            </Link>
            <Link href="#" className="hover:underline">
              Instagram Lite
            </Link>
            <Link href="#" className="hover:underline">
              Threads
            </Link>
            <Link href="#" className="hover:underline">
              Contact Uploading & Non-Users
            </Link>
            <Link href="#" className="hover:underline">
              Meta Verified
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            <span>English</span>
            <span className="mx-2">© 2024 Instagram from Meta</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
