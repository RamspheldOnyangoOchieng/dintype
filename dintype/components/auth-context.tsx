"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { storeUserInfo, getUserId, clearUserInfo } from "@/lib/user-storage"

type User = {
  id: string
  email?: string
  username?: string
  isAdmin?: boolean
  createdAt?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  users: User[]
  deleteUser: (id: string) => Promise<void>
  signOut: () => Promise<
    | {
        success: boolean
        error?: { message: string } | undefined
      }
    | undefined
  >
  refreshSession: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  updateUser: (userId: string, updates: { username?: string; email?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  users: [],
  deleteUser: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
  login: async (email: string, password: string) => false,
  updateUser: async () => {
    throw new Error("updateUser function not implemented")
  },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const supabase = createClient()

  // Updated to use users_view instead of profiles
  const fetchUsers = async () => {
    if (!isAdmin) return // Only fetch users if the current user is an admin

    try {
      const { data, error } = await supabase.from("users_view").select("id, email, created_at, username, is_admin")

      if (error) {
        console.error("Error fetching users:", error)
        return
      }

      // Transform the data to match the User type
      const formattedUsers = data.map((user) => ({
        id: user.id,
        email: user.email || "",
        username: user.username || "",
        isAdmin: user.is_admin || false,
        createdAt: user.created_at,
      }))

      setUsers(formattedUsers)
    } catch (error) {
      console.error("Exception fetching users:", error)
    }
  }

  // Update the deleteUser function to use our new simple delete endpoint
  const deleteUser = async (id: string) => {
    try {
      console.log("Attempting to delete user:", id)

      // Use the simple delete endpoint
      const response = await fetch(`/api/admin/simple-delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      // Update the users list
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Exception deleting user:", error)
      throw error
    }
  }

  // Add useEffect to fetch users when admin status changes
  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    } else {
      setUsers([]) // Clear users if not admin
    }
  }, [isAdmin])

  const checkAdminStatus = async (userId: string) => {
    try {
      // First check localStorage cache
      const cachedAdmin = localStorage.getItem("isAdmin:" + userId)
      if (cachedAdmin === "true") {
        console.log("Using cached admin status: true")
        return true
      }

      // Special case for default admin
      const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      if (storedUser.email === "admin@example.com") {
        console.log("Default admin detected")
        localStorage.setItem("isAdmin:" + userId, "true")
        return true
      }

      // Check if user is in admin_users table
      try {
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", userId)
          .single()

        if (!adminError && adminData) {
          console.log("User found in admin_users table")
          localStorage.setItem("isAdmin:" + userId, "true")
          return true
        }
      } catch (adminErr) {
        console.log("Error checking admin_users table:", adminErr)
      }

      // Check user metadata for admin status
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (!userError && userData?.user) {
          const metadata = userData.user.user_metadata || {}
          if (metadata.is_admin === true) {
            console.log("Admin status found in user metadata")
            localStorage.setItem("isAdmin:" + userId, "true")
            return true
          }
        }
      } catch (metadataErr) {
        console.log("Error checking user metadata:", metadataErr)
      }

      // Last resort - check if email is admin@example.com
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (!userError && userData?.user && userData.user.email === "admin@example.com") {
          console.log("Admin email detected")
          localStorage.setItem("isAdmin:" + userId, "true")
          return true
        }
      } catch (emailErr) {
        console.log("Error checking user email:", emailErr)
      }

      // If we get here, user is not an admin
      localStorage.setItem("isAdmin:" + userId, "false")
      return false
    } catch (error) {
      console.error("Exception checking admin status:", error)
      return false
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
          // Try to get user from local storage as fallback
          const storedUserId = getUserId()
          if (storedUserId) {
            // Get the full user object from localStorage if available
            const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
            if (storedUser.id === storedUserId) {
              console.log("Using stored user:", storedUser)
              setUser(storedUser)
              setIsAdmin(!!storedUser.isAdmin)
            } else {
              setUser({ id: storedUserId })
            }
            console.log("Using stored user ID:", storedUserId)
          }
          setIsLoading(false)
          return
        }

        if (data?.session?.user) {
          const userId = data.session.user.id
          const userEmail = data.session.user.email

          // Check admin status
          const adminStatus = await checkAdminStatus(userId)
          setIsAdmin(adminStatus)

          // Create user object with admin status
          const currentUser = {
            id: userId,
            email: userEmail,
            isAdmin: adminStatus,
          }

          setUser(currentUser)

          // Store user info in local storage for fallback
          storeUserInfo(currentUser.id, currentUser.email || null)

          // Also store the full user object with admin status
          localStorage.setItem("currentUser", JSON.stringify(currentUser))
        } else {
          // Try to get user from local storage as fallback
          const storedUserId = getUserId()
          if (storedUserId) {
            // Get the full user object from localStorage if available
            const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
            if (storedUser.id === storedUserId) {
              console.log("Using stored user:", storedUser)
              setUser(storedUser)
              setIsAdmin(!!storedUser.isAdmin)
            } else {
              setUser({ id: storedUserId })
            }
            console.log("Using stored user ID:", storedUserId)
          } else {
            setUser(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error("Error in auth context:", error)
        // Try to get user from local storage as fallback
        const storedUserId = getUserId()
        if (storedUserId) {
          // Get the full user object from localStorage if available
          const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
          if (storedUser.id === storedUserId) {
            console.log("Using stored user after error:", storedUser)
            setUser(storedUser)
            setIsAdmin(!!storedUser.isAdmin)
          } else {
            setUser({ id: storedUserId })
          }
          console.log("Using stored user ID after error:", storedUserId)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session?.user) {
        const userId = session.user.id
        const userEmail = session.user.email

        // Check admin status
        const adminStatus = await checkAdminStatus(userId)
        setIsAdmin(adminStatus)

        // Create user object with admin status
        const currentUser = {
          id: userId,
          email: userEmail,
          isAdmin: adminStatus,
        }

        setUser(currentUser)

        // Store user info in local storage for fallback
        storeUserInfo(currentUser.id, currentUser.email || null)

        // Also store the full user object with admin status
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAdmin(false)
        clearUserInfo()
        localStorage.removeItem("currentUser")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  // Add this to the AuthProvider component, inside the signOut function
  // This ensures the auth context is properly updated after logout
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
        return false
      }

      // Clear the user state immediately
      setUser(null)
      setIsAdmin(false)
      setIsLoading(false)

      // Clear any cached data
      localStorage.removeItem("lastAuthCheck")
      sessionStorage.clear()
      clearUserInfo()
      localStorage.removeItem("currentUser")

      return true
    } catch (error) {
      console.error("Exception during sign out:", error)
      return false
    }
  }

  // Replace the existing signOut function with handleSignOut
  // Update the signOut function to be more aggressive
  const signOut = async () => {
    try {
      console.log("Auth context: Starting signOut process")

      // 1. Call Supabase auth signOut
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Supabase signOut error:", error)
      }

      // 2. Try to sign out globally as well
      try {
        await supabase.auth.signOut({ scope: "global" })
      } catch (e) {
        console.error("Global signOut error:", e)
      }

      // 3. Clear user state immediately
      setUser(null)
      setIsAdmin(false)

      // 4. Clear all cached data
      console.log("Auth context: Clearing cached data")
      Object.keys(localStorage).forEach((key) => {
        localStorage.removeItem(key)
      })

      Object.keys(sessionStorage).forEach((key) => {
        sessionStorage.removeItem(key)
      })

      // 5. Clear specific items we know about
      clearUserInfo()
      localStorage.removeItem("currentUser")
      localStorage.removeItem("lastAuthCheck")

      // 6. Return success
      return { success: true }
    } catch (error) {
      console.error("Exception during sign out:", error)

      // Even if there's an error, clear everything
      setUser(null)
      setIsAdmin(false)
      localStorage.clear()
      sessionStorage.clear()

      return {
        success: false,
        error: { message: error instanceof Error ? error.message : "Unknown error during sign out" },
      }
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error("Error refreshing session:", error)
        return
      }

      if (data?.session?.user) {
        const userId = data.session.user.id
        const userEmail = data.session.user.email

        // Check admin status
        const adminStatus = await checkAdminStatus(userId)
        setIsAdmin(adminStatus)

        // Create user object with admin status
        const currentUser = {
          id: userId,
          email: userEmail,
          isAdmin: adminStatus,
        }

        setUser(currentUser)

        // Store user info in local storage for fallback
        storeUserInfo(currentUser.id, currentUser.email || null)

        // Also store the full user object with admin status
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
      }
    } catch (error) {
      console.error("Error in refreshSession:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Login error:", error.message)
        return false
      }

      if (!data || !data.user) {
        console.error("Login failed: No user data returned")
        return false
      }

      const userId = data.user.id

      // Check admin status
      const adminStatus = await checkAdminStatus(userId)
      setIsAdmin(adminStatus)

      // Create user object with admin status
      const currentUser = {
        id: userId,
        email: data.user.email,
        isAdmin: adminStatus,
      }

      setUser(currentUser)

      // Store user info in local storage for persistence
      storeUserInfo(userId, data.user.email || null)

      // Also store the full user object with admin status
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      return true
    } catch (err) {
      console.error("Exception during login:", err)
      return false
    }
  }

  const updateUser = async (userId: string, updates: { username?: string; email?: string }) => {
    try {
      const response = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update user")
      }

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                ...updates,
              }
            : u,
        ),
      )
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAdmin, users, deleteUser, signOut, refreshSession, login, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
