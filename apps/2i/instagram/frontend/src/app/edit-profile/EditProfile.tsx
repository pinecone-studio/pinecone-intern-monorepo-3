"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Search, Bell, PlusSquare, User, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useGetUserQuery, useUpdateProfileMutation } from "@/generated"




type ProfilePutProps = {
  userId: string | undefined;
};

export const EditProfile = ({ userId }: ProfilePutProps)  => {
  const router = useRouter()
 
const { data, loading, error } = useGetUserQuery({
  skip: !userId, 
  variables: { id: userId! }
})
const [updateProfile] = useUpdateProfileMutation()
const [formData, setFormData] = useState({
  name: "",
  username: "",
  bio: "",
  gender: "prefer-not-to-say",
  profilePicture: ""
})

useEffect(() => {
  if (data?.getuser) {
    setFormData({
      name: data.getuser.fullname,
      username: data.getuser.username,
      bio: data.getuser.bio ?? "",
      gender: data.getuser.gender ?? "prefer-not-to-say",
      profilePicture: data.getuser.profilePicture ?? ""
    })
  }
}, [data])


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await updateProfile({
      variables: {
        update: {
          fullname: formData.name,
          username: formData.username,
          bio: formData.bio,
          gender: formData.gender,
          profilePicture: formData.profilePicture
        }
      }
    })
    router.push("/profile")
  } catch (err) {
    console.error(err)
  }
}

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading user data</div>
 
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
              <Bell className="h-6 w-6" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
              <PlusSquare className="h-6 w-6" />
              Create
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 h-12 text-base font-normal bg-gray-100"
              onClick={() => router.push("/profile")}
            >
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
          <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-semibold text-center mb-8">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
         
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-purple-500 text-white text-lg">U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold mb-1">upvox_</div>
                  <Button variant="link" className="text-blue-500 p-0 h-auto font-semibold">
                    Change profile photo
                  </Button>
                </div>
              </div>

         
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Help people discover your account by using the name you're known by: either your full name, nickname,
                  or business name.
                </p>
                <p className="text-xs text-gray-500">You can only change your name twice within 14 days.</p>
              </div>

            
              <div className="space-y-2">
                <label className="text-sm font-semibold">Username</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full"
                />
              </div>

             
              <div className="space-y-2">
                <label className="text-sm font-semibold">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Placeholder"
                  className="w-full min-h-[100px] resize-none"
                  maxLength={150}
                />
                <div className="text-right text-xs text-gray-500">{formData.bio.length}/150</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Gender</label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <div className="pt-4">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-2xl mx-auto px-8">
          <div className="text-center text-xs text-gray-400 space-y-2">
            <div className="flex justify-center gap-4 flex-wrap">
              <span>About</span>
              <span>Help</span>
              <span>Press</span>
              <span>API</span>
              <span>Jobs</span>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Locations</span>
              <span>Language</span>
              <span>Meta Verified</span>
            </div>
            <div>© 2024 INSTAGRAM FROM META</div>
          </div>
        </div>
      </div>
    </div>
  )
}








