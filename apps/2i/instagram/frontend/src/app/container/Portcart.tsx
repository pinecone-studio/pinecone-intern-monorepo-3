import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"

export const PostCard = ({ post, liked, saved, onLike, onSave }: any) => {
  return (
    <article className="border-b border-gray-200">
      {/* Header */}
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
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative">
        <img src={post.image} alt="Post content" className="w-full aspect-square object-cover" />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => onLike(post.id)}>
              <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <MessageCircle className="h-6 w-6" />
            <Send className="h-6 w-6" />
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => onSave(post.id)}>
            <Bookmark className={`h-6 w-6 ${saved ? "fill-black" : ""}`} />
          </Button>
        </div>

        <div className="mb-2 font-semibold text-sm">{post.likes.toLocaleString()} likes</div>
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>
        <div className="mb-3 text-gray-500 text-sm">View all {post.comments.toLocaleString()} comments</div>

        {/* Add comment */}
        <div className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input placeholder="Add a comment..." className="border-none p-0 text-sm focus-visible:ring-0"/>
        </div>
      </div>
    </article>
  )
}
