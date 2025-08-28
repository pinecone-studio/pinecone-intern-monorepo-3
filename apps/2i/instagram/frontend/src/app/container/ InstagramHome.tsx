"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Search,
  Bell,
  PlusSquare,
  User,
  Menu,
} from "lucide-react"



export const  InstagramHome = () =>  {
  const router = useRouter()
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const toggleSave = (postId: number) => {
    const newSaved = new Set(savedPosts)
    if (newSaved.has(postId)) {
      newSaved.delete(postId)
    } else {
      newSaved.add(postId)
    }
    setSavedPosts(newSaved)
  }


// const [GetUser]= 

  const stories = [
    { id: 1, username: "instagram", avatar: "/instagram-logo.png", hasStory: true },
    { id: 2, username: "cristiano", avatar: "/cristiano-ronaldo.png", hasStory: true },
    { id: 3, username: "leomessi", avatar: "/lionel-messi.png", hasStory: true },
    { id: 4, username: "fff", avatar: "/french-football.png", hasStory: true },
    { id: 5, username: "selenagomez", avatar: "/selena-gomez.png", hasStory: true },
    { id: 6, username: "kyliejenner", avatar: "/kylie-jenner.png", hasStory: true },
    { id: 7, username: "therock", avatar: "/the-rock.png", hasStory: true },
  ]

  const posts = [
    {
      id: 1,
      username: "instagram",
      avatar: "/instagram-logo.png",
      verified: true,
      timeAgo: "1w",
      image: "/cute-rabbit-hole-paper-doll.png",
      likes: 392410,
      caption: "paper doll rabbit hole 🐰🕳️",
      comments: 6197,
      isVideo: true,
    },
    {
      id: 2,
      username: "janiawzz_",
      avatar: "/user-profile-illustration.png",
      verified: false,
      timeAgo: "2w",
      location: "Ulaanbaatar, Mongolia",
      image: "/mongolia-landscape.png",
      likes: 1205,
      caption: "Beautiful sunset in Mongolia 🌅",
      comments: 89,
      isVideo: false,
    },
  ]

  const suggestions = [
    { username: "natgeo", name: "National Geographic", avatar: "/national-geographic.png" },
    { username: "nasa", name: "NASA", avatar: "/nasa-logo.png" },
    { username: "spotify", name: "Spotify", avatar: "/spotify-logo.png" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
       
        <div className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white p-4 hidden lg:block">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Instagram</h1>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
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
              className="w-full justify-start gap-4 h-12 text-base font-normal"
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
          <div className="max-w-2xl mx-auto">
            <div className="border-b border-gray-200 p-4">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {stories.map((story) => (
                  <div key={story.id} className="flex flex-col items-center gap-1 min-w-fit">
                    <div
                      className={`p-0.5 rounded-full ${story.hasStory ? "bg-gradient-to-tr from-yellow-400 to-pink-600" : ""}`}
                    >
                      <div className="bg-white p-0.5 rounded-full">
                        <Avatar className="h-14 w-14">
                         <AvatarImage src={story.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 max-w-[60px] truncate">{story.username}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-0">
              {posts.map((post) => (
                <article key={post.id} className="border-b border-gray-200">
                
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{post.username}</span>
                        {post.verified && <span className="text-blue-500">✓</span>}
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                      </div>
                      {post.location && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{post.location}</span>
                        </>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full aspect-square object-cover"
                    />
                    {post.isVideo && (
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-black bg-opacity-50 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => toggleLike(post.id)}>
                          <Heart className={`h-6 w-6 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Send className="h-6 w-6" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => toggleSave(post.id)}>
                        <Bookmark className={`h-6 w-6 ${savedPosts.has(post.id) ? "fill-black" : ""}`} />
                      </Button>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold text-sm">{post.likes.toLocaleString()} likes</span>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold text-sm mr-2">{post.username}</span>
                      <span className="text-sm">{post.caption}</span>
                    </div>

                   
                    <div className="mb-3">
                      <button className="text-gray-500 text-sm">
                        View all {post.comments.toLocaleString()} comments
                      </button>
                    </div>

              
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/diverse-user-avatars.png" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <Input
                        placeholder="Add a comment..."
                        className="border-none p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed right-0 top-0 h-full w-80 p-6 hidden xl:block">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src="/user-profile-illustration.png" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">hakk_ime</div>
                <div className="text-gray-500 text-sm">Jochise</div>
              </div>
            </div>
            <Button variant="link" className="text-blue-500 text-sm p-0">
              Switch
            </Button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-semibold text-sm">Suggested for you</span>
              <Button variant="link" className="text-sm p-0">
                See All
              </Button>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.username} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={suggestion.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{suggestion.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{suggestion.username}</div>
                      <div className="text-gray-500 text-xs">{suggestion.name}</div>
                    </div>
                  </div>
                  <Button variant="link" className="text-blue-500 text-sm p-0">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-xs text-gray-400 space-y-1">
            <div>About • Help • Press • API • Jobs • Privacy • Terms</div>
            <div>Locations • Language • Meta Verified</div>
            <div className="mt-4">© 2024 INSTAGRAM FROM META</div>
          </div>
        </div>
      </div>
    </div>
  )
}