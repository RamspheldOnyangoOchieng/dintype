"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function FixProfilesTablePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      // First, check the structure of the profiles table
      const { data: tableInfo, error: tableError } = await supabase.from("profiles").select("*").limit(1)

      if (tableError) {
        setError(`Error checking profiles table: ${tableError.message}`)
        return
      }

      // Check if the profiles table has any rows
      if (tableInfo && tableInfo.length > 0) {
        const sampleProfile = tableInfo[0]
        setResult(`Current profiles table structure: ${JSON.stringify(sampleProfile, null, 2)}`)
      } else {
        setResult("Profiles table exists but has no rows")
      }

      // Run the migration SQL
      const migrationSql = `
        -- Create a backup of the existing profiles table if it exists
        CREATE TABLE IF NOT EXISTS profiles_backup AS 
        SELECT * FROM profiles WHERE EXISTS (
            SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles'
        );
        
        -- Drop the existing profiles table if it exists
        DROP TABLE IF EXISTS profiles;
        
        -- Create a new profiles table with UUID as primary key
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_admin BOOLEAN DEFAULT FALSE
        );
        
        -- Add RLS policies
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own profile"
            ON profiles FOR SELECT
            USING (auth.uid() = id);
        
        CREATE POLICY "Users can update their own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id);
      `

      // Execute the SQL
      const { error: migrationError } = await supabase.rpc("execute_sql", { sql: migrationSql })

      if (migrationError) {
        setError(`Migration error: ${migrationError.message}`)
        return
      }

      setResult(
        (prev) =>
          `${prev}\n\nMigration completed successfully. The profiles table has been recreated with UUID as primary key.`,
      )
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Fix Profiles Table Structure</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>Warning:</strong> This will recreate the profiles table with UUID as primary key. A backup of the
          existing table will be created as profiles_backup. This operation cannot be undone.
        </p>
      </div>

      <Button onClick={runMigration} disabled={isLoading} className="mb-6">
        {isLoading ? "Running Migration..." : "Run Migration"}
      </Button>

      {result && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
