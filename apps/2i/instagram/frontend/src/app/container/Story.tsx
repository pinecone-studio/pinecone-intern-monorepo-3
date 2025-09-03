import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Stories = ({ stories }: { stories: any[] }) => {
  return (
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
  )
}
