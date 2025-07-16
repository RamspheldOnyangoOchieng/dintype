"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DatabaseInspectorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFunctionCreating, setIsFunctionCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTableInfo = async () => {
      try {
        const response = await fetch("/api/admin/inspect-profiles-table")
        const data = await response.json()

        if (response.ok) {
          setTableInfo(data)
        } else {
          setError(data.error || "Failed to fetch table information")
          toast({
            title: "Error",
            description: data.error || "Failed to fetch table information",
            variant: "destructive",
          })
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred")
        toast({
          title: "Error",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTableInfo()
  }, [toast])

  const createHelperFunction = async () => {
    setIsFunctionCreating(true)

    try {
      const sql = `
        CREATE OR REPLACE FUNCTION public.find_profile_by_auth_id(auth_user_id UUID)
        RETURNS TABLE (id INTEGER)
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT id FROM profiles 
          WHERE auth_id = auth_user_id::text
          OR auth_id = auth_user_id
          LIMIT 1;
        $$;
        
        GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO anon;
      `

      const response = await fetch("/api/admin/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Helper function created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create helper function",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFunctionCreating(false)
    }
  }

  const copyToClipboard = () => {
    const sql = `
      CREATE OR REPLACE FUNCTION public.find_profile_by_auth_id(auth_user_id UUID)
      RETURNS TABLE (id INTEGER)
      LANGUAGE sql
      SECURITY DEFINER
      AS $$
        SELECT id FROM profiles 
        WHERE auth_id = auth_user_id::text
        OR auth_id = auth_user_id
        LIMIT 1;
      $$;
      
      GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO authenticated;
      GRANT EXECUTE ON FUNCTION public.find_profile_by_auth_id(UUID) TO anon;
    `

    navigator.clipboard.writeText(sql)
    toast({
      title: "Copied to clipboard",
      description: "SQL has been copied to clipboard. You can paste it in the Supabase SQL Editor.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Database Inspector</h1>

      {isLoading ? (
        <div className="text-center">Loading database information...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profiles Table Structure</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Column Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Type
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nullable
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableInfo?.columns.map((column: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">{column.column_name}</td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">{column.data_type}</td>
                      <td className="py-2 px-4 border-b border-gray-200 text-sm">
                        {column.is_nullable === "YES" ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Key Findings:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  ID Column Type:{" "}
                  <span className="font-medium">
                    {tableInfo?.columns.find((c: any) => c.column_name === "id")?.data_type || "Unknown"}
                  </span>
                </li>
                <li>
                  Has Auth ID Column: <span className="font-medium">{tableInfo?.hasAuthIdColumn ? "Yes" : "No"}</span>
                </li>
              </ul>
            </div>

            {tableInfo?.sampleRow && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Sample Row:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(tableInfo.sampleRow, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Fix User Deletion</h2>

            <p className="mb-4">
              Based on your database schema, we need to create a helper function to find profiles by auth_id. This will
              allow us to properly delete users.
            </p>

            <div className="flex gap-4 mb-6">
              <Button onClick={createHelperFunction} disabled={isFunctionCreating}>
                {isFunctionCreating ? "Creating..." : "Create Helper Function"}
              </Button>

              <Button variant="outline" onClick={copyToClipboard}>
                Copy SQL to Clipboard
              </Button>
            </div>

            <div className="text-sm bg-gray-100 p-4 rounded">
              <p className="font-medium mb-2">Alternative Method:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Copy the SQL by clicking the button above</li>
                <li>Go to the Supabase dashboard</li>
                <li>Open the SQL Editor</li>
                <li>Paste the SQL and run it</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
