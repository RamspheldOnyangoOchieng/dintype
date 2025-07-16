"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CreateSimpleDeletePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const sql = `
-- Create a simple function to delete a user by their auth ID
CREATE OR REPLACE FUNCTION public.simple_delete_user(auth_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id int;
  success boolean := false;
BEGIN
  -- First try to find the profile ID
  BEGIN
    SELECT id INTO profile_id FROM profiles WHERE auth_id = auth_id OR id::text = auth_id;
    EXCEPTION WHEN OTHERS THEN
      -- If there's an error, try a different approach
      BEGIN
        SELECT id INTO profile_id FROM profiles WHERE id = auth_id::integer;
        EXCEPTION WHEN OTHERS THEN
          -- If that fails too, return false
          RETURN false;
      END;
  END;
  
  -- If we found a profile ID, delete it
  IF profile_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = profile_id;
    success := true;
  END IF;
  
  RETURN success;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.simple_delete_user(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.simple_delete_user(text) TO service_role;
`

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult("Migration successful!")
        toast({
          title: "Success",
          description: "The simple_delete_user function has been created.",
        })
      } else {
        setResult(`Error: ${data.error || "Unknown error"}`)
        toast({
          title: "Error",
          description: data.error || "Failed to run migration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error running migration:", error)
      setResult(`Exception: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Error",
        description: "An exception occurred while running the migration",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create Simple Delete User Function</CardTitle>
          <CardDescription>
            This will create a simple SQL function to delete users without requiring admin permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={sql} readOnly className="min-h-[300px] font-mono text-sm" />

          {result && (
            <div
              className={`mt-4 p-4 rounded-md ${result.startsWith("Error") || result.startsWith("Exception") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
            >
              {result}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runMigration} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Migration"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
