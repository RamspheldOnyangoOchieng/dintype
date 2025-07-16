"use client"

import Link from "next/link"
import { Menu, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-context"
import { useSite } from "@/components/site-context"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function UserHeader() {
  const { toggle } = useSidebar()
  const { settings } = useSite()
  const { user, logout } = useAuth()

  // Add state for the active character type
  const [activeType, setActiveType] = useState<string>("Girls")
  // Fixed character types to match the reference design
  const characterTypes = ["Girls", "Anime", "Guys"]

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return "U"
    return user.username.substring(0, 2).toUpperCase()
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">
              candy<span className="text-primary">.ai</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center">
              <span className="text-sm text-gray-300 mr-2 hidden sm:inline">Hi, {user.username}!</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-primary">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-gray-800 border border-gray-200">
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href="/signup">
                <Button
                  variant="default"
                  className="account-button text-white hover:bg-[#d14868] text-xs sm:text-sm whitespace-nowrap"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="login-button hover:bg-[#e75275]/10 text-xs sm:text-sm">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Character Type Tabs - Only show on homepage */}
      {window.location.pathname === "/" && (
        <div className="flex justify-center border-t border-border overflow-x-auto">
          {characterTypes.map((type) => (
            <Button
              key={type}
              variant="ghost"
              className={`rounded-none px-6 py-3 ${
                activeType === type ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveType(type)}
            >
              {type === "Girls" && <span className="mr-1.5 text-pink-500">♀</span>}
              {type === "Anime" && <span className="mr-1.5">⭐</span>}
              {type === "Guys" && <span className="mr-1.5 text-blue-500">♂</span>}
              {type}
            </Button>
          ))}
        </div>
      )}
    </header>
  )
}
