"use client"
import { Button } from "@/components/ui/button"
import { Home, Search, Bell, PlusSquare, User, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export const Sidebar = () => {
  const router = useRouter()
  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white p-4 hidden lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Instagram</h1>
      </div>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
          <Home className="h-6 w-6" /> Home
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
          <Search className="h-6 w-6" /> Search
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
          <Bell className="h-6 w-6" /> Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
          <PlusSquare className="h-6 w-6" /> Create
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 h-12 text-base font-normal"
          onClick={() => router.push("/profile")}
        >
          <User className="h-6 w-6" /> Profile
        </Button>
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-base font-normal">
          <Menu className="h-6 w-6" /> More
        </Button>
      </div>
    </div>
  )
}
