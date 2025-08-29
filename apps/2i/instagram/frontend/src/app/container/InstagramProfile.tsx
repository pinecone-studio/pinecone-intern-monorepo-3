"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  Menu,
  Settings,
  Grid3X3,
  Bookmark,
  UserCheck,
  Camera,
  Phone,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetUserQuery } from "@/generated"

export const  InstagramProfile = () => {
  const router = useRouter()
   const userId = localStorage.getItem("userId");


  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
       
        <div className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white p-4 hidden lg:block">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Instagram</h1>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 h-12 text-base font-normal"
              onClick={() => router.push("/home")}
            >
              <Home className="h-6 w-6" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <Search className="h-6 w-6" />
              Search
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <Compass className="h-6 w-6" />
              Explore
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <Film className="h-6 w-6" />
              Reels
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <MessageSquare className="h-6 w-6" />
              Messages
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <Bell className="h-6 w-6" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <PlusSquare className="h-6 w-6" />
              Create
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal bg-gray-100">
              <User className="h-6 w-6" />
              Profile
            </Button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <Menu className="h-6 w-6" />
              More
            </Button>
          </div>
        </div>

  
        <div className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto p-8">
     
            <div className="flex items-start gap-8 mb-8">
              <div className="flex-shrink-0">
                <Avatar className="h-36 w-36">
                  <AvatarImage src="/placeholder.svg?height=144&width=144" />
                  <AvatarFallback className="text-4xl bg-gray-200">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-xl font-light">hakk_ime</h1>
                  <Button variant="outline" size="sm" onClick={() => router.push("/edit-profile")}>
                    Edit profile
                  </Button>
                  <Button variant="outline" size="sm">
                    View archive
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-8 mb-4">
                  <span>
                    <strong>0</strong> posts
                  </span>
                  <span>
                    <strong>3</strong> followers
                  </span>
                  <span>
                    <strong>5</strong> following
                  </span>
                </div>

                <div>
                  <div className="font-semibold">Jochise</div>
                </div>
              </div>
            </div>

         
            <div className="border-t border-gray-200">
              <div className="flex justify-center">
                <Button variant="ghost" className="flex items-center gap-2 border-t-2 border-black pt-4 pb-3">
                  <Grid3X3 className="h-3 w-3" />
                  <span className="text-xs font-semibold tracking-wide">POSTS</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 pt-4 pb-3 text-gray-400">
                  <Bookmark className="h-3 w-3" />
                  <span className="text-xs font-semibold tracking-wide">SAVED</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 pt-4 pb-3 text-gray-400">
                  <UserCheck className="h-3 w-3" />
                  <span className="text-xs font-semibold tracking-wide">TAGGED</span>
                </Button>
              </div>
            </div>

            
            <div className="text-center py-12">
              <h2 className="text-2xl font-light mb-8">Getting Started</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
               
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-black flex items-center justify-center">
                      <Camera className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Share Photos</h3>
                  <p className="text-gray-600 text-sm mb-4">When you share photos, they will appear on your profile.</p>
                  <Button variant="link" className="text-blue-500 font-semibold">
                    Share your first photo
                  </Button>
                </div>

                
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-black flex items-center justify-center">
                      <Phone className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Add phone number</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add your phone number so you can reset your password, find friends and more.
                  </p>
                  <Button variant="link" className="text-blue-500 font-semibold">
                    Add phone number
                  </Button>
                </div>

                
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-black flex items-center justify-center">
                      <Camera className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Add Profile Photo</h3>
                  <p className="text-gray-600 text-sm mb-4">Add a profile photo so your friends know it's you.</p>
                  <Button variant="link" className="text-blue-500 font-semibold">
                    Add profile photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center text-xs text-gray-400 space-y-2">
            <div className="flex justify-center gap-4 flex-wrap">
              <span>Meta</span>
              <span>About</span>
              <span>Blog</span>
              <span>Jobs</span>
              <span>Help</span>
              <span>API</span>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Locations</span>
              <span>Instagram Lite</span>
              <span>Meta AI</span>
              <span>Meta AI Articles</span>
              <span>Threads</span>
              <span>Contact Uploading & Non-Users</span>
              <span>Meta Verified</span>
            </div>
            <div className="flex justify-center gap-4">
              <span>English</span>
              <span>© 2024 Instagram from Meta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}