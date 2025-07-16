"use client"

import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { UserPlus, Search, Users, ShieldCheck, UserCheck, TrendingUp, Eye, Download } from "lucide-react"
import { format, subDays, subMonths, eachMonthOfInterval, isSameMonth } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Add export const dynamic = 'force-dynamic' at the top of the file to prevent static prerendering
export const dynamic = "force-dynamic"

export default function AdminUsersPage() {
  const { user, users, isLoading, deleteUser, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isTogglingAdmin, setIsTogglingAdmin] = useState<string | null>(null)
  const [allUsers, setAllUsers] = useState(users || []) // Initialize with users from context
  const [filteredUsers, setFilteredUsers] = useState(users || [])
  const [growthData, setGrowthData] = useState<any[]>([])

  // Add state for the user details dialog
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Add state for the edit user dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editUsername, setEditUsername] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Calculate user statistics
  const totalUsers = allUsers.length
  const adminUsers = allUsers.filter((u) => u.isAdmin).length
  const thirtyDaysAgo = subDays(new Date(), 30)
  const newUsers = allUsers.filter((u) => new Date(u.createdAt) >= thirtyDaysAgo).length
  const activeUsers = Math.floor(totalUsers * 0.7) // Placeholder - replace with actual active user count if available

  useEffect(() => {
    setAllUsers(users || [])
    setFilteredUsers(users || [])
  }, [users])

  // Calculate growth data when users change
  useEffect(() => {
    if (!allUsers.length) return

    // Get date range for the last 12 months
    const endDate = new Date()
    const startDate = subMonths(endDate, 11) // 12 months including current month

    // Generate array of month start dates
    const months = eachMonthOfInterval({ start: startDate, end: endDate })

    // Initialize data array with months and zero counts
    const monthlyData = months.map((month) => ({
      month: format(month, "MMM yyyy"),
      newUsers: 0,
      totalUsers: 0,
      date: month, // Keep the date object for sorting
    }))

    // Sort users by creation date
    const sortedUsers = [...allUsers].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // Calculate cumulative users per month
    const runningTotal = 0
    sortedUsers.forEach((user) => {
      const creationDate = new Date(user.createdAt)

      // Only count users within our date range
      if (creationDate >= startDate) {
        // Find the month this user belongs to
        const monthIndex = monthlyData.findIndex((data) => isSameMonth(data.date, creationDate))

        if (monthIndex !== -1) {
          monthlyData[monthIndex].newUsers += 1
        }
      }
    })

    // Calculate running total for each month
    let cumulativeTotal = 0
    monthlyData.forEach((data, index) => {
      cumulativeTotal += data.newUsers
      monthlyData[index].totalUsers = cumulativeTotal
    })

    setGrowthData(monthlyData)
  }, [allUsers])

  // Update the useEffect to ensure proper redirection for non-admins
  // Replace the existing useEffect for redirection with this:

  const isAdmin = user?.isAdmin || false

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/admin/login")
      } else if (!isAdmin) {
        router.push("/") // Redirect non-admin users to home page
      }
    }
  }, [user, isAdmin, isLoading, router])

  useEffect(() => {
    // Update the filteredUsers logic to handle undefined users array
    const newFilteredUsers =
      allUsers?.filter(
        (u) =>
          (u.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      ) || []
    setFilteredUsers(newFilteredUsers)
  }, [searchTerm, allUsers])

  const handleDeleteUser = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteUser(id)
      setAllUsers((prevUsers) => prevUsers.filter((u) => u.id !== id))
      toast({
        title: "Lyckades",
        description: "Användaren har tagits bort.",
      })
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Fel",
        description: error.message || "Kunde inte ta bort användaren. Försök igen.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
    setIsTogglingAdmin(id)
    try {
      // Call your function to update the admin status in the database
      const response = await fetch("/api/admin/toggle-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, isAdmin: !isAdmin }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kunde inte ändra administratörsstatus")
      }

      // Update the user's admin status in the local state
      setAllUsers((prevUsers) => prevUsers.map((u) => (u.id === id ? { ...u, isAdmin: !isAdmin } : u)))

      toast({
        title: "Lyckades",
        description: `Administratörsstatus ändrad för användare ${id}`,
      })
    } catch (error) {
      console.error("Failed to toggle admin status:", error)
      toast({
        title: "Fel",
        description: "Kunde inte ändra administratörsstatus. Försök igen.",
        variant: "destructive",
      })
    } finally {
      setIsTogglingAdmin(null)
    }
  }

  // Add function to view user details
  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
  }

  // Add function to export user data
  const handleExportUserData = (user: any) => {
    try {
      // Create a CSV string with the user data
      const csvData = `ID,Username,Email,Role,Created At\n${user.id},"${user.username || ""}","${user.email}","${
        user.isAdmin ? "Admin" : "User"
      }","${format(new Date(user.createdAt), "yyyy-MM-dd")}"`

      // Create a blob with the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a link element to download the CSV
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `user-${user.id}.csv`)

      // Append the link to the document
      document.body.appendChild(link)

      // Click the link to download the CSV
      link.click()

      // Remove the link from the document
      document.body.removeChild(link)

      toast({
        title: "Lyckades",
        description: "Användardata har exporterats.",
      })
    } catch (error) {
      console.error("Failed to export user data:", error)
      toast({
        title: "Fel",
        description: "Kunde inte exportera användardata. Försök igen.",
        variant: "destructive",
      })
    }
  }

  // Add function to open the edit dialog
  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setEditUsername(user.username || "")
    setEditEmail(user.email || "")
    setIsEditDialogOpen(true)
  }

  // Add function to save user edits
  const handleSaveUserEdit = async () => {
    if (!editingUser) return

    setIsUpdating(true)
    try {
      // Call the updateUser function from the auth context
      await updateUser(editingUser.id, {
        username: editUsername,
        email: editEmail,
      })

      // Update the user in the local state
      setAllUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === editingUser.id ? { ...u, username: editUsername, email: editEmail } : u)),
      )

      toast({
        title: "Lyckades",
        description: "Användarinformationen har uppdaterats.",
      })

      // Close the dialog
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera användarinformationen. Försök igen.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Also, let's strengthen the rendering condition to ensure only admins can see the content:
  // Replace the condition at the bottom of the file:

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-900">Laddar...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    // Don't render anything for non-admins, they'll be redirected
    return null
  }

  // The rest of the component remains the same

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white text-gray-900">
        <div className="p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Users Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Totalt antal användare</p>
                  <h3 className="text-3xl font-bold">{totalUsers}</h3>
                  <p className="text-gray-600 text-xs mt-2">Alla registrerade användare</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Admin Users Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Administratörer</p>
                  <h3 className="text-3xl font-bold">{adminUsers}</h3>
                  <p className="text-gray-600 text-xs mt-2">
                    {((adminUsers / totalUsers) * 100).toFixed(1)}% av alla användare
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* New Users Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Nya användare (30d)</p>
                  <h3 className="text-3xl font-bold">{newUsers}</h3>
                  <p className="text-gray-600 text-xs mt-2">
                    {((newUsers / totalUsers) * 100).toFixed(1)}% tillväxttakt
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Aktiva användare</p>
                  <h3 className="text-3xl font-bold">{activeUsers}</h3>
                  <p className="text-gray-600 text-xs mt-2">
                    {((activeUsers / totalUsers) * 100).toFixed(1)}% engagemang
                  </p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg">
                  <UserCheck className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium">Användartillväxt</h3>
                <p className="text-gray-600 text-sm">Totalt antal användare under de senaste 12 månaderna</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-900" />
              </div>
            </div>

            <div className="h-[400px] w-full">
              <div className="h-full bg-white rounded-lg p-4 border border-gray-200">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis
                      dataKey="month"
                      stroke="#374151"
                      tick={{ fill: "#374151", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: "#374151", fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
                      formatter={(value) => [value.toLocaleString(), ""]}
                      labelFormatter={(label) => `Månad: ${label}`}
                    />
                    <Legend />
                    <Line
                      name="Totalt antal användare"
                      type="monotone"
                      dataKey="totalUsers"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#fff", strokeWidth: 3, stroke: "#3b82f6" }}
                      activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      name="Nya användare"
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#fff", strokeWidth: 3, stroke: "#10b981" }}
                      activeDot={{ r: 6, fill: "#10b981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Användare ({allUsers.length})</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <Input
                    placeholder="Sök användare..."
                    className="pl-9 bg-white border-gray-300 text-gray-900 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Lägg till användare
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Användarnamn</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">E-post</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Roll</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Skapad</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium">Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {user.username || <span className="text-gray-400 italic">Inget användarnamn</span>}
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.isAdmin ? "Administratör" : "Användare"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{format(new Date(user.createdAt), "d MMM yyyy")}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[2rem] py-1"
                            onClick={() => handleViewUser(user)}
                            title="Visa detaljer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[2rem] py-1"
                            onClick={() => handleExportUserData(user)}
                            title="Exportera användardata"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-600">Inga användare hittades som matchar din sökning.</div>
            )}
          </div>
        </div>

        {/* User Details Dialog */}
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Användardetaljer</DialogTitle>
              <DialogDescription>Information om användaren.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="text-sm">{selectedUser.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Användarnamn</p>
                    <p className="text-sm">
                      {selectedUser.username || <span className="italic text-gray-400">Inget användarnamn</span>}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">E-post</p>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Roll</p>
                    <p className="text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedUser.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {selectedUser.isAdmin ? "Administratör" : "Användare"}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Skapad</p>
                    <p className="text-sm">{format(new Date(selectedUser.createdAt), "d MMMM yyyy, HH:mm")}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => handleExportUserData(selectedUser)}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportera data
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Redigera användare</DialogTitle>
              <DialogDescription>Uppdatera användarinformation för {editingUser?.email}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Användarnamn
                </Label>
                <Input
                  id="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-post
                </Label>
                <Input
                  id="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleSaveUserEdit} disabled={isUpdating}>
                {isUpdating ? "Sparar..." : "Spara ändringar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
