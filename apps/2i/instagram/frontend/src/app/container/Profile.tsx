"use client"
 
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Grid3X3,
  Bookmark,
  UserCheck,
  Camera,
 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetUserQuery } from "@/generated"
import { useEffect, useState } from "react"
 
export const  InstagramProfile = () => {
  const router = useRouter()
   const [userId, setUserId] = useState<string | null>(null);
 
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.userId);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }, []);
    const { data } = useGetUserQuery({
      skip: !userId,
      variables: { id: userId! }
    });
    
  const user = data?.getuser;
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
  
        <div className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto p-8">
     
            <div className="flex items-start gap-8 mb-8">
              <div className="flex-shrink-0">
                <Avatar className="h-36 w-36">
                  <AvatarImage src={user?.profilePicture || undefined}/>
                  <AvatarFallback className="text-4xl bg-gray-200">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
 
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-xl font-light">{user?.username}</h1>
                  <Button variant="outline" size="sm" onClick={() => router.push("/editprofile")}>
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
                    <strong>{user?.followers?.length}</strong> followers
                  </span>
                  <span>
                    <strong>{user?.following?.length}</strong> following
                  </span>
                </div>
 
                <div>
                  <div className="font-semibold">{user?.fullname}</div>
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
 
              <div className="gap-8 max-w-3xl mx-auto">
 
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