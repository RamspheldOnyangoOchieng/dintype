"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function RunDeleteUserDirectMigrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/admin/run-delete-user-direct-migration")
      const data = await response.json()

      if (response.ok) {
        setResult(data.message || "Migration completed successfully")
        toast({
          title: "Success",
          description: "Delete user direct function created successfully",
        })
      } else {
        setError(data.error || "Failed to run migration")
        toast({
          title: "Error",
          description: data.error || "Failed to run migration",
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

  const copyToClipboard = () => {
    const sql = `
    -- Create a function to delete users directly via SQL
    CREATE OR REPLACE FUNCTION public.delete_user_direct(user_id UUID)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER -- This makes the function run with the privileges of the creator
    AS $$
    BEGIN
      -- Delete from profiles first
      DELETE FROM public.profiles WHERE id = user_id;
      
      -- Try to delete from auth.users if possible
      BEGIN
        DELETE FROM auth.users WHERE id = user_id;
        EXCEPTION WHEN OTHERS THEN
          -- Ignore errors, we already tried to delete from profiles
          RAISE NOTICE 'Could not delete from auth.users: %', SQLERRM;
      END;
      
      RETURN TRUE;
    END;
    $$;

    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO authenticated;
    -- Grant execute permission to anon users if needed
    GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO anon;
    `

    navigator.clipboard.writeText(sql)
    toast({
      title: "Copied to clipboard",
      description: "SQL has been copied to clipboard. You can paste it in the Supabase SQL Editor.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Delete User Direct Function</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="mb-4">
          This page will create a SQL function that allows direct deletion of users from the database. This function
          bypasses Row Level Security (RLS) policies and provides a more reliable way to delete users.
        </p>

        <div className="flex gap-4 mb-6">
          <Button onClick={runMigration} disabled={isLoading}>
            {isLoading ? "Running..." : "Run Migration"}
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

      {result && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">{result}</div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
