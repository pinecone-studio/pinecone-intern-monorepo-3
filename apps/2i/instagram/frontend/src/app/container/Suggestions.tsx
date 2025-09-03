import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const RightSidebar = ({ suggestions }: { suggestions: any[] }) => {
  return (
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

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 font-semibold text-sm">Suggested for you</span>
        <Button variant="link" className="text-sm p-0">
          See All
        </Button>
      </div>
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.username} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={s.avatar || "/placeholder.svg"} />
                <AvatarFallback>{s.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">{s.username}</div>
                <div className="text-gray-500 text-xs">{s.name}</div>
              </div>
            </div>
            <Button variant="link" className="text-blue-500 text-sm p-0">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
